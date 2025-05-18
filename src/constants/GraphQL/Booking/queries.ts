import {gql} from '@apollo/client';

const getBookings = gql`
  query GetBookings($token: String!, $searchParams: BookingSearchParams) {
    getBookings(token: $token, searchParams: $searchParams) {
      bookingCount
      response {
        message
        status
      }
      bookingData {
        _id
        serviceID
        serviceType
        provider
        booker
        dateBooked
        meetingCount
        bookerEmail
        bookerName
        providerEmail
        providerName
        bookerPhone
        bookerTimeZone
        ccRecipients
        additionalNotes
        price
        currency
        paymentType
        paymentAccount
        paymentStatus
        meetingDate
        percentDonated
        charity
        title
        subject
        conferenceType
        startTime
        endTime
        meetingDuration
        createdAt
        status {
          clientConfirmed
          clientCanceled
          providerConfirmed
          providerCanceled
          providerDeclined
          __typename
          refundRequested
          refunded
          hasOpenReport
          reportReason
          postMeetingNotes
          postMeetingFeedback
          refundRequestReason
          paymentReleased
        }
        answeredQuestions {
          questionType
          question
          answer
          selectedOptions
        }
      }
    }
  }
`;

const getAllUpComingBookings = gql`
  query GetAllUpComingBookings($token: String!, $searchParams: BookingSearchParamsAllUpComing) {
    getAllUpComingBookings(token: $token, searchParams: $searchParams) {
      bookingCount
      response {
        message
        status
      }
      bookingData {
        _id
        serviceID
        serviceType
        provider
        booker
        dateBooked
        meetingCount
        bookerEmail
        bookerName
        providerEmail
        providerName
        bookerPhone
        bookerTimeZone
        ccRecipients
        additionalNotes
        price
        currency
        paymentType
        paymentAccount
        paymentStatus
        meetingDate
        percentDonated
        charity
        title
        subject
        conferenceType
        startTime
        endTime
        meetingDuration
        createdAt
        status {
          clientConfirmed
          clientCanceled
          providerConfirmed
          providerCanceled
          providerDeclined
          __typename
          refundRequested
          refunded
          hasOpenReport
          reportReason
          postMeetingNotes
          postMeetingFeedback
          refundRequestReason
          paymentReleased
        }
        answeredQuestions {
          questionType
          question
          answer
          selectedOptions
        }
      }
    }
  }
`;

const getBookingById = gql`
  query GetBookingById($token: String, $documentId: String!) {
    getBookingById(token: $token, documentId: $documentId) {
      response {
        message
        status
      }
      bookingData {
        _id
        serviceID
        serviceType
        provider
        booker
        dateBooked
        meetingCount
        providerEmail
        providerName
        bookerEmail
        bookerName
        bookerPhone
        bookerTimeZone
        ccRecipients
        additionalNotes
        price
        currency
        paymentType
        paymentAccount
        paymentStatus
        meetingDate
        percentDonated
        charity
        title
        subject
        conferenceType
        startTime
        endTime
        meetingDuration
        status {
          clientConfirmed
          clientCanceled
          providerConfirmed
          providerCanceled
          providerDeclined
          refunded
          refundRequested
          refundRequestReason
          hasOpenReport
          postMeetingNotes
          postMeetingFeedback
          reportReason
          paymentReleased
        }
        googleCalendarEvent {
          googleCalender
          googleCalendarEventId
        }
        officeCalendarEvent {
          office365Calendar
          office365CalendarEventId
        }
        answeredQuestions {
          questionType
          question
          answer
          selectedOptions
        }
      }
    }
  }
`;

const getBookingsForAdmin = gql`
  query GetBookingsForAdmin($token: String!, $searchParams: AdminBookingParams) {
    getBookingsForAdmin(token: $token, searchParams: $searchParams) {
      response {
        message
        status
      }
      bookingCount
      bookingData {
        _id
        serviceID
        serviceType
        provider
        booker
        dateBooked
        meetingCount
        bookerName
        bookerEmail
        providerName
        providerEmail
        bookerPhone
        bookerTimeZone
        ccRecipients
        additionalNotes
        price
        currency
        paymentType
        paymentAccount
        paymentStatus
        meetingDate
        percentDonated
        charity
        title
        subject
        conferenceType
        startTime
        endTime
        meetingDuration
      }
    }
  }
`;

const checkEmailFilter = gql`
  query CheckEmailFilter($serviceId: String!, $providerId: String!, $bookerEmail: String!) {
    checkEmailFilter(serviceID: $serviceId, providerID: $providerId, bookerEmail: $bookerEmail) {
      message
      status
    }
  }
`;

const getAvailability = gql`
  query GetAvailability($serviceId: String!, $daySelected: String!, $bookerTimezone: String!) {
    getAvailability(
      serviceID: $serviceId
      daySelected: $daySelected
      bookerTimezone: $bookerTimezone
    ) {
      availableSlots
      response {
        message
        status
      }
    }
  }
`;

const getWeekdayAvailability = gql`
  query GetWeekdayAvailability($serviceId: String!, $bookerTimezone: String!) {
    getWeekdayAvailability(serviceID: $serviceId, bookerTimezone: $bookerTimezone) {
      availableWeekdays
      response {
        message
        status
      }
    }
  }
`;
const getRRAvailablities = gql`
  query GetRRAvailability($serviceId: String!, $daySelected: String!, $bookerTimezone: String!) {
    getRRAvailability(
      serviceID: $serviceId
      daySelected: $daySelected
      bookerTimezone: $bookerTimezone
    ) {
      teamsAvailability {
        availability

        priority
        user {
          accountDetails {
            username
            email
            stripeAccountId
            smsSettings {
              phone
              reminders
            }
          }
          personalDetails {
            name
          }
        }
      }
      collectiveAvailability
      response {
        message
        status
      }
    }
  }
`;

const checkRecurringAvailibility = gql`
  query CheckRecurringAvailability(
    $providerUsername: String!
    $initialBookingDateTime: String!
    $meetingCount: Int!
  ) {
    checkRecurringAvailability(
      providerUsername: $providerUsername
      initialBookingDateTime: $initialBookingDateTime
      meetingCount: $meetingCount
    ) {
      isAvailable
      availabilities
      response {
        message
        status
      }
    }
  }
`;

const getStatusAuthCode = gql`
  query GetStatusAuthCode($bookingId: String, $email: String, $authCode: String) {
    getStatusAuthCode(bookingId: $bookingId, email: $email, authCode: $authCode) {
      response {
        message
        status
      }
      statusAuthCode {
        id
        email
        bookingId
        authCode
        availableStatus
        expireAt
        used
      }
    }
  }
`;

const getPendingPayouts = gql`
  query GetPendingPayouts($token: String!, $searchParams: PendingPayoutSearchParams) {
    getPendingPayouts(token: $token, searchParams: $searchParams) {
      payoutCount
      response {
        message
        status
      }
      payoutData {
        _id
        providerEmail
        providerPayoutMethod {
          payoutId
          payoutType
        }
        amountToRelease
        bookerEmail
        bookingId
        dateReleased
        status
      }
    }
  }
`;

const queries = {
  getBookings,
  getBookingById,
  getBookingsForAdmin,
  getAllUpComingBookings,
  checkEmailFilter,
  getAvailability,
  getWeekdayAvailability,
  getRRAvailablities,
  checkRecurringAvailibility,
  getStatusAuthCode,
  getPendingPayouts,
};

export default queries;
