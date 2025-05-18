import {GetServerSideProps} from 'next';
import {getSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Layout from 'components/Layout/PreLogin';
import Hero from 'components/PreLogin/Home/Hero';
import ServiceCards from 'components/PreLogin/Home/ServiceCards';
import ScheduleWithUs from 'components/PreLogin/Home/Schedule';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import queries from 'constants/GraphQL/User/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import Script from 'next/script';
import React from 'react';

const Home = ({userList, userData}) => {
  const {t} = useTranslation();

  return (
    <>
      <Script id={'live-support'}>
        {`var LHC_API = LHC_API||{};
LHC_API.args = {mode:'widget',lhc_base_url:'//livehelperchat.runnel.ai/index.php/',wheight:450,wwidth:350,pheight:520,pwidth:500,domain:'30mins.com',leaveamessage:true,department:["30minsbilling","30minsmyaccount","30minsotherqueries","30minssales","30minssignupissues","30minsticketstatus"],theme:"5",check_messages:false};
(function() {
var po = document.createElement('script'); po.type = 'text/javascript'; po.setAttribute('crossorigin','anonymous'); po.async = true;
var date = new Date();po.src = '//livehelperchat.runnel.ai/design/defaulttheme/js/widgetv2/index.js?'+(""+date.getFullYear() + date.getMonth() + date.getDate());
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})()`}
      </Script>
      <Layout>
        <HeadSeo
          canonicalUrl={'https://30mins.com/'}
          description={t('page:home_description')}
          ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
          ogType={'website'}
          title={'30mins.com'}
        />
        <Hero userData={userData} userList={userList} />
        <ServiceCards />
        <ScheduleWithUs />
      </Layout>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  try {
    const {data: usersWithExtensions} = await graphqlRequestHandler(
      queries.getUsersWithAdvertisingExtension,
      {},
      process.env.BACKEND_API_KEY
    );

    const {data: user} = await graphqlRequestHandler(
      queries.getUserById,
      {token: session?.accessToken},
      process.env.BACKEND_API_KEY
    );
    const userList = usersWithExtensions?.data?.getUsersWithAdvertisingExtension?.userData;
    const userData = user;

    return {
      props: {
        userList,
        userData,
      },
    };
  } catch (err) {
    return {
      props: {
        userList: [],
        userData: null,
      },
    };
  }
};
