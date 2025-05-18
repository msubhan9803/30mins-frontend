import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import sendEmail from 'utils/sendEmailHandler';
import TEMPLATES from 'constants/emailTemplateIDs';
import dayjs from 'dayjs';
import bookingMutation from 'constants/GraphQL/Booking/mutations';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const RequestApproval = async (req: NextApiRequest, res: NextApiResponse) => {
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

    const {bookerEmail, bookerName, providerEmail, providerName, serviceId, windowOrigin} =
      req.body;

    const {data} = await graphqlRequestHandler(
      bookingMutation.requestBookingApprovals,
      {bookerEmail, providerEmail, serviceId, providerName, bookerName},
      process.env.BACKEND_API_KEY
    );

    if (data.data.requestBookingApprovals.response.status === 200) {
      const {authcode} = data.data.requestBookingApprovals;
      const API_URL_ALLOW = `${windowOrigin}/api/booking/preApproval/allow/?authcode=${authcode}`;
      const API_URL_DENY = `${windowOrigin}/api/booking/preApproval/deny/?authcode=${authcode}`;

      await sendEmail(
        {
          providerName,
          bookerName,
          allow: API_URL_ALLOW,
          deny: API_URL_DENY,
        },
        req.body.providerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.PRE_BOOKING.BOOKER_REQUEST_TO_PROVIDER
      );
      return res.status(200).json({message: data.data.requestBookingApprovals.response.message});
    }
    return res.status(500).json({message: 'Error Requesting Approval'});
  } catch (error) {
    return res.status(400).json({message: error});
  }
};

export default RequestApproval;
