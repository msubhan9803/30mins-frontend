export interface TData {
  getProductQttWithCompleteDetails: GetProductQttWithCompleteDetails;
}
export interface GetProductQttWithCompleteDetails {
  __typename: string;
  response: Response;
  productQtt: ProductQtt;
}
export interface Response {
  __typename: string;
  message: string;
  status: number;
}
export interface ProductQtt {
  __typename: string;
  _id: string;
  product: Product;
  quantity: string;
  checkout: Checkout;
  checkoutPrice: number;
  refundRequested: boolean;
  refundStatus: string;
  refundReason?: null;
  shippingAddress?: null;
  authCode?: null;
  authCodeUsed: boolean;
}
export interface Product {
  __typename: string;
  _id: string;
  title: string;
  seller: SellerOrBuyer;
  price: number;
  discount: number;
  description: string;
  image: string;
  tags?: string[] | null;
  type: string;
  file: File;
  resText: string;
}
export interface SellerOrBuyer {
  __typename: string;
  _id: string;
  accountDetails: AccountDetails;
  personalDetails: PersonalDetails;
}
export interface AccountDetails {
  __typename: string;
  accountType: string;
  email: string;
  username: string;
}
export interface PersonalDetails {
  __typename: string;
  name: string;
}
export interface File {
  __typename: string;
  name: string;
  link: string;
}
export interface Checkout {
  __typename: string;
  _id: string;
  createdAt: string;
  buyer: SellerOrBuyer;
}
