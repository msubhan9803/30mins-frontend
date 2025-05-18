/* eslint-disable @typescript-eslint/dot-notation */
import {NextApiRequest, NextApiResponse} from 'next';
import Stripe from 'stripe';
import getRawBody from 'raw-body';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import activeExtensionsMutations from 'constants/GraphQL/ActiveExtension/mutations';
import userMutations from 'constants/GraphQL/User/mutations';
import EMAIL_TEMPLATES from 'constants/emailTemplateIDs';
import sendEmail from 'utils/sendEmailHandler';
import stripProductIds from 'constants/stripeProductIDs';
import updateBuisnessStats from 'utils/updateBusinessStats';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }
  const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
    apiVersion: '2020-08-27',
  });

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);

    event = stripe.webhooks.constructEvent(
      rawBody,
      req.headers['stripe-signature']!,
      process.env.WEBHOOK_KEY!
    );

    if (['charge.succeeded', 'invoice.payment_succeeded'].includes(event?.type)) {
      if (event?.data?.object['receipt_email']) {
        await graphqlRequestHandler(
          userMutations.backendUpdateUser,
          {
            userData: {
              accountDetails: {
                verifiedAccount: true,
              },
            },
            email: event?.data?.object['receipt_email'],
          },
          process.env.BACKEND_API_KEY
        );
      }
    }

    const isSubscription = event.data.object['subscription'] || false;
    let customer;

    if (event.data.object['customer']) {
      customer = await stripe.customers.retrieve(event.data.object['customer']);
    }

    switch (event.type) {
      case 'invoice.payment_succeeded':
        await sendEmail(
          {
            invoiceLink: event.data.object['invoice_pdf'],
            customerName: customer.name,
          },
          customer.email,
          process.env.EMAIL_SERVER_USER!,
          EMAIL_TEMPLATES.EXTENSIONS.PAYMENT_SUCCESS
        );

        // Customer paid Invoice Manually
        if (event.data.object['billing_reason'] === 'manual' && isSubscription) {
          // Update ActiveExtension Status
          await graphqlRequestHandler(
            activeExtensionsMutations.updateActiveExtension,
            {
              activeExtensionData: {
                status: event.data.object['status'],
              },
              subscriptionId: event.data.object['subscription'],
              customerId: event.data.object['customer'],
            },
            process.env.BACKEND_API_KEY
          );
        }

        // Set Default Payment Method for this Subscription
        if (event.data.object['billing_reason'] === 'subscription_create') {
          const subscriptionId = event.data.object['subscription'];
          const paymentIntentId = event.data.object['payment_intent'];
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

          if (paymentIntent?.payment_method) {
            await stripe.subscriptions.update(subscriptionId, {
              default_payment_method: paymentIntent.payment_method.toString(),
            });
          }

          // Update Status of ActiveExtension
          await graphqlRequestHandler(
            activeExtensionsMutations.updateActiveExtension,
            {
              activeExtensionData: {
                status: event.data.object['status'],
              },
              subscriptionId: event.data.object['subscription'],
              customerId: event.data.object['customer'],
            },
            process.env.BACKEND_API_KEY
          );
        }
        break;
      case 'invoice.payment_failed':
        if (isSubscription) {
          // Update Status of ActiveExtension
          await graphqlRequestHandler(
            activeExtensionsMutations.updateActiveExtension,
            {
              activeExtensionData: {
                status: 'payment_failed',
              },
              subscriptionId: event.data.object['subscription'],
              customerId: event.data.object['customer'],
            },
            process.env.BACKEND_API_KEY
          );

          await sendEmail(
            {
              invoiceLink: event.data.object['invoice_pdf'],
              customerName: customer.name,
            },
            customer.email,
            process.env.EMAIL_SERVER_USER!,
            EMAIL_TEMPLATES.EXTENSIONS.PAYMENT_FAILED
          );
        }
        break;

      // case 'customer.subscription.created':
      //   break;

      case 'customer.subscription.updated':
        // Monthly
        if (event.data.object['plan'].id === stripProductIds.EXTENSIONS.COLLECTIVE_AVAILABILITY) {
          const {amount} = event.data.object['plan'];

          await updateBuisnessStats({
            totalRevenue: amount,
            totalMonthlyRecurringRevenue: amount,
          });
        }

        // Monthly Orgnaization
        if (event.data.object['plan'].id === stripProductIds.EXTENSIONS.ORGANIZATIONS) {
          const {amount} = event.data.object['plan'];

          await updateBuisnessStats({
            totalRevenue: amount,
            totalMonthlyRecurringRevenue: amount,
            totalOrganizationRevenue: amount,
            totalOrganizationMonthlyRecurringRevenue: amount,
          });
        }

        // Annuall Organization
        if (event.data.object['plan'].id === stripProductIds.EXTENSIONS.ORGANIZATIONS_ANNUAL) {
          const {amount} = event.data.object['plan'];

          await updateBuisnessStats({
            totalRevenue: amount,
            totalAnnualRecurringRevenue: amount,
            totalOrganizationRevenue: amount,
            totalOragnizationAnnualRecurringRevenue: amount,
          });
        }

        if (event.data.object['status'] === 'past_due') {
          // Re Sub
          if (event.data.object['plan'].id === stripProductIds.EXTENSIONS.COLLECTIVE_AVAILABILITY) {
            const {amount} = event.data.object['plan'];

            await updateBuisnessStats({
              totalRevenue: amount,
            });
          }

          // Orgnaization Re Sub
          if (
            event.data.object['plan'].id === stripProductIds.EXTENSIONS.ORGANIZATIONS ||
            event.data.object['plan'].id === stripProductIds.EXTENSIONS.ORGANIZATIONS_ANNUAL
          ) {
            const {amount} = event.data.object['plan'];

            await updateBuisnessStats({
              totalRevenue: amount,
              totalOrganizationRevenue: amount,
            });
          }

          const invoicePdf = (await stripe.invoices.retrieve(event.data.object['latest_invoice']))
            .invoice_pdf;

          await sendEmail(
            {
              invoiceLink: invoicePdf,
              customerName: customer.name,
            },
            customer.email,
            process.env.EMAIL_SERVER_USER!,
            EMAIL_TEMPLATES.EXTENSIONS.SUBSCRIPTION_PAST_DUE
          );

          // Update Status of ActiveExtension
          await graphqlRequestHandler(
            activeExtensionsMutations.updateActiveExtension,
            {
              activeExtensionData: {
                status: 'past_due',
              },
              subscriptionId: event.data.object['id'],
              customerId: event.data.object['customer'],
            },
            process.env.BACKEND_API_KEY
          );
        }
        break;
      case 'customer.subscription.deleted':
        // Monthly Delete
        if (event.data.object['plan'].id === stripProductIds.EXTENSIONS.COLLECTIVE_AVAILABILITY) {
          const amount = parseInt(`-${event.data.object['plan'].amount}`, 10);

          await updateBuisnessStats({
            totalMonthlyRecurringRevenue: amount,
          });
        }

        // Monthly Org Delete
        if (event.data.object['plan'].id === stripProductIds.EXTENSIONS.ORGANIZATIONS) {
          const amount = parseInt(`-${event.data.object['plan'].amount}`, 10);

          await updateBuisnessStats({
            totalMonthlyRecurringRevenue: amount,
            totalOrganizationMonthlyRecurringRevenue: amount,
          });
        }

        // Annually Org Delete
        if (event.data.object['plan'].id === stripProductIds.EXTENSIONS.ORGANIZATIONS_ANNUAL) {
          const amount = parseInt(`-${event.data.object['plan'].amount}`, 10);

          await updateBuisnessStats({
            TOTAL_ANNUALLY_RECURRING_REVENUE: amount,
            totalAnnualRecurringRevenue: amount,
          });
        }

        await sendEmail(
          {
            customerName: customer.name,
          },
          customer.email,
          process.env.EMAIL_SERVER_USER!,
          EMAIL_TEMPLATES.EXTENSIONS.SUBSCRIPTION_CANCELED
        );
        break;
      default:
    }

    res.status(200).json({message: 'webhooks ran'});
  } catch (err) {
    res.status(500).json({statusCode: 500, message: 'Unknown Error'});
  }
}
