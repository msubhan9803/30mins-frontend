import PostLoginLayout from '@components/layout/post-login';
import {GetServerSideProps} from 'next';
import {getSession, useSession} from 'next-auth/react';
import TableWrapper from '../../components/PostLogin/Payouts/TableWrapper';
import graphqlRequestHandler from '../../utils/graphqlRequestHandler';
import queries from '../../constants/GraphQL/User/queries';

const PayoutsView = () => {
  const {data: session} = useSession();

  return (
    <PostLoginLayout>
      <TableWrapper session={session} />
    </PostLoginLayout>
  );
};

export default PayoutsView;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  const router = context.resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router}`,
        permanent: false,
      },
    };
  }
  const {data: userData} = await graphqlRequestHandler(
    queries.getUserById,
    {
      token: session?.accessToken,
    },
    session?.accessToken
  );

  const isAuthorized = ['admin', 'payoutOperator'].includes(
    userData?.data?.getUserById?.userData?.accountDetails?.accountType
  );

  if (!isAuthorized) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
