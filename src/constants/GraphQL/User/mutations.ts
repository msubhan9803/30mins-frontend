import {gql} from '@apollo/client';

const updateUserWelcome = gql`
  mutation UpdateUserWelcome($token: String!, $userData: WelcomeInput) {
    updateUserWelcome(token: $token, userData: $userData) {
      message
      status
    }
  }
`;

const updateUser = gql`
  mutation UpdateUser($token: String!, $userData: UserInput) {
    updateUser(token: $token, userData: $userData) {
      message
      status
    }
  }
`;

const updatePaymentMethods = gql`
  mutation UpdatePaymentMethods($direct: [String], $escrow: [String]) {
    updatePaymentMethods(direct: $direct, escrow: $escrow) {
      message
      status
    }
  }
`;

const adminUpdateUser = gql`
  mutation AdminUpdateUser($userData: AdminUserInput, $token: String!, $documentId: String!) {
    adminUpdateUser(userData: $userData, token: $token, documentId: $documentId) {
      message
      status
    }
  }
`;

const backendUpdateUser = gql`
  mutation BackendUpdateUser($userData: AdminUserInput, $email: String!) {
    backendUpdateUser(userData: $userData, email: $email) {
      message
      status
    }
  }
`;

const updateWorkingHours = gql`
  mutation UpdateWorkingHours($token: String!, $workingHours: WorkingHoursInput!) {
    updateWorkingHours(token: $token, workingHours: $workingHours) {
      message
      status
    }
  }
`;

const deleteUser = gql`
  mutation DeleteUser($token: String!) {
    deleteUser(token: $token) {
      message
      status
    }
  }
`;

const adminDeleteUser = gql`
  mutation AdminDeleteUser($token: String!, $documentId: String!) {
    adminDeleteUser(token: $token, documentId: $documentId) {
      message
      status
    }
  }
`;

const adminDeleteUsers = gql`
  mutation AdminDeleteUsers($userIDs: [String]!) {
    adminDeleteUsers(userIDs: $userIDs) {
      response {
        message
        status
      }
      userIDs
    }
  }
`;

const generateInviteLink = gql`
  mutation generateInviteLink($token: String!, $inviteeEmail: String!, $inviteeName: String!) {
    generateInviteLink(token: $token, inviteeEmail: $inviteeEmail, inviteeName: $inviteeName) {
      message
      status
    }
  }
`;

const handleEmailChange = gql`
  mutation HandleEmailChange($email: String!) {
    handleEmailChange(email: $email) {
      status
      message
    }
  }
`;
const marketerCreateUser = gql`
  mutation MarketerCreateUser($userData: UserInput) {
    marketerCreateUser(userData: $userData) {
      status
      message
    }
  }
`;

const marketerDeleteUser = gql`
  mutation MarketerDeleteUser($userEmail: String!) {
    marketerDeleteUser(userEmail: $userEmail) {
      status
      message
    }
  }
`;

const makeAffiliateUser = gql`
  mutation MakeAffiliateUser($affiliateTeam: String!, $username: String!) {
    makeAffiliateUser(affiliateTeam: $affiliateTeam, username: $username) {
      message
      status
    }
  }
`;

const makeUserVerified = gql`
  mutation MakeUserVerified($username: String!) {
    makeUserVerified(username: $username) {
      message
      status
    }
  }
`;

const resetWelcomeProcess = gql`
  mutation ResetWelcomeProcess($username: String!) {
    resetWelcomeProcess(username: $username) {
      message
      status
    }
  }
`;

const sendSmsOtp = gql`
  mutation SendSmsOtp($phone: String!) {
    sendSmsOtp(phone: $phone) {
      message
      status
    }
  }
`;

const validateSmsOtp = gql`
  mutation ValidateSmsOtp($phone: String!, $otpToken: String!, $forProviderExtension: Boolean!) {
    validateSmsOtp(
      phone: $phone
      otpToken: $otpToken
      forProviderExtension: $forProviderExtension
    ) {
      message
      status
    }
  }
`;

const mutations = {
  updateUserWelcome,
  resetWelcomeProcess,
  updateUser,
  adminUpdateUser,
  backendUpdateUser,
  updateWorkingHours,
  deleteUser,
  adminDeleteUser,
  adminDeleteUsers,
  generateInviteLink,
  handleEmailChange,
  marketerCreateUser,
  marketerDeleteUser,
  makeAffiliateUser,
  makeUserVerified,
  sendSmsOtp,
  validateSmsOtp,
  updatePaymentMethods,
};

export default mutations;
