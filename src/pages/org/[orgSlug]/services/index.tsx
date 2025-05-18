import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import queries from 'constants/GraphQL/Organizations/queries';
import OrgServiceSearch from 'components/PostLogin/Organizations/Tabs/OrgServiceSearch-org';
import HeadSeo from 'components/shared/HeadSeo/Seo';

type IProps = {
  organization: any;
  tags?: string;
};

const OrganizationPublicPage = ({organization, tags}: IProps) => {
  const organizationDetails = organization?.data?.getOrganizationBySlug?.organizationData;
  return (
    <div className='w-full h-full'>
      <HeadSeo
        title={organizationDetails?.title}
        description={organizationDetails?.description}
        canonicalUrl={`https://30mins.com/org/${organizationDetails?.title}/`}
        ogTwitterImage={
          organizationDetails?.image
            ? organizationDetails?.image
            : 'https://30mins.com/assets/30mins-ogimage.jpg'
        }
        ogType={'website'}
      />
      <div className='container px-1 h-full mx-auto items-start lg:items-center justify-between gap-4'>
        <OrgServiceSearch organizationDetails={organizationDetails} tags={tags} />
      </div>
    </div>
  );
};
export default OrganizationPublicPage;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const {tags} = context.query;
    const {data: organization} = await graphqlRequestHandler(
      queries.getOrganizationBySlug,
      {
        slug: context.query.orgSlug,
      },
      process.env.BACKEND_API_KEY
    );
    const {status} = organization.data.getOrganizationBySlug.response;

    if (status === 500) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        organization,
        tags: tags || null,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
