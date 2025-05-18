import Button from '@root/components/button';
import axios from 'axios';
import OrganizationPagination from 'components/shared/Pagination/OrganizationPagination';
import {ORG_SERVICE_SEARCH_STATE} from 'constants/yup/organization';
import {Form, Formik} from 'formik';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useEffect, useState} from 'react';
import ServiceCard from '@root/components/service-card';
import FieldSearchTags from '@root/components/field-search-tags';
import {useRouter} from 'next/router';
import {LoaderIcon} from 'react-hot-toast';

const OrgServiceSearch = ({organizationDetails, tags}) => {
  const {data: session} = useSession();
  const {t} = useTranslation();
  const router = useRouter();
  const [submittingSearch, setSubmittingSearch] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceSearchResuls, setServiceSearchResuls] = useState([]);
  const [serviceSerchCount, setserviceSerchCount] = useState(0);
  const [LoadingSearch, setLoadingSearch] = useState(false);
  const [InitTags, setInitTags] = useState([]);
  const defaultItemsPerPage = 6;

  const [ListTags, setListTags] = useState<Array<string>>(
    tags?.split(',').filter(el => (el === null ? false : true)) || []
  );

  useEffect(() => {
    router.push({
      pathname: router.asPath.split('?')[0],
      query: {
        tags: ListTags.join(','),
      },
    });
  }, [ListTags]);

  const handleServiceSearch = async (
    values,
    pageNumber = 1,
    itemsPerPage = defaultItemsPerPage,
    formButton = false
  ) => {
    setFormValues(values);
    formButton && setSubmittingSearch(true);
    setLoadingSearch(true);

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
      searchTags: values.searchTags,
      isPaid: paidParam,
      pageNumber: pageNumber,
      resultsPerPage: itemsPerPage,
    });

    const data = await response.data;
    setServiceSearchResuls(data?.userData?.data?.getOrganizationServiceResults?.services);
    setserviceSerchCount(data?.userData?.data?.getOrganizationServiceResults?.serviceCount);
    setInitTags(data?.userData?.data?.getOrganizationServiceResults?.allOrgTags);
    setSubmittingSearch(false);
    setLoadingSearch(false);
  };

  const handleSubmit = values => {
    setFormValues(values);
    handleServiceSearch(values, 1, defaultItemsPerPage, true);
  };

  useEffect(() => {
    handleServiceSearch({keywords: '', searchTags: ListTags});
  }, []);

  return (
    <>
      <div className='px-2 pt-6 flex h-full flex-col gap-6'>
        <div className='flex flex-col gap-8 divide-x'>
          <Formik
            initialValues={ORG_SERVICE_SEARCH_STATE}
            onSubmit={values => {
              handleSubmit({...values, searchTags: ListTags});
            }}
            enableReinitialize
          >
            {({values, handleChange}) => (
              <Form className='flex flex-col-reverse h-full md:flex-row gap-2 w-full'>
                <div className='w-full'>
                  <FieldSearchTags
                    onChange={(e: any) => {
                      setListTags(e);
                    }}
                    value={ListTags}
                    initialTags={InitTags}
                  />
                </div>

                <div className='flex w-full md:w-6/12 gap-1 pt-1'>
                  <div className='mb-3 w-full'>
                    <div className='input-group gap-2 relative pt-1 flex flex-row items-stretch w-full mb-4'>
                      <input
                        type='text'
                        name='keywords'
                        id='keywords'
                        value={values.keywords}
                        onChange={handleChange}
                        className='form-control relative flex-auto min-w-0 block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-mainBlue focus:outline-none'
                        placeholder='Search for services...'
                        aria-label='Search'
                      />
                      <Button type='submit' variant='solid' className='h-max' onClick={() => {}}>
                        {submittingSearch ? 'Searching...' : 'Search'}
                      </Button>
                    </div>
                    <div className='w-full'>
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
              </Form>
            )}
          </Formik>
        </div>

        {serviceSearchResuls && serviceSearchResuls?.length > 0 ? (
          <div className={`pb-20 col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2`}>
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
            {LoadingSearch ? (
              <div className='flex flex-1 loader justify-center items-center align-middle self-center'>
                <LoaderIcon style={{height: 50, width: 50}} />
              </div>
            ) : (
              <div className='mt-5 md:mt-0 md:col-span-2 grid grid-cols-1 sm:grid-cols-1 gap-2'>
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

        <footer className='fixed bottom-0 left-0 right-0 w-full'>
          <OrganizationPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            defaultItemsPerPage={defaultItemsPerPage}
            memberSearchCount={serviceSerchCount}
            disabled={!(serviceSearchResuls && serviceSerchCount > defaultItemsPerPage)}
            searchHandler={(itemsPerPage, itemsToSkip) => {
              handleServiceSearch(formValues, itemsPerPage, itemsToSkip, false);
            }}
          />
        </footer>
      </div>
    </>
  );
};
export default OrgServiceSearch;
