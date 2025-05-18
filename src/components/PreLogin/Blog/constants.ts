type IAuthor = {
  node: {
    name: string;
    avatar: {
      url: string;
    };
  };
};

type ICategory = {
  nodes: [
    {
      name: string;
    }
  ];
};

export type IBlog = {
  featuredImage: any;
  title: string;
  content: string;
  slug: string;
  author?: IAuthor;
  date?: string;
  categories?: ICategory;
};

export type IPropsBlogCard = {
  data: IBlog;
};
