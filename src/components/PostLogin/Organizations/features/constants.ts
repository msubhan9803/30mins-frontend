export interface IProps {
  __typename: string;
  _id: string;
  userId: string;
  role: string;
  organizationId: OrganizationId;
  refetch?: () => {};
  OriginUserId?: undefined;
}
export interface OrganizationId {
  __typename: string;
  _id: string;
  title: string;
  headline: string;
  restrictionLevel: string;
  slug: string;
  description: string;
  image: string;
  website: string;
  supportEmail: string;
  supportPhone: string;
  location: string;
  socials: Socials;
  verified?: null;
  searchTags?: string[] | null;
  serviceCategories?: string[] | null;
  media: Media;
  isPrivate: boolean;
  services?: string[] | null;
  members?: string[] | null;
}
export interface Socials {
  __typename: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  facebook: string;
  youtube: string;
}
export interface Media {
  __typename: string;
  type: string;
  link: string;
}
