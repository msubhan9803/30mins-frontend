import dayjs from 'dayjs';
import {GetServerSideProps} from 'next';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import queries from 'constants/GraphQL/Booking/queries';
import userQuery from 'constants/GraphQL/User/queries';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Loader from 'components/shared/Loader/Loader';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import PostLoginLayout from '@root/components/layout/post-login';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import {useRouter} from 'next/router';
import getMeetingStatus from 'utils/getMeetingStatus';
import Header from '@root/components/header';

dayjs.extend(utc);
dayjs.extend(timezone);

const MeetingDetails = ({meeting, user, serviceExists}) => {
  const {status} = useSession();
  const router = useRouter();

  const {showModal} = ModalContextProvider();
  const User = user?.data?.getUserById?.userData;
  const {t} = useTranslation();

  const meetingDetails = meeting?.data?.getBookingById?.bookingData;
  const meetingStatus = meeting?.data?.getBookingById?.bookingData?.status;

  const isProvider = () => User._id === meetingDetails.provider;
  const isClient = () => User._id === meetingDetails.booker;

  const meetingDateUTC = () => dayjs(meetingDetails.endTime);

  const meetingStartTime = () => dayjs(meetingDetails.startTime);

  const locationDetails = user?.data?.getUserById?.userData?.locationDetails;

  const showComplete = () =>
    dayjs().isAfter(meetingDateUTC()) &&
    isProvider() &&
    !meetingStatus?.providerConfirmed &&
    !meetingStatus.clientCanceled &&
    !meetingStatus.providerDeclined;

  const showConfirm = () =>
    dayjs().isAfter(meetingDateUTC()) &&
    isClient() &&
    !meetingStatus.hasOpenReport &&
    !meetingStatus.clientConfirmed &&
    !meetingStatus.providerCanceled &&
    !meetingStatus.providerDeclined &&
    !meetingStatus.clientCanceled;

  const showRefund = () =>
    dayjs().isAfter(meetingDateUTC()) &&
    !meetingStatus.refundRequested &&
    !meetingStatus.clientConfirmed &&
    !meetingStatus.providerConfirmed &&
    meetingDetails.price > 0 &&
    isClient();

  const showCancel = () =>
    dayjs().isBefore(meetingStartTime()) &&
    !meetingStatus.providerCanceled &&
    !meetingStatus.providerDeclined &&
    !meetingStatus.clientCanceled &&
    !meetingStatus.providerDeclined;

  const showDecline = () =>
    dayjs().isBefore(meetingStartTime()) &&
    !meetingStatus.providerCanceled &&
    !meetingStatus.clientCanceled &&
    !meetingStatus.providerDeclined &&
    User._id === meetingDetails.provider;

  const showReport = () =>
    dayjs().isAfter(meetingDateUTC()) &&
    isClient() &&
    !meetingStatus.hasOpenReport &&
    !meetingStatus.clientConfirmed;

  const showButtonBar = () =>
    showComplete() ||
    showConfirm() ||
    showReport() ||
    showCancel() ||
    showRefund() ||
    showDecline();

  if (status === 'loading') {
    return <Loader />;
  }

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
        <div className='flex flex-col items-center py-4 w-full gap-8'>
          {serviceExists ? (
            showButtonBar() ? (
              <div className='flex gap-4 w-full justify-center sm:justify-start flex-wrap bg-white rounded-md py-3 px-4 shadow-md'>
                {showCancel() ? (
                  <button
                    type='button'
                    onClick={() => {
                      // eslint-disable-next-line no-restricted-globals
                      router.replace(`${location.href}/cancel`);
                    }}
                    className='bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600'
                  >
                    {t('common:txt_cancel_met')}
                  </button>
                ) : null}

                {showDecline() ? (
                  <button
                    type='button'
                    onClick={() => {
                      // eslint-disable-next-line no-restricted-globals
                      router.replace(`${location.href}/decline`);
                    }}
                    className='bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600'
                  >
                    {t('common:txt_decline_met')}
                  </button>
                ) : null}

                {showCancel() ? (
                  <button
                    type='button'
                    onClick={() => {
                      // eslint-disable-next-line no-restricted-globals
                      router.replace(`${location.href}/reschedule`);
                    }}
                    className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    {t('common:txt_reschedule_met')}
                  </button>
                ) : null}

                {showComplete() ? (
                  <button
                    type='button'
                    onClick={() => {
                      // eslint-disable-next-line no-restricted-globals
                      router.replace(`${location.href}/complete`);
                    }}
                    className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    {t('meeting:Complete Meeting')}
                  </button>
                ) : null}

                {showConfirm() ? (
                  <button
                    type='button'
                    onClick={() => {
                      // eslint-disable-next-line no-restricted-globals
                      router.replace(`${location.href}/confirm`);
                    }}
                    className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    {t('meeting:Confirm Meeting Completion')}
                  </button>
                ) : null}

                {showReport() ? (
                  <button
                    type='button'
                    onClick={() => {
                      showModal(MODAL_TYPES.MEETINGS, {
                        mode: 'report',
                        meetingData: meetingDetails,
                        title: 'Report Meeting',
                        labelTitle: 'Reason for Report',
                      });
                    }}
                    className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    Report Meeting
                  </button>
                ) : null}

                {showRefund() ? (
                  <button
                    type='button'
                    onClick={() => {
                      showModal(MODAL_TYPES.MEETINGS, {
                        mode: 'refund',
                        meetingData: meetingDetails,
                        title: 'Refund Meeting',
                        labelTitle: 'Reason for Refund',
                      });
                    }}
                    className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    Request Refund
                  </button>
                ) : null}
              </div>
            ) : null
          ) : (
            <p className='text-red-500'>{t('meeting:service_deleted_by_provider')}</p>
          )}
        </div>

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
                        <td
                          title={meetingStatus.reportReason}
                          className='px-6 py-4 text-sm break-before-column flex w-80 text-gray-500'
                        >
                          {meetingStatus.reportReason}
                        </td>
                      ) : null}
                      {meetingStatus.refundRequestReason ? (
                        <td className='px-6 py-4 break-before-column flex w-80 text-sm text-gray-500'>
                          {meetingStatus.refundRequestReason}
                        </td>
                      ) : null}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-0 sm:gap-2'>
            {meetingDetails.answeredQuestions.map(({question, answer, selectedOptions}, index) => {
              if (question) {
                return (
                  <div key={index}>
                    <div className='col-span-1 flex flex-col divide-y-2'>
                      <label
                        htmlFor='ccRecipients'
                        className='text-sm p-0 px-1 pt-0 pb-0 w-full font-medium text-gray-700'
                      >
                        {t('common:question')}: {question}
                      </label>
                    </div>
                    <div className='col-span-1 sm:col-span-1 flex flex-col w-full divide-y-2'>
                      <label
                        htmlFor='ccRecipients'
                        className='text-sm px-1 pb-2 w-full font-medium text-gray-700'
                      >
                        {t('common:answer')}:
                        <label className='w-full p-0'>{answer ?? selectedOptions.join(' ')}</label>
                      </label>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
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
    queries.getBookingById,
    {
      documentId: context.query.meetingDetails,
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const serviceID = meeting?.data?.getBookingById?.bookingData?.serviceID;
  const providerName = meeting?.data?.getBookingById?.bookingData?.providerName;

  if (meeting?.data?.getBookingById?.bookingData === null) {
    return {
      redirect: {destination: '/user/meetings', permanent: false},
    };
  }

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
