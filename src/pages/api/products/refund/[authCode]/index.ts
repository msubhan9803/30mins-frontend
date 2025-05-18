/* eslint-disable consistent-return */
import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import productsMutations from 'constants/GraphQL/Products/mutations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      return res.status(400).json({
        success: false,
        message: 'This endpoint only accepts POST requests!',
      });
    }

    const {authCode} = req.query;

    const queryRes = await graphqlRequestHandler(
      productsMutations.productQttUpdateStatus,
      {
        token: null,
        productQttId: null,
        action: 'PENDING_ACTION',
        authCode,
      },
      process.env.BACKEND_API_KEY
    );

    if (queryRes.data.data.productQttUpdateStatus.status === 200) {
      res.redirect(
        `/Home?message=RequestForRefundSent&status=${queryRes.data.data.productQttUpdateStatus.status}&success=1`
      );
    }

    if (
      queryRes.data.data.productQttUpdateStatus.status === 400 ||
      queryRes.data.data.productQttUpdateStatus.status === 500
    ) {
      res.redirect(
        `/Home?message=CannotRequestForRefund&status=${queryRes.data.data.productQttUpdateStatus.status}&success=0`
      );
    }
  } catch (error) {
    return res.status(400).json({message: error});
  }
};

export default handler;
