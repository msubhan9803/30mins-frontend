import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import queries from 'constants/GraphQL/Organizations/queries';
import OrgMemberSearch from 'components/PostLogin/Organizations/Tabs/OrgMemberSearch-org';
import HeadSeo from 'components/shared/HeadSeo/Seo';

type IProps = {
  organization: any;
  tags?: string;
};

const OrganizationMembers = ({organization}: IProps) => {
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
        <OrgMemberSearch
          organizationDetails={organizationDetails}
          isManagement={false}
          userRole={null}
        />
      </div>
    </div>
  );
};
export default OrganizationMembers;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
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
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
