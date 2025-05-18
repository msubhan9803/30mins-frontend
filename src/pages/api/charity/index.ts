import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from '../../../utils/graphqlRequestHandler';
import queries from '../../../constants/GraphQL/Charity/queries';

// eslint-disable-next-line consistent-return
const GetCharities = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const {data} = await graphqlRequestHandler(
        queries.getPublicCharities,
        {
          pageNumber: Number(req.query.pageNumber),
          resultsPerPage: Number(req.query.resultsPerPage),
          keywords: req.query.keywords,
          sortKey: req.query.sortKey,
          sortValue: Number(req.query.sortValue),
        },
        process.env.BACKEND_API_KEY
      );
      if (data?.data?.getPublicCharities?.response?.status === 200) {
        res.status(200).json({
          charityData: data?.data?.getPublicCharities?.charityData,
          charityCount: data?.data?.getPublicCharities?.charityCount,
        });
      }
    }
  } catch (error) {
    return res.status(400).json({message: error, charityData: null});
  }
};

export default GetCharities;
