import React from 'react';
import Head from 'next/head';
import Header from '@components/header';
import PostLoginLayout from '@components/layout/post-login';
import useTranslation from 'next-translate/useTranslation';
import {GetServerSideProps} from 'next';
import {Elements} from '@stripe/react-stripe-js';
import dynamic from 'next/dynamic';
import stripeProductIDs from '../../../constants/stripeProductIDs';
import ExtensionsInfoContainer from '../../../components/PostLogin/Extensions/SingleExtensionPage/ExtensionsInfoContainer';
import getStripe from '../../../utils/getStripe';
import getUserExtensionsData from '../../../utils/extensions/getUserExtensionsData';

const PaidMeetingsExtension = ({
  errors,
  prices,
  paymentMethods,
  customerId,
  activeExtensions,
  giftedExtensions,
  discount,
}) => {
  const {t} = useTranslation();

  const ReactSlides = dynamic(() => import('react-google-slides'), {
    ssr: false,
  });

  if (errors) {
    return <div>{errors}</div>;
  }

  const extensionIds = [stripeProductIDs.EXTENSIONS.PAID_MEETINGS];

  const hasExtension = activeExtensions?.some(extensionId => extensionIds?.includes(extensionId));

  const displayPriceData = prices?.filter(
    price => price.id === stripeProductIDs.EXTENSIONS.PAID_MEETINGS
  )[0];

  const displayPrices = prices?.filter(price => extensionIds.includes(price.id));

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Extensions'), href: '/user/extensions'},
    {title: t(`page:PaidMeetings_Extension`), href: `/user/extensions/organizations`},
  ];

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:PaidMeetings_Extension')}</title>
      </Head>
      <Header crumbs={crumbs} heading={t('page:PaidMeetings_Extension')} />
      <Elements stripe={getStripe()}>
        <ExtensionsInfoContainer
          title={t(`page:PaidMeetings_Extension`)}
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

      {hasExtension ? (
        <> </>
      ) : (
        <div className='flex justify-center pb-4'>
          <ReactSlides
            containerStyle={{borderRadius: 6}}
            width={'100%'}
            slideDuration={5}
            position={1}
            showControls
            loop
            slidesLink={
              'https://docs.google.com/presentation/d/1lLApGOZnish0NB5wjwDZmI4Dnyhh7PffebU6aaaVPVw/'
            }
          />
        </div>
      )}
    </PostLoginLayout>
  );
};

PaidMeetingsExtension.auth = true;
export default PaidMeetingsExtension;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    return await getUserExtensionsData(context);
  } catch (err) {
    console.log(err);
    return {
      props: {
        errors: err.toString(),
        hasExtension: false,
      },
    };
  }
};
