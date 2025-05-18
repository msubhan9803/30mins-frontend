import {gql} from '@apollo/client';

const CreateOrgRoundRobinService = gql`
  mutation CreateOrgRoundRobinService($roundRobinServiceData: RoundRobinServiceInput) {
    createOrgRoundRobinService(roundRobinServiceData: $roundRobinServiceData) {
      message
      status
    }
  }
`;

const EditOrgRoundRobinService = gql`
  mutation EditOrgRoundRobinService(
    $roundRobinServiceData: RoundRobinServiceInput
    $documentId: String
  ) {
    editOrgRoundRobinService(
      roundRobinServiceData: $roundRobinServiceData
      documentId: $documentId
    ) {
      message
      status
    }
  }
`;

const DeleteOrgRoundRobinService = gql`
  mutation DeleteOrgRoundRobinService($documentId: String, $organizationId: String) {
    deleteOrgRoundRobinService(documentId: $documentId, organizationId: $organizationId) {
      message
      status
    }
  }
`;

const RemoveRoundRobinTeamFromService = gql`
  mutation RemoveRoundRobinTeamFromService($serviceId: String, $organizationId: String) {
    removeRoundRobinTeamFromService(serviceId: $serviceId, organizationId: $organizationId) {
      message
      status
    }
  }
`;
const DeleteRoundRobinTeam = gql`
  mutation DeleteRoundRobinTeam($documentId: String!, $organizationId: String) {
    deleteRoundRobinTeam(documentId: $documentId, organizationId: $organizationId) {
      message
      status
    }
  }
`;

const CreateRoundRobinTeam = gql`
  mutation CreateRoundRobinTeam($roundRobinTeamData: RoundRobinInput) {
    createRoundRobinTeam(roundRobinTeamData: $roundRobinTeamData) {
      message
      status
    }
  }
`;
const EditRoundRobinTeam = gql`
  mutation EditRoundRobinTeam($documentId: String!, $roundRobinTeamData: RoundRobinInput) {
    editRoundRobinTeam(documentId: $documentId, roundRobinTeamData: $roundRobinTeamData) {
      message
      status
    }
  }
`;

const mutations = {
  CreateRoundRobinTeam,
  EditRoundRobinTeam,
  CreateOrgRoundRobinService,
  DeleteOrgRoundRobinService,
  EditOrgRoundRobinService,
  RemoveRoundRobinTeamFromService,
  DeleteRoundRobinTeam,
};

export default mutations;
