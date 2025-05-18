import {useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';

import useTranslation from 'next-translate/useTranslation';
import {useQuery, useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';

import queries from 'constants/GraphQL/Organizations/queries';
import mutations from 'constants/GraphQL/Organizations/mutations';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import DropDownComponent from 'components/shared/DropDownComponent';
import Loader from 'components/shared/Loader/Loader';
import Button from '@root/components/button';

import {MinusCircleIcon, PlusIcon} from '@heroicons/react/24/solid';

export default function OrganizationPendingJoinRequests() {
  const {t} = useTranslation();

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Organizations'), href: '/user/organizations'},
    {title: t('page:Pending Join Requests'), href: '/user/organizations/pending-join-requests'},
  ];

  const {data: session} = useSession();

  const router = useRouter();

  const {data: organizations, loading: orgLoading} = useQuery(
    queries.getOrganizationManagementDetails,
    {
      variables: {
        token: session?.accessToken,
      },
    }
  );

  const organizationsData = organizations?.getOrganizationManagementDetails?.membershipData;

  const [currentSelectedOrg, setCurrentSelectedOrg] = useState<any>(null);

  const [acceptRequest] = useMutation(mutations.acceptPendingJoinRequest);

  const [rejectRequest] = useMutation(mutations.declinePendingJoinRequest);

  const {data: inviteResults, loading: inviteLoading} = useQuery(
    queries.getPendingJoinRequestsByOrgId,
    {
      variables: {
        token: session?.accessToken,
        organizationId: currentSelectedOrg?._id,
      },
      skip: !organizationsData,
    }
  );

  const invitesData = inviteResults?.getPendingJoinRequestsByOrgId?.pendingJoinRequests;

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

  const handleAcceptRequest = async itemID => {
    await acceptRequest({
      variables: {
        pendingRequestId: itemID,
        token: session?.accessToken,
      },
    });
    router.reload();
  };

  const handleRejectRequest = async itemID => {
    await rejectRequest({
      variables: {
        pendingRequestId: itemID,
        token: session?.accessToken,
      },
    });
    router.reload();
  };

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:Pending Join Requests')}</title>
      </Head>
      <Header crumbs={crumbs} heading={t('page:Pending Join Requests')} />

      {orgLoading && !organizationsData && (
        <div className='mt-6'>
          <Loader />
        </div>
      )}

      {!orgLoading && !organizationsData && (
        <div className='mt-6 text-center'>
          <p className='text-gray-500 text-2xl'>{t('common:no_organization_found')}</p>
        </div>
      )}

      <div className='mt-6'>
        {organizationsData && (
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
            <p className='text-lg font-semibold text-mainText'>{t('common:select_organization')}</p>
            <DropDownComponent
              name='currentOrganization'
              options={selectOrganizations}
              className='w-full max-w-[300px]'
              onChange={handleChangeOrganization}
            />
          </div>
        )}

        {inviteLoading && !invitesData && (
          <div className='mt-4'>
            <Loader />
          </div>
        )}

        {!inviteLoading && organizationsData && (
          <div className='mt-4'>
            <div className='flex flex-col px-0 py-2'>
              <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
                  {invitesData && invitesData?.length > 0 ? (
                    <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                          <tr>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              {t('common:Avatar')}
                            </th>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              {t('common:name')}
                            </th>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              {t('common:Email')}
                            </th>
                            <th
                              scope='col'
                              className=' py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              {t('common:Actions')}
                            </th>
                            <th
                              scope='col'
                              className='py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            ></th>
                          </tr>
                        </thead>

                        <tbody className='bg-white divide-y divide-gray-200'>
                          {invitesData &&
                            invitesData?.map((person, idx) => (
                              <tr key={idx}>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                  <img
                                    className='h-10 w-10 rounded-full object-cover'
                                    src={
                                      person?.requesterUserId?.accountDetails?.avatar ||
                                      '/assets/default-profile.jpg'
                                    }
                                    alt=''
                                  />
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  {person?.requesterUserId?.personalDetails?.name}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  {person?.requesterUserId?.accountDetails?.email}
                                </td>
                                <td>
                                  <Button
                                    variant='outline'
                                    type='button'
                                    onClick={() => handleAcceptRequest(person._id)}
                                  >
                                    <PlusIcon className='-ml-1 mr-0.5 h-5 w-5' aria-hidden='true' />
                                    <span className='text-sm font-medium'>
                                      {t('common:btn_accept')}
                                    </span>
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    variant='cancel'
                                    onClick={() => handleRejectRequest(person._id)}
                                    type='button'
                                    className='ml-1'
                                  >
                                    <MinusCircleIcon
                                      className='-ml-1 mr-0.5 h-5 w-5'
                                      aria-hidden='true'
                                    />
                                    <span className='text-sm font-medium'>
                                      {t('common:btn_reject')}
                                    </span>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    t('common:no_pending_join_requests')
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PostLoginLayout>
  );
}

OrganizationPendingJoinRequests.auth = true;
