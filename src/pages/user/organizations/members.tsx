import {useEffect, useState} from 'react';
import Head from 'next/head';

import useTranslation from 'next-translate/useTranslation';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';

import queries from 'constants/GraphQL/Organizations/queries';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import DropDownComponent from 'components/shared/DropDownComponent';
import Loader from 'components/shared/Loader/Loader';
import MemberList from 'components/PreLogin/PublicOrgPage/MemberList';
import OrganizationPagination from 'components/shared/Pagination/OrganizationPagination';

export default function OrganizationMembers() {
  const {t} = useTranslation();

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Organizations'), href: '/user/organizations'},
    {title: t('page:Members'), href: '/user/organizations/members'},
  ];

  const {data: session} = useSession();

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
  const [currentSelectedRole, setCurrentSelectedRole] = useState(null);
  const [offset, setOffset] = useState(1);
  const [limit, setLimit] = useState(6);

  const {data: memberResults, loading: memberLoading} = useQuery(
    queries.GetOrganizationMembersById,
    {
      variables: {
        token: session?.accessToken,
        documentId: currentSelectedOrg?._id,
        searchParams: {
          pageNumber: offset,
          resultsPerPage: limit,
        },
      },
      skip: !organizationsData,
    }
  );

  const membersData = memberResults?.getOrganizationMembersById?.members;
  const memberCount = memberResults?.getOrganizationMembersById?.memberCount || 0;

  useEffect(() => {
    if (organizationsData) {
      setCurrentSelectedOrg(organizationsData[0]?.organizationId || null);
      setCurrentSelectedRole(organizationsData[0]?.role || null);
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
    setCurrentSelectedRole(currentOrg?.role);
  };

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:Members')}</title>
      </Head>
      <Header crumbs={crumbs} heading={t('page:Members')} />

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

        {memberLoading && !membersData && (
          <div className='mt-4'>
            <Loader />
          </div>
        )}

        {membersData && (
          <div className='mt-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <MemberList
                members={membersData || []}
                isManagement={true}
                organizationDetails={currentSelectedOrg}
                userRole={currentSelectedRole}
              />
            </div>

            {memberCount > limit && (
              <div className='mt-6'>
                <OrganizationPagination
                  currentPage={offset}
                  setCurrentPage={setOffset}
                  defaultItemsPerPage={limit}
                  memberSearchCount={memberCount}
                  searchHandler={(itemsPerPage, itemsToSkip) => {
                    setOffset(itemsPerPage);
                    setLimit(itemsToSkip);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </PostLoginLayout>
  );
}
OrganizationMembers.auth = true;
