import {gql} from '@apollo/client';

const bookMeeting = gql`
  mutation BookMeeting($bookingData: BookingDataInput) {
    bookMeeting(bookingData: $bookingData) {
      response {
        message
        status
      }
      bookingId
      providerLanguage
      bookerLanguage
    }
  }
`;

const createPendingMeeting = gql`
  mutation CreatePendingMeeting($bookingData: BookingDataInput) {
    createPendingMeeting(bookingData: $bookingData) {
      response {
        message
        status
      }
      bookingId
      providerLanguage
      bookerLanguage
    }
  }
`;

const confirmMeeting = gql`
  mutation ConfirmMeeting($documentId: String!, $chargeID: String!) {
    confirmMeeting(documentId: $documentId, chargeID: $chargeID) {
      response {
        message
        status
      }
      providerUser {
        _id
        accountDetails {
          username
          email
          stripeAccountId
        }
        personalDetails {
          name
        }
        locationDetails {
          timezone
        }
      }
      serviceData {
        title
        duration
        description
        serviceType
        dueDate
      }
      bookingData {
        _id
        confirmed
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
      }
    }
  }
`;

const updateBookingStatus = gql`
  mutation UpdateBookingStatus($userId: String, $statusUpdateData: StatusUpdateInput) {
    updateBookingStatus(userId: $userId, statusUpdateData: $statusUpdateData) {
      message
      status
    }
  }
`;

const updateCalendarEvents = gql`
  mutation UpdateCalendarEventIds($bookingId: String, $events: CalendarEvents) {
    updateCalendarEventIds(bookingId: $bookingId, events: $events) {
      message
      status
    }
  }
`;

const addStatusAuthCode = gql`
  mutation AddStatusAuthCode($input: StatusAuthCodeInput!) {
    addStatusAuthCode(input: $input) {
      authCode {
        id
        email
        bookingId
        authCode
        availableStatus
        expireAt
        used
      }
      response {
        message
        status
      }
    }
  }
`;

const updateStatusAuthCode = gql`
  mutation UpdateStatusAuthCode($id: String!) {
    updateStatusAuthCode(id: $id) {
      message
      status
    }
  }
`;

const generateBookingOTP = gql`
  mutation GenerateBookingOTP($email: String, $serviceId: String) {
    generateBookingOTP(email: $email, serviceId: $serviceId) {
      status
      message
    }
  }
`;

const resendBookingOTP = gql`
  mutation ResendBookingOTP($email: String, $serviceId: String) {
    resendBookingOTP(email: $email, serviceId: $serviceId) {
      status
      message
    }
  }
`;

const verifyBookingOTP = gql`
  mutation VerifyBookingOTP($email: String, $serviceId: String, $otpToken: String) {
    verifyBookingOTP(email: $email, serviceId: $serviceId, otpToken: $otpToken) {
      status
      message
    }
  }
`;

const rescheduleMeeting = gql`
  mutation RescheduleMeeting(
    $rescheduleMeetingReason: String
    $selectedTime: String
    $meetingId: String
  ) {
    rescheduleMeeting(
      rescheduleMeetingReason: $rescheduleMeetingReason
      selectedTime: $selectedTime
      meetingId: $meetingId
    ) {
      response {
        status
        message
      }
      meetingLink
    }
  }
`;

const requestBookingApprovals = gql`
  mutation RequestBookingApprovals(
    $bookerEmail: String!
    $serviceId: String!
    $providerEmail: String!
    $providerName: String!
    $bookerName: String!
  ) {
    requestBookingApprovals(
      bookerEmail: $bookerEmail
      serviceId: $serviceId
      providerEmail: $providerEmail
      providerName: $providerName
      bookerName: $bookerName
    ) {
      response {
        status
        message
      }
      authcode
    }
  }
`;

const requestBookingAllow = gql`
  mutation RequestBookingAllow($authcode: String!) {
    requestBookingAllow(authcode: $authcode) {
      approved
      providerName
      bookerName
      providerEmail
      bookerEmail
      response {
        status
        message
      }
    }
  }
`;

const requestBookingDeny = gql`
  mutation RequestBookingDeny($authcode: String!) {
    requestBookingDeny(authcode: $authcode) {
      approved
      providerName
      bookerName
      providerEmail
      bookerEmail
      response {
        status
        message
      }
    }
  }
`;

const manualEscrowRelease = gql`
  mutation ManualEscrowRelease($documentId: String!) {
    manualEscrowRelease(documentId: $documentId) {
      status
      message
    }
  }
`;

const mutations = {
  bookMeeting,
  updateBookingStatus,
  createPendingMeeting,
  confirmMeeting,
  updateCalendarEvents,
  addStatusAuthCode,
  updateStatusAuthCode,
  generateBookingOTP,
  resendBookingOTP,
  verifyBookingOTP,
  rescheduleMeeting,
  requestBookingApprovals,
  requestBookingAllow,
  requestBookingDeny,
  manualEscrowRelease,
};

export default mutations;
