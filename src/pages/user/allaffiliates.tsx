import PostLoginLayout from '@components/layout/post-login';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import AllAffiliates from 'components/PostLogin/AllAffiliates/AllAffiliates';
import {getSession, useSession} from 'next-auth/react';
import queries from 'constants/GraphQL/User/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

const AllAffiliatesPage = ({session}) => {
  const {status} = useSession();
  const {t} = useTranslation();
  return (
    <ProtectedRoute status={status}>
      <PostLoginLayout>
        <Head>
          <title>{t('common:all_affiliates')}</title>
        </Head>
        <AllAffiliates session={session} />
      </PostLoginLayout>
    </ProtectedRoute>
  );
};

export default AllAffiliatesPage;
AllAffiliatesPage.auth = true;

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
    },
  };
};
