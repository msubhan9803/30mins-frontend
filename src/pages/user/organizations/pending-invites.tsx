import {useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';

import useTranslation from 'next-translate/useTranslation';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';

import queries from 'constants/GraphQL/Organizations/queries';
import mutations from 'constants/GraphQL/Organizations/mutations';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import DropDownComponent from 'components/shared/DropDownComponent';
import Loader from 'components/shared/Loader/Loader';
import Button from '@root/components/button';

import graphqlRequestHandler from 'utils/graphqlRequestHandler';

export default function OrganizationPendingInvites() {
  const {t} = useTranslation();

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Organizations'), href: '/user/organizations'},
    {title: t('page:Pending_Invites'), href: '/user/organizations/pending-invites'},
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

  const {data: inviteResults, loading: inviteLoading} = useQuery(queries.getPendingInvitesByOrgId, {
    variables: {
      token: session?.accessToken,
      organizationId: currentSelectedOrg?._id,
    },
    skip: !organizationsData,
  });

  const invitesData = inviteResults?.getPendingInvitesByOrgId?.pendingInvites;

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

  const handleDeleteInvite = async documentId => {
    try {
      await graphqlRequestHandler(
        mutations.deletePendingInvite,
        {
          token: session?.accessToken,
          organizationId: currentSelectedOrg?._id,
          documentId,
        },
        session?.accessToken
      );
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:Pending_Invites')}</title>
      </Head>
      <Header crumbs={crumbs} heading={t('page:Pending_Invites')} />

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
                                      person?.inviteeUserId?.accountDetails?.avatar ||
                                      '/assets/default-profile.jpg'
                                    }
                                    alt=''
                                  />
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  {person?.inviteeEmail}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  <Button
                                    variant='outline'
                                    onClick={() => {
                                      handleDeleteInvite(person._id);
                                    }}
                                  >
                                    {t('Delete Invite')}
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    t('common:no_pending_invites')
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

OrganizationPendingInvites.auth = true;
