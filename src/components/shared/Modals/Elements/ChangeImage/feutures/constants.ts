export type IValues = {
  imgSrc: string;
  aspect: number;
  maxSize?: number;
  upLoadImage(file: any): Promise<void>;
};
