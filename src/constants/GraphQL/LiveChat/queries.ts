import {gql} from '@apollo/client';

const GetAllConversations = gql`
  query GetAllConversations($paginationArgs: PaginationArgs) {
    getAllConversations(paginationArgs: $paginationArgs) {
      conversations {
        _id
        members {
          accountDetails {
            email
            username
            avatar
          }
          personalDetails {
            name
          }
        }
        createdAt
        unreadMessageCount
        hidden
        archived
        blocked
      }
      response {
        message
        status
      }
    }
  }
`;

const getConversationById = gql`
  query Conversation($documentId: String) {
    getConversationById(documentId: $documentId) {
      conversation {
        _id
        members {
          accountDetails {
            email
            username
            avatar
          }
          personalDetails {
            name
          }
        }
        createdAt
      }
    }
  }
`;

const getAllMsgsByConversationId = gql`
  query GetAllMsgsByConversationId($conversationId: String!, $paginationArgs: PaginationArgs) {
    getAllMsgsByConversationId(conversationId: $conversationId, paginationArgs: $paginationArgs) {
      messages {
        senderEmail
        receiverEmail
        message
        conversationId
        createdAt
        _id
      }
    }
  }
`;
const GetTotalUnreadMsgs = gql`
  query GetTotalUnreadMsgs {
    getTotalUnreadMsgs {
      unreadMessageCount
      response {
        message
        status
      }
    }
  }
`;
const getLastSeen = gql`
  query GetLastSeenOfUser($email: String) {
    getLastSeenOfUser(email: $email) {
      lastSeen
      online
      accountDetails {
        username
        email
      }
    }
  }
`;

const queries = {
  GetAllConversations,
  getConversationById,
  getAllMsgsByConversationId,
  GetTotalUnreadMsgs,
  getLastSeen,
};

export default queries;
