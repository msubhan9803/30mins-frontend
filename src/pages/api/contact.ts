import type {NextApiRequest, NextApiResponse} from 'next';
import nodemailer from 'nodemailer';
import graphqlRequestHandler from '../../utils/graphqlRequestHandler';
import domainQueries from '../../constants/GraphQL/BlockedDomain/queries';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {message, senderEmail, senderName, subject} = req.body;

  try {
    const senderEmailDomain = senderEmail.split('@')[1];

    const {data: domainResponse} = await graphqlRequestHandler(
      domainQueries.validateDomain,
      {domain: senderEmailDomain},
      process.env.BACKEND_API_KEY
    );

    if (domainResponse.data.validateDomain.status !== 200) {
      res.status(400).send({message: 'Invalid Email Provided'});
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const to30minEmailData = {
      from: senderEmail,
      to: process.env.EMAIL_SERVER_USER,
      subject: `${senderName} - ${subject}`,
      text: message,
      html: `<div><h3>Email From: ${senderEmail}</h3><p>${message}</p></div>`,
    };

    const toSenderEmailData = {
      from: process.env.EMAIL_FROM,
      to: senderEmail,
      subject: '30mins - ContactUs',
      text: 'Your message has been successfully sent. A 30mins representative will reach out asap.',
      html: `<div><p>Your message has been successfully sent. A 30mins representative will reach out asap.</p></div>`,
    };

    await transporter.sendMail(to30minEmailData);
    await transporter.sendMail(toSenderEmailData);

    res.status(200).send({message: 'Email Sent'});
  } catch (err) {
    res.status(500).send({message: 'Unknown Server Error'});
  }
};

export default handler;
