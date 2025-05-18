import React from 'react';
import Head from 'next/head';
import Header from '@components/header';
import PostLoginLayout from '@components/layout/post-login';
import useTranslation from 'next-translate/useTranslation';
import {GetServerSideProps} from 'next';
import {Elements} from '@stripe/react-stripe-js';
import ExtensionsInfoContainer from '../../../components/PostLogin/Extensions/SingleExtensionPage/ExtensionsInfoContainer';
import getStripe from '../../../utils/getStripe';
import getUserExtensionsData from '../../../utils/extensions/getUserExtensionsData';
import stripeProductIDs from '../../../constants/stripeProductIDs';

const AdvertisementExtension = ({
  prices,
  paymentMethods,
  customerId,
  activeExtensions,
  giftedExtensions,
  discount,
}) => {
  const {t} = useTranslation();

  const extensionIds = [stripeProductIDs.EXTENSIONS.ADVERTISEMENT];

  const displayPriceData = prices.filter(
    price => price.id === stripeProductIDs.EXTENSIONS.ADVERTISEMENT
  )[0];

  const displayPrices = prices.filter(price => extensionIds.includes(price.id));

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Extensions'), href: '/user/extensions'},
    {title: t(`page:Advertisement_Campaign_Extension`), href: `/user/extensions/advertisement`},
  ];

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:Advertisement_Campaign_Extension')}</title>
      </Head>

      <Header crumbs={crumbs} heading={t('page:Advertisement_Campaign_Extension')} />

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

AdvertisementExtension.auth = true;
export default AdvertisementExtension;

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
