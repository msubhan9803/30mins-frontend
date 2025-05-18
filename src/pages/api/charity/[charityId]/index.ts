import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from '../../../../utils/graphqlRequestHandler';
import queries from '../../../../constants/GraphQL/Charity/queries';

// eslint-disable-next-line consistent-return
const GetCharityById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const {data} = await graphqlRequestHandler(
        queries.getPublicCharityById,
        {
          documentId: req.query.charityId,
        },
        process.env.BACKEND_API_KEY
      );
      if (data?.data?.getPublicCharityById?.response?.status === 200) {
        res.status(200).json({charityData: data?.data?.getPublicCharityById?.charityData});
      }
    }
  } catch (error) {
    return res.status(400).json({message: error, charityData: null});
  }
};

export default GetCharityById;
