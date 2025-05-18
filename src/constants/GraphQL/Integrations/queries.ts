import {gql} from '@apollo/client';

const getCredentialsByUserId = gql`
  query GetCredentialsByUserId($userId: String!) {
    getCredentialsByUserId(userId: $userId) {
      response {
        message
        status
      }
      officeCredentials {
        _id
        userId
        type
        userEmail
        isPrimary
        allowedProviders
        credentials {
          access_token
          refresh_token
          scope
          expires_in
          ext_expires_in
        }
        _v
      }
      googleCredentials {
        _id
        userId
        type
        userEmail
        isPrimary
        credentials {
          access_token
          refresh_token
          expiry_date
          token_type
          scope
        }
        _v
      }
      zoomCredentials {
        _id
        userId
        type
        userEmail
        isPrimary
        credentials {
          access_token
          refresh_token
          expires_in
          token_type
          scope
        }
      }
    }
  }
`;
const getCredentialsByToken = gql`
  query GetCredentialsByToken($token: String!) {
    getCredentialsByToken(token: $token) {
      response {
        message
        status
      }
      officeCredentials {
        _id
        userId
        type
        userEmail
        isPrimary
        allowedProviders
        credentials {
          access_token
          refresh_token
          scope
          expires_in
          ext_expires_in
        }
        _v
      }
      googleCredentials {
        _id
        userId
        type
        userEmail
        isPrimary
        credentials {
          access_token
          refresh_token
          expiry_date
          token_type
          scope
        }
        _v
      }
      zoomCredentials {
        _id
        userId
        type
        userEmail
        isPrimary
      }
    }
  }
`;

const getCredentialsByEmail = gql`
  query GetCredentialsByEmail($email: String!) {
    getCredentialsByEmail(email: $email) {
      response {
        message
        status
      }
      hasGoogleCredentials
      hasOfficeCredentials
      hasZoomCredentials
    }
  }
`;
const getlastWarningSent = gql`
  query GetlastWarningSent($email: String!) {
    getlastWarningSent(email: $email) {
      sendEmail
      response {
        message
        status
      }
    }
  }
`;

const queries = {
  getCredentialsByUserId,
  getCredentialsByToken,
  getCredentialsByEmail,
  getlastWarningSent,
};

export default queries;
