/* eslint-disable no-unsafe-optional-chaining */
import axios from 'axios';
import UserCard from 'components/PreLogin/Search/userCard';
import UsersPagination from 'components/shared/Pagination/UsersPagination';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {SUMMARY_TABS} from 'constants/context/tabs';
import Tabs from 'components/PostLogin/Tabs/Tab';
import {useEffect, useRef, useState} from 'react';
import Recaptcha from 'react-google-recaptcha';
import EventCard from 'components/PreLogin/Event/EventCard';
import OrganizationCard from '../OrganizationCard';
import ServiceCard from '../serviceCard';
import HomeSearchForm from '../SearchForm';

const Users = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const [submittingSearch, setSubmittingSearch] = useState(false);
  const [formValues, setFormValues] = useState({keywords: '', location: ''});
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;
  const recaptchaRef = useRef<Recaptcha>();
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [totalMembersCount, setTotalMemberCount] = useState(0);
  const [totalOrgCount, setTotalOrgCount] = useState(0);
  const [totalServiceCount, setTotalServiceCount] = useState(0);
  const [orgSearchResults, setOrgSearchResults] = useState([]);
  const [totalEventCount, setTotalEventCount] = useState(0);
  const [eventSearchResults, setEventSearchResults] = useState([]);

  const [state, setstate] = useState({
    usrs: true,
    srvs: false,
    orgs: false,
    events: false,
  });
  const {query} = useRouter();
  const [tab, setTab] = useState<any>(query?.tab ? query?.tab : 'Users');

  const changeState = tabName => {
    if (tabName === 'Users') {
      setstate({
        usrs: true,
        srvs: false,
        orgs: false,
        events: false,
      });
    }
    if (tabName === 'Organizations') {
      setstate({
        usrs: false,
        srvs: false,
        orgs: true,
        events: false,
      });
    }
    if (tabName === 'Services') {
      setstate({
        usrs: false,
        srvs: true,
        orgs: false,
        events: false,
      });
    }
    if (tabName === 'Events') {
      setstate({
        usrs: false,
        srvs: false,
        orgs: false,
        events: true,
      });
    }
  };

  useEffect(() => {
    if (query?.tab) {
      setTab(query?.tab);
      changeState(query?.tab);
    }
  }, [query?.tab]);

  const [serviceSearchResults, setServiceSearchResults] = useState([]);

  const handleUserSearch = async (values, pageNumber = 1, itemsPerPage = resultsPerPage) => {
    try {
      const captchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      setSubmittingSearch(true);
      const response = await axios.post('/api/searchPage/search', {
        keywords: values.keywords || router?.query.keywords,
        location: values.location || router?.query.location,
        isIndividual: null,
        pageNumber: pageNumber,
        resultsPerPage: itemsPerPage,
        isProvider: true,
        captchaToken,
        srvs: state.srvs,
        usrs: state.usrs,
        orgs: state.orgs,
        events: state.events,
      });
      const data = await response.data;
      setUserSearchResults(data?.queryData?.data?.getUserAndOrganizationSearchResults?.userData);

      state.usrs
        ? setTotalMemberCount(data?.queryData?.data?.getUserAndOrganizationSearchResults?.userCount)
        : setTotalMemberCount(0);

      state.orgs
        ? setTotalOrgCount(
            data?.queryData?.data?.getUserAndOrganizationSearchResults?.organizationCount
          )
        : setTotalOrgCount(0);

      state.srvs
        ? setTotalServiceCount(
            data?.queryData?.data?.getUserAndOrganizationSearchResults?.serviceCount
          )
        : setTotalServiceCount(0);

      state.events
        ? setTotalEventCount(
            data?.queryData?.data?.getUserAndOrganizationSearchResults?.eventsCount
          )
        : setTotalEventCount(0);

      setOrgSearchResults(
        data?.queryData?.data?.getUserAndOrganizationSearchResults?.organizationData
      );

      setServiceSearchResults(
        data?.queryData?.data?.getUserAndOrganizationSearchResults?.serviceData
      );

      setEventSearchResults(data?.queryData?.data?.getUserAndOrganizationSearchResults?.eventData);

      setCurrentPage(pageNumber);
      setSubmittingSearch(false);
    } catch (err) {
      setSubmittingSearch(false);
    }
  };

  const handleSubmit = values => {
    router.replace({
      query: {
        ...router.query,
        keywords: values.keywords,
        location: values.location,
      },
    });
    handleUserSearch(values);
  };

  useEffect(() => {
    const values = {
      keywords: router?.query?.keywords as string,
      location: router?.query?.location as string,
    };
    setFormValues(values);
    setSubmittingSearch(true);
    handleUserSearch(values);
  }, [router.query]);

  useEffect(() => {
    setSubmittingSearch(true);
    handleUserSearch({keywords: formValues.keywords});
  }, [state.usrs, state.srvs, state.orgs]);

  return (
    <>
      <div className='sm:px-10 max-w-7xl mx-auto'>
        <div className='flex flex-col gap-x-6 mt-8'>
          <HomeSearchForm
            onSubmit={handleSubmit}
            recaptchaRef={recaptchaRef}
            initialValues={formValues}
          />
          <div className='flex space-x-6 flex-grow w-full lg:w-2/3 mb-4 py-2 mt-3 lg:mb-0 justify-start'>
            <Tabs
              openedTab={tab}
              className='w-full'
              tabsNames={SUMMARY_TABS.searchTabs}
              onChange={(tabName: string) => {
                changeState(tabName);

                setTab(tabName);
              }}
            />
          </div>
        </div>
      </div>
      {!submittingSearch ? (
        <>
          <div className=' max-w-7xl mx-auto mt-8 md:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-0 sm:px-10 '>
            {userSearchResults?.length > 0 &&
              userSearchResults.map((member, index) => <UserCard key={index} member={member} />)}

            {orgSearchResults?.length > 0 &&
              orgSearchResults.map((org, index) => <OrganizationCard key={index} orgData={org} />)}

            {serviceSearchResults?.length > 0 &&
              serviceSearchResults.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}

            {eventSearchResults?.length > 0 &&
              eventSearchResults.map((eventData: any, index) => (
                <EventCard
                  key={index}
                  eventData={eventData}
                  username={eventData?.userId?.accountDetails?.username || ''}
                  isVertical
                />
              ))}
          </div>
          {totalMembersCount > resultsPerPage ||
          totalMembersCount > 0 ||
          totalOrgCount > resultsPerPage ||
          totalOrgCount > 0 ||
          totalEventCount > resultsPerPage ||
          totalEventCount > 0 ||
          serviceSearchResults?.length > 0 ? (
            <div className='box col-start-1 col-span-4 sm:col-start-4 sm:col-span-2 mt-8 mb-6'>
              <UsersPagination
                currentPage={currentPage}
                resultsPerPage={resultsPerPage}
                setCurrentPage={setCurrentPage}
                totalOrgCount={totalOrgCount}
                totalMembersCount={totalMembersCount}
                totalServiceCount={totalServiceCount}
                totalEventCount={totalEventCount}
                usrs={state.usrs}
                srvs={state.srvs}
                orgs={state.orgs}
                events={state.events}
                searchHandler={(itemsPerPage, itemsToSkip) => {
                  handleUserSearch(formValues, itemsPerPage, itemsToSkip);
                }}
              />
            </div>
          ) : (
            <div className='mt-5 md:mt-0 md:col-span-2 grid grid-cols-1 sm:grid-cols-1  gap-2 px-0 sm:px-10 '>
              <div className='flex justify-center mt-10'>
                <div className='m-auto'>
                  <div className='flex flex-1 justify-center text-center items-center align-middle text-xl font-bold'>
                    {t('common:no_result_found')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className='mt-5 flex loader justify-center items-center align-middle self-center'>
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
      )}
    </>
  );
};
export default Users;
