export type TypeMutualAuthList =
  | 'searchUnauthorizedUser'
  | 'getAuthorizedUser'
  | 'getPendingInvites'
  | 'getPendingRequest';

export type PSendRequest = {
  actoin: 'CONNECT' | 'ACCEPT' | 'DECLINE' | 'CANCEL' | 'REMOVEACCESS' | 'SENDREQUEST';
  email: string;
  name?: string;
};
