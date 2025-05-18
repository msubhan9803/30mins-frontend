import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
// import mutations from '../../../constants/GraphQL/User/mutations';
// import domainQueries from '../../../constants/GraphQL/BlockedDomain/queries';
import mutations from 'constants/GraphQL/MutualAuth/mutations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {authCode, method} = req.query;

    const data = await graphqlRequestHandler(
      mutations.updateMutualAuths,
      {
        actoin: method,
        authCode: authCode,
      },
      process.env.BACKEND_API_KEY
    );
    return res
      .status(200)
      .redirect(
        `/Home/?message=${data?.data?.data?.updateMutualAuths?.response?.message}&status=200&operation=UpdateMutualAuth&success=1`
      );
  } catch (err) {
    return res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
