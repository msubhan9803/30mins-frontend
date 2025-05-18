import Header from '@components/header';
import Head from 'next/head';
import PostLoginLayout from '@components/layout/post-login';
import useTranslation from 'next-translate/useTranslation';
import {GetServerSideProps} from 'next';
import {unstable_getServerSession} from 'next-auth';
import Marketing from '../../components/PostLogin/Marketing/Marketing';
import {authOptions} from '../api/auth/[...nextauth]';
import graphqlRequestHandler from '../../utils/graphqlRequestHandler';
import queries from '../../constants/GraphQL/User/queries';

function MarketingPage() {
  const {t} = useTranslation();
  const crumbs = [{title: t('page:Home'), href: '/'}];
  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Import Users')} />
      <Head>
        <title>{t('page:Import Users')}</title>
      </Head>
      <Marketing />
    </PostLoginLayout>
  );
}

export default MarketingPage;

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

  const {data: user} = await graphqlRequestHandler(
    queries.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const {userData} = user.data.getUserById;

  if (!userData.isMarketer) {
    return {
      redirect: {
        destination: `/user/dashboard`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
};
