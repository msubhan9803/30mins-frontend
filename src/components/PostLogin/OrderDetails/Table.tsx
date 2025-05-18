import useTranslation from 'next-translate/useTranslation';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {getProjectOrderStatus, getOrderPaymentStatus} from 'utils/getOrderStatus';

const Table = ({orderDetails, locationDetails, dueDate}) => {
  const {t} = useTranslation('common');
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return (
    <>
      <div className='flex flex-col'>
        <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden sm:rounded-lg'>
              <table className='min-w-full'>
                <thead>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {t('meeting:title')}
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {t('meeting:seller_name')}
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {t('meeting:seller_email')}
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {t('meeting:buyer_name')}
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {t('meeting:buyer_email')}
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {t('meeting:due_date')}
                    </th>

                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {t('meeting:price')}
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {t('meeting:project_status')}
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {t('meeting:payment_status')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {orderDetails.title}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {orderDetails.providerName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {orderDetails.providerEmail}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {orderDetails.bookerName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {orderDetails.bookerEmail}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {dayjs(dueDate()).tz(locationDetails.timezone).format('ddd DD MMM YYYY')}
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {orderDetails.price > 0 ? `$${orderDetails.price}` : t('event:Free')}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {t(getProjectOrderStatus(orderDetails.price, orderDetails.status))}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {t(getOrderPaymentStatus(orderDetails.paymentStatus))}
                    </td>
                  </tr>
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
