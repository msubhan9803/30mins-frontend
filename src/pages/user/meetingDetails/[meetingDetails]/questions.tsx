import {useMemo} from 'react';
import type {GetServerSideProps} from 'next';
import {unstable_getServerSession} from 'next-auth';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';

import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import PostLoginLayout from '@root/components/layout/post-login';
import Loader from 'components/shared/Loader/Loader';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import queries from 'constants/GraphQL/Booking/queries';
import userQuery from 'constants/GraphQL/User/queries';
import {SERVICE_TYPES} from 'constants/enums';
import Header from '@root/components/header';

export default function MeetingQuestions({meeting}) {
  const {status} = useSession();
  const {t} = useTranslation();
  const meetingDetails = useMemo(() => meeting?.data?.getBookingById?.bookingData, [meeting]);

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

        <h1 className='mb-6 text-xl uppercase font-bold text-mainBlue'>
          {t('meeting:your_answer_to_questions')}
        </h1>

        <div className='grid grid-cols-1 gap-0 sm:gap-2'>
          {meetingDetails.answeredQuestions.map(({question, answer, selectedOptions}, index) => (
            <div key={index}>
              <div className='col-span-1 flex flex-col divide-y-2'>
                <label
                  htmlFor='ccRecipients'
                  className='text-sm p-0 px-1 pt-0 pb-0 w-full font-medium text-gray-700'
                >
                  Question: {question}
                </label>
              </div>
              <div className='col-span-1 sm:col-span-1 flex flex-col w-full divide-y-2'>
                <label
                  htmlFor='ccRecipients'
                  className='text-sm px-1 pb-2 w-full font-medium text-gray-700'
                >
                  Answer:{' '}
                  <label className='w-full p-0'>{answer ?? selectedOptions.join(' ')}</label>
                </label>
              </div>
            </div>
          ))}
        </div>
      </PostLoginLayout>
    </ProtectedRoute>
  );
}

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
  // const isWelcome = user?.data?.getUserById?.welcomeComplete;
  // if (isWelcome) {
  //   return {
  //     redirect: {destination: '/user/welcome', permanent: false},
  //   };
  // }
  return {
    props: {
      meeting,
      user,
    },
  };
};
