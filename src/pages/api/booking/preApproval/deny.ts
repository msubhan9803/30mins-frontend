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
      bookingMutation.requestBookingDeny,
      {authcode},
      process.env.BACKEND_API_KEY
    );
    if (data.data.requestBookingDeny.response.status === 200) {
      await sendEmail(
        {
          providerName: data.data.requestBookingDeny.providerName,
          bookerName: data.data.requestBookingDeny.bookerName,
        },
        data.data.requestBookingDeny.bookerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.PRE_BOOKING.BOOKER_REQUEST_DENIED
      );
    }
    return res
      .status(data.data.requestBookingDeny.response.status)
      .redirect(
        `/Home?message=${data.data.requestBookingDeny.response.message}&status=${data.data.requestBookingDeny.response.status}&operation=RequestBookingDeny&success=1`
      );
  } catch (error) {
    return res.status(400).json({message: error});
  }
};

export default PreApproval;
