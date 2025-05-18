import classNames from 'classnames';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import React, {useCallback, useRef, useState} from 'react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import logQueries from 'constants/GraphQL/Logs/queries';
import logMutations from 'constants/GraphQL/Logs/mutations';
import Header from '@root/components/header';
import Table from './Table';
import ApiFilterForm from './ApiFilterForm';
import SearchForm from './SearchForm';

const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const Logs = ({session}) => {
  const [logs, setLogs] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [apiFilter, setApiFilter] = useState({types: [], levels: []});
  const [showingFilterForm, setShowingFilterForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState({
    logType: undefined,
    logLevel: undefined,
    functionName: '',
    id: '',
    newSearch: false,
  });

  const queryIdRef = useRef(0);

  const {t} = useTranslation();

  const StatusPill = ({value}) => {
    const status = value ? value.toLowerCase() : 'unknown';

    return (
      <span
        className={classNames(
          'px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm',
          status.startsWith('error') ? 'bg-red-100 text-red-800' : null,
          status.startsWith('info') ? 'bg-blue-100 text-blue-800' : null
        )}
      >
        {status}
      </span>
    );
  };

  const TypePill = ({value}) => {
    const type = value ? value.toLowerCase() : 'unknown';

    return (
      <span
        className={classNames(
          'px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm',
          type.endsWith('end') ? 'bg-gray-300' : null,
          type.endsWith('start') ? 'bg-green-500 text-white' : null
        )}
      >
        {type}
      </span>
    );
  };

  const FormatedDate = ({value}) => (
    <div className='flex items-center'>{dayjs((value / 1000) * 1000).fromNow()}</div>
  );

  const columns = React.useMemo(
    () => [
      {
        Header: t('page:Created Date'),
        accessor: 'createdAt',
        Cell: FormatedDate,
      },
      {
        Header: t('page:Function name'),
        accessor: 'functionName',
      },

      {
        Header: t('page:Level'),
        accessor: 'level',
        Cell: StatusPill,
      },
      {
        Header: t('page:Type'),
        accessor: 'type',
        Cell: TypePill,
      },
    ],
    [t]
  );

  const queryLogs = useCallback(
    (searchParams, pageNumber, pageSize) => {
      const queryId = ++queryIdRef.current;

      const searchPayload = searchParams;
      delete searchPayload.newSearch;

      if (queryId === queryIdRef.current) {
        setIsLoading(true);
        graphqlRequestHandler(
          logQueries.getApiLogsForAdmin,
          {
            searchParams: {
              ...searchParams,
              pageNumber,
              resultsPerPage: pageSize,
            },
            token: session?.accessToken,
          },
          session?.accessToken
        )
          .then(response => {
            const logsCount = response?.data?.data?.getApiLogsForAdmin?.logsCount || 0;
            setLogs(response?.data?.data?.getApiLogsForAdmin?.logData);
            setPageCount(Math.ceil(logsCount / pageSize));
            setIsLoading(false);
          })
          .catch(e => console.log(e));
      }
    },
    [session?.accessToken]
  );

  const getApiFilter = async () => {
    try {
      const {data: filterData} = await graphqlRequestHandler(
        logQueries.getApiLogFilter,
        {
          token: session?.accessToken,
        },
        session?.accessToken
      );

      const filter = filterData.data.getApiLogFilter;

      setApiFilter({
        types: filter.types,
        levels: filter.levels,
      });
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  const updateApiFilter = async values => {
    try {
      await graphqlRequestHandler(
        logMutations.updateApiFilter,
        {
          filterConfig: {
            types: values.types,
            levels: values.levels,
          },
          token: session?.accessToken,
        },
        session?.accessToken
      );

      setApiFilter({
        types: values.types,
        levels: values.levels,
      });
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  const toggleApiFilterForm = async status => {
    if (status) {
      setShowingFilterForm(false);
    } else {
      await getApiFilter();
      setShowingFilterForm(true);
    }
  };

  const crumbs = [{title: t('page:logs'), href: '/'}];

  return (
    <>
      <Header crumbs={crumbs} heading={t('page:logs')} />
      <div className='min-h-screen text-gray-900'>
        <main className='max-w-7xl mx-auto px-0 pt-4'>
          <div className='mt-6 flex flex-col gap-8'>
            <div className='flex flex-col shadow-md rounded-md overflow-hidden'>
              <h3 className='text-xl col-span-12 font-bold text-gray-500 bg-gray-100 px-6 py-3 justify-between flex'>
                {t('common:generation_filter')}
                <button
                  className='text-mainBlue hover:text-blue-300 duration-200'
                  onClick={() => {
                    toggleApiFilterForm(showingFilterForm);
                  }}
                >
                  {showingFilterForm ? t('common:hide_filter') : t('common:show_filter')}
                </button>
              </h3>
              {showingFilterForm ? (
                <div className='py-3 px-6'>
                  <ApiFilterForm apiFilter={apiFilter} updateApiFilter={updateApiFilter} />
                </div>
              ) : null}
            </div>
            <SearchForm setSearchFilter={setSearchFilter} isLoading={isLoading} />
            <Table
              columns={columns}
              data={logs}
              pageCount={pageCount}
              queryLogs={queryLogs}
              searchFilter={searchFilter}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default Logs;
