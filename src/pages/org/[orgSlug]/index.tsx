import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import queries from 'constants/GraphQL/Organizations/queries';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import dynamic from 'next/dynamic';
import ReactPlayer from 'react-player';
import Header from 'components/PreLogin/PublicOrgPage/Header';
import {useEffect, useState} from 'react';
import {SUMMARY_TABS, TABS} from 'constants/context/tabs';
import OrgMemberSearch from 'components/PostLogin/Organizations/Tabs/OrgMemberSearch';
import Tabs from 'components/PostLogin/Tabs/Tab';
import OrgServiceSearch from 'components/PostLogin/Organizations/Tabs/OrgServiceSearch';
import OrgSignupTab from 'components/PostLogin/Organizations/Tabs/OrgSignupTab';
import {PUBLIC_ORGANIZATION_FEATURES} from '../../../constants/enums';

const OrganizationPublicPage = ({organization}) => {
  const organizationDetails = organization?.data?.getOrganizationBySlug?.organizationData;
  const ReactSlides = dynamic(() => import('react-google-slides'), {
    ssr: false,
  });

  const hasServices =
    organizationDetails?.services.filter(el => el?.serviceType === 'MEETING')?.length > 0;
  const hasMembers = organizationDetails?.members?.length > 0;

  const [tab, setTab] = useState('');

  const tabsContent: any = {
    members: (
      <OrgMemberSearch
        organizationDetails={organizationDetails}
        isManagement={false}
        userRole={null}
      />
    ),
    services: <OrgServiceSearch organizationDetails={organizationDetails} />,
    signup: <OrgSignupTab organizationData={organizationDetails} />,
  };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight + 500);
    }, 1400);
  }, [tab]);

  useEffect(() => {
    if (
      organizationDetails?.publicFeatures?.includes(PUBLIC_ORGANIZATION_FEATURES.SIGN_UP) &&
      tab === ''
    ) {
      setTab(TABS.signup);
    } else if (hasMembers && tab === '') {
      setTab(TABS.members);
    } else if (hasServices && tab === '') {
      setTab(TABS.services);
    }
  });

  return (
    <>
      <HeadSeo
        title={organizationDetails?.title}
        description={organizationDetails?.description}
        canonicalUrl={`https://30mins.com/org/${organizationDetails?.title}/`}
        ogTwitterImage={
          organizationDetails?.image
            ? organizationDetails?.image
            : 'https://30mins.com/assets/30mins-ogimage.jpg'
        }
        ogType={'website'}
      />

      <Header organizationDetails={organizationDetails} isManagement={false} />

      {organizationDetails?.media?.link && organizationDetails?.media?.type === 'Google Slides' ? (
        organizationDetails?.media?.type !== '' &&
        organizationDetails?.media?.link.startsWith('https://docs.google.com/presentation') ? (
          <div className='flex w-full justify-center bg-white'>
            <div className='w-1/2 h-full my-8'>
              <ReactSlides
                height='640'
                width='100%'
                slideDuration={5}
                position={1}
                showControls
                loop
                slidesLink={organizationDetails?.media?.link}
              />
            </div>
          </div>
        ) : null
      ) : null}

      {organizationDetails?.media?.type === 'Youtube Embed' ? (
        <div className='flex w-full justify-center bg-white'>
          <div
            className='relative flex justify-center flex-wrap w-full overflow-hidden my-8'
            style={{
              height: '500px',
            }}
          >
            <ReactPlayer url={`${organizationDetails?.media?.link}`} />
          </div>
        </div>
      ) : null}

      <div className='container px-6 mx-auto items-start lg:items-center justify-between gap-4 flex'>
        <Tabs
          openedTab={tab}
          className={'mr-6 mb-0 list-none flex-wrap  gap-2 sm:gap-0'}
          tabsNames={SUMMARY_TABS.organizationPublic.filter(el => {
            switch (el) {
              case 'members':
                return (
                  hasMembers &&
                  organizationDetails?.publicFeatures?.includes(
                    PUBLIC_ORGANIZATION_FEATURES.MEMBERS
                  )
                );
              case 'services':
                return (
                  hasServices &&
                  organizationDetails?.publicFeatures?.includes(
                    PUBLIC_ORGANIZATION_FEATURES.SERVICES
                  )
                );
              case 'signup':
                return organizationDetails?.publicFeatures?.includes(
                  PUBLIC_ORGANIZATION_FEATURES.SIGN_UP
                );
              default:
                return false;
            }
          })}
          onChange={(tabName: string) => setTab(tabName)}
        />
      </div>
      <div className='container px-6 mx-auto items-start lg:items-center justify-between gap-4'>
        {tabsContent[tab]}
      </div>
    </>
  );
};
export default OrganizationPublicPage;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const {data: organization} = await graphqlRequestHandler(
      queries.getOrganizationBySlug,
      {
        slug: context.query.orgSlug,
      },
      process.env.BACKEND_API_KEY
    );

    const {status} = organization.data.getOrganizationBySlug.response;

    if (status === 500) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        organization,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
