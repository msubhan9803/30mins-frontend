import {useContext, useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import bookingQueries from 'constants/GraphQL/Booking/queries';
import userQueries from 'constants/GraphQL/User/queries';
import {useSession} from 'next-auth/react';
import {SERVICE_TYPES} from 'constants/enums';
import Image from 'next/image';
import Button from 'components/shared/Button/Button';
import useTranslation from 'next-translate/useTranslation';
import {UserContext} from '@root/context/user';
import {LoaderIcon} from 'react-hot-toast';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  isFree?: boolean;
  isPaid?: boolean;
};

const ListAppointment = ({isFree, isPaid}: IProps) => {
  const {data: session} = useSession();
  const {t} = useTranslation();
  const [tableData, setTableData] = useState<any>([]);
  const {user: UserData} = useContext(UserContext);

  const {data: providerBooking, loading} = useQuery(bookingQueries.getAllUpComingBookings, {
    variables: {
      token: session?.accessToken,
      searchParams: {
        serviceType: SERVICE_TYPES.MEETING,
        isProvider: true,
      },
    },
  });

  const {data: user, loading: userLoading} = useQuery(userQueries.getUserById, {
    variables: {
      token: session?.accessToken,
    },
  });

  const providerBookings = providerBooking?.getAllUpComingBookings?.bookingData;

  useEffect(() => {
    setTableData(
      providerBookings?.filter(el => (isFree ? el?.price === 0 : isPaid ? el?.price > 0 : true))
    );
  }, [user, providerBookings]);

  const truncate = (input: string) => {
    if (input?.length > 15) {
      return `${input?.substring(0, 13)}...`;
    }
    return input;
  };
  return (
    <>
      <div className='col-span-1 border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full flex flex-col items-center'>
        <div className='text-blue-500 mx-auto mb-0'>
          <Image
            src={`/icons/services/${isFree ? 'upcoming_free.svg' : 'upcoming_paid.svg'}`}
            height={96}
            width={96}
            alt=''
          />
        </div>
        <h3 className='mb-2 font-bold font-heading'>
          {t(`common:${isFree ? 'Upcoming_Free_Appointments' : 'Upcoming_Paid_Appointments'}`)}
        </h3>
        <span className='relative text-center flex w-full flex-col items-center'>
          <div className='container mx-auto'>
            <div className='overflow-x-auto flex flex-col justify-start items-start'>
              <div className='py-4 min-w-full sm:px-6 lg:px-8'>
                <div className='list-disc flex flex-col gap-1 flex-1 justify-start items-start'>
                  {tableData &&
                    tableData?.map(
                      (el, idx) =>
                        idx < 5 && (
                          <li key={idx} className=''>
                            <span className='text-sm text-mainBlue'>
                              <a href={`/user/meetingDetails/${el?._id}/`}>
                                {dayjs(el?.startTime)
                                  .tz(UserData?.timezone || dayjs.tz.guess())
                                  .format('MM/DD hh:mmA')}{' '}
                                {truncate(el?.bookerName)}
                              </a>
                            </span>
                          </li>
                        )
                    )}
                </div>
                {(loading || userLoading) && (
                  <div className='w-full flex flex-col justify-center items-center'>
                    <LoaderIcon
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                  </div>
                )}
                {tableData?.length === 0 && (
                  <>
                    <span className='font-bold'>None</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </span>
        <Button
          type='button'
          href={
            isFree
              ? '/user/meeting-services/free-appointments/'
              : '/user/meeting-services/paid-appointments/'
          }
          text={tableData?.length > 4 ? t('common:Show_more') : t('common:Show')}
          className='inline-flex text-xs w-3/4 sm:text-sm justify-center mb-4 mt-auto sm:w-3/4 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
        />
      </div>
    </>
  );
};

export default ListAppointment;
