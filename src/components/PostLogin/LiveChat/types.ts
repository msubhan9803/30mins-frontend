export interface IConversation {
  _id: String;
  blocked: Boolean;
  createdAt: String;
  members: Array<MemberType>;
}

export interface MemberType {
  personalDetails: PersonalDetailsType;
  accountDetails: AccountDetailsType;
}

export interface PersonalDetailsType {
  name: String;
}
export interface AccountDetailsType {
  username: String;
  email: String;
  avatar: string;
}
export interface GetConversationQuery {
  getConversationById: GetConversationById;
}
export interface GetConversationById {
  conversation: IConversation;
}
export interface GetConversationVars {
  documentId: String;
}
