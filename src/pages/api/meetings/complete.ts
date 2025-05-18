import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import nextConnect from 'next-connect';
import sendEmail from 'utils/sendEmailHandler';
import TEMPLATES from 'constants/emailTemplateIDs';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import bookingMutations from 'constants/GraphQL/Booking/mutations';
import bookingQueries from 'constants/GraphQL/Booking/queries';
import {SERVICE_TYPES} from '../../../constants/enums';
import middleware from '../middleware/middlewareOrderCompletion';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({req: req});
    if (!session) {
      return res.status(401).json({success: false, message: 'Not authenticated'});
    }
    if (req.method !== 'POST') {
      return res.status(400).json({
        success: false,
        message: 'This endpoint only accepts POST requests!',
      });
    }

    const {notes} = req.body;

    const queryRes = await graphqlRequestHandler(
      bookingMutations.updateBookingStatus,
      {
        statusUpdateData: {
          bookingId: req.body._id,
          providerConfirmed: true,
          postMeetingNotes: notes,
        },
      },
      session?.accessToken
    );

    if (queryRes.data.data.updateBookingStatus.status === 200) {
      if (
        req.body.serviceType === SERVICE_TYPES.MEETING ||
        req.body.serviceType === SERVICE_TYPES.ROUND_ROBIN
      ) {
        const {data: postStatusAuthCodeResult} = await graphqlRequestHandler(
          bookingQueries.getStatusAuthCode,
          {
            email: req.body.bookerEmail,
            bookingId: req.body._id,
          },
          process.env.BACKEND_API_KEY
        );

        await sendEmail(
          {
            clientName: req.body.bookerName,
            bookingId: req.body._id,
            providerName: req.body.providerName || 'Account Deleted',
            postMeetingNotes: notes,
            isPaid: req.body.price > 0,
            paymentType: req.body.paymentType,
            authCode: postStatusAuthCodeResult.data.getStatusAuthCode.statusAuthCode.authCode,
          },
          req.body.bookerEmail,
          process.env.EMAIL_FROM!,
          TEMPLATES.POST_BOOKING.PROVIDER_COMPLETED_MEETING,
          req.body.attachment
        );
      }

      if (req.body.serviceType === SERVICE_TYPES.FREELANCING_WORK) {
        await sendEmail(
          {
            clientName: req.body.bookerName,
            bookingId: req.body._id,
            providerName: req.body.providerName || 'Account Deleted',

            postMeetingNotes: notes,
          },
          req.body.bookerEmail,
          process.env.EMAIL_FROM!,
          TEMPLATES.POST_BOOKING.FREELANCE_PROVIDER_COMPLETE_TO_CLIENT,
          req.body.attachment
        );
      }
      return res.status(200).json({success: true, message: 'Meeting has been completed'});
    }
    return res.status(400).json({success: false, message: 'Meeting has not canceled'});
  } catch (error) {
    return res.status(400).json({message: error});
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
