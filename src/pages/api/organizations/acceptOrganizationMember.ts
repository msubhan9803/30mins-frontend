import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import mutation from 'constants/GraphQL/Organizations/mutations';
import {getSession} from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req: req});
  if (!session) {
    res.redirect(307, `/auth/login/`);
    return;
  }
  try {
    const {
      // orgID,
      requestID,
    } = req.query;
    const {data} = await graphqlRequestHandler(
      mutation.acceptPendingJoinRequest,
      {
        pendingRequestId: requestID,
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );
    const {status} = data?.data?.acceptPendingJoinRequest || {
      status: 200,
    };
    if (status === 200) {
      res.redirect(
        `/Home/?message=member_has_been_added_successfully&status=200&operation=AcceptPendingJoinRequest&success=1`
      );
    } else {
      res.redirect(
        `/Home/?message=no_pending_request_exists_for_this_user&status=${status}&operation=AcceptPendingJoinRequest&success=0`
      );
    }
  } catch (err) {
    // res.redirect(
    //   307,
    //   `/user/organizations/edit/${req.query.orgID}/?tab=pending+join+requests&error=Error+Accepting+Join+Request`
    // );
  }
};

export default handler;
