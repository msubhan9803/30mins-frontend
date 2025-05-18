import useTranslation from 'next-translate/useTranslation';
import React, {useCallback, useRef, useState} from 'react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/Service/queries';
import Header from '@root/components/header';
import Table from './table';
import SearchForm from './SearchForm';

const AllServices = ({session}) => {
  const {t} = useTranslation();
  const [services, setService] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoresults] = useState(false);
  const queryIdRef = useRef(0);

  const [showOrgServices, setShowOrgServices] = useState(false);

  const [searchFilter, setSearchFilter] = useState({
    keywords: '',
    isOrgService: false,
    newSearch: false,
  });

  const queryServices = useCallback(
    async (serviceSearchParams, pageNumber, pageSize) => {
      const queryId = ++queryIdRef.current;

      const searchPayload = serviceSearchParams;

      if (searchPayload?.isOrgService) {
        setShowOrgServices(true);
      } else {
        setShowOrgServices(false);
      }
      delete searchPayload.newSearch;

      try {
        if (queryId === queryIdRef.current) {
          setIsLoading(true);
          const dataResponse = await graphqlRequestHandler(
            queries.getServicesForAdmin,
            {
              serviceSearchParams: {
                ...serviceSearchParams,
                pageNumber,
                resultsPerPage: pageSize,
              },
              token: session?.accessToken,
            },
            process.env.BACKEND_API_KEY
          );
          if (dataResponse?.data?.data?.getServicesForAdmin?.response?.status === 404) {
            setNoresults(true);
            setIsLoading(false);
          } else {
            setNoresults(false);
            const serviceCount = dataResponse?.data?.data?.getServicesForAdmin?.serviceCount || 0;
            setService(dataResponse?.data?.data?.getServicesForAdmin?.serviceData);
            setPageCount(Math.ceil(serviceCount / pageSize));
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    [session?.accessToken]
  );

  const PricewithCurrency = ({value, column, row}) => (
    <div className='flex items-center'>
      {value > 0 ? (
        <>
          <div className='text-sm text-gray-500'>
            {row.original[column.currencyAccessor]}
            {value}
          </div>
        </>
      ) : (
        <div className='text-sm text-gray-500'>{t('event:Free')}</div>
      )}
    </div>
  );

  const NameWithUsername = ({value, row}) => (
    <div className='flex items-center'>
      <a href={`https://30mins.com/${row?.original?.userId?.accountDetails?.username}`}>
        <div className='text-sm text-mainBlue'>{value}</div>
      </a>
    </div>
  );

  const Duration = ({value}) => (
    <div className='flex items-center'>
      <div className='text-sm text-gray-500'>{value} min</div>
    </div>
  );

  const columnsServices = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Duration',
        accessor: 'duration',
        Cell: Duration,
      },
      {
        Header: 'Price',
        accessor: 'price',
        currencyAccessor: 'currency',
        Cell: PricewithCurrency,
      },
      {
        Header: 'Provider',
        accessor: 'userId.personalDetails.name',
        Cell: NameWithUsername,
      },
    ],
    []
  );

  const columnsOrgServices = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Duration',
        accessor: 'duration',
        Cell: Duration,
      },
      {
        Header: 'Price',
        accessor: 'price',
        currencyAccessor: 'currency',
        Cell: PricewithCurrency,
      },
      {Header: 'Organization Name', accessor: 'organizationName'},
      {
        Header: 'Provider',
        accessor: 'userId.personalDetails.name',
        Cell: NameWithUsername,
      },
    ],
    []
  );
  const crumbs = [{title: t('page:All Services'), href: '/'}];

  return (
    <>
      <Header crumbs={crumbs} heading={t('page:All Services')} />
      <div className='min-h-screen text-gray-900'>
        <main className='max-w-7xl mx-auto px-0 pt-4'>
          <SearchForm setSearchFilter={setSearchFilter} isLoading={isLoading} />
          <div className='mt-6'>
            <Table
              columns={showOrgServices ? columnsOrgServices : columnsServices}
              data={services}
              pageCount={pageCount}
              searchFilter={searchFilter}
              query={queryServices}
              isLoading={isLoading}
              noResults={noResults}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default AllServices;
