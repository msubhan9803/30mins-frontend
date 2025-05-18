import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import sendEmail from 'utils/sendEmailHandler';
import TEMPLATES from 'constants/emailTemplateIDs';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import bookingMutations from 'constants/GraphQL/Booking/mutations';
import languageCode from 'utils/languageCode';
import queries from 'constants/GraphQL/User/queries';
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

    const {meetingDetails, feedback} = req.body;

    const queryRes = await graphqlRequestHandler(
      bookingMutations.updateBookingStatus,
      {
        statusUpdateData: {
          bookingId: meetingDetails._id,
          clientConfirmed: true,
          postMeetingFeedback: feedback,
        },
      },
      session?.accessToken
    );
    if (queryRes.data.data.updateBookingStatus.status === 200) {
      if (meetingDetails.provider !== null) {
        const {data: userDataResults} = await graphqlRequestHandler(
          queries.getUserById,
          {
            token: session?.accessToken,
            documentId: meetingDetails.provider,
          },
          process.env.BACKEND_API_KEY
        );
        const providerLanguage =
          userDataResults.data.getUserById?.userData?.personalDetails?.language;

        if (meetingDetails.serviceType === SERVICE_TYPES.MEETING) {
          await sendEmail(
            {
              clientName: meetingDetails.bookerName,
              providerName: meetingDetails.providerName,
              bookingId: meetingDetails._id,
              postMeetingFeedback: feedback,
              isPaid: meetingDetails?.price > 0,
              clientConfirmed: true,
              [languageCode(providerLanguage)]: true,
            },
            meetingDetails.providerEmail,
            process.env.EMAIL_FROM!,
            TEMPLATES.POST_BOOKING.CLIENT_CONFIRMED_MEETING_COMPLETION
          );
        }

        if (meetingDetails.serviceType === SERVICE_TYPES.FREELANCING_WORK) {
          await sendEmail(
            {
              clientName: meetingDetails.bookerName,
              providerName: meetingDetails.providerName,
              bookingId: meetingDetails._id,
              postMeetingFeedback: feedback,
              clientConfirmed: true,
              [languageCode(providerLanguage)]: true,
            },
            meetingDetails.providerEmail,
            process.env.EMAIL_FROM!,
            TEMPLATES.POST_BOOKING.FREELANCE_CLIENT_CONFIRMED_TO_PROVIDER
          );
        }
      }
      return res.status(200).json({success: true, message: 'Meeting has been canceled'});
    }
    return res.status(400).json({success: true, message: 'Meeting has not been canceled'});
  } catch (error) {
    return res.status(400).json({message: error});
  }
};

export default handler;
