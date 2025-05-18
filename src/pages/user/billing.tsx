import Billing from 'components/PostLogin/Billing';
import queries from 'constants/GraphQL/User/queries';
import {GetServerSideProps} from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';

const BillingPage = ({user}) => {
  const {t} = useTranslation();
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Payments'), href: '/user/profile'},
    {title: tpage('Billing Address'), href: '/user/billing'},
  ];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Billing Address')} />
      <Head>
        <title>{t('page:Billing Address')}</title>
      </Head>
      <Billing userData={user} />
    </PostLoginLayout>
  );
};

export default BillingPage;
BillingPage.auth = true;

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
  const {data: userData} = await graphqlRequestHandler(
    queries.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const user = userData?.data?.getUserById?.userData;
  return {
    props: {
      user,
    },
  };
};
