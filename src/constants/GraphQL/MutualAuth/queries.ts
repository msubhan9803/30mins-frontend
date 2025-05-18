import {gql} from '@apollo/client';

const getMutualAuthList = gql`
  query GetMutualAuthList(
    $token: String!
    $actoin: AuthQueriesActoins!
    $searchParams: MutualAuthSearchParams!
  ) {
    getMutualAuthList(token: $token, actoin: $actoin, SearchParams: $searchParams) {
      response {
        message
        status
      }
      userCount
      Data {
        _id
        name
        email
        username
        lastSeen
        avatar
      }
    }
  }
`;

const queries = {
  getMutualAuthList,
};

export default queries;
