import {useRouter} from 'next/router';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {useSession} from 'next-auth/react';
import ExtensionIDs from 'constants/stripeProductIDs';

const useOrganizations = ({userOrgs, activeExtensions, invitedOrgs, refetch}) => {
  const router = useRouter();
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();

  const [modifyRole] = useMutation(mutations.editOrganizationMemberRole);
  const hasOrgExtension = activeExtensions
    ? activeExtensions.includes(ExtensionIDs.EXTENSIONS.ORGANIZATIONS) ||
      activeExtensions.includes(ExtensionIDs.EXTENSIONS.ORGANIZATIONS_ANNUAL)
    : false;

  const editOrg = data => {
    showModal(MODAL_TYPES.ORGANIZATION, {
      orgId: data._id,
      initdata: data,
      hasOrgExtension,
    });
  };

  const showCreateModal = () => {
    showModal(MODAL_TYPES.ORGANIZATION, {
      hasOrgExtension,
      onSubmit: async () => {
        if (router.asPath !== '/user/organizations') {
          await refetch();
          await router.push('/user/organizations');
        } else {
          refetch();
        }
      },
    });
  };

  const showJoinModal = () => {
    showModal(MODAL_TYPES.JOIN_ORGANIZATION, {
      joinedOrgIds:
        userOrgs === null ? [] : userOrgs?.map(membership => membership.organizationId._id),
      refetch,
    });
  };

  const showPendingInvitesModal = () => {
    showModal(MODAL_TYPES.PENDING_ORG_INVITES, {
      invitedOrgs: invitedOrgs,
    });
  };

  const manageServiceCategories = async organization => {
    showModal(MODAL_TYPES.ORGANIZATION_SERVICE_CATEGORY, {
      initData: organization,
    });
  };

  const inviteMembers = async organization => {
    showModal(MODAL_TYPES.ORG_INVITE_MEMBERS, {
      initData: organization,
    });
  };

  const handleModifyRole = async (membershipId: number, role: string, itemID: string) => {
    try {
      await modifyRole({
        variables: {
          organizationId: itemID,
          token: session?.accessToken,
          role: role,
          organizationMembershipId: membershipId,
        },
      });
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleKickModal = async (userIdToKick: string, itemID: string) => {
    showModal(MODAL_TYPES.KICK_ORGANIZATION_MEMBER, {
      userIdToKick,
      itemID,
    });
  };

  return {
    orgMethods: {
      editOrg,
      handleModifyRole,
      handleKickModal,
    },
    orgModals: {
      showCreateModal,
      manageServiceCategories,
      showJoinModal,
      inviteMembers,
      showPendingInvitesModal,
    },
  };
};
export default useOrganizations;
