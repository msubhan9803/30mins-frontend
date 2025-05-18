/* eslint-disable @typescript-eslint/dot-notation */
import React from 'react';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {getSession} from 'next-auth/react';

import userQueries from 'constants/GraphQL/User/queries';
import eventQueries from 'constants/GraphQL/Event/queries';

import HeadSeo from 'components/shared/HeadSeo/Seo';
import EventPageLayout from 'components/PostLogin/EventPageLayout';

const removeRawString = (str: string) => str.replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/gi, '');

const EventBookingPage = ({providerUser, eventData, bookerUser, eventUpcomingDates}) => (
  <>
    <HeadSeo
      title={eventData.serviceTitle}
      description={removeRawString(eventData.serviceDescription)}
      canonicalUrl={`https://30mins.com/${providerUser.accountDetails.username}/events/${eventData.serviceSlug}`}
      ogTwitterImage={
        providerUser.accountDetails.avatar
          ? providerUser.accountDetails.avatar
          : 'https://30mins.com/assets/30mins-ogimage.jpg'
      }
      ogType={'website'}
    />

    <EventPageLayout
      providerUser={providerUser}
      serviceData={eventData}
      bookerUser={bookerUser}
      eventUpcomingDates={eventUpcomingDates}
    />
  </>
);

export default EventBookingPage;

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

    const {slug} = context.query;
    let eventData = null;
    let eventUpcomingDates = [];

    if (session) {
      const {
        data: {
          data: {getEventBySlug},
        },
      } = await graphqlRequestHandler(
        eventQueries.getEventBySlug,
        {
          slug: slug,
          token: session?.accessToken,
        },
        process.env.BACKEND_API_KEY
      );

      eventData = getEventBySlug?.eventData;
      eventUpcomingDates = getEventBySlug?.eventUpcomingDates ?? [];
    } else {
      const {
        data: {
          data: {getEventBySlugWithoutToken},
        },
      } = await graphqlRequestHandler(
        eventQueries.getEventBySlugWithoutToken,
        {
          slug: slug,
        },
        process.env.BACKEND_API_KEY
      );

      eventData = getEventBySlugWithoutToken?.eventData;
      eventUpcomingDates = getEventBySlugWithoutToken?.eventUpcomingDates ?? [];
    }

    if (!eventData) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        eventData,
        providerUser,
        bookerUser: bookerUser || {},
        eventUpcomingDates,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
