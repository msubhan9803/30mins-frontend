import {gql} from '@apollo/client';

const createPost = gql`
  mutation CreatePost($token: String!, $postData: PostInput) {
    createPost(token: $token, postData: $postData) {
      message
      status
    }
  }
`;

const editPost = gql`
  mutation EditPost($documentId: String!, $token: String!, $postData: PostInput) {
    editPost(documentId: $documentId, token: $token, postData: $postData) {
      message
      status
    }
  }
`;

const deletePost = gql`
  mutation DeletePost($documentId: String!, $token: String!) {
    deletePost(documentId: $documentId, token: $token) {
      message
      status
    }
  }
`;

const mutations = {createPost, editPost, deletePost};

export default mutations;
