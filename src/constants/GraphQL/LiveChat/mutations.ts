import {gql} from '@apollo/client';

const createChatMessage = gql`
  mutation CreateChatMessage(
    $senderEmail: String
    $createdAt: String
    $receiverEmail: String
    $message: String
    $conversationId: String
  ) {
    createChatMessage(
      senderEmail: $senderEmail
      createdAt: $createdAt
      receiverEmail: $receiverEmail
      message: $message
      conversationId: $conversationId
    ) {
      messageId
      response {
        message
        status
      }
    }
  }
`;
const notifyTyping = gql`
  mutation NotifyTyping(
    $message: String
    $senderEmail: String
    $receiverEmail: String
    $conversationId: String
  ) {
    notifyTyping(
      message: $message
      senderEmail: $senderEmail
      receiverEmail: $receiverEmail
      conversationId: $conversationId
    ) {
      message
      status
    }
  }
`;
const CreateConversation = gql`
  mutation CreateConversation($membersEmail: [String]) {
    createConversation(membersEmail: $membersEmail) {
      response {
        message
        status
      }
      conversationID
    }
  }
`;
const MarkReadMessageOfConversation = gql`
  mutation MarkReadMessageOfConversation($conversationId: String) {
    markReadMessageOfConversation(conversationId: $conversationId) {
      message
      status
    }
  }
`;

const updateLastSeen = gql`
  mutation UpdateLastSeen {
    updateLastSeen {
      lastSeen
      response {
        message
        status
      }
    }
  }
`;

const blockConversation = gql`
  mutation BlockConversation($documentId: String, $emailBlocker: String) {
    blockConversation(documentId: $documentId, emailBlocker: $emailBlocker) {
      message
      status
    }
  }
`;

const archiveConversation = gql`
  mutation ArchiveConversation($documentId: String, $archivedEmail: String) {
    archiveConversation(documentId: $documentId, archivedEmail: $archivedEmail) {
      message
      status
    }
  }
`;

const deleteConversation = gql`
  mutation DeleteConversation($documentId: String) {
    deleteConversation(documentId: $documentId) {
      message
      status
    }
  }
`;
const hideConversation = gql`
  mutation HideConversation($documentId: String, $hideEmail: String) {
    hideConversation(documentId: $documentId, hideEmail: $hideEmail) {
      message
      status
    }
  }
`;

const mutations = {
  createChatMessage,
  notifyTyping,
  CreateConversation,
  MarkReadMessageOfConversation,
  updateLastSeen,
  blockConversation,
  archiveConversation,
  deleteConversation,
  hideConversation,
};

export default mutations;
