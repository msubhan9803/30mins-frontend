export type IPost = {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
};

export type IPropsPostCard = {
  data: IPost;
  session?: any;
  showMenus: boolean;
  handleRefetch?: () => void;
};
