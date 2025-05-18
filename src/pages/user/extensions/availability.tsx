import Availability from 'components/PostLogin/AvailabilityPage/AvailabilityPage';
import {useSession} from 'next-auth/react';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import AvailabilityQueries from 'constants/GraphQL/CollectiveAvailability/queries';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';
import {Elements} from '@stripe/react-stripe-js';
import React from 'react';
import getUserExtensionsData from '../../../utils/extensions/getUserExtensionsData';
import stripeProductIDs from '../../../constants/stripeProductIDs';
import getStripe from '../../../utils/getStripe';
import ExtensionsInfoContainer from '../../../components/PostLogin/Extensions/SingleExtensionPage/ExtensionsInfoContainer';

const AvailabilityPage = ({
  integrations,
  hasExtension,
  prices,
  paymentMethods,
  customerId,
  activeExtensions,
  giftedExtensions,
  discount,
}) => {
  const {data: session} = useSession();
  const {t} = useTranslation();

  const extensionIds = [stripeProductIDs.EXTENSIONS.COLLECTIVE_AVAILABILITY];

  const displayPriceData = prices.filter(
    price => price.id === stripeProductIDs.EXTENSIONS.COLLECTIVE_AVAILABILITY
  )[0];

  const displayPrices = prices.filter(price => extensionIds.includes(price.id));

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Extensions'), href: '/user/extensions'},
    {title: t(`page:Collective Availability`), href: `/user/extensions/sms`},
  ];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Collective Availability')} />
      <Head>
        <title> {t('page:Collective Availability')}</title>
      </Head>
      <Elements stripe={getStripe()}>
        <ExtensionsInfoContainer
          title={t(`page:Collective Availability`)}
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
      <Availability
        session={session}
        integrations={integrations}
        isExtensionActivate={hasExtension}
      />
    </PostLoginLayout>
  );
};
export default AvailabilityPage;
AvailabilityPage.auth = true;

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
    AvailabilityQueries.getAllGroups,
    {},
    session?.accessToken
  );

  const {props: extensionsProps} = await getUserExtensionsData(context);

  const hasExtension = extensionsProps?.userData?.accountDetails?.activeExtensions.includes(
    stripeProductIDs.EXTENSIONS.COLLECTIVE_AVAILABILITY
  );

  return {
    props: {
      integrations,
      hasExtension,
      ...extensionsProps,
    },
  };
};
