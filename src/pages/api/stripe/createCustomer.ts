/* eslint-disable @typescript-eslint/dot-notation */
import {NextApiRequest, NextApiResponse} from 'next';

import Stripe from 'stripe';
import {getSession} from 'next-auth/react';
import graphqlRequestHandler from '../../../utils/graphqlRequestHandler';
import userMutations from '../../../constants/GraphQL/User/mutations';

const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
  apiVersion: '2020-08-27',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
      return;
    }
    const session = await getSession({req: req});

    const {email, name, referral, coupon} = req.body;

    const payload: Stripe.CustomerCreateParams = {
      address: '',
      email,
      name,
      metadata: {
        referral,
      },
    };

    try {
      const stripeCoupon = await stripe.coupons.retrieve(coupon);

      if (stripeCoupon.valid) {
        payload['coupon'] = stripeCoupon.id;
      }
    } catch {
      console.log('Invalid Stripe Coupon');
    }

    const customer = await stripe.customers.create(payload);

    // Attach customerId to User
    await graphqlRequestHandler(
      userMutations.updateUser,
      {
        userData: {
          billingDetails: {
            customerId: customer.id,
          },
        },
        token: session?.accessToken,
      },
      session?.accessToken
    ).catch(err => console.log(err.response.data.errors));

    res.status(200).json(customer);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    console.log(err.message);
    res.status(500).json({statusCode: 500, message: errorMessage});
  }
}
