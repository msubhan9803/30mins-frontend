import type {GetServerSideProps} from 'next';
import {unstable_getServerSession} from 'next-auth';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Header from '@root/components/header';

import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import PostLoginLayout from '@root/components/layout/post-login';
import Loader from 'components/shared/Loader/Loader';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import queries from 'constants/GraphQL/Booking/queries';
import userQuery from 'constants/GraphQL/User/queries';
import {SERVICE_TYPES} from 'constants/enums';

export default function OrderQuestions({order}) {
  const {status} = useSession();
  const {t} = useTranslation();

  if (status === 'loading') {
    return <Loader />;
  }
  const Confirmed =
    order?.status?.clientConfirmed === true || order?.status?.providerConfirmed === true;

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Freelancing Services'), href: '#'},
    {
      title: !Confirmed ? t('page:Pending Orders') : t('page:Completed Orders'),
      href: !Confirmed
        ? '/user/freelancing-services/pending-orders'
        : '/user/freelancing-services/completed-orders',
    },
  ];

  return (
    <ProtectedRoute status={status}>
      <PostLoginLayout>
        <Header crumbs={crumbs} heading={order.title} />

        <h1 className='mb-6 text-xl uppercase font-bold text-mainBlue'>
          {t('meeting:your_answer_to_questions')}
        </h1>

        <div className='grid grid-cols-1 gap-0 sm:gap-2'>
          {order.answeredQuestions.map(({question, answer, selectedOptions}, index) => (
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
                  {t('common:answer')}:{' '}
                  <label className='w-full p-0'>{answer || selectedOptions?.join(', ')}</label>
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
  const {data: order} = await graphqlRequestHandler(
    queries.getBookingById,
    {
      documentId: context.query.orderDetails,
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  if (
    order?.data?.getBookingById?.bookingData?.serviceType !== SERVICE_TYPES.FREELANCING_WORK ||
    order?.data?.getBookingById?.bookingData === null
  ) {
    return {
      redirect: {destination: '/user/orders', permanent: false},
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
      documentId: context.query.orderDetails,
      token: session?.accessToken,
      user,
      order: order?.data?.getBookingById?.bookingData,
    },
  };
};
