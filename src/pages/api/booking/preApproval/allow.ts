import type {NextApiRequest, NextApiResponse} from 'next';
import sendEmail from 'utils/sendEmailHandler';
import TEMPLATES from 'constants/emailTemplateIDs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import bookingMutation from 'constants/GraphQL/Booking/mutations';

dayjs.extend(utc);
dayjs.extend(timezone);

const PreApproval = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {authcode} = req.query;
    const {data} = await graphqlRequestHandler(
      bookingMutation.requestBookingAllow,
      {authcode},
      process.env.BACKEND_API_KEY
    );

    if (data.data.requestBookingAllow.response.status === 200) {
      await sendEmail(
        {
          providerName: data.data.requestBookingAllow.providerName,
          bookerName: data.data.requestBookingAllow.bookerName,
        },
        data.data.requestBookingAllow.bookerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.PRE_BOOKING.BOOKER_REQUEST_APPROVED
      );
    }
    return res
      .status(data.data.requestBookingAllow.response.status)
      .redirect(
        `/Home?message=${data.data.requestBookingAllow.response.message}&status=${data.data.requestBookingAllow.response.status}&operation=RequestBookingAllow&success=1`
      );
  } catch (error) {
    return res.status(400).json({message: error});
  }
};

export default PreApproval;
