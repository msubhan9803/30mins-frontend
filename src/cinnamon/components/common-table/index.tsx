import useTranslation from 'next-translate/useTranslation';
import {useSortBy, useTable} from 'react-table';

export default function CommonTable({columns, data}) {
  const {t} = useTranslation('common');
  if (!columns || !data) {
    return <></>;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  return (
    <div className='overflow-auto h-full w-full flex flex-col shadow border-b border-gray-200 sm:rounded-lg'>
      <table {...getTableProps()} className='border w-full divide-gray-200'>
        <thead className='border-y bg-gray-50'>
          {headerGroups.map((headerGroup, idx) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
              {headerGroup.headers.map((column, i) => (
                <th {...column.getHeaderProps()} className='px-6 py-3' key={i}>
                  <div className='flex items-center text-center justify-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-default'>
                    {column.render('Header')}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className='bg-white divide-y divide-gray-200'>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className='border-y' key={i}>
                {row.cells.map((cell, idx) => (
                  <td {...cell.getCellProps()} key={idx} align='center' className='border-l'>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows?.length! === 0 && (
        <span className='mx-auto font-normal w-full border flex justify-center items-center border-t-0'>
          {t('No records found')}
        </span>
      )}
    </div>
  );
}
