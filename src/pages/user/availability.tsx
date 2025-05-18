import Availability from 'components/PostLogin/AvailabilityPage/AvailabilityPage';
import {useSession} from 'next-auth/react';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import AvailabilityQueries from 'constants/GraphQL/CollectiveAvailability/queries';
import ExtensionQuery from 'constants/GraphQL/ActiveExtension/queries';
import ProductIDs from 'constants/stripeProductIDs';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';

const AvailabilityPage = ({integrations, isExtensionActivate}) => {
  const {data: session} = useSession();
  const {t} = useTranslation();

  const crumbs = [{title: t('page:Home'), href: '/'}];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Collective Availability')} />
      <Head>
        <title> {t('page:Collective Availability')}</title>
      </Head>
      <Availability
        session={session}
        integrations={integrations}
        isExtensionActivate={isExtensionActivate}
      />
    </PostLoginLayout>
  );
};
export default AvailabilityPage;
AvailabilityPage.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  const router = context.resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router}`,
        permanent: false,
      },
    };
  }

  const {data: integrations} = await graphqlRequestHandler(
    AvailabilityQueries.getAllGroups,
    {},
    session?.accessToken
  );

  const {data: isExtensionActivate} = await graphqlRequestHandler(
    ExtensionQuery.checkExtensionStatus,
    {
      productId: ProductIDs.EXTENSIONS.COLLECTIVE_AVAILABILITY,
    },
    session?.accessToken
  );

  return {
    props: {
      integrations,
      isExtensionActivate: isExtensionActivate?.data?.checkExtensionStatus?.isActive,
    },
  };
};
