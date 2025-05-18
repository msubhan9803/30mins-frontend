import {gql} from '@apollo/client';

const getProductsByUserId = gql`
  query GetProductsByUserId($token: String!) {
    getProductsByUserId(token: $token) {
      response {
        message
        status
      }
      products {
        _id
        title
        seller {
          _id
        }
        price
        discount
        description
        image
        tags
      }
    }
  }
`;

const getProductDownloadUrl = gql`
  query GetProductDownloadUrl($token: String!, $productId: String!) {
    getProductDownloadUrl(token: $token, productId: $productId) {
      response {
        message
        status
      }
      downloadUrl
    }
  }
`;

const getProductById = gql`
  query GetProductById($documentId: String!, $token: String!) {
    getProductById(documentId: $documentId, token: $token) {
      response {
        message
        status
      }
      product {
        _id
        title
        seller {
          _id
        }
        price
        discount
        description
        image
        tags
        type
        file {
          name
          link
        }
        resText
        service {
          _id
          title
          serviceType
        }
        serviceMessage
      }
    }
  }
`;

const getProductDownloadSuccessData = gql`
  query GetProductDownloadSuccessData($documentId: String!) {
    getProductDownloadSuccessData(documentId: $documentId) {
      response {
        message
        status
      }
      product {
        _id
        title
        seller {
          _id
          accountDetails {
            username
            email
            avatar
            verifiedAccount
            verifiedEmail
          }
          personalDetails {
            description
            headline
            name
            socials {
              facebook
              instagram
              linkedin
              twitter
              youtube
            }
            website
          }
        }
        price
        discount
        description
        image
        tags
        type
        file {
          name
          link
        }
        resText
        serviceMessage
        service {
          description
          charity
          conferenceType
          title
          charityId
          currency
          duration
          media {
            link
            type
          }
          isPaid
          isPrivate
          percentDonated
          price
          serviceType
          slug
        }
      }
    }
  }
`;

const getPublicProductsData = gql`
  query GetPublicProductData($username: String!) {
    getPublicProductsData(username: $username) {
      response {
        message
      }
      products {
        _id
        title
        seller {
          _id
        }
        price
        discount
        description
        image
        tags
        type
        resText
        serviceMessage
        service {
          _id
          serviceType
          title
          slug
          image
          description
          duration
          isPrivate
          orgServiceCategory
          organizationName
          organizationId
          price
          dueDate
          currency
          percentDonated
          charity
          charityId
          reminders
          recurringInterval
          conferenceType
          searchTags
          paymentType
          isRecurring
          isPaid
          authenticationType
          isOrgService
          media {
            type
            link
          }
          attendeeLimit
          blackList {
            emails
            domains
          }
          whiteList {
            emails
            domains
          }
          bookingQuestions {
            questionType
            required
            question
            options
          }
          serviceWorkingHours {
            isCustomEnabled
            monday {
              availability {
                start
                end
              }
              isActive
            }
            tuesday {
              availability {
                start
                end
              }
              isActive
            }
            wednesday {
              availability {
                start
                end
              }
              isActive
            }
            thursday {
              availability {
                start
                end
              }
              isActive
            }
            friday {
              availability {
                start
                end
              }
              isActive
            }
            saturday {
              availability {
                start
                end
              }
              isActive
            }
            sunday {
              availability {
                start
                end
              }
              isActive
            }
          }
        }
        file {
          link
          name
        }
      }
    }
  }
`;

const getCurrentCartItems = gql`
  query GetCurrentCartItems($token: String!) {
    getCurrentCartItems(token: $token) {
      response {
        message
        status
      }
      cart {
        seller {
          _id
          accountDetails {
            username
            email
            avatar
            stripeAccountId
          }
        }
        productQtts {
          _id
          checkoutPrice
          quantity
          checkout {
            _id
            createdAt
            updatedAt
          }
          product {
            _id
            seller {
              _id
            }
            file {
              name
              link
            }
            resText
            description
            discount
            image
            price
            title
            tags
          }
        }
      }
    }
  }
`;

const getProductQttById = gql`
  query GetProductQttById($token: String!, $documentId: String) {
    getProductQttById(token: $token, documentId: $documentId) {
      response {
        status
        message
      }
      productQtt {
        _id
        checkoutPrice
        product {
          _id
          description
          discount
          price
          image
          tags
          title
        }
        checkout {
          _id
        }
        quantity
      }
    }
  }
`;

