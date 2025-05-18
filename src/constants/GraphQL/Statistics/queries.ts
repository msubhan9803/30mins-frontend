import {gql} from '@apollo/client';

const getBusinessStats = gql`
  query GlobalBussinessStats {
    getGlobalBussinessStats {
      response {
        message
        status
      }
      globalBussinessStats {
        totalRevenue
        totalMonthlyRecurringRevenue
        totalAnnualRecurringRevenue
        totalOrganizationRevenue
        totalOrganizationMonthlyRecurringRevenue
        totalOragnizationAnnualRecurringRevenue
        totalUsersSignedUp
        totalUsersVerified
        totalUsersWelcomeComplete
        totalOrganizationsSignedUp
        timeStamp
      }
    }
  }
`;

const queries = {
  getBusinessStats,
};

export default queries;
