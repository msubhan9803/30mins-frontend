import {useEffect, useState} from 'react';
import Button from '@root/components/button';
import axios from 'axios';
import OrganizationPagination from 'components/shared/Pagination/OrganizationPagination';
import {ORG_SERVICE_SEARCH_STATE} from 'constants/yup/organization';
import {Form, Formik} from 'formik';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import ServiceCard from '@root/components/service-card';

const OrgServiceSearch = ({organizationDetails}) => {
  const {data: session} = useSession();
  const {t} = useTranslation();
  const [submittingSearch, setSubmittingSearch] = useState(false);
  const [FirstLoad, setFirstLoad] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceSearchResuls, setServiceSearchResuls] = useState([]);
  const [serviceSerchCount, setserviceSerchCount] = useState(0);
  const defaultItemsPerPage = 12;

  const handleServiceSearch = async (
    values,
    pageNumber = 1,
    itemsPerPage = defaultItemsPerPage
  ) => {
    setFormValues(values);
    setSubmittingSearch(true);

    let paidParam = values.isPaid;

    if (values.isFree && !values.isPaid) {
      paidParam = 'false';
    } else if (!values.isFree && values.isPaid) {
      paidParam = 'true';
    }
    if (values.isPaid && values.isFree) {
      paidParam = null;
    }
    if (!values.isPaid && !values.isFree) {
      paidParam = null;
    }

    const response = await axios.post('/api/organizations/services', {
      documentId: organizationDetails._id,
      token: session?.accessToken,
      keywords: values.keywords,
      isPaid: paidParam,
      pageNumber: pageNumber,
      resultsPerPage: itemsPerPage,
    });

    const data = await response.data;
    setServiceSearchResuls(data?.userData?.data?.getOrganizationServiceResults?.services);
    setserviceSerchCount(data?.userData?.data?.getOrganizationServiceResults?.serviceCount);
    setSubmittingSearch(false);
    setFirstLoad(true);
  };

  const handleSubmit = values => {
    setFormValues(values);
    handleServiceSearch(values);
  };

  useEffect(() => {
    handleServiceSearch({keywords: ''});
  }, []);

  return (
    <>
      <div className='px-2 py-2'>
        <div className='grid grid-cols-1 gap-2 pb-2'>
          <Formik
            initialValues={ORG_SERVICE_SEARCH_STATE}
            onSubmit={values => {
              handleSubmit(values);
            }}
            enableReinitialize
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
                          value={values.isPaid}
                          onChange={handleChange}
                          name='isPaid'
                          type='checkbox'
                          className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded'
                        />
                        <label className='text-sm ml-2'>{t('common:Paid')}</label>
                      </div>
                    </div>
                  </div>
                  <Button type='submit' variant='solid' className='h-max' onClick={() => {}}>
                    {submittingSearch && FirstLoad ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {serviceSearchResuls && serviceSearchResuls?.length > 0 ? (
          <div className={`mt-0 col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2`}>
            {serviceSearchResuls.map((item: any, key) => (
              <ServiceCard
                key={key}
                service={item}
                type={item?.serviceType}
                username={item?.userId?.accountDetails?.username}
              />
            ))}
          </div>
        ) : (
          <>
            {submittingSearch ? (
              <div className='flex loader h-60 justify-center items-center align-middle self-center'>
                <svg
                  className='custom_loader -ml-1 mr-3 h-10 w-10 text-mainBlue'
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
              </div>
            ) : (
              <div className='mt-0 md:col-span-2 grid grid-cols-1 sm:grid-cols-1 gap-2'>
                <div className='flex justify-center mt-10'>
                  <div className='m-auto'>
                    <div className='flex flex-1 justify-center text-center items-center align-middle text-xl font-bold'>
                      {t('common:no_services_found')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {serviceSearchResuls && serviceSerchCount > defaultItemsPerPage && (
          <div className='box col-start-1 col-span-4 sm:col-start-4 sm:col-span-2'>
            <OrganizationPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              defaultItemsPerPage={defaultItemsPerPage}
              memberSearchCount={serviceSerchCount}
              searchHandler={(itemsPerPage, itemsToSkip) => {
                handleServiceSearch(formValues, itemsPerPage, itemsToSkip);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};
export default OrgServiceSearch;
