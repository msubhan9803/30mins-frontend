import {useEffect} from 'react';
import {usePagination, useTable} from 'react-table';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  columns: any;
  data: any[];
  pageCount: any;
  searchFilter: {
    keywords: string;
    newSearch: boolean;
  };
  query: (searchParams: any, pageNumber: any, pageSize: any) => Promise<void>;
  isLoading: boolean;
  noResults: boolean;
  setSearchFilter: any;
}

const Table = ({
  columns,
  data,
  isLoading,
  noResults,
  query,
  pageCount: controlledPageCount,
  searchFilter,
}: Props) => {
  const {
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    prepareRow,
    getTableBodyProps,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize},
  } = useTable(
    {
      columns,
      data,
      initialState: {pageIndex: 0, pageSize: 100},
      pageCount: controlledPageCount,
      manualPagination: true,
    },
    usePagination
  );
  const {t} = useTranslation();

  useEffect(() => {
    if (searchFilter.newSearch) {
      gotoPage(0);
    }
    query(searchFilter, pageIndex + 1, pageSize);
  }, [pageIndex, pageSize, query, searchFilter]);
  return (
    <>
      <div className='py-3 flex items-center justify-between'>
        <div className='flex-1 flex justify-between sm:hidden'>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {t('common:previous')}{' '}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {t('common:next')}
          </button>
        </div>
        <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
          <div className='flex gap-x-2 items-baseline'>
            <button onClick={previousPage}>
              <span className='sm:block flex hover:bg-blue-700 hover:text-white bg-gray-200 text-gray-500 text-base leading-tight font-bold cursor-pointer shadow transition duration-150 ease-in-out mx-1 rounded px-3 py-2 focus:outline-none'>
                {t('common:txt_Prev')}
              </span>
            </button>
            {Array.from({length: controlledPageCount}, (_, i) => i)?.map(pageNumber => {
              let pageButtonStyle;
              if (pageNumber !== pageIndex) {
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
                    gotoPage(pageNumber);
                  }}
                >
                  {pageNumber + 1}
                </button>
              );
            })}
            {page.length !== 0 && (
              <button onClick={nextPage}>
                <span className='sm:block flex hover:bg-blue-700 hover:text-white bg-gray-200 text-gray-500 text-base leading-tight font-bold cursor-pointer shadow transition duration-150 ease-in-out mx-1 rounded px-3 py-2 focus:outline-none'>
                  {t('common:txt_Next')}
                </span>
              </button>
            )}
          </div>
          <div>
            <nav
              className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
              aria-label='Pagination'
            >
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
              {/* <button
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
                <ChevronDoubleRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' /> */}
              {/* </button> */}
            </nav>
          </div>
        </div>
      </div>
      <div className='mt-8 flex flex-col'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  {headerGroups.map(headerGroup => {
                    const {key, ...restHeaderGroupProps} = headerGroup.getHeaderGroupProps();
                    return (
                      <tr key={key} {...restHeaderGroupProps}>
                        {headerGroup.headers.map(column => {
                          // eslint-disable-next-line @typescript-eslint/no-shadow
                          const {key, ...restColumn} = column.getHeaderProps();
                          return (
                            <th
                              key={key}
                              {...restColumn}
                              scope='col'
                              className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                            >
                              {column.render('Header')}
                            </th>
                          );
                        })}
                      </tr>
                    );
                  })}
                </thead>
                <tbody {...getTableBodyProps} className='divide-y divide-gray-200 bg-white'>
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
                      <td colSpan={6}>
                        <div className='flex justify-center text-2xl font-bold'>
                          {t('common:no_result_found')}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    page.map(row => {
                      prepareRow(row);
                      const {key, ...restRowProps} = row.getRowProps();
                      return (
                        <tr key={key} {...restRowProps}>
                          {row.cells.map(cell => {
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            const {key, ...restCellProps} = cell.getCellProps();
                            return (
                              <td
                                key={key}
                                {...restCellProps}
                                className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'
                              >
                                {cell.render('Cell')}
                              </td>
                            );
                          })}
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
    </>
  );
};

export default Table;