const getCountItemsAndSubtotal = gql`
  query GetCountItemsAndSubtotal($token: String!) {
    getCountItemsAndSubtotal(token: $token) {
      response {
        message
        status
      }
      items {
        price
        productId
        productQttId
        quantity
      }
    }
  }
`;

const getAllCommandedProduct = gql`
  query GetAllCommandedProduct($token: String!) {
    getAllCommandedProduct(token: $token) {
      response {
        message
        status
      }
      productQtt {
        _id
        checkout {
          _id
        }
        checkoutPrice
        product {
          _id
          description
          discount
          image
          price
          tags
          title
        }
        quantity
        refundStatus
      }
    }
  }
`;

const getProductQttWithCompleteDetails = gql`
  query GetProductQttWithCompleteDetails($token: String!, $documentId: String!) {
    getProductQttWithCompleteDetails(token: $token, documentId: $documentId) {
      response {
        message
        status
      }
      productQtt {
        _id
        product {
          _id
          title
          seller {
            _id
            accountDetails {
              accountType
              email
              username
            }
            personalDetails {
              name
            }
          }
          price
          discount
          description
          image
          tags
          serviceMessage
          service {
            _id
            serviceType
            title
            slug
            image
            description
            duration
            isPrivate
            orgServiceCategory
            organizationName
            organizationId
            price
            dueDate
            currency
            percentDonated
            charity
            charityId
            reminders
            recurringInterval
            conferenceType
            searchTags
            paymentType
            isRecurring
            isPaid
            authenticationType
            isOrgService
            media {
              type
              link
            }
            attendeeLimit
            blackList {
              emails
              domains
            }
            whiteList {
              emails
              domains
            }
            bookingQuestions {
              questionType
              required
              question
              options
            }
            serviceWorkingHours {
              isCustomEnabled
              monday {
                availability {
                  start
                  end
                }
                isActive
              }
              tuesday {
                availability {
                  start
                  end
                }
                isActive
              }
              wednesday {
                availability {
                  start
                  end
                }
                isActive
              }
              thursday {
                availability {
                  start
                  end
                }
                isActive
              }
              friday {
                availability {
                  start
                  end
                }
                isActive
              }
              saturday {
                availability {
                  start
                  end
                }
                isActive
              }
              sunday {
                availability {
                  start
                  end
                }
                isActive
              }
            }
          }
          type
          file {
            name
            link
          }
          resText
        }
        quantity
        checkout {
          _id
          createdAt
          buyer {
            _id
            accountDetails {
              accountType
              email
              username
            }
            personalDetails {
              name
            }
          }
        }
        checkoutPrice
        refundRequested
        refundStatus
        refundReason
        shippingAddress
        authCode
        authCodeUsed
      }
    }
  }
`;
const getAllCompletedCheckout = gql`
  query GetAllCompletedCheckout($token: String!) {
    getAllCompletedCheckout(token: $token) {
      response {
        message
        status
      }
      checkouts {
        seller {
          accountDetails {
            username
            email
            avatar
          }
          personalDetails {
            name
            description
            headline
            phone
          }
        }
        checkout {
          _id
          createdAt
          updatedAt
          buyer {
            _id
          }
        }
        total
        countOfItems
      }
    }
  }
`;

const getCompletedCheckoutId = gql`
  query GetCompletedCheckoutId($checkoutId: String!, $token: String!) {
    getCompletedCheckoutId(checkoutID: $checkoutId, token: $token) {
      response {
        message
        status
      }
      checkout {
        _id
        buyer {
          _id
        }
        createdAt
      }
      productQtt {
        _id
        checkoutPrice
        refundRequested
        refundStatus
        refundReason
        shippingAddress
        authCode
        authCodeUsed
        product {
          _id
          description
          discount
          tags
          title
          image
          price
          service {
            slug
            serviceType
          }
          serviceMessage
          seller {
            _id
            accountDetails {
              avatar
              email
              username
              verifiedEmail
              verifiedAccount
            }
            personalDetails {
              description
              name
              phone
              headline
              socials {
                youtube
                twitter
                linkedin
                instagram
                facebook
              }
            }
          }
          resText
          file {
            name
            link
          }
        }
        quantity
        checkoutPrice
      }
    }
  }
`;

const queries = {
  getProductsByUserId,
  getProductById,
  getPublicProductsData,
  getCurrentCartItems,
  getProductQttById,
  getCountItemsAndSubtotal,
  getAllCommandedProduct,
  getAllCompletedCheckout,
  getCompletedCheckoutId,
  getProductQttWithCompleteDetails,
  getProductDownloadSuccessData,
  getProductDownloadUrl,
};

export default queries;
