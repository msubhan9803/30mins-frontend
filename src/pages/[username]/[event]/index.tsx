/* eslint-disable @typescript-eslint/dot-notation */
import React from 'react';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import ServiceLayout from 'components/PostLogin/ServicePageLayout';
import userQueries from 'constants/GraphQL/User/queries';
import {getSession} from 'next-auth/react';

const BookingPage = ({providerUser, serviceData, bookerUser}) => (
  <>
    <HeadSeo
      title={serviceData.title}
      description={serviceData.description}
      canonicalUrl={`https://30mins.com/${providerUser.accountDetails.username}/${serviceData.title}`}
      ogTwitterImage={
        providerUser.accountDetails.avatar
          ? providerUser.accountDetails.avatar
          : 'https://30mins.com/assets/30mins-ogimage.jpg'
      }
      ogType={'website'}
    />
    <ServiceLayout providerUser={providerUser} serviceData={serviceData} bookerUser={bookerUser} />
  </>
);

export default BookingPage;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
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

    const {data: ProviderUser} = await graphqlRequestHandler(
      userQueries.getPublicUserData,
      {
        username: context.query.username,
      },
      process.env.BACKEND_API_KEY
    );
    const {status} = ProviderUser.data;
    if (status === 404) {
      return {
        notFound: true,
      };
    }
    const providerUser = ProviderUser?.data?.getPublicUserData?.userData;
    const services = ProviderUser?.data?.getPublicUserData?.userData?.services;
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

    serviceData.conferenceType = serviceData.conferenceType.filter(type =>
      providerUser.accountDetails.allowedConferenceTypes.includes(type)
    );

    return {
      props: {
        serviceData,
        providerUser,
        bookerUser: bookerUser || {},
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
