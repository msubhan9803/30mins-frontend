import React from 'react';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/Organizations/queries';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import ServiceLayout from 'components/PostLogin/ServicePageLayout';
import {getSession} from 'next-auth/react';
import userQueries from '../../../../constants/GraphQL/User/queries';

const BookingPage = ({orgData, serviceData, bookerUser}) => (
  <>
    <HeadSeo
      title={serviceData.title}
      description={serviceData.description}
      canonicalUrl={`https://30mins.com/${orgData.slug}/${serviceData.title}`}
      ogTwitterImage={
        orgData.image ? orgData.image : 'https://30mins.com/assets/30mins-ogimage.jpg'
      }
      ogType={'website'}
    />
    <ServiceLayout providerUser={orgData} serviceData={serviceData} bookerUser={bookerUser} />
  </>
);

export default BookingPage;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  let bookerUser;
  if (session) {
    const {data: bookerUserData} = await graphqlRequestHandler(
      userQueries.getUserById,
      {
        token: session?.accessToken,
      },
      session?.accessToken
    );

    bookerUser = bookerUserData.data.getUserById.userData;
  }

  const {data: userData} = await graphqlRequestHandler(
    queries.getOrganizationBySlug,
    {
      slug: context.query.orgSlug,
    },
    process.env.BACKEND_API_KEY
  );

  const {status} = userData.data;

  if (status === 404) {
    return {
      notFound: true,
    };
  }
  const orgData = userData?.data?.getOrganizationBySlug?.organizationData;
  const services = userData?.data?.getOrganizationBySlug?.organizationData?.services;
  let eventTitle: String;
  if (context?.query?.event) {
    const eventQuery = context.query.event.toString();
    eventTitle = eventQuery.toLowerCase();
  }
  const serviceData = services?.find(serv => serv.slug.toLowerCase() === eventTitle);
  if (!serviceData) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      serviceData,
      orgData,
      bookerUser: bookerUser || {},
    },
  };
};
