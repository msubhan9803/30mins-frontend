import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';
import Calendars from 'components/PostLogin/Settings/calendars';
import queries from 'constants/GraphQL/Integrations/queries';
import {GetServerSideProps} from 'next';
import {unstable_getServerSession} from 'next-auth';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import Image from 'next/image';

const Integrations = ({integrations}) => {
  const {t} = useTranslation();
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Connected Calendars'), href: '/user/integrations'},
  ];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('common:txt_calendar_Integrations')} />
      <Head>
        <title>{t('common:txt_calendar_Integrations')}</title>
      </Head>
      <div className='flex flex-col sm:flex-row items-center sm:items-start'>
        <div className='w-1/2 h-[14rem] sm:w-[72rem] md:w-[48rem] p-6 relative'>
          <Image src={`/icons/services/calendar.svg`} alt='' layout='fill' objectFit='cover' />
        </div>
        <div className='pt-8 px-4'>{t('common:default_calendar_message')}</div>
      </div>
      <Calendars integrations={integrations} />
    </PostLoginLayout>
  );
};

export default Integrations;
Integrations.auth = true;

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
  const {data: integrations} = await graphqlRequestHandler(
    queries.getCredentialsByToken,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  return {
    props: {
      integrations,
    },
  };
};
