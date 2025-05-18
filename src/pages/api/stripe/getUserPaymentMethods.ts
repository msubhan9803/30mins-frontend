/* eslint-disable @typescript-eslint/dot-notation */
import {NextApiRequest, NextApiResponse} from 'next';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
  apiVersion: '2020-08-27',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const {customerId} = req.body;

  try {
    let paymentMethods: Stripe.PaymentMethod[] = [];

    if (customerId) {
      const customer = await stripe.customers.retrieve(customerId);
      // @ts-ignore
      const defaultPaymentMethod = customer.invoice_settings.default_payment_method;
      // @ts-ignore

      const methods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      if (methods.data.length !== 0) {
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

    res.status(200).json({
      paymentMethods,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({statusCode: 500, message: 'Unknown Error'});
  }
}
