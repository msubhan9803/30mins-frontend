import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import Header from '@root/components/header';
import React, {useCallback, useRef, useState} from 'react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/Booking/queries';
import Table from './table';
import SearchForm from '../Allusers/SearchForm';

const AllMeetings = ({session}) => {
  const {t} = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoresults] = useState(false);
  const queryIdRef = useRef(0);

  const [searchFilter, setSearchFilter] = useState({
    keywords: '',
    newSearch: false,
  });

  const queryBookings = useCallback(
    async (searchParams, pageNumber, pageSize) => {
      const queryId = ++queryIdRef.current;

      const searchPayload = searchParams;
      delete searchPayload.newSearch;

      try {
        if (queryId === queryIdRef.current) {
          setIsLoading(true);
          const dataResponse = await graphqlRequestHandler(
            queries.getBookingsForAdmin,
            {
              searchParams: {
                ...searchParams,
                pageNumber,
                resultsPerPage: pageSize,
              },
              token: session?.accessToken,
            },
            process.env.BACKEND_API_KEY
          );
          if (dataResponse?.data?.data?.getBookingsForAdmin?.response?.status === 404) {
            setNoresults(true);
            setIsLoading(false);
          } else {
            setNoresults(false);
            const usersCount = dataResponse?.data?.data?.getBookingsForAdmin?.bookingCount || 0;
            setBookings(dataResponse?.data?.data?.getBookingsForAdmin?.bookingData);
            setPageCount(Math.ceil(usersCount / pageSize));
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

  const FormatedDate = ({value}) => (
    <div className='flex items-center'>{dayjs(value.meetingDate).format('dddd DD MMMM YYYY')}</div>
  );

  const ActionColumn = ({value}) => (
    <div className='flex items-center'>
      <Link href={`/user/meetingDetails/${value}`} passHref>
        <div className='mr-2 w-12 justify-center flex items-center text-gray-600 p-2 border-transparent border  bg-gray-100 hover:text-mainBlue cursor-pointer rounded focus:outline-none focus:border-gray-800 focus:shadow-outline-gray'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='icon cursor-pointer icon-tabler icon-tabler-edit'
            width={20}
            height={20}
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path stroke='none' d='M0 0h24v24H0z' />
            <path d='M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3' />
            <path d='M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3' />
            <line x1={16} y1={5} x2={19} y2={8} />
          </svg>
        </div>
      </Link>
    </div>
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Provider Name',
        accessor: 'providerName',
      },
      {
        Header: 'Booker Name',
        accessor: 'bookerName',
      },
      {
        Header: 'Conference Type',
        accessor: 'conferenceType',
      },
      {
        Header: 'Price',
        accessor: 'price',
        currencyAccessor: 'currency',
        Cell: PricewithCurrency,
      },
      {
        Header: 'Meeting Date',
        accessor: 'meetingDate',
        Cell: FormatedDate,
      },
      {
        Header: 'Actions',
        accessor: '_id',
        Cell: ActionColumn,
      },
    ],
    []
  );

  const crumbs = [{title: t('meeting:txt_all_meeting'), href: '/'}];

  return (
    <>
      <Header crumbs={crumbs} heading={t('meeting:txt_all_meeting')} />
      <div className='min-h-screen text-gray-900'>
        <main className='max-w-7xl mx-auto px-0 pt-4'>
          <SearchForm setSearchFilter={setSearchFilter} isLoading={isLoading} />
          <div className='mt-6'>
            <Table
              columns={columns}
              data={bookings}
              pageCount={pageCount}
              searchFilter={searchFilter}
              query={queryBookings}
              isLoading={isLoading}
              noResults={noResults}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default AllMeetings;
