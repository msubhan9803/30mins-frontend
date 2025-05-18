import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/Security/queries';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {bookerEmail, providerEmail, serviceId} = req.body;

    const data = await graphqlRequestHandler(
      queries.getPreApprovedUsers,
      {bookerEmail, providerEmail, serviceId},
      process.env.BACKEND_API_KEY
    );

    const getPreApprovedUsers = {
      approved: data?.data?.data?.getPreApprovedUsers?.approved,
      dayPassed: data?.data?.data?.getPreApprovedUsers?.dayPassed,
      approvalRequested: data?.data?.data?.getPreApprovedUsers?.approvalRequested,
    };
    res.status(200).send({getPreApprovedUsers: getPreApprovedUsers});
  } catch (err) {
    res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
