import axios from 'axios';
import MemberList from 'components/PreLogin/PublicOrgPage/MemberList';
import OrganizationPagination from 'components/shared/Pagination/OrganizationPagination';
import {ORG_MEMBER_SEARCH_STATE} from 'constants/yup/organization';
import organizationQueries from 'constants/GraphQL/Organizations/queries';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {useEffect, useState} from 'react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import Button from '@root/components/button';
import {useSession} from 'next-auth/react';

const OrgMemberSearch = ({organizationDetails, isManagement, userRole}) => {
  const {data: session} = useSession();
  const {t} = useTranslation();
  const [submittingSearch, setSubmittingSearch] = useState(false);
  const [memberSearchResults, setMemberSearchResults] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [memberSearchCount, setmemberSearchCount] = useState(0);
  const defaultItemsPerPage = isManagement ? 6 : 9;

  const handleUserSearch = async (values, pageNumber = 1, itemsPerPage = defaultItemsPerPage) => {
    try {
      setFormValues(values);
      setSubmittingSearch(true);

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
      setSubmittingSearch(false);
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  const handleSubmit = values => {
    setFormValues(values);
    handleUserSearch(values);
  };

  useEffect(() => {
    handleUserSearch({keywords: ''});
  }, []);

  return (
    <div className='w-full h-full pb-6'>
      {!isManagement && (
        <div className='py-0 mt-0 grid grid-cols-1 gap-2 px-0'>
          <Formik
            initialValues={ORG_MEMBER_SEARCH_STATE}
            onSubmit={values => {
              handleSubmit(values);
            }}
            enableReinitialize
          >
            {({values, handleChange}) => (
              <Form>
                {(memberSearchResults === null
                  ? true
                  : memberSearchCount > defaultItemsPerPage) && (
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
                          placeholder='Search for users...'
                          aria-label='Search'
                        />
                      </div>
                    </div>
                    <Button type='submit' variant='solid' className='h-max' onClick={() => {}}>
                      {submittingSearch ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      )}
      {memberSearchResults?.length > 0 ? (
        <div
          className={`py-0 md:mt-0 col-span-2 grid grid-cols-1 md:grid-cols-2 ${
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
          {submittingSearch ? (
            <div className='flex loader h-96 justify-center items-center align-middle self-center'>
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
            <div className='mt-0 md:mt-0 md:col-span-2 grid grid-cols-1 sm:grid-cols-1 gap-2'>
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
      {memberSearchResults && memberSearchCount > defaultItemsPerPage && (
        <div className='box col-start-1 col-span-4 sm:col-start-4 sm:col-span-2'>
          <OrganizationPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            defaultItemsPerPage={defaultItemsPerPage}
            memberSearchCount={memberSearchCount}
            searchHandler={(itemsPerPage, itemsToSkip) => {
              handleUserSearch(formValues, itemsPerPage, itemsToSkip);
            }}
          />
        </div>
      )}
    </div>
  );
};
export default OrgMemberSearch;
