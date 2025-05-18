import {gql} from '@apollo/client';

const getPostById = gql`
  query GetPostById($documentId: String!, $token: String!) {
    getPostById(documentId: $documentId, token: $token) {
      response {
        message
        status
      }
      postData {
        _id
        title
        image
        description
        tags
      }
    }
  }
`;

const getPostsByUserToken = gql`
  query GetPostsByUserToken($token: String!, $offset: Int, $limit: Int) {
    getPostsByUserToken(token: $token, offset: $offset, limit: $limit) {
      response {
        message
        status
      }
      postData {
        _id
        title
        image
        description
        tags
        createdAt
      }
      recordsTotalCount
    }
  }
`;

const getPostsByUserId = gql`
  query GetPostsByUserId($userId: String!, $offset: Int, $limit: Int) {
    getPostsByUserId(userId: $userId, offset: $offset, limit: $limit) {
      response {
        message
        status
      }
      postData {
        _id
        title
        image
        description
        tags
        createdAt
      }
      recordsTotalCount
    }
  }
`;

const queries = {
  getPostById,
  getPostsByUserToken,
  getPostsByUserId,
};

export default queries;
