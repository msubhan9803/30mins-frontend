import React from 'react';
import Head from 'next/head';
import Header from '@components/header';
import PostLoginLayout from '@components/layout/post-login';
import useTranslation from 'next-translate/useTranslation';
import {GetServerSideProps} from 'next';
import {Elements} from '@stripe/react-stripe-js';
import stripeProductIDs from '../../../constants/stripeProductIDs';
import ExtensionsInfoContainer from '../../../components/PostLogin/Extensions/SingleExtensionPage/ExtensionsInfoContainer';
import getUserExtensionsData from '../../../utils/extensions/getUserExtensionsData';
import getStripe from '../../../utils/getStripe';

const ChatbotExtension = ({
  prices,
  paymentMethods,
  customerId,
  activeExtensions,
  giftedExtensions,
  discount,
}) => {
  const {t} = useTranslation();

  const extensionIds = [stripeProductIDs.EXTENSIONS.CHATBOT];

  const displayPriceData = prices.filter(
    price => price.id === stripeProductIDs.EXTENSIONS.CHATBOT
  )[0];

  const displayPrices = prices.filter(price => extensionIds.includes(price.id));

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Extensions'), href: '/user/extensions'},
    {title: t(`page:Chatbot_Extension`), href: `/user/extensions/chatbot`},
  ];

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:Chatbot_Extension')}</title>
      </Head>

      <Header crumbs={crumbs} heading={t('page:Chatbot_Extension')} />
      <Elements stripe={getStripe()}>
        <ExtensionsInfoContainer
          title={t(`page:Advertisement_Campaign_Extension`)}
          description={displayPriceData?.product?.description}
          image={displayPriceData?.product?.images[0]}
          customerId={customerId}
          activeExtensions={activeExtensions}
          giftedExtensions={giftedExtensions}
          paymentMethods={paymentMethods}
          prices={displayPrices}
          discount={discount}
        />
      </Elements>
    </PostLoginLayout>
  );
};

ChatbotExtension.auth = true;
export default ChatbotExtension;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    return await getUserExtensionsData(context);
  } catch (err) {
    return {
      props: {
        errors: 'Unknown Error',
        hasExtension: false,
      },
    };
  }
};
