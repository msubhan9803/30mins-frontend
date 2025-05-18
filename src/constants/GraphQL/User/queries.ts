import {gql} from '@apollo/client';

const getUserById = gql`
  query GetUserById($token: String!) {
    getUserById(token: $token) {
      response {
        message
        status
      }
      test
      userData {
        _id
        forTesting
        isMarketer
        welcomeComplete
        otpToken
        orgMemberships
        services
        publications
        educationHistory
        jobHistory
        bookedMeetings
        couponCode
        bankDetails {
          bankName
          bankAddress
          accountNumber
          typeAccount
          categoryAccount
          currencyAccount
          SWIFTBIC
        }
        wireDetails {
          nameOnBank
          phoneOfBank
          addressOfBank
          country
        }
        accountDetails {
          profileBackground
          verifiedEmail
          credentialIDs
          privateAccount
          acceptedPaymentTypes
          isIndividual
          verifiedAccount
          accountType
          createdDate
          avatar
          password
          email
          username
          allowedConferenceTypes
          activeExtensions
          activeExtensionIDs
          stripeAccountId
          paypalId
          payoneerId
          upiId
          paymentAccounts {
            direct
            escrow
          }
          smsSettings {
            phone
            reminders
          }
        }
        workingHours {
          startTime
          endTime
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
        personalDetails {
          name
          description
          headline
          language
          phone
          website
          socials {
            facebook
            linkedin
            instagram
            twitter
            youtube
          }
          searchTags
          profileMediaLink
          profileMediaType
        }
        locationDetails {
          country
          timezone
          zipCode
          latitude
          longitude
        }
        billingDetails {
          customerId
          fname
          lname
          address
          buildingNumber
          city
          zipCode
          country
        }
      }
    }
  }
`;

const getUserDashboardData = gql`
  query GetUserDashboardData($token: String!) {
    getUserDashboardData(token: $token) {
      response {
        message
        status
      }
      hasPaidService
      orgSignups {
        count
        organizationTitle
      }
      totalRevenueData {
        _id
        totalRevenue
      }
    }
  }
`;

const getUserForAdmin = gql`
  query GetUserForAdmin($token: String!, $documentId: String!) {
    getUserForAdmin(token: $token, documentId: $documentId) {
      response {
        message
        status
      }
      userData {
        _id
        forTesting
        welcomeComplete
        otpToken
        orgMemberships
        services
        publications
        educationHistory
        jobHistory
        bookedMeetings
        couponCode
        accountDetails {
          profileBackground
          verifiedEmail
          credentialIDs
          privateAccount
          acceptedPaymentTypes
          isIndividual
          verifiedAccount
          accountType
          createdDate
          avatar
          password
          email
          username
          allowedConferenceTypes
          activeExtensions
          activeExtensionIDs
          paymentAccounts {
            direct
            escrow
          }
        }
        workingHours {
          startTime
          endTime
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
        personalDetails {
          name
          description
          headline
          phone
          website
          socials {
            facebook
            linkedin
            instagram
            twitter
            youtube
          }
          searchTags
          profileMediaLink
          profileMediaType
        }
        locationDetails {
          country
          timezone
          zipCode
          latitude
          longitude
        }
        billingDetails {
          customerId
          fname
          lname
          address
          buildingNumber
          city
          zipCode
          country
        }
      }
    }
  }
`;

const getUserByUsername = gql`
  query GetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
      response {
        message
        status
      }
      userData {
        _id
        couponCode
        accountDetails {
          username
          email
          acceptedPaymentTypes
          allowedConferenceTypes
          credentialIDs
          activeExtensions
          paymentAccounts {
            direct
            escrow
          }
        }
        locationDetails {
          timezone
        }
      }
    }
  }
`;
const getUserByCode = gql`
  query GetUserByCode($code: String!) {
    getUserByCode(code: $code) {
      response {
        message
        status
      }
      emailHint
      hasAccount
    }
  }
`;

const getSentJoinInvites = gql`
  query GetSentJoinInvites($token: String!) {
    getSentJoinInvites(token: $token) {
      response {
        message
        status
      }
      pendingInvites {
        _id
        inviteeEmail
      }
    }
  }
`;

