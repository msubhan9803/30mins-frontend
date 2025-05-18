import EditProfilePage from 'components/PostLogin/Profile/EditProfile/EditProfile';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/User/queries';
import PostLoginLayout from '@root/components/layout/post-login';
import Header from '@root/components/header';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';

const EditProfile = ({userData}) => {
  const {t} = useTranslation();
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Profile'), href: '/user/profile'},
    {title: tpage('Account Settings'), href: '/user/edit'},
  ];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('common:txt_edit_profile')} />
      <Head>
        <title> {t('common:txt_edit_profile')}</title>
      </Head>
      <EditProfilePage userData={userData} />
    </PostLoginLayout>
  );
};

export default EditProfile;
EditProfile.auth = true;

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
    session?.accessToken
  );

  return {
    props: {
      userData,
    },
  };
};
