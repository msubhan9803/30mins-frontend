import {gql} from '@apollo/client';

const getCharities = gql`
  query GetCharities($token: String!) {
    getCharities(token: $token) {
      response {
        message
        status
      }
      charityData {
        _id
        name
        taxID
        description
        website
      }
    }
  }
`;

const getPublicCharities = gql`
  query GetPublicCharities(
    $pageNumber: Int!
    $resultsPerPage: Int!
    $keywords: String!
    $sortKey: String!
    $sortValue: Int!
  ) {
    getPublicCharities(
      pageNumber: $pageNumber
      resultsPerPage: $resultsPerPage
      keywords: $keywords
      sortKey: $sortKey
      sortValue: $sortValue
    ) {
      charityData {
        _id
        name
        taxID
        description
        website
      }
      charityCount
      response {
        message
        status
      }
    }
  }
`;

const getServiceCharity = gql`
  query getServiceCharity($charityQuery: String!) {
    getServiceCharity(charityQuery: $charityQuery) {
      charities {
        _id
        name
        taxID
        description
        website
      }
      response {
        message
        status
      }
    }
  }
`;

const getCharityById = gql`
  query GetCharityById($token: String!, $documentId: String!) {
    getCharityById(token: $token, documentId: $documentId) {
      response {
        message
        status
      }
      charityData {
        _id
        name
        taxID
        description
        website
      }
    }
  }
`;

const getPublicCharityById = gql`
  query GetPublicCharityById($documentId: String!) {
    getPublicCharityById(documentId: $documentId) {
      response {
        message
        status
      }
      charityData {
        _id
        name
        taxID
        description
        website
      }
    }
  }
`;

const queries = {
  getCharities,
  getCharityById,
  getServiceCharity,
  getPublicCharityById,
  getPublicCharities,
};

export default queries;
