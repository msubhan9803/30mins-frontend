import languageCode from 'utils/languageCode';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import sendEmail from 'utils/sendEmailHandler';
import TEMPLATES from 'constants/emailTemplateIDs';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/User/queries';
import bookingMutations from 'constants/GraphQL/Booking/mutations';
import {SERVICE_TYPES} from '../../../constants/enums';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

    const {meetingDetails, reason} = req.body;

    const {data: userDataResults} = await graphqlRequestHandler(
      queries.getUserById,
      {
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );
    const userID = userDataResults.data.getUserById?.userData?._id;

    if (userID === meetingDetails.booker) {
      const queryRes = await graphqlRequestHandler(
        bookingMutations.updateBookingStatus,
        {
          statusUpdateData: {
            bookingId: meetingDetails._id,
            refundRequested: true,
            hasOpenReport: true,
            refundRequestReason: reason,
          },
        },
        session?.accessToken
      );

      if (queryRes.data.data.updateBookingStatus.status === 200) {
        if (meetingDetails.booker !== null) {
          const bookerLanguage =
            userDataResults.data.getUserById?.userData?.personalDetails?.language;

          if (
            meetingDetails.serviceType === SERVICE_TYPES.MEETING ||
            meetingDetails.serviceType === SERVICE_TYPES.ROUND_ROBIN
          ) {
            await sendEmail(
              {
                clientName: meetingDetails.bookerName,
                providerName: meetingDetails.providerName,
                bookingId: meetingDetails._id,
                refundReason: reason,
                isPaid: meetingDetails.price > 0,
                paymentType: meetingDetails.paymentType,
                [languageCode(bookerLanguage)]: true,
              },
              meetingDetails.bookerEmail,
              process.env.EMAIL_FROM!,
              TEMPLATES.POST_BOOKING.CLIENT_REFUNDED_REQUESTED
            );
          }

          if (meetingDetails.serviceType === SERVICE_TYPES.FREELANCING_WORK) {
            await sendEmail(
              {
                clientName: meetingDetails.bookerName,
                bookingId: meetingDetails._id,
                [languageCode(bookerLanguage)]: true,
              },
              meetingDetails.bookerEmail,
              process.env.EMAIL_FROM!,
              TEMPLATES.POST_BOOKING.FREELANCE_REFUND_CONFIRMATION_TO_CLIENT
            );

            await sendEmail(
              {
                clientName: meetingDetails.bookerName,
                bookingId: meetingDetails._id,
                [languageCode(bookerLanguage)]: true,
              },
              meetingDetails.providerEmail,
              process.env.EMAIL_FROM!,
              TEMPLATES.POST_BOOKING.FREELANCE_REFUND_ALERT_TO_PROVIDER
            );
          }
        }

        return res.status(200).json({success: true, message: ' Request for refund sent'});
      }
    }
    return res.status(400).json({success: true, message: 'Cannot request for refund sent'});
  } catch (error) {
    return res.status(400).json({message: error});
  }
};

export default handler;
