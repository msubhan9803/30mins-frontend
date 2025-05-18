import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/Organizations/queries';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {data: userData} = await graphqlRequestHandler(
      queries.getOrganizationMemberResults,
      {
        documentId: req.body.documentId,
        searchParams: {
          keywords: req.body.keywords,
          pageNumber: req.body.pageNumber,
          resultsPerPage: req.body.resultsPerPage,
        },
      },
      process.env.BACKEND_API_KEY
    );
    return res.status(200).send({message: 'Query Successful', userData});
  } catch (err) {
    return res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
