import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import domainQueries from '../../../constants/GraphQL/BlockedDomain/queries';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const emailDomain = req.body.email.split('@')[1];
    const {data: domainResponse} = await graphqlRequestHandler(
      domainQueries.validateDomain,
      {domain: emailDomain},
      process.env.BACKEND_API_KEY
    );
    if (domainResponse.data.validateDomain.status !== 200) {
      return res.status(203).send({message: 'Invalid Domain', error: 'Invalid Domain'});
    }
    return res.status(200).send({message: 'Valid email'});
  } catch (err) {
    return res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
