/* eslint-disable @typescript-eslint/dot-notation */
import {NextApiRequest, NextApiResponse} from 'next';

import Stripe from 'stripe';
import {getSession} from 'next-auth/react';
import graphqlRequestHandler from '../../../utils/graphqlRequestHandler';
import userQueries from '../../../constants/GraphQL/User/queries';

const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
  apiVersion: '2020-08-27',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const {price, email} = req.body;
  try {
    const session = await getSession({req: req});
    const {data: userDataResponse} = await graphqlRequestHandler(
      userQueries.getUserById,
      {
        token: session?.accessToken,
      },
      session?.accessToken
    );
    const {userData} = userDataResponse.data.getUserById;
    const customerId = userData?.billingDetails?.customerId;
    let baseReq: any = {
      amount: price * 100,
      receipt_email: email,
      currency: 'usd',
      automatic_payment_methods: {enabled: true},
    };

    if (customerId) {
      baseReq = {
        ...baseReq,
        customer: customerId,
      };
    }
    const paymentIntent: Stripe.Response<Stripe.PaymentIntent> = await stripe.paymentIntents.create(
      baseReq
    );

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({statusCode: 500, message: 'Unknown Error'});
  }
}
