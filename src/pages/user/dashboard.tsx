import {useEffect, useState} from 'react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Head from 'next/head';
import {GetServerSideProps} from 'next';
import Organizations from 'components/PostLogin/Profile/Tabs/Profile/Organizations';
import Calendars from 'components/PostLogin/Profile/Tabs/Profile/Calendars';
import PaymentMethods from 'components/PostLogin/Profile/Tabs/Profile/PaymentMethods';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import activeExtensionsQueries from 'constants/GraphQL/ActiveExtension/queries';
import credentialsQuery from 'constants/GraphQL/Integrations/queries';
import stripeProductIDs from 'constants/stripeProductIDs';
import serviceQueries from 'constants/GraphQL/Service/queries';
import AutorizedUserDashboard from 'components/PostLogin/Dashboard/AutorizedUserDashboard';
import ListAppointment from 'components/PostLogin/Dashboard/ListAppointment';
import graphqlRequestHandler from '../../utils/graphqlRequestHandler';
import queries from '../../constants/GraphQL/User/queries';
import Button from '../../components/shared/Button/Button';
import currencyConversionMap from '../../utils/currencies';

const Dashboard = ({
  user,
  hasOrgExtension,
  hasSmsExtension,
  hasPaidService,
  totalRevenueData,
  credentials,
  orgSignups,
}) => {
  const {t} = useTranslation();
  const [changed, setchanged] = useState(false);
  const crumbs = [{title: t('page:Home'), href: '/'}];
  const publicURL = `${window.origin}/${user?.data?.getUserById?.userData?.accountDetails?.username}`;
  const [orgSignupsCount, setOrgSignupsCount] = useState(3);

  const userCredentials = credentials?.data?.getCredentialsByToken;

  const {googleCredentials, officeCredentials} = userCredentials;

  const hasIntegrations =
    (googleCredentials && googleCredentials?.length > 0) ||
    (officeCredentials && officeCredentials?.length > 0);

  useEffect(() => {
    setchanged(!changed);
  }, []);

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Dashboard')} />
      <Head>
        <title>{t('page:Dashboard')}</title>
      </Head>
      <div className='bg-white pt-0 pb-20'>
        <div className='py-0 text-left sm:px-12 md:px-0 items-start justify-start'>
          <h1 className='font-bold text-xl md:text-2xl'>{t('profile:Your_Public_URL')}</h1>
          <div className='mt-4 text-md border-2 border-mainBlue px-2 py-2'>
            <div className='text-md flex flex-col items-center sm:items-start sm:flex-row border-[1px] border-mainBlue bg-mainBlue px-5 py-5'>
              <div className='text-lg sm:text-xl font-bold text-mainBlue text-white break-all'>
                <a href={publicURL} target='_blank' rel='noreferrer'>
                  {publicURL}
                </a>
              </div>
            </div>
          </div>

          <div className='mt-6 text-md grid gap-2 col-span-3'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {!hasPaidService && (
                <div className='col-span-1 lg:col-span-2 border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full flex flex-col py-[100px] min-h-[300px] items-center'>
                  <div className='text-blue-500 mx-auto mb-0 pt-[50px]'>
                    <Image src={`/icons/services/NOPAIDGIG.svg`} height={96} width={96} alt='' />
                  </div>
                  <h3 className='mb-2 font-bold font-heading'>{t(`common:NOPAIDGIG`)}</h3>
                  <Button
                    type='button'
                    href={'/user/meeting-services/add-services/?mode=create&stepType=MEETING'}
                    text={t('common:create_your_first_gig')}
                    className='inline-flex text-xs w-3/4 sm:text-sm justify-center mt-2 mr-3 sm:w-3/4 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
                  />
                </div>
              )}
              {totalRevenueData?.length > 0 ? (
                <div className='col-span-1 lg:col-span-2 border border-gray-100 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full flex flex-col justify-between py-[100px] min-h-[300px]'>
                  {totalRevenueData?.map(currency => (
                    <div key={currency?._id} className={'flex justify-center'}>
                      <span className='text-3xl text-[#d54a30] font-bold'>
                        {currencyConversionMap[currency?._id].format(currency?.totalRevenue)}
                      </span>
                    </div>
                  ))}
                  <h3 className='font-bold font-heading'>{t(`common:your_revenue_so_far`)}</h3>
                </div>
              ) : (
                <div className='col-span-1 lg:col-span-2 border border-gray-100 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full flex flex-col justify-between py-[100px] min-h-[300px]'>
                  <div className={'flex justify-center'}>
                    <span className='text-5xl text-[#d54a30] font-bold'>$0.00</span>
                  </div>
                  <h3 className='font-bold font-heading'>{t(`common:your_revenue_so_far`)}</h3>
                </div>
              )}
              {hasPaidService && (
                <div className='col-span-1 lg:col-span-2 border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
                  <PaymentMethods User={user?.data?.getUserById.userData} fromDashboard={true} />
                </div>
              )}
            </div>
          </div>
          <div className='mt-6 text-md grid gap-2 col-span-3'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <Organizations
                fromDashboard={true}
                hasOrgExtension={hasOrgExtension}
                showInvitedOrgs={false}
              />
              <Organizations
                fromDashboard={true}
                hasOrgExtension={hasOrgExtension}
                showInvitedOrgs={true}
              />
              {hasOrgExtension ? (
                <div className='col-span-1 border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
                  <div className='text-blue-500 mx-auto mb-0'>
                    <Image src={`/icons/services/referral.svg`} height={96} width={96} alt='' />
                  </div>
                  <h3 className='mb-2 font-bold font-heading'>
                    {t(`common:organization_referral_count`)}
                  </h3>
                  <div className={'flex flex-col divide divide-y'}>
                    {orgSignups.slice(0, orgSignupsCount)?.map(org => (
                      <div className={'grid grid-cols-8 px-4 py-2'} key={org?.organizationTitle}>
                        <span
                          className={'col-span-6 text-left truncate font-semibold'}
                          title={org?.organizationTitle}
                        >
                          {org?.organizationTitle}
                        </span>
                        <span className={'col-span-2 text-right font-semibold'}>{org?.count}</span>
                      </div>
                    ))}
                    {orgSignups?.length > orgSignupsCount ? (
                      <button
                        className={'text-sm text-mainBlue'}
                        onClick={() => setOrgSignupsCount(orgSignupsCount + 2)}
                      >
                        {t('common:show_more')}
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}
              {!hasPaidService && (
                <div className='col-span-1 border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
                  <PaymentMethods User={user?.data?.getUserById.userData} fromDashboard={true} />
                </div>
              )}
              {!hasSmsExtension ? (
                <div className='col-span-1 border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
                  <div className='text-blue-500 mx-auto mb-0'>
                    <Image src={`/icons/services/SMS.svg`} height={96} width={96} alt='' />
                  </div>
                  <h3 className='mb-2 font-bold font-heading'>{t(`common:DO_YOU_NEED_SMS`)}</h3>
                  <p className='text-xs text-blueGray-400 h-[6rem]'>
                    {t(`common:DO_YOU_NEED_SMS_DESCRIPTION`)}
                  </p>
                  <Button
                    type='button'
                    href={'/user/extensions/sms/'}
                    text={t('common:DO_YOU_NEED_SMS_ADD_SMS_EXTENSION')}
                    className='inline-flex text-xs mb-4 w-3/4 sm:text-sm justify-center mt-2 mr-3 sm:w-3/4 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
                  />
                </div>
              ) : null}
              <div className='col-span-1 border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full flex flex-col items-center'>
                <div className='text-blue-500 mx-auto mb-0'>
                  <Image src={`/icons/services/AUTHORIZE.svg`} height={96} width={96} alt='' />
                </div>
                <h3 className='mb-2 font-bold font-heading'>{t(`common:DASHBOARD_AUTHORIZE`)}</h3>
                <span className='relative text-center flex flex-col items-center'>
                  <AutorizedUserDashboard changed={changed} />
                </span>
                <Button
                  type='button'
                  href={'/user/mutual-auth/'}
                  text={t('common:DASHBOARD_AUTHORIZE_USERS')}
                  className='inline-flex text-xs w-3/4 sm:text-sm justify-center mb-4 mt-auto sm:w-3/4 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
                />
              </div>
              <div className='col-span-1 border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
                <div className='text-blue-500 mx-auto mb-0'>
                  <Image src={`/icons/services/EXTENSIONS.svg`} height={96} width={96} alt='' />
                </div>
                <h3 className='mb-2 font-bold font-heading'>{t(`common:DASHBOARD_EXTENSIONS`)}</h3>
                <p className='text-xs text-blueGray-400 h-[6rem]'>
                  {t(`common:DASHBOARD_EXTENSIONS_DESCRIPTION`)}
                </p>
                <Button
                  type='button'
                  href={'/user/mutual-auth/'}
                  text={t('common:DASHBOARD_EXTENSIONS_USERS')}
                  className='inline-flex text-xs mb-4 w-3/4 sm:text-sm justify-center mt-2 mr-3 sm:w-3/4 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
                />
              </div>
              <Calendars
                credentials={userCredentials}
                hasIntegrations={hasIntegrations}
                fromDashboard={true}
              />
              <ListAppointment isFree />
              <ListAppointment isPaid />
            </div>
          </div>
        </div>
      </div>
    </PostLoginLayout>
  );
};

Dashboard.auth = true;
export default Dashboard;

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
    queries.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const isWelcome = user?.data?.getUserById?.userData?.welcomeComplete;
  if (!isWelcome) {
    return {
      redirect: {destination: '/user/welcome', permanent: false},
    };
  }

  const {data: services} = await graphqlRequestHandler(
    serviceQueries.getServicesByUserId,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: credentials} = await graphqlRequestHandler(
    credentialsQuery.getCredentialsByToken,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const extensionsArray: any = [];

  const tempArray = user?.data?.getUserById?.userData?.accountDetails?.activeExtensions;
  if (tempArray && tempArray?.length > 0) {
    await Promise.all(
      tempArray.map(async (extensionID: any) => {
        const response = await graphqlRequestHandler(
          activeExtensionsQueries.getActiveExtensionByProductId,
          {
            token: session?.accessToken,
            productId: extensionID,
          },
          session?.accessToken
        );
        extensionsArray.push(
          response?.data?.data?.getActiveExtensionByProductId?.activeExtensionData
        );
      })
    );
  }

  const hasOrgExtension = user?.data?.getUserById.userData?.accountDetails?.activeExtensions.some(
    extension =>
      [
        stripeProductIDs.EXTENSIONS.ORGANIZATIONS,
        stripeProductIDs.EXTENSIONS.ORGANIZATIONS_ANNUAL,
      ].includes(extension)
  );

  const hasSmsExtension = user?.data?.getUserById.userData?.accountDetails?.activeExtensions.some(
    extension => [stripeProductIDs.EXTENSIONS.SMS_REMINDER].includes(extension)
  );

  const {data: dashboardData} = await graphqlRequestHandler(
    queries.getUserDashboardData,
    {
      token: session?.accessToken,
    },
    session?.accessToken
  );

  const {hasPaidService, totalRevenueData, orgSignups} = dashboardData.data.getUserDashboardData;

  return {
    props: {
      user,
      hasOrgExtension,
      hasSmsExtension,
      services,
      credentials,
      extensionsArray,
      hasPaidService,
      totalRevenueData,
      orgSignups,
    },
  };
};
