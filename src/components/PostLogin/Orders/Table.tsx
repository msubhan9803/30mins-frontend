import {useEffect, useState} from 'react';
import {ArrowLeftIcon, ArrowRightIcon, PencilSquareIcon} from '@heroicons/react/20/solid';
import {useQuery} from '@apollo/client';
import bookingQueries from 'constants/GraphQL/Booking/queries';
import userQueries from 'constants/GraphQL/User/queries';
import {useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import getMeetingStatus from 'utils/getMeetingStatus';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import {SERVICE_TYPES} from 'constants/enums';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface TableData {
  _id: string;
  bookerName: string;
  providerName: string;
  subject: string;
  status: {
    providerDeclined: boolean;
    refunded: boolean;
    refundRequested: boolean;
    clientCanceled: boolean;
    conferenceType: boolean;
    providerCanceled: boolean;
    hasOpenReport: boolean;
    clientConfirmed: boolean;
    providerConfirmed: boolean;
  };
  price: number;
  currency: string;
  conferenceType: string;
  meetingDate: string;
  startTime: string;
  endTime: string;
  serviceType: string;
}

type IProps = {
  filter?: 'Completed' | 'Pending';
};
const Table = ({filter}: IProps) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const date = new Date();
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [isProvider, setIsProvider] = useState<boolean>(true);
  const [filterText, setFilterText] = useState<string>('');
  const [filterTextRender, setFilterTextRender] = useState<string>('');
  const [pageNumberList, setPageNumberList] = useState<number[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [tableData, setTableData] = useState<TableData[]>([]);

  const {data: providerBooking, loading} = useQuery(bookingQueries.getBookings, {
    variables: {
      token: session?.accessToken,
      searchParams: {
        pageNumber: selectedPage,
        resultsPerPage: rowsPerPage,
        isProvider: true,
        serviceType: SERVICE_TYPES.FREELANCING_WORK,
        month: month,
        year: year,
      },
    },
  });

  const {data: clientBooking, loading: clientLoading} = useQuery(bookingQueries.getBookings, {
    variables: {
      token: session?.accessToken,
      searchParams: {
        pageNumber: selectedPage,
        resultsPerPage: rowsPerPage,
        isProvider: false,
        serviceType: SERVICE_TYPES.FREELANCING_WORK,
        month: month,
        year: year,
      },
    },
  });
  const {data: user, loading: userLoading} = useQuery(userQueries.getUserById, {
    variables: {
      token: session?.accessToken,
    },
  });
  const providerBookings = providerBooking?.getBookings?.bookingData;
  const clientBookings = clientBooking?.getBookings?.bookingData;
  const locationDetails = user?.getUserById?.userData?.locationDetails;
  const providerBookingsCount = providerBooking?.getBookings?.bookingCount;
  const clientBookingsCount = clientBooking?.getBookings?.bookingCount;

  useEffect(() => {
    isProvider
      ? setTableData(
          providerBookings?.filter(el =>
            filter === 'Completed'
              ? el.status.providerConfirmed === true ||
                el.status.clientConfirmed === true ||
                el.status.providerCanceled === true ||
                el.status.clientCanceled === true
              : filter === 'Pending'
              ? el.status.providerConfirmed === false &&
                el.status.clientConfirmed === false &&
                el.status.providerCanceled === false &&
                el.status.clientCanceled === false
              : true
          )
        )
      : setTableData(
          clientBookings?.filter(el =>
            filter === 'Completed'
              ? el.status.providerConfirmed === true ||
                el.status.clientConfirmed === true ||
                el.status.providerCanceled === true ||
                el.status.clientCanceled === true
              : filter === 'Pending'
              ? el.status.providerConfirmed === false &&
                el.status.clientConfirmed === false &&
                el.status.providerCanceled === false &&
                el.status.clientCanceled === false
              : true
          )
        );

    function dynamicPageNumbers(bookingsCount: number, rowsLimitPerPage: number) {
      const totalPagesCalculated = Math.ceil(bookingsCount / rowsLimitPerPage);
      setTotalPages(totalPagesCalculated);
    }

    isProvider
      ? dynamicPageNumbers(providerBookingsCount, rowsPerPage)
      : dynamicPageNumbers(clientBookingsCount, rowsPerPage);
  }, [user, providerBookings, clientBookings, isProvider, month, filterTextRender, rowsPerPage]);

  useEffect(() => {
    setSelectedPage(1);
  }, [rowsPerPage]);

  useEffect(() => {
    setRowsPerPage(rowsPerPage);
    let pageNumbersArray: number[];
    if (totalPages > 5) {
      pageNumbersArray = Array.from({length: 5}, (_, i) => i + 1);
    } else {
      pageNumbersArray = Array.from({length: totalPages}, (_, i) => i + 1);
    }
    if (selectedPage > 3) {
      pageNumbersArray = Array.from({length: 5}, (_, i) => i + selectedPage - 2);
      pageNumbersArray = pageNumbersArray.filter(pageNumbers => pageNumbers <= totalPages);
      if (pageNumbersArray.length < 5) {
        !Number.isNaN(pageNumbersArray[0] - 1) && pageNumbersArray.unshift(pageNumbersArray[0] - 1);
        if (pageNumbersArray.length < 5) {
          pageNumbersArray.unshift(pageNumbersArray[0] - 1);
        }
      }
    }

    pageNumbersArray?.length === 1 ? setPageNumberList([]) : setPageNumberList(pageNumbersArray);
  }, [user, rowsPerPage, selectedPage, totalPages]);

  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
      return;
    }
    setMonth(month + 1);
  };

  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
      return;
    }
    setMonth(month - 1);
  };

  if (loading || clientLoading || userLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className='container mx-auto'>
        <div className='grid items-center mb-5 md:grid-cols-3'>
          <div className='flex items-start'>
            <button
              type='button'
              onClick={() => setIsProvider(true)}
              className={
                isProvider
                  ? 'font-medium border-b-2 border-mainBlue text-mainBlue p-5 mr-10 pl-0 pb-2 mb-5 pr-0'
                  : 'font-medium border-mainBlue text-gray-500 p-5 mr-10 pl-0 pb-2 mb-5 pr-0'
              }
            >
              {t('meeting:as_seller')}
            </button>
            <button
              type='button'
              onClick={() => setIsProvider(false)}
              className={
                !isProvider
                  ? 'font-medium border-b-2 border-mainBlue text-mainBlue p-5 mr-10 pl-0 pb-2 mb-5 pr-0'
                  : 'font-medium border-mainBlue text-gray-500 p-5 mr-10 pl-0 pb-2 mb-5 pr-0'
              }
            >
              {t('meeting:as_buyer')}
            </button>
          </div>
          <div></div>
          <div className='flex items-center justify-start md:justify-end lg:justify-end md:mt-3 lg:mt-5 my-3'>
            <input
              type='text'
              id='filter'
              name='filter'
              onChange={event => setFilterText(event.target.value)}
              className='rounded-md border-gray text-gray-500 text-sm'
              placeholder={isProvider ? t('meeting:buyer_name') : t('meeting:seller_name')}
            />
            <button
              type='button'
              className='sm:text-white rounded-lg shadow-sm text-md font-medium ml-5 focus:outline-none px-4 py-2 text-md bg-mainBlue text-white '
              onClick={() => setFilterTextRender(filterText)}
            >
              {t('meeting:search')}
            </button>
          </div>
        </div>

        <div className='flex items-center justify-start md:justify-between w-full mb-3 relative gap-2'>
          <div className='w-40 sm:w-50 md:70'>
            <span className='text-2xl md:text-2xl uppercase font-bold text-gray-800 mr-1'>
              {monthNames[month]}
            </span>
            <span className='text-2xl md:text-2xl font-bold text-gray-800'>{year}</span>
          </div>

          <div className='w-fit flex items-center justify-center ring-1 ring-gray-400 h-8 rounded-lg ml-3'>
            <button
              type='button'
              className='hover:bg-slate-200 rounded-l-lg px-2 h-full'
              onClick={() => prevMonth()}
            >
              <ArrowLeftIcon className='h-6 w-6 text-gray-500 inline-flex leading-none' />
            </button>
            <div className='border-r inline-flex h-6' />
            <button
              type='button'
              className='hover:bg-slate-200 rounded-r-lg px-2 h-full'
              onClick={() => nextMonth()}
            >
              <ArrowRightIcon className='h-6 w-6 text-gray-500 inline-flex leading-none' />
            </button>
          </div>

          <div className='mx-auto left-2/12 w-fit md:w-fit absolute md:static top-16 inset-x-0 whitespace-nowrap pr-4'>
            {pageNumberList.length !== 0 && (
              <button
                onClick={() =>
                  selectedPage !== pageNumberList[0] ? setSelectedPage(selectedPage - 1) : null
                }
              >
                <span className='sm:block flex hover:bg-blue-700 hover:text-white bg-gray-200 text-gray-500 text-base leading-tight font-bold cursor-pointer shadow transition duration-150 ease-in-out mx-1 rounded px-3 py-2 focus:outline-none'>
                  {t('common:txt_Prev')}
                </span>
              </button>
            )}
            {pageNumberList?.map(pageNumber => {
              let pageButtonStyle;
              if (pageNumber !== selectedPage) {
                pageButtonStyle =
                  'inline w-10 text-mainBlue hover:bg-blue-700 hover:text-white bg-gray-200 text-base leading-tight font-bold cursor-pointer shadow transition duration-150  ease-in-out mx-1 rounded px-1.5 py-2 focus:outline-none';
              } else {
                pageButtonStyle =
                  'inline w-10 bg-mainBlue text-white text-base leading-tight font-bold cursor-pointer shadow transition duration-150 ease-in-out mx-1 rounded px-1.5 py-2 focus:outline-none';
              }

              return (
                <button
                  key={pageNumber}
                  className={pageButtonStyle}
                  onClick={() => {
                    setSelectedPage(pageNumber);
                  }}
                >
                  {pageNumber}
                </button>
              );
            })}
            {pageNumberList.length !== 0 && (
              <button
                disabled={selectedPage === pageNumberList[-1]}
                onClick={() =>
                  selectedPage !== pageNumberList[pageNumberList.length - 1]
                    ? setSelectedPage(selectedPage + 1)
                    : null
                }
              >
                <span className='sm:block flex hover:bg-blue-700 hover:text-white bg-gray-200 text-gray-500 text-base leading-tight font-bold cursor-pointer shadow transition duration-150 ease-in-out mx-1 rounded px-3 py-2 focus:outline-none'>
                  {t('common:txt_Next')}
                </span>
              </button>
            )}
          </div>

          <div className='ml-auto'>
            <select
              name='language'
              className='max-w-md w-fit block  pl-3 pr-10 py-2 overflow-hidden border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base rounded-md'
              onChange={event => setRowsPerPage(Number(event.target.value))}
            >
              <option value='25' selected={rowsPerPage === 25}>
                25
              </option>
              <option value='50' selected={rowsPerPage === 50}>
                50
              </option>
              <option value='100' selected={rowsPerPage === 100}>
                100
              </option>
            </select>
          </div>
        </div>

        <div>
          <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='py-4 inline-block min-w-full sm:px-6 lg:px-8'>
              <div className=''>
                <table
                  className={
                    pageNumberList.length === 0
                      ? `min-w-full sm:min-w-full md:min-w-full lg:w-full text-center table-fixed md:mt-5 mt-0`
                      : `min-w-full sm:min-w-full md:min-w-full lg:w-full text-center table-fixed md:mt-5 mt-14`
                  }
                >
                  <thead className='border-b bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                      >
                        {isProvider ? t('meeting:buyer_name') : t('meeting:seller_name')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%]  text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                      >
                        {t('meeting:title')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                      >
                        {t('meeting:status')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-12 py-2 whitespace-nowrap'
                      >
                        {t('meeting:price')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                      >
                        {t('meeting:Date_Ordered')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                      >
                        {t('meeting:due_date')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                      >
                        {t('meeting:txt_actions')}
                      </th>
                    </tr>
                  </thead>

                  <tbody className='overflow-y-scroll'>
                    {tableData &&
                      tableData
                        .filter(
                          el =>
                            el.bookerName.includes(filterTextRender) ||
                            el.providerName.includes(filterTextRender)
                        )
                        .map(el => {
                          const meetingSchedule = () => dayjs(el.endTime);
                          return (
                            <tr key={el._id} className='bg-white border-b w-20'>
                              <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 text-left'>
                                {el.bookerName}
                              </td>
                              <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2'>
                                {el.subject}
                              </td>
                              <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 whitespace-normal'>
                                {t(getMeetingStatus(Number(el.price), el.status))}
                              </td>
                              <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2'>
                                {el.price !== 0 && el.currency}
                                {el.price !== 0 ? el.price : t('profile:txt_free')}
                              </td>
                              <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2'>
                                {dayjs(dayjs(el.startTime))
                                  .tz(locationDetails.timezone)
                                  .format('ddd DD MMM YYYY hh:mm A')}
                              </td>
                              <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2'>
                                {dayjs(meetingSchedule())
                                  .tz(locationDetails.timezone)
                                  .format('ddd DD MMM YYYY hh:mm A')}
                              </td>
                              <td className='text-sm text-black px-2 py-2'>
                                <Link href={`/user/orderDetails/${el._id}`} passHref>
                                  <button
                                    type='button'
                                    className='bg-gray-200 hover:bg-gray-500 text-black hover:text-white font-bold py-2 px-4 rounded-md'
                                  >
                                    <PencilSquareIcon className='h-6 w-6 inline-flex leading-none' />
                                  </button>
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
                {tableData?.length === 0 ? (
                  <div className='flex justify-center mt-5 text-gray-500 text-2xl'>
                    {t('meeting:no_orders')}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className='text-black flex items-center justify-center space-x-2 mt-12'>
            <div className='space-x-2'></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
