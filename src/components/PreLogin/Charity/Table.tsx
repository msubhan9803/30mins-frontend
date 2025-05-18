/* eslint-disable react/jsx-key */
import React, {useEffect} from 'react';
import {usePagination, useRowSelect, useTable, useSortBy} from 'react-table';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';
import useTranslation from 'next-translate/useTranslation';

type IProps = {
  columns: any;
  data: any;
  pageCount: any;
  query: any;
  searchFilter: any;
  sort: any;
  setSort: any;
  isLoading: boolean;
  noResults: boolean;
};

const Table = (props: IProps) => {
  const {
    columns,
    data,
    pageCount: controlledPageCount,
    query,
    searchFilter,
    isLoading,
    sort,
    setSort,
    noResults,
  } = props;
  const {t} = useTranslation('common');
  const {
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize},
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
      },
      pageCount: controlledPageCount,
      manualPagination: true,
    },
    useSortBy,
    usePagination,
    useRowSelect
  );
  const handleSortingChange = async accessor => {
    try {
      if (accessor === 'name') {
        query(searchFilter, 1, pageSize, {
          key: accessor,
          order: sort.order * -1,
        });
        gotoPage(0);
        setSort(prev => ({...prev, key: accessor, order: prev.order * -1}));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const SortArrow = ({order}) => {
    if (order === 1) {
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-4 h-4 cursor-pointer'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d={
              searchFilter.value === 1
                ? 'M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75'
                : 'M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75'
            }
          />
        </svg>
      );
    }
    if (order === -1) {
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-4 h-4 cursor-pointer'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75'
          />
        </svg>
      );
    }
    return null;
  };
  useEffect(() => {
    if (searchFilter.newSearch) {
      gotoPage(0);
    }
    query(searchFilter, pageIndex + 1, pageSize, sort);
  }, [pageIndex, pageSize, query, searchFilter]);
  return (
    <>
      <div className='flex flex-col'>
        <div className='my-2 overflow-x-auto mx-4 sm:mx-6 lg:mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, index) => {
                        let headClassName = 'col-span-2';
                        if (column.id === 'taxID') {
                          headClassName = 'col-span-1';
                        } else if (column.id === 'description') {
                          headClassName = 'col-span-4';
                        }
                        return (
                          <th
                            scope='col'
                            key={index}
                            className={`${headClassName} group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                            onClick={() => handleSortingChange(column.id)}
                          >
                            <div className='flex items-center justify-between'>
                              {column.render('Header')}
                              {column.id === 'name' ? <SortArrow order={sort.order} /> : null}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {isLoading && !noResults ? (
                    <tr>
                      <td colSpan={6} rowSpan={6}>
                        <div className='flex justify-center m-5'>
                          <svg
                            className='custom_loader animate-spin -ml-1 mr-3 h-10 w-10 text-mainBlue'
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
                      </td>
                    </tr>
                  ) : !isLoading && noResults ? (
                    <tr>
                      <td colSpan={4}>
                        <div className='flex justify-center text-2xl font-bold'>
                          {t('no_result_found')}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    page.map(row => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map(cell => (
                            <td {...cell.getCellProps()} className='px-6 py-4' role='cell'>
                              <div className='text-sm text-gray-500'>{cell.render('Cell')}</div>
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className='py-3 flex items-center justify-between'>
        <div className='flex-1 flex justify-between sm:hidden'>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
        </div>
        <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
          <div className='flex gap-x-2 items-baseline'>
            <span className='text-sm text-gray-700'>
              Page <span className='font-medium'>{pageIndex + 1}</span> of{' '}
              <span className='font-medium'>{controlledPageCount}</span>
            </span>
            <label>
              <span className='sr-only'>Items Per Page</span>
              <select
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 20, 50, 100, 500].map(size => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav
              className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
              aria-label='Pagination'
            >
              <button
                className='rounded-l-md'
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <span className='sr-only'>First</span>
                <ChevronDoubleLeftIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                <span className='sr-only'>Previous</span>
                <ChevronLeftIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage}>
                <span className='sr-only'>Next</span>
                <ChevronRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </button>
              <button
                className='rounded-r-md'
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className='sr-only'>Last</span>
                <ChevronDoubleRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
