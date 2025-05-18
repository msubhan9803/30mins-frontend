import React, {useEffect} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {usePagination, useTable} from 'react-table';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';

const Table = ({
  columns,
  data,
  pageCount: controlledPageCount,
  query,
  searchFilter,
  isLoading,
  noResults,
}) => {
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
      initialState: {pageIndex: 0},
      pageCount: controlledPageCount,
      manualPagination: true,
    },
    usePagination
  );

  useEffect(() => {
    if (searchFilter.newSearch) {
      gotoPage(0);
    }
    query(searchFilter, pageIndex + 1, pageSize);
  }, [pageIndex, pageSize, query, searchFilter]);

  const {t} = useTranslation();

  return (
    <>
      <div className='flex flex-col'>
        <div className='-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  {headerGroups.map((headerGroup, i) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                      {headerGroup.headers.map((column, index) => (
                        <th
                          scope='col'
                          key={index}
                          className='group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          <div className='flex items-center justify-between'>
                            {column.render('Header')}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {isLoading && !noResults ? (
                    <tr>
                      <td colSpan={6}>
                        <div className='flex justify-center text-2xl font-bold'>Loading...</div>
                      </td>
                    </tr>
                  ) : !isLoading && noResults ? (
                    <tr>
                      <td colSpan={6}>
                        <div className='flex justify-center text-2xl font-bold'>
                          {t('common:no_result_found')}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    page.map((row, i) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} key={i}>
                          {row?.cells.map((cell, idx) => (
                            <td
                              {...cell?.getCellProps()}
                              className='px-6 py-4 whitespace-nowrap'
                              role='cell'
                              key={idx}
                            >
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
            {t('common:previous')}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {t('common:next')}
          </button>
        </div>
        <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
          <div className='flex gap-x-2 items-baseline'>
            <span className='text-sm text-gray-700'>
              {t('common:page')} <span className='font-medium'>{pageIndex + 1}</span> of{' '}
              <span className='font-medium'>{controlledPageCount}</span>
            </span>
            <label>
              <span className='sr-only'>{t('common:items_per_page')}</span>
              <select
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 20, 50, 100, 500].map(size => (
                  <option key={size} value={size}>
                    {t('common:Show')} {size}
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
                <span className='sr-only'>{t('common:first')}</span>
                <ChevronDoubleLeftIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                <span className='sr-only'>{t('common:previous')}</span>
                <ChevronLeftIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage}>
                <span className='sr-only'>{t('common:next')}</span>
                <ChevronRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </button>
              <button
                className='rounded-r-md'
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className='sr-only'>{t('common:last')}</span>
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
