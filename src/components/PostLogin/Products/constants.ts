export type IProduct = {
  _id: string;
  file: any;
  title: string;
  description: string;
  image: string;
  tags: string[];
  price: string;
  discount: string;
};

export type IPropsProductCard = {
  data: IProduct;
  refetch?: () => {};
};

export type IPropsPProductCard = {
  data: IProduct;
  email?: string;
  refetch?: () => {};
};
