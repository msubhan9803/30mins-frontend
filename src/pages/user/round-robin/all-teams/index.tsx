import {useEffect, useState} from 'react';
import {GetServerSideProps} from 'next';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import classnames from 'classnames';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import userQuery from 'constants/GraphQL/User/queries';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import PostLoginLayout from '@root/components/layout/post-login';
import Header from '@root/components/header';
import queries from 'constants/GraphQL/Organizations/queries';
import DropDownComponent from 'components/shared/DropDownComponent';
import RoundRobin from 'components/PostLogin/Organizations/Tabs/RoundRobin';

const AllRoundRobinTeams = () => {
  const {t} = useTranslation();

  const {data: session} = useSession();

  const [currentSelectedOrg, setCurrentSelectedOrg] = useState<any>(null);
  const [isDisableSelect, setIsDisableSelect] = useState(false);

  const {data: organizations} = useQuery(queries.getOrganizationManagementDetails, {
    variables: {
      token: session?.accessToken,
    },
  });

  const organizationsData = organizations?.getOrganizationManagementDetails?.membershipData;
  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:All Teams'), href: '/user/round-robin/all-teams'},
  ];

  useEffect(() => {
    if (organizationsData) {
      setCurrentSelectedOrg(organizationsData[0]?.organizationId || null);
    }
  }, [organizationsData]);

  const selectOrganizations =
    organizationsData
      ?.filter(item => item.role === 'owner' || item.role === 'admin')
      ?.map(item => ({
        value: item.organizationId._id,
        key: item.organizationId.title,
      })) ?? [];

  const handleChangeOrganization = e => {
    const {value} = e.target;

    const currentOrg = organizationsData.find(item => item.organizationId._id === value);

    setCurrentSelectedOrg(currentOrg?.organizationId);
  };

  const handleDisableSelect = (check: boolean) => {
    setIsDisableSelect(check);
  };

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:All Teams')} />
      <Head>
        <title> {t('page:All Teams')}</title>
      </Head>

      <div className='flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between md:mb-4'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
          <p className='text-lg font-semibold text-mainText'>{t('common:select_organization')}</p>
          <DropDownComponent
            name='currentOrganization'
            options={selectOrganizations}
            className={classnames('min-w-[300px]', {'cursor-not-allowed': isDisableSelect})}
            onChange={handleChangeOrganization}
            disabled={isDisableSelect}
          />
        </div>
      </div>

      {currentSelectedOrg && (
        <RoundRobin
          organization={currentSelectedOrg}
          context='teams'
          handleDisableSelect={handleDisableSelect}
        />
      )}
    </PostLoginLayout>
  );
};
export default AllRoundRobinTeams;
AllRoundRobinTeams.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
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

  return {
    props: {
      user,
    },
  };
};
