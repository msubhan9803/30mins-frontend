import {useState} from 'react';
import dayjs from 'dayjs';
import {GetServerSideProps} from 'next';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Booking/mutations';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import bookingQueries from 'constants/GraphQL/Booking/queries';
import userQuery from 'constants/GraphQL/User/queries';
import Calendar from 'components/PostLogin/ServicePageLayout/InternalLayout/feature/shared/Calendar';
import {initialValues} from 'components/PostLogin/ServicePageLayout/InternalLayout/feature/meeting/constants';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Loader from 'components/shared/Loader/Loader';
import PostLoginLayout from '@root/components/layout/post-login';
import {useRouter} from 'next/router';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import getMeetingStatus from 'utils/getMeetingStatus';
import Header from '@root/components/header';
import {useFormik} from 'formik';
import axios from 'axios';

dayjs.extend(utc);
dayjs.extend(timezone);

const MeetingDetails = ({meeting, user, serviceExists}) => {
  const {status, data: session} = useSession();
  const {t} = useTranslation();
  const [rescheduleMeeting] = useMutation(mutations.rescheduleMeeting);
  const router = useRouter();
  const {values, setFieldValue} = useFormik({
    initialValues: initialValues,
    validateOnChange: false,
    onSubmit: () => {},
  });
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleMeetingReason, setRescheduleMeetingReason] = useState('');
  const meetingDetails = meeting?.data?.getBookingById?.bookingData;
  const meetingStatus = meeting?.data?.getBookingById?.bookingData?.status;
  const meetingStartTime = () => dayjs(meetingDetails.startTime);
  const locationDetails = user?.data?.getUserById?.userData?.locationDetails;

  const showReschedule = () =>
    dayjs().isBefore(meetingStartTime()) &&
    !meetingStatus.providerCanceled &&
    !meetingStatus.providerDeclined &&
    !meetingStatus.clientCanceled &&
    !meetingStatus.providerDeclined;

  if (status === 'loading') {
    return <Loader />;
  }

  const handleAvailabilityQuery = async daySelected => {
    if (meetingDetails?.serviceType === 'MEETING') {
      const {data: availabilityResponse} = await graphqlRequestHandler(
        bookingQueries.getAvailability,
        {
          serviceId: meetingDetails?.serviceID,
          daySelected,
          bookerTimezone: meetingDetails?.bookerTimeZone,
        },
        ''
      );

      return availabilityResponse.data.getAvailability.availableSlots;
    }
    if (meetingDetails?.serviceType === 'ROUND_ROBIN') {
      const {data: availabilityResponse} = await graphqlRequestHandler(
        bookingQueries.getRRAvailablities,
        {
          serviceId: meetingDetails?.serviceID,
          daySelected: daySelected,
          bookerTimezone: meetingDetails?.bookerTimeZone,
        },
        ''
      );
      setFieldValue(
        'teamsAvailability',
        availabilityResponse.data.getRRAvailability.teamsAvailability
      );
      return availabilityResponse.data.getRRAvailability.collectiveAvailability;
    }
    return null;
  };

  const handleWeekdayQuery = async () => {
    const {data: weekDayResponse} = await graphqlRequestHandler(
      bookingQueries.getWeekdayAvailability,
      {
        serviceId: meetingDetails?.serviceID,
        bookerTimezone: meetingDetails?.bookerTimeZone,
      },
      ''
    );
    return weekDayResponse.data.getWeekdayAvailability.availableWeekdays;
  };
  const RescheduleHandler = async () => {
    try {
      const response = await rescheduleMeeting({
        variables: {
          meetingId: meeting?.data.getBookingById.bookingData._id,
          selectedTime: values?.selectedTime,
          rescheduleMeetingReason: rescheduleMeetingReason,
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
      if (response?.data?.rescheduleMeeting?.response?.status === 200) {
        meetingDetails.startTime = values?.selectedTime;
        meetingDetails.rescheduleMeetingReason = rescheduleMeetingReason;
        meetingDetails.conferenceLink = response?.data?.rescheduleMeeting?.meetingLink;
        await axios.post('/api/meetings/reschedule', meetingDetails);
        router.replace(
          `${window.origin}/user/meetingDetails/${meeting?.data.getBookingById.bookingData._id}`
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  const isNotFree = meeting?.data?.getBookingById?.bookingData?.price > 0;

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Meeting Services'), href: '#'},
    {
      title: isNotFree ? t('page:Paid Appointments') : t('page:Free Appointments'),
      href: isNotFree
        ? '/user/meeting-services/paid-appointments'
        : '/user/meeting-services/free-appointments',
    },
  ];
  return (
    <ProtectedRoute status={status}>
      <PostLoginLayout>
        <Header crumbs={crumbs} heading={meetingDetails.title} />
        {!serviceExists && (
          <p className='text-red-500 text-center'>{t('meeting:service_deleted_by_provider')}</p>
        )}
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
                        {t('meeting:provider_name')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:provider_email')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:client_name')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:client_email')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:meeting_date')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:meeting_time')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:meeting_cost')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:payment_status')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:meeting_status')}
                      </th>
                      {meetingStatus.reportReason ? (
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          {t('meeting:report_reason')}
                        </th>
                      ) : null}
                      {meetingStatus.refundRequestReason ? (
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36'
                        >
                          {t('meeting:refund_request_reason')}
                        </th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.title}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.providerName}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.providerEmail}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.bookerName}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.bookerEmail}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {dayjs(meetingStartTime())
                          .tz(locationDetails.timezone)
                          .format('dddd DD MMMM YYYY')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {dayjs(meetingStartTime()).tz(locationDetails.timezone).format('hh:mm A')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.price > 0 ? `$${meetingDetails.price}` : t('event:Free')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.price > 0
                          ? meetingDetails.paymentStatus
                          : t('profile:txt_media_type_none')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {t(getMeetingStatus(meetingDetails.price, meetingDetails.status))}
                      </td>
                      {meetingStatus.reportReason ? (
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {meetingStatus.reportReason}
                        </td>
                      ) : null}
                      {meetingStatus.refundRequestReason ? (
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {meetingStatus.refundRequestReason}
                        </td>
                      ) : null}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {serviceExists && showReschedule() ? (
          <div className='px-2 mt-9 lg:flex w-full'>
            <div className='w-full'>
              <Calendar
                availabilityQueryHandler={handleAvailabilityQuery}
                weekdayQueryHandler={handleWeekdayQuery}
                setFieldValue={setFieldValue}
                values={values}
                disabled={!['MEETING', 'ROUND_ROBIN'].includes(meetingDetails?.serviceType)}
              />
              {!values?.selectedTime && (
                <p className='text-red-500'>{t('meeting:select_reschedule_time')}</p>
              )}
            </div>
            <div className='w-full lg:w-4/5 lg:p-0 lg:ml-3 sm:mt-0'>
              <div>
                <label htmlFor='rescedule-description' className='block mb-1 font-semibold'>
                  {t('meeting:Reason_Rescheduling')}
                </label>
                <textarea
                  id='rescedule-description'
                  className='block p-2.5 w-full h-40 md:h-60 text-sm rounded-lg shadow-md border border-gray-300 resize-none'
                  onChange={e => setRescheduleMeetingReason(e.target.value)}
                ></textarea>
              </div>
              <div className='mt-5 mb-2 ml-2 flex justify-end gap-4'>
                <button
                  className={
                    !values?.selectedTime || !rescheduleMeetingReason || rescheduling
                      ? 'text-sm block font-medium rounded-md border sm:px-5 px-2 py-1.5 border-transparent bg-mainBlue text-white shadow duration-150 ease-out hover:bg-blue-800 focus:outline-none focus:ring-2 focus:mainBlue focus:ring-offset-2 cursor-not-allowed'
                      : 'text-sm block font-medium rounded-md border sm:px-5 px-2 py-1.5 border-transparent bg-mainBlue text-white shadow duration-150 ease-out hover:bg-blue-800 focus:outline-none focus:ring-2 focus:mainBlue focus:ring-offset-2'
                  }
                  onClick={async () => {
                    setRescheduling(true);
                    await RescheduleHandler();
                    setRescheduling(false);
                  }}
                  disabled={!values?.selectedTime || !rescheduleMeetingReason || rescheduling}
                >
                  {rescheduling ? t('meeting:rescheduling') : t('meeting:reschedule')}
                </button>
              </div>
              {!rescheduleMeetingReason && (
                <p className='text-red-500'>{t('meeting:enter_reschedule_reason')}</p>
              )}
            </div>
          </div>
        ) : (
          <p className='text-red-500 text-center mt-10'>
            {t('common:meeting_cannot_be_rescheduled')}
          </p>
        )}
      </PostLoginLayout>
    </ProtectedRoute>
  );
};
export default MeetingDetails;
MeetingDetails.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  const router = context.resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router}`,
        permanent: false,
      },
    };
  }

  const {data: meeting} = await graphqlRequestHandler(
    bookingQueries.getBookingById,
    {
      documentId: context.query.meetingDetails,
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  if (meeting?.data?.getBookingById?.bookingData === null) {
    return {
      redirect: {destination: '/user/meetings', permanent: false},
    };
  }

  const serviceID = meeting?.data?.getBookingById?.bookingData?.serviceID;
  const providerName = meeting?.data?.getBookingById?.bookingData?.providerName;

  const {data: publicUserData} = await graphqlRequestHandler(
    userQuery.getPublicUserData,
    {
      username: providerName,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: user} = await graphqlRequestHandler(
    userQuery.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const userData = publicUserData?.data?.getPublicUserData?.userData;
  const userServices = userData?.services;
  const serviceFilter = userServices?.filter(service => service._id === serviceID);
  const serviceExists = () => (serviceFilter?.length === 0 ? false : true);

  return {
    props: {
      meeting,
      user,
      serviceExists: serviceExists(),
    },
  };
};
