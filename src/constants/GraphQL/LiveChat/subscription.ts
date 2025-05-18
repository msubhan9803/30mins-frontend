import {gql} from '@apollo/client';

const newMessage = gql`
  subscription Subscription {
    newMessage {
      _id
      senderEmail
      receiverEmail
      message
      avatar
      blocked
      username
      createdAt
      unreadMessageCount
      conversationId
    }
  }
`;
const startedTyping = gql`
  subscription StartedTyping {
    startedTyping {
      senderEmail
      receiverEmail
      conversationId
      message
    }
  }
`;

const subscription = {newMessage, startedTyping};

export default subscription;
