import {FormikErrors} from 'formik';

export type Member = {
  accountDetails: {
    email: string;
    username: string;
    avatar: string;
  };
  personalDetails: {
    name: string;
  };
};

export type IConv = {
  _id: string;
  members: [Member];
  createdAt: string;
  unreadMessageCount: number;
  hidden: any;
  typing: boolean;
  online?: boolean;
  archived: [string];
  blocked: [string];
  removed: [string];
};

export type IOptions = {
  archive: [boolean, number];
  blocked: [boolean, number];
  inbox: [boolean, number];
};

export type InitConv = {
  TextFileter: string;
  Convs?: Array<IConv>;
  conversationId?: string;
  options: IOptions;
  NewMessage: any;
  AllMessages?: Array<any>;
};

export type IsetValue = (
  field: string,
  value: any,
  shouldValidate?: boolean | undefined
) => Promise<void> | Promise<FormikErrors<InitConv>>;

export const initConv: InitConv = {
  TextFileter: '',
  Convs: undefined,
  conversationId: undefined,
  options: {archive: [false, 0], blocked: [false, 0], inbox: [true, 0]},
  NewMessage: undefined,
  AllMessages: undefined,
};
