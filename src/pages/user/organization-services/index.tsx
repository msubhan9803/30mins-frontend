import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import userQuery from 'constants/GraphQL/User/queries';

import Organizations from 'components/PostLogin/Organizations';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import PostLoginLayout from '@root/components/layout/post-login';
import Header from '@root/components/header';

const OrganizationServices = ({user}) => {
  const {t} = useTranslation();

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Organization Services'), href: '/user/organizations-services'},
  ];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Organization Services')} />
      <Head>
        <title> {t('page:Organization Services')}</title>
      </Head>
      <Organizations user={user} />
    </PostLoginLayout>
  );
};
export default OrganizationServices;
OrganizationServices.auth = true;

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
    userQuery.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  return {
    props: {
      user,
    },
  };
};
