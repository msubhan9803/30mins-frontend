import {gql} from '@apollo/client';

const getServiceById = gql`
  query GetServiceById($documentId: String!, $token: String!) {
    getServiceById(documentId: $documentId, token: $token) {
      response {
        message
        status
      }
      serviceData {
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
    }
  }
`;

const getServicesByUserId = gql`
  query GetServicesByUserId($token: String!) {
    getServicesByUserId(token: $token) {
      response {
        message
        status
      }
      serviceData {
        _id
        serviceType
        title
        slug
        image
        description
        duration
        isPrivate
        price
        currency
        percentDonated
        charity
        reminders
        orgServiceCategory
        organizationName
        recurringInterval
        conferenceType
        authenticationType
        isRecurring
        searchTags
        isOrgService
        media {
          type
          link
        }
        paymentType
        isPaid
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
        attendeeLimit
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
    }
  }
`;

const getServicesForAdmin = gql`
  query GetServicesForAdmin($token: String!, $serviceSearchParams: AdminServiceSearchParams) {
    getServicesForAdmin(token: $token, serviceSearchParams: $serviceSearchParams) {
      response {
        status
        message
      }
      serviceCount
      serviceData {
        userId {
          personalDetails {
            name
          }
          accountDetails {
            username
          }
        }
        organizationName
        serviceType
        title
        image
        slug
        duration
        price
        currency
      }
    }
  }
`;

const getServicesForSeo = gql`
  query GetServicesForSeo($resultsPerBatch: Int!, $batchNumber: Int!) {
    getServicesForSeo(resultsPerBatch: $resultsPerBatch, batchNumber: $batchNumber) {
      serviceData {
        title
        slug
        description
        userId {
          accountDetails {
            username
          }
        }
      }
      serviceCount
      response {
        message
        status
      }
    }
  }
`;

const getServiceSlug = gql`
  query GetServiceSlug($token: String!, $slug: String!) {
    getServiceSlug(token: $token, slug: $slug) {
      serviceSlugCheck
      response {
        message
        status
      }
    }
  }
`;

const getServiceCharity = gql`
  query GetServiceCharity($charityQuery: String!) {
    getServiceCharity(charityQuery: $charityQuery) {
      charities {
        name
        _id
      }
      response {
        message
        status
      }
    }
  }
`;

const queries = {
  getServiceById,
  getServicesByUserId,
  getServicesForAdmin,
  getServicesForSeo,
  getServiceSlug,
  getServiceCharity,
};

export default queries;
