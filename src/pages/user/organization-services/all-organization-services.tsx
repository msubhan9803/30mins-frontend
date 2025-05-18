import Head from 'next/head';

import useTranslation from 'next-translate/useTranslation';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';

import queries from 'constants/GraphQL/Service/queries';
import {SERVICE_TYPES} from 'constants/enums';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Error from '@components/error';
import Loader from 'components/shared/Loader/Loader';

import TableHead from '@root/features/services/service-display/table-head';
import TableRow from '@root/features/services/service-display/table-row';

export default function AllOrganizationServices() {
  const {t} = useTranslation('common');
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {
      title: tpage('All Organization Services'),
      href: '/user/organization-services/all-organization-services',
    },
  ];

  const {data: session} = useSession();

  const {
    data: {getServicesByUserId: {serviceData = {}} = {}} = {},
    loading,
    refetch,
  } = useQuery(queries.getServicesByUserId, {
    variables: {token: session?.accessToken},
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <PostLoginLayout>
      <Head>
        <title>{tpage('All Organization Services')}</title>
      </Head>

      <Header crumbs={crumbs} heading={tpage('All Organization Services')} />

      {serviceData && (
        <div className='pb-4'>
          {serviceData?.filter(el => el.serviceType === SERVICE_TYPES.MEETING)?.length > 0 ? (
            <div className='border border-gray-300 border-opacity-75 rounded-lg mt-4 shadow-md'>
              <table className='table-auto max-w-full w-full'>
                <TableHead withoutType />
                <tbody>
                  {serviceData?.length > 0 &&
                    serviceData
                      ?.filter(service => service.isOrgService)
                      // eslint-disable-next-line array-callback-return, consistent-return
                      ?.map((service, index) => {
                        if (service.serviceType === SERVICE_TYPES.MEETING)
                          return (
                            <TableRow refetch={refetch} key={index} service={service} withoutType />
                          );
                      })}
                </tbody>
              </table>
            </div>
          ) : (
            <Error
              image={'/icons/errors/no-data.svg'}
              title={t('common:oops_no_services')}
              description={t('common:why_services')}
            />
          )}
        </div>
      )}
    </PostLoginLayout>
  );
}

AllOrganizationServices.auth = true;
