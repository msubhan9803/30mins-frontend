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
import PostLoginLayout from '@root/components/layout/post-login';
import Loader from 'components/shared/Loader/Loader';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import {useContext, useState} from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';

import {NotificationContext} from 'store/Notification/Notification.context';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {SERVICE_TYPES} from 'constants/enums';
import Header from '@root/components/header';
import Button from '@root/components/button';

dayjs.extend(utc);
dayjs.extend(timezone);

const Decline = ({meeting, user, serviceExists}) => {
  const router = useRouter();
  const {status} = useSession();
  const [reason, setReason] = useState('');
  const User = user?.data?.getUserById?.userData;
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation();
  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const [declineLoading, setDeclineLoading] = useState(false);

  const meetingDetails = meeting?.data?.getBookingById?.bookingData;
  const meetingStatus = meeting?.data?.getBookingById?.bookingData?.status;

  const declineMeeting = async (meetingData, values) => {
    try {
      if (reason === '') {
        showNotification(NOTIFICATION_TYPES.success, 'Please provide reason', false);
        return;
      }
      setLoading(true);
      const res = await axios.post('/api/meetings/decline', {
        meetingDetails: meetingData,
        reason: values,
      });
      if (res?.data?.success) {
        showNotification(NOTIFICATION_TYPES.success, 'Meeting declined successfully', false);
        setLoading(false);
        // eslint-disable-next-line no-restricted-globals
        router.replace(location.href.replace('decline', '').toString());
      }
    } catch (error) {
      setLoading(false);

      console.error(error);
    }
  };
  const onCancel = () => {
    setDeclineLoading(true);
    // eslint-disable-next-line no-restricted-globals
    router.replace(location.href.replace('decline', '').toString());
  };
  const meetingDateUTC = () => dayjs(meetingDetails.endTime);
  const meetingStartTime = () => dayjs(meetingDetails.startTime);

  const showDecline = () =>
    dayjs().isBefore(meetingDateUTC()) &&
    !meetingStatus.providerCanceled &&
    !meetingStatus.clientCanceled &&
    !meetingStatus.providerDeclined &&
    User._id === meetingDetails.provider;

  const getStatus = () => {
    if (meetingStatus.refunded) {
      return t('meeting:refunded');
    }
    if (meetingStatus.refundRequested && meetingStatus.clientCanceled && meetingDetails.price > 0) {
      return t('meeting:client_cancel_refund');
    }
    if (meetingStatus.refundRequested && meetingStatus.clientCanceled) {
      return t('meeting:client_cancel');
    }
    if (
      meetingStatus.refundRequested &&
      meetingStatus.providerCanceled &&
      meetingDetails.price > 0
    ) {
      return t('meeting:provider_cancel_refund');
    }
    if (meetingStatus.refundRequested && meetingStatus.providerCanceled) {
      return t('meeting:provider_cancelled');
    }
    if (meetingStatus.hasOpenReport) {
      return t('meeting:reported');
    }
    if (meetingStatus.providerCanceled) {
      return t('meeting:provider_cancelled');
    }
    if (meetingStatus.providerDeclined) {
      return t('meeting:provider_declined');
    }
    if (meetingStatus.clientCanceled) {
      return t('meeting:client_cancel');
    }
    if (meetingStatus.clientConfirmed) {
      return t('meeting:client_confirmed');
    }
    if (meetingStatus.providerConfirmed) {
      return t('meeting:provider confirmed');
    }
    return t('meeting:pending');
  };

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
                        {dayjs(meetingDateUTC()).format('dddd DD MMMM YYYY')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {dayjs(meetingStartTime()).format('hh:mm A')}
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
                        {getStatus()}
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
        {/* show decline */}
        <div className='flex flex-col py-4 w-full gap-8'>
          {serviceExists && showDecline() ? (
            <>
              <div className='mt-10 sm:mt-0'>
                <div className='md:grid md:grid-cols-1 md:gap-6'>
                  <div className='mt-5 md:mt-0 md:col-span-2'>
                    <div className='overflow-hidden sm:rounded-md'>
                      <div className='px-4 py-5 bg-white sm:p-6'>
                        <div className=''>
                          <div className=''>
                            <label
                              htmlFor='description'
                              className='block text-md font-medium text-gray-700'
                            >
                              {t('common:declination_msg')}
                              <span className='text-red-400 font-extrabold m-1'>*</span>
                            </label>
                            <div className='mt-0'>
                              <textarea
                                rows={8}
                                name='text'
                                id='text'
                                onChange={e => {
                                  setReason(e.target.value);
                                }}
                                value={reason}
                                className='shadow-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='px-4 mt-5 sm:mb-4 text-right sm:px-6'>
                <Button
                  type='button'
                  variant='cancel'
                  onClick={onCancel}
                  disabled={declineLoading || loading}
                  className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  {t('common:btn_cancel')}
                </Button>
                <Button
                  type='submit'
                  variant='solid'
                  disabled={loading || reason === ''}
                  onClick={() => {
                    declineMeeting(meetingDetails, reason);
                  }}
                  className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium  hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue w-40'
                >
                  {loading ? t('common:txt_loading1') : t('common:declination_btn')}
                </Button>
              </div>
            </>
          ) : (
            <h2 className='mt-5 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
              {t('common:declination_error')}
            </h2>
          )}
        </div>
      </PostLoginLayout>
    </ProtectedRoute>
  );
};
export default Decline;
Decline.auth = true;

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

  if (
    ![SERVICE_TYPES.MEETING, SERVICE_TYPES.ROUND_ROBIN].includes(
      meeting?.data?.getBookingById?.bookingData?.serviceType
    ) ||
    meeting?.data?.getBookingById?.bookingData === null
  ) {
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

  if (meeting?.data?.getBookingById?.bookingData === null) {
    return {
      redirect: {destination: '/user/meetings', permanent: false},
    };
  }
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
