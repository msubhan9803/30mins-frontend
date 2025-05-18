import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import userMutations from '../../../constants/GraphQL/User/mutations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {username} = req.body;

    // Booker Auth Code
    const {data} = await graphqlRequestHandler(
      userMutations.makeUserVerified,
      {username},
      process.env.BACKEND_API_KEY
    );

    res.status(200).send({data: data});
    return;
  } catch (err) {
    res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
