import type {NextApiRequest, NextApiResponse} from 'next';
import sendEmail from 'utils/sendEmailHandler';
import TEMPLATES from 'constants/emailTemplateIDs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {user, type} = req.body;
    await sendEmail(
      {
        calendarType: type,
        providerName: user.accountDetails?.username,
      },
      user.accountDetails?.email,
      process.env.EMAIL_FROM!,
      TEMPLATES.GETBUSYTIMESFAILS
    );
    return res.status(200).send({message: 'email sent'});
  } catch (err) {
    return res.status(500).send({message: 'Unknown Server Error', error: err});
  }
};

export default handler;
