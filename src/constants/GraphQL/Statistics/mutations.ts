import {gql} from '@apollo/client';

const updateGlobalBusinessStats = gql`
  mutation UpdateGlobalBussinessStats($inputs: statsInput) {
    updateGlobalBussinessStats(inputs: $inputs) {
      message
      status
    }
  }
`;

const mutations = {
  updateGlobalBusinessStats,
};

export default mutations;
