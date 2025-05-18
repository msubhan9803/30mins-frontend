import {gql} from '@apollo/client';

const getEventSlug = gql`
  query GetEventSlug($token: String!, $slug: String!) {
    getEventSlug(slug: $slug, token: $token) {
      eventSlugCheck
      response {
        message
        status
      }
    }
  }
`;

const getEventsByUser = gql`
  query getEventsByUser($token: String) {
    getEventsByUser(token: $token) {
      eventsData {
        _id
        serviceType
        serviceTitle
        serviceDuration
        serviceAttendeeLimit
        serviceSlug
        serviceDateTime
        serviceRecurring
        serviceDescription
        isPublic
        serviceAttendeesMessage
        searchTags
        serviceQuestions
        serviceQuestionsList {
          options
          question
          questionType
          required
        }
        eventStatus
        serviceImage
        serviceMedia {
          type
          link
        }
        otpProtected
        authenticationType
      }
      response {
        message
        status
      }
    }
  }
`;

const getEventById = gql`
  query GetEventById($token: String!, $documentId: String!) {
    getEventById(token: $token, documentId: $documentId) {
      eventData {
        _id
        serviceType
        serviceTitle
        serviceDuration
        serviceAttendeeLimit
        serviceSlug
        serviceDateTime
        serviceRecurring
        serviceDescription
        isPublic
        serviceAttendeesMessage
        searchTags
        serviceQuestions
        serviceQuestionsList {
          questionType
          required
          question
          options
        }
        eventStatus
        serviceImage
        serviceMedia {
          type
          link
        }
        otpProtected
        authenticationType
      }
      response {
        message
        status
      }
    }
  }
`;

const getEventsByUserId = gql`
  query GetEventsByUserId($userId: String) {
    getEventsByUserId(userId: $userId) {
      eventsData {
        _id
        serviceType
        serviceTitle
        serviceDuration
        serviceAttendeeLimit
        serviceSlug
        serviceDateTime
        serviceRecurring
        serviceDescription
        isPublic
        serviceAttendeesMessage
        searchTags
        serviceQuestions
        serviceQuestionsList {
          questionType
          required
          question
          options
        }
        eventStatus
        serviceImage
        serviceMedia {
          type
          link
        }
        otpProtected
        authenticationType
      }
      response {
        message
        status
      }
    }
  }
`;

const getEventBySlug = gql`
  query GetEventBySlug($slug: String!, $token: String!) {
    getEventBySlug(slug: $slug, token: $token) {
      eventData {
        _id
        serviceType
        serviceTitle
        serviceDuration
        serviceAttendeeLimit
        serviceAttendeeCount
        serviceSlug
        serviceDateTime
        serviceRecurring
        serviceDescription
        isPublic
        serviceAttendeesMessage
        searchTags
        serviceQuestions
        serviceQuestionsList {
          questionType
          required
          question
          options
        }
        eventStatus
        serviceImage
        serviceMedia {
          type
          link
        }
        otpProtected
        authenticationType
      }
      response {
        message
        status
      }
      eventUpcomingDates {
        attendeeCount
        eventDateTime
        isAttending
      }
    }
  }
`;

const getEventBySlugWithoutToken = gql`
  query GetEventBySlugWithoutToken($slug: String!) {
    getEventBySlugWithoutToken(slug: $slug) {
      eventData {
        _id
        serviceType
        serviceTitle
        serviceDuration
        serviceAttendeeLimit
        serviceAttendeeCount
        serviceSlug
        serviceDateTime
        serviceRecurring
        serviceDescription
        isPublic
        serviceAttendeesMessage
        searchTags
        serviceQuestions
        serviceQuestionsList {
          questionType
          required
          question
          options
        }
        eventStatus
        serviceImage
        serviceMedia {
          type
          link
        }
        otpProtected
        authenticationType
      }
      response {
        message
        status
      }
      eventUpcomingDates {
        attendeeCount
        eventDateTime
        isAttending
      }
    }
  }
`;

const getEventsForAttendeeOrOrganizer = gql`
  query GetEventsForAttendeeOrOrganizer($searchParams: EventsSearchParams, $token: String) {
    getEventsForAttendeeOrOrganizer(searchParams: $searchParams, token: $token) {
      eventsData {
        _id
        serviceType
        serviceTitle
        serviceDuration
        serviceAttendeeLimit
        serviceAttendeeCount
        serviceSlug
        serviceDateTime
        serviceRecurring
        serviceDescription
        isPublic
        serviceAttendeesMessage
        searchTags
        serviceQuestions
        serviceQuestionsList {
          questionType
          required
          question
          options
        }
        eventStatus
        serviceImage
        serviceMedia {
          type
          link
        }
        otpProtected
        authenticationType
        userId {
          _id
          accountDetails {
            username
          }
          personalDetails {
            name
          }
        }
        attendingDateTime
        createdAt
        registeredDateTime
      }
      response {
        message
        status
      }
      totalRecords
    }
  }
`;

const getAllAttendeesByEventId = gql`
  query GetAllAttendeesByEventId($eventId: String) {
    getAllAttendeesByEventId(eventId: $eventId) {
      attendees {
        answeredQuestions {
          questionType
          question
          answer
          selectedOptions
        }
        registeredDateTime
        attendingDateTime
        attendeeStatus
        eventId {
          serviceTitle
        }
        attendeeId {
          personalDetails {
            name
          }
          accountDetails {
            email
          }
        }
      }
      eventData {
        serviceTitle
      }
      response {
        message
        status
      }
    }
  }
`;

const queries = {
  getEventSlug,
  getEventsByUser,
  getEventById,
  getEventsByUserId,
  getEventBySlug,
  getEventBySlugWithoutToken,
  getEventsForAttendeeOrOrganizer,
  getAllAttendeesByEventId,
};

export default queries;
