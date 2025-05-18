import {useEffect, useState} from 'react';
import Head from 'next/head';

import useTranslation from 'next-translate/useTranslation';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {Form, Formik} from 'formik';

import queries from 'constants/GraphQL/Organizations/queries';
import {ORG_SERVICE_SEARCH_STATE} from 'constants/yup/organization';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import DropDownComponent from 'components/shared/DropDownComponent';
import Loader from 'components/shared/Loader/Loader';
import ServiceCard from '@root/components/service-card';
import OrganizationPagination from 'components/shared/Pagination/OrganizationPagination';
import Button from '@root/components/button';
import {useRouter} from 'next/router';

function LoaderIcon() {
  return (
    <svg
      className='custom_loader animate-spin h-10 w-10 text-mainBlue'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      ></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      ></path>
    </svg>
  );
}

export default function OrganizationServices() {
  const {t} = useTranslation();
  const {query} = useRouter();

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Organizations'), href: '/user/organizations'},
    {title: t('page:Services'), href: '/user/organizations/services'},
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
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    isPaid: null,
    keywords: '',
  });
  const [offset, setOffset] = useState(1);
  const [limit, setLimit] = useState(6);

  const {data: serviceResults, loading: serviceLoading} = useQuery(
    queries.GetOrganizationServiceResults,
    {
      variables: {
        documentId: currentSelectedOrg?._id,
        searchParams: {
          keywords: formData.keywords,
          isPaid: formData.isPaid,
          pageNumber: offset,
          resultsPerPage: limit,
        },
      },
      skip: !currentSelectedOrg,
    }
  );

  const servicesData = serviceResults?.getOrganizationServiceResults?.services;
  const serviceCount = serviceResults?.getOrganizationServiceResults?.serviceCount || 0;

  useEffect(() => {
    if (organizationsData) {
      if (query?.oid) {
        const org = organizationsData?.find(el => el.organizationId._id === query?.oid);
        if (org) {
          setCurrentSelectedOrg(org?.organizationId || null);
        }
      } else {
        setCurrentSelectedOrg(organizationsData[0]?.organizationId || null);
      }
    }
  }, [organizationsData]);

  // useEffect(() => {
  // }, [query?.oid]);

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

  if (!serviceLoading && isLoading) {
    setIsLoading(false);
  }

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:Services')}</title>
      </Head>
      <Header crumbs={crumbs} heading={t('page:Services')} />

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
              value={currentSelectedOrg?._id}
              className='w-full max-w-[300px]'
              onChange={handleChangeOrganization}
            />
          </div>
        )}

        <div className='mt-4 px-2'>
          <Formik
            enableReinitialize
            initialValues={ORG_SERVICE_SEARCH_STATE}
            onSubmit={values => {
              let paidParam: any = values.isPaid;

              if (values.isFree && !values.isPaid) {
                paidParam = false;
              } else if (!values.isFree && values.isPaid) {
                paidParam = true;
              }
              if (values.isPaid && values.isFree) {
                paidParam = null;
              }
              if (!values.isPaid && !values.isFree) {
                paidParam = null;
              }

              setFormData({
                isPaid: paidParam,
                keywords: values.keywords,
              });

              setIsLoading(true);
            }}
          >
            {({values, handleChange}) => (
              <Form>
                <div className='flex justify-end gap-2'>
                  <div className='mb-0 w-full md:w-2/6'>
                    <div className='input-group relative flex flex-wrap items-stretch w-full mb-0'>
                      <input
                        type='text'
                        name='keywords'
                        id='keywords'
                        value={values.keywords}
                        onChange={handleChange}
                        className='form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-mainBlue focus:outline-none'
                        placeholder='Search for services...'
                        aria-label='Search'
                      />
                      <div>
                        <input
                          id='isFree'
                          name='isFree'
                          value={values.isFree}
                          onChange={handleChange}
                          type='checkbox'
                          className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded'
                        />
                        <label className='text-sm ml-2 pr-2'>{t('common:Free')}</label>
                        <input
                          id='isPaid'
                          name='isPaid'
                          value={values.isPaid}
                          onChange={handleChange}
                          type='checkbox'
                          className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded'
                        />
                        <label className='text-sm ml-2'>{t('common:Paid')}</label>
                      </div>
                    </div>
                  </div>
                  <Button type='submit' variant='solid' className='h-max'>
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {serviceLoading && !servicesData && (
          <div className='mt-4 flex items-center justify-center'>
            <LoaderIcon />
          </div>
        )}

        {!serviceLoading && !servicesData && organizationsData && (
          <p>{t('common:no_services_found')}</p>
        )}

        {servicesData && (
          <div className='mt-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2'>
              {servicesData.map((item: any, key) => (
                <ServiceCard
                  key={key}
                  service={item}
                  type={item?.serviceType}
                  username={item?.userId?.accountDetails?.username}
                />
              ))}
            </div>

            {serviceCount > limit && (
              <div className='mt-6'>
                <OrganizationPagination
                  currentPage={offset}
                  setCurrentPage={setOffset}
                  defaultItemsPerPage={limit}
                  memberSearchCount={serviceCount}
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
OrganizationServices.auth = true;
