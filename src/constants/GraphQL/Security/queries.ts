import {gql} from '@apollo/client';

const getPreApprovedUsers = gql`
  query GetPreApprovedUsers($serviceId: String!, $bookerEmail: String!, $providerEmail: String!) {
    getPreApprovedUsers(
      serviceID: $serviceId
      bookerEmail: $bookerEmail
      providerEmail: $providerEmail
    ) {
      response {
        message
        status
      }
      approved
      dayPassed
      approvalRequested
    }
  }
`;

const queries = {getPreApprovedUsers};

export default queries;
