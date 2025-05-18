import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Loader from 'components/shared/Loader/Loader';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import queries from 'constants/GraphQL/Organizations/queries';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import useOrganizations from 'components/PostLogin/Organizations/useOrganizations';
import userQuery from 'constants/GraphQL/User/queries';
import {useEffect, useState} from 'react';
import {SUMMARY_TABS, TABS} from 'constants/context/tabs';
import PendingJoinRequests from 'components/PostLogin/Organizations/Tabs/PendingJoinRequests';
import Tabs from 'components/PostLogin/Tabs/Tab';
import OrgMemberSearch from 'components/PostLogin/Organizations/Tabs/OrgMemberSearch';
import OrgServiceSearch from 'components/PostLogin/Organizations/Tabs/OrgServiceSearch';
import PendingInvites from 'components/PostLogin/Organizations/Tabs/PendingInvites';
import RoundRobin from 'components/PostLogin/Organizations/Tabs/RoundRobin';
import {useRouter} from 'next/router';
import Information from 'components/PostLogin/Organizations/Tabs/Information';
import PostLoginLayout from '@root/components/layout/post-login';
import Head from 'next/head';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import Header from '@root/components/header';

const OrganizationManagement = ({user, organization, userRole}) => {
  const {status} = useSession();
  const [currentTab, setTab] = useState(TABS.information);
  const router = useRouter();
  const {t} = useTranslation();

  const {tab} = router.query;

  useEffect(() => {
    if (tab) {
      setTab(tab as string);
    }
  }, [tab]);

  const organizationDetails = organization;
  const userData = user?.data?.getUserById?.userData;

  const {orgMethods, orgModals} = useOrganizations({
    userOrgs: organizationDetails,
    activeExtensions: userData?.accountDetails?.activeExtensions,
    invitedOrgs: undefined,
    refetch: () => {
      router.reload();
    },
  });

  const tabsContent = {
    information: (
      <Information
        organizationDetails={organizationDetails}
        orgMethods={orgMethods}
        orgModals={orgModals}
      />
    ),
    members: (
      <OrgMemberSearch
        organizationDetails={organizationDetails}
        isManagement={true}
        userRole={userRole}
      />
    ),
    services: <OrgServiceSearch organizationDetails={organizationDetails} />,
    [TABS.pendingJoinRequests]: <PendingJoinRequests organization={organizationDetails} />,
    [TABS.pendingInvites]: <PendingInvites organization={organizationDetails} />,
    [TABS.roundRobin]: <RoundRobin organization={organizationDetails} />,
  };

  if (status === 'loading') {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{organizationDetails?.title}</title>
      </Head>
      <ProtectedRoute status={status}>
        <PostLoginLayout>
          <Header
            crumbs={[
              {title: t('page:Home'), href: '/'},
              {title: t('page:Organizations'), href: '/user/organizations'},
              {
                title:
                  organizationDetails.title.length > 15
                    ? `${organizationDetails.title.substring(0, 15).trim()}...`
                    : organizationDetails.title,
                href: `/user/organizations/edit/${organizationDetails._id}/`,
              },
            ]}
            heading={organizationDetails.title}
          />
          <div className='container mx-auto items-start lg:items-center justify-between gap-4 flex'>
            <Tabs
              openedTab={currentTab}
              className={'mr-6 mb-0 list-none flex-wrap gap-2 sm:gap-0'}
              tabsNames={SUMMARY_TABS.organizationManagement}
              onChange={(tabName: string) => setTab(tabName)}
            />
          </div>
          <div className='w-full h-full'>{tabsContent[currentTab]}</div>
        </PostLoginLayout>
      </ProtectedRoute>
    </>
  );
};
export default OrganizationManagement;
OrganizationManagement.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    const router = context.resolvedUrl;

    if (!session) {
      return {
        redirect: {
          destination: `/auth/login?url=${router}`,
          permanent: false,
        },
      };
    }
    const {data: user} = await graphqlRequestHandler(
      userQuery.getUserById,
      {
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );

    const {data: userOrgMembershipResponse} = await graphqlRequestHandler(
      queries.getOrganizationMembership,
      {
        token: session?.accessToken,
        organizationId: context.query.id,
      },
      session?.accessToken
    );

    const {membership} = userOrgMembershipResponse.data.getOrganizationMembership;
    const organizationData = membership.organizationId;

    if (!['owner', 'admin'].includes(membership?.role)) {
      return {
        redirect: {
          permanent: false,
          destination: '/user/organizations/',
        },
      };
    }

    return {
      props: {user, organization: organizationData, userRole: membership?.role},
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: '/user/organizations/',
      },
    };
  }
};
