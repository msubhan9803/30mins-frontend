/* eslint-disable @typescript-eslint/dot-notation */

import {getSession} from 'next-auth/react';
import Stripe from 'stripe';
import graphqlRequestHandler from '../graphqlRequestHandler';
import userQueries from '../../constants/GraphQL/User/queries';
import activeExtensionQueries from '../../constants/GraphQL/ActiveExtension/queries';

export default async function getUserExtensionsData(context) {
  const session = await getSession(context);
  const router = context.resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router}`,
        permanent: false,
      },
    };
  }

  const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
    apiVersion: '2020-08-27',
  });

  const {data: userDataResponse} = await graphqlRequestHandler(
    userQueries.getUserById,
    {
      token: session?.accessToken,
    },
    session?.accessToken
  );

  const {data: activeExtensionDataResponse} = await graphqlRequestHandler(
    activeExtensionQueries.getActiveExtensions,
    {
      token: session?.accessToken,
    },
    session?.accessToken
  );

  const activeExtensionsData =
    activeExtensionDataResponse.data.getActiveExtensions.activeExtensionData || [];

  const {userData} = userDataResponse.data.getUserById;
  const customerId = userData?.billingDetails?.customerId || '';
  const hasCustomerId = !!customerId;
  let hasPaymentMethod: boolean = false;
  let discount = 0;

  let paymentMethods: Stripe.PaymentMethod[] = [];
  let activeExtensions: String[] = [];

  if (customerId) {
    const customer = await stripe.customers.retrieve(customerId);
    // @ts-ignore
    const defaultPaymentMethod = customer.invoice_settings.default_payment_method;
    // @ts-ignore
    if (customer?.discount?.coupon?.percent_off) {
      discount = customer['discount']['coupon']['percent_off'] / 100;
    }
    const methods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    if (methods.data.length !== 0) {
      hasPaymentMethod = true;

      paymentMethods = methods.data.map(method => {
        if (method.id === defaultPaymentMethod) {
          method['isDefault'] = true;
        }
        return method;
      });

      paymentMethods.sort((methodA, methodB) => {
        if (methodA['isDefault']) {
          return -1;
        }

        if (methodB['isDefault']) {
          return 1;
        }

        return 0;
      });
    }
  }

  activeExtensions = userData?.accountDetails?.activeExtensions || [];
  const giftedExtensions =
    activeExtensionsData?.map(extension => {
      if (extension?.status === 'gifted') {
        return extension?.extensionProductId;
      }
      return null;
    }) || [];
  const pricesResponse = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    limit: 100,
  });

  return {
    props: {
      prices: pricesResponse.data,
      userData,
      paymentMethods,
      customerId,
      hasCustomerId,
      hasPaymentMethod,
      activeExtensions,
      giftedExtensions,
      discount,
    },
  };
}