const getUserSearchResults = gql`
  query GetUserSearchResults($userSearchParams: UserSearchParams) {
    getUserSearchResults(userSearchParams: $userSearchParams) {
      response {
        message
        status
      }
      userCount
      userData {
        couponCode
        accountDetails {
          username
          email
          avatar
          isIndividual
          accountType
          verifiedAccount
          verifiedEmail
          acceptedPaymentTypes
          allowedConferenceTypes
          activeExtensions
          paymentAccounts {
            direct
            escrow
          }
        }
        personalDetails {
          name
          headline
          description
          socials {
            twitter
            instagram
            linkedin
            facebook
            youtube
          }
        }
        locationDetails {
          country
        }
      }
    }
  }
`;
const getUsersForAdmin = gql`
  query GetUsersForAdmin($token: String!, $userSearchParams: AdminUserSearchParams) {
    getUsersForAdmin(token: $token, userSearchParams: $userSearchParams) {
      response {
        message
        status
      }
      userCount
      userData {
        couponCode
        _id
        forTesting
        welcomeComplete
        lastSeen
        personalDetails {
          name
          description
          headline
          phone
          website
          socials {
            twitter
            instagram
            linkedin
            facebook
            youtube
          }
          searchTags
          profileMediaLink
          profileMediaType
        }
        locationDetails {
          country
          timezone
          zipCode
        }
        billingDetails {
          customerId
          fname
          lname
          address
          buildingNumber
          city
          zipCode
          country
        }
        accountDetails {
          username
          email
          avatar
          isIndividual
          accountType
          verifiedAccount
          verifiedEmail
          privateAccount
          acceptedPaymentTypes
          allowedConferenceTypes
          credentialIDs
          createdDate
          activeExtensions
          activeExtensionIDs
          paymentAccounts {
            direct
            escrow
          }
        }
      }
    }
  }
`;

const getPublicUserData = gql`
  query GetPublicUserData($username: String!) {
    getPublicUserData(username: $username) {
      response {
        message
        status
      }
      userData {
        couponCode
        welcomeComplete
        lastWarningSent
        accountDetails {
          username
          email
          avatar
          createdDate
          isIndividual
          accountType
          verifiedAccount
          verifiedEmail
          privateAccount
          acceptedPaymentTypes
          allowedConferenceTypes
          activeExtensions
          paymentAccounts {
            direct
            escrow
          }
          stripeAccountId
          paypalId
          payoneerId
          upiId
          smsSettings {
            phone
            reminders
          }
        }
        workingHours {
          startTime
          endTime
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
        personalDetails {
          name
          description
          headline
          phone
          website
          socials {
            twitter
            instagram
            linkedin
            facebook
            youtube
          }
          searchTags
          profileMediaLink
          profileMediaType
        }
        publications {
          headline
          url
          type
          image
          description
        }
        jobHistory {
          position
          startDate
          company
          current
          endDate
          roleDescription
          employmentType
          location
        }
        educationHistory {
          degree
          school
          startDate
          endDate
          current
          graduated
          additionalInfo
          extracurricular
          fieldOfStudy
        }
        locationDetails {
          timezone
          country
        }
        services {
          _id
          serviceType
          title
          image
          slug
          description
          duration
          isPrivate
          price
          dueDate
          currency
          charity
          charityId
          percentDonated
          recurringInterval
          conferenceType
          otpProtected
          authenticationType
          media {
            type
            link
          }
          bookingQuestions {
            options
            question
            questionType
            required
          }
          searchTags
          paymentType
          isPaid
          hasReminder
          isRecurring
          attendeeLimit
          whiteList {
            domains
            emails
          }
          blackList {
            domains
            emails
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
  }
`;

const getUsersWithAdvertisingExtension = gql`
  query getUsersWithAdvertisingExtension {
    getUsersWithAdvertisingExtension {
      response {
        message
        status
      }
      userData {
        personalDetails {
          name
        }
        accountDetails {
          username
        }
      }
    }
  }
`;

const getUserAndOrganizationSearchResults = gql`
  query GetUserAndOrganizationSearchResults($searchParams: UserSearchParams) {
    getUserAndOrganizationSearchResults(searchParams: $searchParams) {
      response {
        message
        status
      }
      userData {
        couponCode
        accountDetails {
          username
          email
          avatar
          isIndividual
          accountType
          verifiedAccount
          verifiedEmail
          acceptedPaymentTypes
          allowedConferenceTypes
          activeExtensions
        }
        personalDetails {
          name
          headline
          description
          socials {
            twitter
            instagram
            linkedin
            facebook
            youtube
          }
        }
        locationDetails {
          country
        }
      }
      userCount
      organizationCount
      organizationData {
        _id
        title
        slug
        headline
        description
        image
        website
        supportEmail
        supportPhone
        location
        socials {
          twitter
          instagram
          linkedin
          facebook
          youtube
        }
        verified
        searchTags
        serviceCategories
        media {
          type
          link
        }
        isPrivate
      }
      serviceCount
      serviceData {
        _id
        organizationName
        image
        serviceType
        isOrgService
        organizationId {
          _id
          slug
          title
          image
        }
        orgServiceCategory
        title
        slug
        duration
        description
        price
        currency
        conferenceType
        isPaid
        serviceType
        userId {
          _id
          accountDetails {
            username
            avatar
            email
          }
          personalDetails {
            name
            headline
          }
        }
      }
      eventData {
        _id
        userId {
          _id
          accountDetails {
            username
            email
            avatar
          }
          personalDetails {
            name
            headline
          }
        }
        serviceType
        serviceTitle
        serviceDuration
        serviceAttendeeLimit
        serviceAttendeeCount
        serviceSlug
        serviceDateTime
        serviceRecurring
        serviceDescription
        isPublic
        serviceAttendeesMessage
        searchTags
        serviceQuestions
        serviceQuestionsList {
          questionType
          required
          question
          options
        }
        eventStatus
        serviceImage
        serviceMedia {
          type
          link
        }
        otpProtected
        authenticationType
        createdAt
        attendingDateTime
        registeredDateTime
      }
      eventsCount
    }
  }
`;

