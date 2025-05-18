import PostLoginLayout from '@components/layout/post-login';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import AdminDashboard from 'components/PostLogin/AdminDashboard';
import {getSession, useSession} from 'next-auth/react';
import queries from 'constants/GraphQL/User/queries';
import businessStatsQueries from 'constants/GraphQL/Statistics/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

const AdminDashboardPage = ({businessStats}) => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <PostLoginLayout>
        <Head>
          <title>{t('page:admin_dashboard')}</title>
        </Head>
        <AdminDashboard globalBussinessStats={businessStats.globalBussinessStats} />
      </PostLoginLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;
AdminDashboardPage.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  const router = context.resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router}`,
        permanent: false,
      },
    };
  }
  const {data: userData} = await graphqlRequestHandler(
    queries.getUserById,
    {
      token: session?.accessToken,
    },
    session?.accessToken
  );

  const {data: businessStatsResult} = await graphqlRequestHandler(
    businessStatsQueries.getBusinessStats,
    {},
    session?.accessToken
  );

  const isAuthorized =
    userData?.data?.getUserById?.userData?.accountDetails?.accountType === 'admin';

  if (!isAuthorized) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      businessStats: businessStatsResult.data.getGlobalBussinessStats,
    },
  };
};
