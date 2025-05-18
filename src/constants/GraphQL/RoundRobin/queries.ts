import {gql} from '@apollo/client';

const GetRoundRobinTeamsByOrganizationId = gql`
  query GetRoundRobinTeamsByOrganizationId($organizationId: String!) {
    getRoundRobinTeamsByOrganizationId(organizationId: $organizationId) {
      roundRobinTeams {
        _id
        name
        organizationId
        teamMembers {
          memberId {
            personalDetails {
              description
              name
              headline
            }
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
            }
          }
          priority
        }
      }
      response {
        message
        status
      }
    }
  }
`;

const GetOrgRoundRobinServices = gql`
  query GetOrgRoundRobinServices($organizationId: String) {
    getOrgRoundRobinServices(organizationId: $organizationId) {
      roundRobinServices {
        _id
        image
        userId {
          accountDetails {
            email
            username
          }
          couponCode
          personalDetails {
            name
            headline
            description
          }
        }
        organizationId {
          slug
          title
          _id
        }
        organizationName
        orgServiceCategory
        isOrgService
        title
        slug
        description
        duration
        isPrivate
        price
        currency
        percentDonated
        charity
        reminders
        recurringInterval
        conferenceType
        searchTags
        media {
          type
          link
        }
        paymentType
        isPaid
        hasReminder
        isRecurring
        authenticationType
        serviceWorkingHours {
          isCustomEnabled
          monday {
            availability {
              end
              start
            }
            isActive
          }
          tuesday {
            availability {
              end
              start
            }
            isActive
          }
          wednesday {
            availability {
              end
              start
            }
            isActive
          }
          thursday {
            availability {
              end
              start
            }
            isActive
          }
          friday {
            availability {
              end
              start
            }
            isActive
          }
          saturday {
            availability {
              end
              start
            }
            isActive
          }
          sunday {
            availability {
              end
              start
            }
            isActive
          }
        }
        bookingQuestions {
          questionType
          required
          question
          options
        }
        blackList {
          emails
          domains
        }
        whiteList {
          emails
          domains
        }
        serviceType
        roundRobinTeam {
          _id
          name
          organizationId
          teamMembers {
            priority
            memberId {
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
                stripeAccountId
                paymentAccounts {
                  direct
                  escrow
                }
              }
              personalDetails {
                name
                description
                headline
                phone
                website
                searchTags
                profileMediaLink
                profileMediaType
                language
                socials {
                  twitter
                  instagram
                  linkedin
                  facebook
                  youtube
                }
              }
            }
          }
        }
      }
      response {
        message
        status
      }
    }
  }
`;

const GetServiceCountWithRRId = gql`
  query GetServiceCountWithRRId($roundRobinTeamId: String) {
    getServiceCountWithRRId(roundRobinTeamId: $roundRobinTeamId) {
      serviceCount
      response {
        message
        status
      }
    }
  }
`;

// const SearchTeamResults = gql`
// query GetUserSearchResults($userSearchParams: UserSearchParams) {
//   getUserSearchResults(userSearchParams: $userSearchParams) {
//     response {
//       message
//       status
//     }
//     userData {
//       accountDetails {
//         avatar
//         username
//         email
//       }
//       personalDetails {
//         description
//         headline
//         name
//       }

//     }
//   }
// }
// `

const SearchTeamResults = gql`
  query GetOrganizationMembersById(
    $token: String!
    $documentId: String!
    $searchParams: OrgMemberSearchParams!
  ) {
    getOrganizationMembersById(
      token: $token
      documentId: $documentId
      searchParams: $searchParams
    ) {
      response {
        message
        status
      }
      members {
        userId {
          accountDetails {
            username
            email
            avatar
          }
          personalDetails {
            description
            headline
            name
          }
        }
      }
      memberCount
    }
  }
`;

const queries = {
  GetRoundRobinTeamsByOrganizationId,
  GetOrgRoundRobinServices,
  GetServiceCountWithRRId,
  SearchTeamResults,
};

export default queries;
