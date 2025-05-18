import axios from 'axios';
import MemberList from 'components/PreLogin/PublicOrgPage/MemberList';
import OrganizationPagination from 'components/shared/Pagination/OrganizationPagination';
import {ORG_MEMBER_SEARCH_STATE} from 'constants/yup/organization';
import organizationQueries from 'constants/GraphQL/Organizations/queries';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {useEffect, useState} from 'react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {useSession} from 'next-auth/react';
import Button from '@root/components/button';
import {LoaderIcon} from 'react-hot-toast';

const OrgMemberSearch = ({organizationDetails, isManagement, userRole}) => {
  const {data: session} = useSession();
  const {t} = useTranslation();
  const [submittingSearch, setSubmittingSearch] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [memberSearchResults, setMemberSearchResults] = useState([]);
  const [memberSearchCount, setmemberSearchCount] = useState(0);
  const [LoadingSearch, setLoadingSearch] = useState(false);
  const defaultItemsPerPage = 9;

  const handleUserSearch = async (
    values,
    fromButton,
    pageNumber = 1,
    itemsPerPage = defaultItemsPerPage
  ) => {
    try {
      setFormValues(values);
      fromButton && setSubmittingSearch(true);
      setLoadingSearch(true);

      if (!isManagement) {
        const searchResults = await axios.post('/api/organizations/searchusers', {
          documentId: organizationDetails._id,
          keywords: values.keywords,
          pageNumber: pageNumber,
          resultsPerPage: itemsPerPage,
        });
        setMemberSearchResults(
          searchResults?.data?.userData?.data?.getOrganizationMemberResults?.userData
        );
        setmemberSearchCount(
          searchResults?.data?.userData?.data?.getOrganizationMemberResults?.userCount
        );
      } else {
        const {data: memberResults} = await graphqlRequestHandler(
          organizationQueries.GetOrganizationMembersById,
          {
            token: session?.accessToken,
            documentId: organizationDetails._id,
            searchParams: {
              pageNumber: pageNumber,
              resultsPerPage: itemsPerPage,
            },
          },
          session?.accessToken
        );

        setMemberSearchResults(memberResults?.data?.getOrganizationMembersById?.members);
        setmemberSearchCount(memberResults?.data?.getOrganizationMembersById?.memberCount);
      }

      setLoadingSearch(false);
      setSubmittingSearch(false);
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  const handleSubmit = values => {
    setFormValues(values);
    handleUserSearch(values, false);
  };

  useEffect(() => {
    handleUserSearch({keywords: ''}, false);
  }, []);

  return (
    <div className='px-2 py-6 h-full flex flex-col gap-6'>
      <div className='grid grid-cols-1 gap-2 px-0 sm:px-10 '>
        <Formik
          initialValues={ORG_MEMBER_SEARCH_STATE}
          onSubmit={values => {
            handleSubmit(values);
          }}
          enableReinitialize
        >
          {({values, handleChange}) => (
            <Form>
              <div className='flex justify-end gap-2'>
                <div className='mb-3 w-full md:w-2/6'>
                  <div className='input-group relative flex flex-wrap items-stretch w-full mb-4'>
                    <input
                      type='text'
                      name='keywords'
                      id='keywords'
                      value={values.keywords}
                      onChange={handleChange}
                      className='form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-mainBlue focus:outline-none'
                      placeholder='Search for users...'
                      aria-label='Search'
                    />
                  </div>
                </div>
                <Button type='submit' variant='solid' className='h-max' onClick={() => {}}>
                  {submittingSearch ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {memberSearchResults?.length > 0 ? (
        <div
          className={`pb-20 col-span-2 grid grid-cols-1 md:grid-cols-2 ${
            isManagement ? '' : 'lg:grid-cols-3'
          } gap-2`}
        >
          <MemberList
            members={memberSearchResults || []}
            isManagement={isManagement}
            organizationDetails={organizationDetails}
            userRole={userRole}
          />
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
                    {t('common:no_user_found')}
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
          memberSearchCount={memberSearchCount}
          disabled={!(memberSearchResults && memberSearchCount > defaultItemsPerPage)}
          searchHandler={(itemsPerPage, itemsToSkip) => {
            handleUserSearch(formValues, false, itemsPerPage, itemsToSkip);
          }}
        />
      </footer>
    </div>
  );
};

export default OrgMemberSearch;
