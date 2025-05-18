export interface Data {
  getCurrentCartItems: GetCurrentCartItems;
}
export interface GetCurrentCartItems {
  response: Response;
  cart?: CartEntity[] | null;
}
export interface Response {
  message: string;
  status: number;
}
export interface CartEntity {
  seller: Seller;
  productQtts?: ProductQttsEntity[] | null;
}
export interface Seller {
  _id: string;
  accountDetails: AccountDetails;
}
export interface AccountDetails {
  username: string;
  email: string;
  avatar?: null;
  stripeAccountId?: null;
}
export interface ProductQttsEntity {
  _id: string;
  checkoutPrice?: null;
  quantity: string;
  checkout?: null;
  product: Product;
}
export interface Product {
  _id: string;
  seller: Seller1;
  description: string;
  discount: number;
  image: string;
  price: number;
  title: string;
  tags?: null[] | null;
}
export interface Seller1 {
  _id: string;
}
