import PaymentOptions from 'components/PostLogin/PaymentOptions';
import userQueries from 'constants/GraphQL/User/queries';
import stripeQueries from 'constants/GraphQL/StripeAccount/queries';
import {GetServerSideProps} from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import Stripe from 'stripe';
import LinkStripeContainer from 'components/PostLogin/PaymentOptions/LinkStripeContainer';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import PostLoginLayout from '@root/components/layout/post-login';
import Header from '@root/components/header';
import WireTransfer from 'components/PostLogin/PaymentOptions/WireTransfer';
import {MANUAL_ESCROW_PAYMENT_OPTIONS} from '../../constants/enums';
import LinkAccountContainer from '../../components/PostLogin/PaymentOptions/LinkAccountContainer';

const PaymentOptionsPage = ({
  user,
  userStripeAccount,
  accountDocumentId,
  hasDirectServices,
  hasEscrowServices,
}) => {
  const {t} = useTranslation();
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Payments'), href: '/user/profile'},
    {title: tpage('Receiving Payments'), href: '/user/paymentOptions'},
  ];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Receiving Payments')} />
      <Head>
        <title>{t('page:Payment Methods')}</title>
      </Head>
      <span className='font-medium text-lg text-mainBlue col-span-2'>
        {t('setting:new_receiving_payments_header_1')}
      </span>
      <LinkStripeContainer
        userStripeAccount={userStripeAccount}
        accountDocumentId={accountDocumentId}
      />
      {Object.keys(MANUAL_ESCROW_PAYMENT_OPTIONS).map(option => (
        <LinkAccountContainer
          key={option}
          user={user}
          paymentType={option}
          paymentTypeId={MANUAL_ESCROW_PAYMENT_OPTIONS[option]}
          userPaymentAccount={user?.accountDetails[MANUAL_ESCROW_PAYMENT_OPTIONS[option]]}
        />
      ))}

      <WireTransfer />

      <PaymentOptions
        user={user}
        userStripeAccount={userStripeAccount}
        hasDirectServices={hasDirectServices}
        hasEscrowServices={hasEscrowServices}
      />
      <div className={'mb-6'} />
    </PostLoginLayout>
  );
};

export default PaymentOptionsPage;
PaymentOptionsPage.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    const router = context.resolvedUrl;

    const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
      apiVersion: '2020-08-27',
    });

    if (!session) {
      return {
        redirect: {
          destination: `/auth/login?url=${router}`,
          permanent: false,
        },
      };
    }
    const {data: userData} = await graphqlRequestHandler(
      userQueries.getUserById,
      {
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );

    const {data: paymentOptionsData} = await graphqlRequestHandler(
      userQueries.getPaymentOptionsData,
      {
        token: session?.accessToken,
      },
      session?.accessToken
    );

    const {directServices, escrowServices} = paymentOptionsData.data.getPaymentOptionsData;

    const {data: stripeAccountRes} = await graphqlRequestHandler(
      stripeQueries.getStripeAccount,
      {},
      session?.accessToken
    );

    const user = userData?.data?.getUserById?.userData;
    const stripeAccountId = stripeAccountRes?.data?.getStripeAccount?.stripeAccountData?.accountId;
    const stripeAccountDocumentId =
      stripeAccountRes?.data?.getStripeAccount?.stripeAccountData?._id;
    let userStripeAccount: Stripe.Response<Stripe.Account> | undefined;
    if (stripeAccountId) {
      userStripeAccount = await stripe.accounts.retrieve(stripeAccountId);
    }

    return {
      props: {
        user,
        userStripeAccount: userStripeAccount || '',
        accountDocumentId: stripeAccountDocumentId || '',
        hasDirectServices: !!directServices,
        hasEscrowServices: !!escrowServices,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
