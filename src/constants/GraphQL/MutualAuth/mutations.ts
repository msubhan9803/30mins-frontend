import {gql} from '@apollo/client';

const updateMutualAuths = gql`
  mutation UpdateMutualAuths(
    $token: String
    $ownerEmail: String
    $actoin: authsActoins
    $authCode: String
    $origin: String
  ) {
    updateMutualAuths(
      token: $token
      ownerEmail: $ownerEmail
      actoin: $actoin
      AuthCode: $authCode
      origin: $origin
    ) {
      authCode {
        authCode
      }
      response {
        message
        status
      }
      token
      Data {
        guests {
          _id
          name
          email
          username
          lastSeen
          avatar
        }
      }
    }
  }
`;

const mutations = {
  updateMutualAuths,
};

export default mutations;
