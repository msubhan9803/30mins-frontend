import {gql} from '@apollo/client';

const createEvent = gql`
  mutation CreateEvent($token: String!, $eventData: EventInput) {
    createEvent(token: $token, eventData: $eventData) {
      message
      status
    }
  }
`;

const editEvent = gql`
  mutation EditEvent($documentId: String!, $token: String!, $eventData: EventEditInput) {
    editEvent(documentId: $documentId, token: $token, eventData: $eventData) {
      message
      status
    }
  }
`;

const cancelEvent = gql`
  mutation CancelEvent($documentId: String!, $token: String!) {
    cancelEvent(documentId: $documentId, token: $token) {
      message
      status
    }
  }
`;

const addAttendee = gql`
  mutation AddAttendee($attendeeData: addAttendeeInput) {
    addAttendee(attendeeData: $attendeeData) {
      message
      status
    }
  }
`;

const cancelAttendeeEvent = gql`
  mutation CancelAttendeeEvent($eventId: String, $token: String) {
    cancelAttendeeEvent(eventId: $eventId, token: $token) {
      message
      status
    }
  }
`;

const rescheduleEvent = gql`
  mutation RescheduleEvent($documentId: String!, $token: String!, $newEventDateTime: String!) {
    rescheduleEvent(documentId: $documentId, token: $token, newEventDateTime: $newEventDateTime) {
      message
      status
    }
  }
`;

const mutations = {
  createEvent,
  editEvent,
  cancelEvent,
  addAttendee,
  cancelAttendeeEvent,
  rescheduleEvent,
};

export default mutations;
