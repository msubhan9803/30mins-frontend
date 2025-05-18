import {gql} from '@apollo/client';

const createProduct = gql`
  mutation CreateProduct($token: String!, $productData: ProductInput) {
    createProduct(token: $token, productData: $productData) {
      message
      status
    }
  }
`;

const editProduct = gql`
  mutation EditProduct($documentId: String!, $token: String!, $productData: ProductInput) {
    editProduct(documentId: $documentId, token: $token, productData: $productData) {
      message
      status
    }
  }
`;

const deleteProduct = gql`
  mutation DeleteProduct($documentId: String!, $token: String!) {
    deleteProduct(documentId: $documentId, token: $token) {
      message
      status
    }
  }
`;

const addCart = gql`
  mutation AddCart($productId: String!, $quantity: Int!, $token: String!) {
    addCart(productId: $productId, quantity: $quantity, token: $token) {
      message
      status
    }
  }
`;
const deleteCart = gql`
  mutation DeleteCart($productQttId: String!, $token: String!) {
    deleteCart(productQttId: $productQttId, token: $token) {
      message
      status
    }
  }
`;

const checkout = gql`
  mutation Checkout($token: String!) {
    checkout(token: $token) {
      response {
        message
        status
      }
      checkoutId
    }
  }
`;

const productQttUpdateStatus = gql`
  mutation ProductQttUpdateStatus(
    $token: String
    $productQttId: String
    $authCode: String
    $action: ProductQttRefundTypeEnum
    $refundReason: String
  ) {
    productQttUpdateStatus(
      token: $token
      productQttId: $productQttId
      authCode: $authCode
      action: $action
      refundReason: $refundReason
    ) {
      message
      status
    }
  }
`;

const mutations = {
  createProduct,
  editProduct,
  deleteProduct,
  addCart,
  deleteCart,
  checkout,
  productQttUpdateStatus,
};

export default mutations;
