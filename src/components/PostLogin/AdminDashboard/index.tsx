import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import {useSession} from 'next-auth/react';
import {useQuery} from '@apollo/client';

import Header from '@root/components/header';
import Loader from 'components/shared/Loader/Loader';
import userQueries from '../../../constants/GraphQL/User/queries';

const AdminDashboard = ({globalBussinessStats}: {globalBussinessStats: any}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const crumbs = [{title: t('page:Dashboard'), href: '/'}];
  // const {data: userCount} = useQuery(userQueries.getUserCount, {
  //   variables: {token: session?.accessToken},
  // });
  // const {data: organizationCount} = useQuery(userQueries.getOrganizationCounts, {
  //   variables: {token: session?.accessToken},
  // });
  const {data: ServiceCount, loading: LoadingServiceCount} = useQuery(userQueries.getServiceCount, {
    variables: {token: session?.accessToken},
  });
  const {data: ExtensionCount, loading: LoadingExtension} = useQuery(userQueries.getExtension, {
    variables: {token: session?.accessToken},
  });
  if (LoadingServiceCount || LoadingExtension) {
    return <Loader />;
  }
  return (
    <>
      <Header crumbs={crumbs} heading={t('page:Dashboard')} />
      <div className='min-h-screen text-gray-900'>
        <main className='max-w-7xl mx-auto px-0 pt-4'>
          <div className='mt-6'>
            <div className='grid grid-cols-1 mt-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
              <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
                <div className='flex flex-col'>
                  <div className='text-xs font-bold text-mainBlue uppercase'>
                    {t('page:Global_Revenue')}
                  </div>
                  <div className='grid grid-cols-3'>
                    <div className='col-span-1 flex flex-col'>
                      <div className='text-xs mt-4 font-bold'>
                        ${Number(globalBussinessStats?.totalRevenue) / 100}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Revenue_Total')}
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col justified-center items-center'>
                      <div className='text-xs mt-4 font-bold'>
                        ${Number(globalBussinessStats?.totalMonthlyRecurringRevenue) / 100}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Revenue_Monthly_Recurring')}
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col justified-center items-center'>
                      <div className='text-xs mt-4 font-bold'>
                        ${Number(globalBussinessStats?.totalAnnualRecurringRevenue) / 100}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Revenue_Annual_Recurring')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
                <div className='flex flex-col'>
                  <div className='text-xs font-bold text-mainBlue uppercase'>
                    {t('page:Global_Organization_Revenue')}
                  </div>
                  <div className='grid grid-cols-3'>
                    <div className='col-span-1 flex flex-col'>
                      <div className='text-xs mt-4 font-bold'>
                        ${Number(globalBussinessStats?.totalOrganizationRevenue) / 100}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Organization_Revenue_Total')}
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col justified-center items-center'>
                      <div className='text-xs mt-4 font-bold'>
                        $
                        {Number(globalBussinessStats?.totalOrganizationMonthlyRecurringRevenue) /
                          100}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Organization_Revenue_Monthly_Recurring')}
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col justified-center items-center'>
                      <div className='text-xs mt-4 font-bold'>
                        $
                        {Number(globalBussinessStats?.totalOragnizationAnnualRecurringRevenue) /
                          100}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Organization_Revenue_Annual_Recurring')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
                <div className='flex flex-col'>
                  <div className='text-xs font-bold text-mainBlue uppercase'>
                    {t('page:Global_Other_Revenue')}
                  </div>
                  <div className='grid grid-cols-3'>
                    <div className='col-span-1 flex flex-col'>
                      <div className='text-xs mt-4 font-bold'>
                        $
                        {(Number(globalBussinessStats?.totalRevenue) -
                          Number(globalBussinessStats?.totalOrganizationRevenue)) /
                          100}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Other_Revenue_Total')}
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col justified-center items-center'>
                      <div className='text-xs mt-4 font-bold'>
                        $
                        {(Number(globalBussinessStats?.totalMonthlyRecurringRevenue) -
                          Number(globalBussinessStats?.totalOrganizationMonthlyRecurringRevenue)) /
                          100}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Other_Revenue_Monthly_Recurring')}
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col justified-center items-center'>
                      <div className='text-xs mt-4 font-bold'>
                        $
                        {(Number(globalBussinessStats?.totalAnnualRecurringRevenue) -
                          Number(globalBussinessStats?.totalOragnizationAnnualRecurringRevenue)) /
                          100}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Other_Revenue_Annual_Recurring')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
                <div className='flex flex-col'>
                  <div className='text-xs font-bold text-mainBlue uppercase'>
                    {t('page:Global_Total_Organizations')}
                  </div>
                  <div className='grid grid-cols-3'>
                    <div className='col-span-1 flex flex-col'>
                      <div className='text-xs mt-4 font-bold'>
                        {Number(globalBussinessStats?.totalOrganizationsSignedUp)}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Total_Organizations_Total')}
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col justified-center items-center'>
                      <div className='text-xs mt-4 font-bold'></div>
                      <div className='text-[0.5em] text-gray-500 font-base'></div>
                    </div>
                    <div className='col-span-1 flex flex-col justified-center items-center'>
                      <div className='text-xs mt-4 font-bold'></div>
                      <div className='text-[0.5em] text-gray-500 font-base'></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
                <div className='flex flex-col'>
                  <div className='text-xs font-bold text-mainBlue uppercase'>
                    {t('page:Global_Total_Users')}
                  </div>
                  <div className='grid grid-cols-3'>
                    <div className='col-span-1 flex flex-col'>
                      <div className='text-xs mt-4 font-bold'>
                        {Number(globalBussinessStats?.totalUsersSignedUp)}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Total_Users_Signed_Up')}
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col'>
                      <div className='text-xs mt-4 font-bold'>
                        {Number(globalBussinessStats?.totalUsersVerified)}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Total_Users_Verified')}
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col items-center justified-center'>
                      <div className='text-xs mt-4 font-bold'>
                        {Number(globalBussinessStats?.totalUsersWelcomeComplete)}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Total_Users_Welcome_Complete')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
                <div className='flex flex-col'>
                  <div className='text-xs font-bold text-mainBlue uppercase'>
                    {t('page:Global_Extensions')}
                  </div>
                  <div className='grid grid-cols-3'>
                    <div className='col-span-1 flex flex-col'>
                      <div className='text-xs mt-4 font-bold flex '>
                        {ExtensionCount?.getExtensionsCounts?.extensionCount}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Extensions_Total')}
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col'></div>
                    <div className='col-span-1 flex flex-col items-center justified-center'>
                      <div className='text-xs mt-4 font-bold'></div>
                      <div className='text-[0.5em] text-gray-500 font-base'></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
                <div className='flex flex-col'>
                  <div className='text-xs font-bold text-mainBlue uppercase'>
                    {t('page:Global_Services')}
                  </div>
                  <div className='grid grid-cols-3'>
                    <div className='col-span-1 flex flex-col'>
                      <div className='text-xs mt-4 font-bold'>
                        {ServiceCount?.getServiceCount?.servicePaidCount}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Services_Paid')}
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col items-center justified-center'>
                      <div className='text-xs mt-4 font-bold'>
                        {ServiceCount?.getServiceCount?.serviceFreeCount}
                      </div>
                      <div className='text-[0.5em] text-gray-500 font-base'>
                        {t('page:Global_Services_Free')}
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col'>
                      <div className='text-xs mt-4 font-bold'></div>
                      <div className='text-[0.5em] text-gray-500 font-base'></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
