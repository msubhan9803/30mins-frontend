import {useEffect, useState, useContext} from 'react';
import Head from 'next/head';

import useTranslation from 'next-translate/useTranslation';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';

import queries from 'constants/GraphQL/Organizations/queries';
import {UserContext} from '@root/context/user';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import DropDownComponent from 'components/shared/DropDownComponent';
import Loader from 'components/shared/Loader/Loader';

import {ArrowLeftIcon, ArrowRightIcon, ArrowTopRightOnSquareIcon} from '@heroicons/react/20/solid';

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

let tempResellerList: any = [];

export default function Reseller() {
  const {t} = useTranslation();

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Organizations'), href: '/user/organizations'},
    {title: t('page:Reseller'), href: '/user/organizations/reseller'},
  ];

  const {data: session} = useSession();

  const {user} = useContext(UserContext);

  const date = new Date();

  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [filterText, setFilterText] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [tableData, setTableData] = useState<any[]>([]);

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

  const {data: resellersResults, loading: inviteLoading} = useQuery(
    queries.getReferralUsersByOrganizationId,
    {
      variables: {
        token: session?.accessToken,
        searchParams: {
          pageNumber: selectedPage,
          resultsPerPage: rowsPerPage,
          month: month,
          year: year,
          organizationId: currentSelectedOrg?._id,
        },
      },
      skip: !organizationsData,
    }
  );

  const resellersData = resellersResults?.getReferralUsersByOrganizationId?.usersData;
  const totalCount = resellersResults?.getReferralUsersByOrganizationId?.totalRecords ?? 0;

  useEffect(() => {
    if (organizationsData) {
      setCurrentSelectedOrg(organizationsData[0]?.organizationId || null);
    }
  }, [organizationsData]);

  useEffect(() => {
    function dynamicPageNumbers(count: number, rowsLimitPerPage: number) {
      const totalPagesCalculated = Math.ceil(count / rowsLimitPerPage);
      setTotalPages(totalPagesCalculated);
    }

    if (resellersData) {
      setTableData(resellersData);
      tempResellerList = resellersData;

      dynamicPageNumbers(totalCount, rowsPerPage);
    }
  }, [resellersData, month, rowsPerPage]);

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

        if (pageNumbersArray.length < 5 && pageNumbersArray[0] > 1) {
          pageNumbersArray.unshift(pageNumbersArray[0] - 1);
        }
      }
    }
  }, [rowsPerPage, selectedPage, totalPages]);

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

  const handleFilter = () => {
    if (filterText !== '') {
      const filterEvents = tempResellerList.filter(
        reseller =>
          reseller.personalDetails.name.toLowerCase().includes(filterText.toLocaleLowerCase()) ||
          reseller.accountDetails.email.toLowerCase().includes(filterText.toLocaleLowerCase())
      );

      setTableData(filterEvents);
    } else {
      setTableData(tempResellerList);
    }
  };

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

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:Reseller')}</title>
      </Head>
      <Header crumbs={crumbs} heading={t('page:Reseller')} />

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

        {inviteLoading && !resellersData && (
          <div className='mt-4'>
            <Loader />
          </div>
        )}

        {!inviteLoading && organizationsData && (
          <div className='mt-4'>
            <div className='flex items-center justify-start md:justify-end my-3'>
              <input
                type='text'
                id='filter'
                name='filter'
                onChange={event => setFilterText(event.target.value)}
                className='rounded-md border-gray text-gray-500 text-sm min-w-[280px]'
                placeholder={t('common:search_by_name_or_email')}
              />
              <button
                type='button'
                className='sm:text-white rounded-lg shadow-sm text-md font-medium ml-5 focus:outline-none px-4 py-2 text-md bg-mainBlue text-white '
                onClick={handleFilter}
              >
                {t('meeting:search')}
              </button>
            </div>

            <div className='flex items-center justify-start md:justify-between w-full mt-6 mb-3 relative gap-2'>
              <div className='w-40 sm:w-50 md:70'>
                <span className='text-2xl md:text-2xl uppercase font-bold text-gray-800 mr-1'>
                  {monthNames[month]}
                </span>
                <span className='text-2xl md:text-2xl font-bold text-gray-800'>{year}</span>
              </div>

              <div className='w-fit flex items-center justify-center ring-1 h-8 ring-gray-400 rounded-lg ml-3'>
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

            <div className='flex flex-col px-0 py-2'>
              <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
                  <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            {t('common:name')}
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            {t('common:Email')}
                          </th>
                          <th
                            scope='col'
                            className=' py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            {t('common:createdAt')}
                          </th>
                          <th
                            scope='col'
                            className=' py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            {t('common:actions')}
                          </th>
                        </tr>
                      </thead>

                      {tableData && tableData?.length > 0 && (
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {tableData?.map((reseller, idx) => (
                            <tr key={idx}>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                {reseller.personalDetails.name}
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                {reseller.accountDetails.email}
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                {dayjs(new Date(parseInt(reseller.createdAt, 10)))
                                  .tz(user?.timezone || dayjs.tz.guess())
                                  .format('ddd DD MMM YYYY  hh:mm A')}
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                <a
                                  href={`/${reseller.accountDetails.username}`}
                                  target='_blank'
                                  rel='noreferrer'
                                >
                                  <ArrowTopRightOnSquareIcon
                                    title='View Event'
                                    className='w-6 h-6 cursor-pointer'
                                  />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>

                  {tableData && tableData?.length === 0 && (
                    <p className='mt-8 text-base text-mainText font-semibold text-center'>
                      {t('common:no_reseller_found')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PostLoginLayout>
  );
}

Reseller.auth = true;
