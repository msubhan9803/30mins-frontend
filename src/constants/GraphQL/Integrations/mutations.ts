import {gql} from '@apollo/client';

export const addGoogleCalendar = gql`
  mutation AddGoogleCalendar($credentials: GoogleCredentialsInput!, $email: String!) {
    addGoogleCalendar(credentials: $credentials, email: $email) {
      message
      status
    }
  }
`;

export const deleteGoogleCalendar = gql`
  mutation DeleteGoogleCalendar($token: String!, $email: String!) {
    deleteGoogleCalendar(token: $token, email: $email) {
      message
      status
    }
  }
`;

export const addOffice365Calendar = gql`
  mutation AddOffice365Calendar(
    $credentials: OfficeCredentialsInput!
    $email: String!
    $allowedProviders: [String]!
  ) {
    addOffice365Calendar(
      credentials: $credentials
      email: $email
      allowedProviders: $allowedProviders
    ) {
      message
      status
    }
  }
`;

export const deleteOffice365Calendar = gql`
  mutation DeleteOffice365Calendar($token: String!, $email: String!) {
    deleteOffice365Calendar(token: $token, email: $email) {
      message
      status
    }
  }
`;

export const addZoomCredentials = gql`
  mutation AddZoomCredentials(
    $credentials: ZoomCredentialsInput!
    $email: String!
    $allowedProviders: [String]!
    $credentialIdentifier: String!
  ) {
    addZoomCredentials(
      credentials: $credentials
      email: $email
      allowedProviders: $allowedProviders
      credentialIdentifier: $credentialIdentifier
    ) {
      message
      status
    }
  }
`;

export const deleteZoomCredentials = gql`
  mutation DeleteZoomCredentials($token: String!, $email: String!) {
    deleteZoomCredentials(token: $token, email: $email) {
      message
      status
    }
  }
`;

export const deleteZoomCredentialsWebhook = gql`
  mutation DeleteZoomCredentialsWebhook($credentialIdentifier: String!) {
    deleteZoomCredentialsWebhook(credentialIdentifier: $credentialIdentifier) {
      message
      status
    }
  }
`;

export const updateZoomRefreshToken = gql`
  mutation UpdateZoomRefreshToken($refreshToken: String!, $userId: String!) {
    updateZoomRefreshToken(refreshToken: $refreshToken, userId: $userId) {
      message
      status
    }
  }
`;

export const updateOfficeRefreshToken = gql`
  mutation UpdateOfficeRefreshToken($refreshToken: String!, $credentialId: String!) {
    updateOfficeRefreshToken(refreshToken: $refreshToken, credentialId: $credentialId) {
      message
      status
    }
  }
`;

export const updateGoogleRefreshToken = gql`
  mutation UpdateGoogleRefreshToken($refreshToken: String!, $credentialId: String!) {
    updateGoogleRefreshToken(refreshToken: $refreshToken, credentialId: $credentialId) {
      message
      status
    }
  }
`;

export const toggleCredentialById = gql`
  mutation toggleCredentialById($credentialId: String!, $token: String!) {
    toggleCredentialById(credentialId: $credentialId, token: $token) {
      message
      status
    }
  }
`;

const mutations = {
  addGoogleCalendar,
  addOffice365Calendar,
  deleteOffice365Calendar,
  deleteGoogleCalendar,
  addZoomCredentials,
  deleteZoomCredentials,
  deleteZoomCredentialsWebhook,
  updateZoomRefreshToken,
  toggleCredentialById,
};

export default mutations;
