import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import mutations from '../../../constants/GraphQL/SignIn/mutations';

// eslint-disable-next-line consistent-return
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const validateRecaptcha = async (token: string): Promise<boolean> => {
      const secret = process.env.RECAPTCHA_SECRET_KEY;
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
        {
          method: 'POST',
        }
      );
      const data = await response.json();
      return data.success;
    };

    const human = await validateRecaptcha(req.body.captchaToken);
    if (!human) {
      res.status(400);
      res.json({errors: ['Recaptca validation failed']});
    } else {
      const {data: signInData} = await graphqlRequestHandler(
        mutations.handleOtpSignIn,
        {
          email: req.body?.email,
        },
        process.env.BACKEND_API_KEY
      );

      if (signInData.data.handleOtpSignIn?.status === 404) {
        res.status(201).send({message: 'Account Not Found'});
      } else {
        res.status(200).send({message: 'OTP SignIn Response', signInData});
      }
    }
  } catch (err) {
    return res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