const getUsersForSeo = gql`
  query GetUsersForSeo($resultsPerBatch: Int!, $batchNumber: Int!) {
    getUsersForSeo(resultsPerBatch: $resultsPerBatch, batchNumber: $batchNumber) {
      response {
        message
        status
      }
      userCount
      userData {
        accountDetails {
          avatar
          username
        }
        personalDetails {
          description
        }
      }
    }
  }
`;

const getUserForStartConversation = gql`
  query GetUserForStartConversation($keyword: String) {
    getUserForStartConversation(keyword: $keyword) {
      response {
        message
        status
      }
      userData {
        accountDetails {
          username
          email
          avatar
        }
        personalDetails {
          name
        }
      }
    }
  }
`;

const getResultsForMarketer = gql`
  query GetResultsForMarketer($searchParams: MarketerSearchParams) {
    getResultsForMarketer(searchParams: $searchParams) {
      response {
        message
        status
      }
      returnDataCount
      returnOrgData {
        _id
        createdAt
        createdBy {
          accountDetails {
            username
          }
        }
        title
        slug
        headline
        description
        image
        website
        supportEmail
        supportPhone
        location
        socials {
          twitter
          instagram
          linkedin
          facebook
          youtube
        }
        verified
        searchTags
        serviceCategories
        media {
          type
          link
        }
        isPrivate
      }
      returnUserData {
        welcomeComplete
        couponCode
        createdAt
        createdBy {
          accountDetails {
            username
          }
        }
        accountDetails {
          username
          email
          avatar
          isIndividual
          accountType
          verifiedAccount
          verifiedEmail
          acceptedPaymentTypes
          allowedConferenceTypes
          activeExtensions
        }
        personalDetails {
          name
          headline
          description
          socials {
            twitter
            instagram
            linkedin
            facebook
            youtube
          }
        }
        locationDetails {
          country
        }
      }
    }
  }
`;
const getUserCount = gql`
  query GetUsersCount($token: String!) {
    getUsersCount(token: $token) {
      response {
        message
        status
      }
      usercount
      welcomeData
    }
  }
`;
const getOrganizationCounts = gql`
  query GetOrganizationCounts($token: String!) {
    getOrganizationCounts(token: $token) {
      response {
        status
        message
      }
      OrganizationCount
    }
  }
`;

const getServiceCount = gql`
  query GetServiceCount($token: String!) {
    getServiceCount(token: $token) {
      response {
        status
        message
      }
      serviceFreeCount
      servicePaidCount
    }
  }
`;

const getExtension = gql`
  query GetExtensionsCounts($token: String!) {
    getExtensionsCounts(token: $token) {
      extensionCount
    }
  }
`;

const checkVerifiedStatus = gql`
  query CheckVerifiedStatus($email: String) {
    checkVerifiedStatus(email: $email) {
      message
      status
    }
  }
`;

const getPaymentOptionsData = gql`
  query GetPaymentOptionsData($token: String!) {
    getPaymentOptionsData(token: $token) {
      escrowServices
      directServices
      response {
        message
        status
      }
    }
  }
`;

const queries = {
  getUserById,
  getUserDashboardData,
  getUserByUsername,
  getPublicUserData,
  getUserSearchResults,
  getUsersForAdmin,
  getUserForAdmin,
  getUserByCode,
  getSentJoinInvites,
  getUsersWithAdvertisingExtension,
  getUserAndOrganizationSearchResults,
  getUsersForSeo,
  getUserForStartConversation,
  getResultsForMarketer,
  getUserCount,
  getOrganizationCounts,
  getServiceCount,
  getExtension,
  checkVerifiedStatus,
  getPaymentOptionsData,
};

export default queries;
