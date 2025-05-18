import EventModal from 'components/shared/Modals/Elements/Event';
import PublicationModal from 'components/shared/Modals/Elements/Publication';
import EducationModal from 'components/shared/Modals/Elements/Education';
import JobHistoryModal from 'components/shared/Modals/Elements/JobHistory';
import ShareProfile from 'components/shared/Modals/Elements/ShareProfile';
import ChangeTime from 'components/shared/Modals/Elements/ChangeTime';
import Meetings from 'components/shared/Modals/Elements/MeetingModal';
import OrganizationModal from 'components/shared/Modals/Elements/Organization';
import OrganizationServiceCategory from 'components/shared/Modals/Elements/OrganizationServiceCategoryModal';
import Charity from 'components/shared/Modals/Elements/Charity';
import JoinOrganizationModal from 'components/shared/Modals/Elements/JoinOrganizationModal';
import OrgServiceModal from 'components/shared/Modals/Elements/OrgServiceModal';
import Delete from 'components/shared/Modals/Elements/Delete';
import Confirm from 'components/shared/Modals/Elements/Confirm';
import SignOut from 'components/shared/Modals/Elements/signOut';
import OrganizationInviteMembers from 'components/shared/Modals/Elements/OrganizationInviteModal';
import SendMessageExtension from 'components/shared/Modals/Elements/SendMessageExtension';
import KickOrganizationMember from 'components/shared/Modals/Elements/KickOrganizationMember';
import GiftExtensionModal from 'components/shared/Modals/Elements/GiftExtensionModal';
import CheckAvailability from 'components/shared/Modals/Elements/CheckAvailability';
import EditAvailabilityGroupTitle from 'components/shared/Modals/Elements/EditAvailabilityGroupTitle';
import SearchUserForConversation from 'components/shared/Modals/Elements/search-user-for-conversation';
import MeetingOTP from 'components/shared/Modals/Elements/MeetingOTP';
import MessageOtpModal from 'components/shared/Modals/Elements/MessageOtpModal';
import MessageOtpVerify from 'components/shared/Modals/Elements/MessageOtpVerify';
import VerifiedOnly from 'components/shared/Modals/Elements/VerifiedOnly';
import PreApproval from 'components/shared/Modals/Elements/PreApproval';
import ChangeImage from 'components/shared/Modals/Elements/ChangeImage';
import Attachcalendar from 'components/shared/Modals/Elements/Attachcalendar';
import SetupPayment from 'components/shared/Modals/Elements/SetupPayment';
import AuthModal from 'components/shared/Modals/Elements/AuthModal';
import PublicCheckout from 'components/shared/Modals/Elements/PublicCheckout';
import RefundProduct from 'components/shared/Modals/Elements/RefundProduct';
import WireTransfer from 'components/shared/Modals/Elements/WireTransfer';
import WireTransferService from 'components/shared/Modals/Elements/WireTransferService';
import AddPaymentAccount from '../../components/shared/Modals/Elements/AddPaymentAccount';
import VerifySmsOtp from '../../components/shared/Modals/Elements/VerifySmsOtp';
import VerifyBookingSmsOtp from '../../components/shared/Modals/Elements/VerifyBookingSmsOtp';
import Checkout from '../../components/shared/Modals/Elements/Checkout';
import CheckoutModal from '../../components/PostLogin/Extensions/CheckoutModal';
import FreeDownloadAuthModal from '../../components/shared/Modals/Elements/FreeDownloadAuthModal';
import MissingExtensionModal from '../../components/shared/Modals/MissingExtensionModal';

export const MODAL_TYPES = {
  EVENT: 'EVENT',
  PUBLICATION: 'PUBLICATION',
  JOBHISTORY: 'JOBHISTORY',
  EDUCATION: 'EDUCATION',
  SHAREPROFILE: 'SHAREPROFILE',
  CHANGETIME: 'CHANGETIME',
  MEETINGS: 'MEETINGS',
  CHARITY: 'CHARITY',
  ORGANIZATION: 'ORGANIZATION',
  ORGANIZATION_SERVICE_CATEGORY: 'ORGANIZATION_SERVICE_CATEGORY',
  JOIN_ORGANIZATION: 'JOIN_ORGANIZATION',
  PENDING_ORG_INVITES: 'PENDING_ORG_INVITES',
  ORG_SERVICE: 'ORG_SERVICE',
  DELETE: 'DELETE',
  CONFIRM: 'CONFIRM',
  SIGN_OUT: 'SIGN_OUT',
  ORG_INVITE_MEMBERS: 'ORG_INVITE_MEMBERS',
  SEND_MESSAGE_EXTENSION: 'SEND_MESSAGE_EXTENSION',
  KICK_ORGANIZATION_MEMBER: 'KICK_ORGANIZATION_MEMBER',
  GIFT_EXTENSION: 'GIFT_EXTENSION',
  CHECK_AVAILABILITY: 'CHECK_AVAILABILITY',
  EDIT_AVAILABILITY_GROUP_TITLE: 'EDIT_AVAILABILITY_GROUP_TITLE',
  Search_User_For_Conversation: 'Search_User_For_Conversation',
  MEETING_OTP: 'MEETING_OTP',
  VERIFIED_ONLY: 'VERIFIED_ONLY',
  PRE_APPROVAL: 'PRE_APPROVAL',
  CHAMGEIMAGE: 'CHAMGEIMAGE',
  MESSAGE_OTP_MODAL: 'MESSAGE_OTP_MODAL',
  MESSAGE_OTP_VERIFY: 'MESSAGE_OTP_VERIFY',
  ADD_PAYMENT_ACCOUNT: 'ADD_PAYMENT_ACCOUNT',
  VERIFY_SMS_OTP: 'VERIFY_SMS_OTP',
  VERIFY_BOOKING_SMS_OTP: 'VERIFY_BOOKING_SMS_OTP',
  ATTACHCALENDAR: 'ATTACHCALENDAR',
  EXTENSIONS_CHECKOUT: 'EXTENSIONS_CHECKOUT',
  SETUP_PAYMENT_ESCROW: 'SETUP_PAYMENT_ESCROW',
  SETUP_PAYMENT_DIRECT: 'SETUP_PAYMENT_DIRECT',
  CHECKOUT: 'CHECKOUT',
  AUTH_MODAL: 'AUTH_MODAL',
  PUBLICCHECKOUT: 'PUBLICCHECKOUT',
  REFUNDPRODUCT: 'REFUNDPRODUCT',
  FREE_DOWNLOAD_AUTH_MODAL: 'FREE_DOWNLOAD_AUTH_MODAL',
  MISSING_EXTENSION: 'MISSING_EXTENSION',
  WIRE_TRANSFER: 'WIRE_TRANSFER',
  WIRE_TRANSFER_SERVICE: 'WIRE_TRANSFER_SERVICE',
};

export const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.EVENT]: EventModal,
  [MODAL_TYPES.EDUCATION]: EducationModal,
  [MODAL_TYPES.JOBHISTORY]: JobHistoryModal,
  [MODAL_TYPES.PUBLICATION]: PublicationModal,
  [MODAL_TYPES.SHAREPROFILE]: ShareProfile,
  [MODAL_TYPES.CHANGETIME]: ChangeTime,
  [MODAL_TYPES.MEETINGS]: Meetings,
  [MODAL_TYPES.CHARITY]: Charity,
  [MODAL_TYPES.ORGANIZATION]: OrganizationModal,
  [MODAL_TYPES.ORGANIZATION_SERVICE_CATEGORY]: OrganizationServiceCategory,
  [MODAL_TYPES.JOIN_ORGANIZATION]: JoinOrganizationModal,
  [MODAL_TYPES.ORG_SERVICE]: OrgServiceModal,
  [MODAL_TYPES.DELETE]: Delete,
  [MODAL_TYPES.CONFIRM]: Confirm,
  [MODAL_TYPES.SIGN_OUT]: SignOut,
  [MODAL_TYPES.ORG_INVITE_MEMBERS]: OrganizationInviteMembers,
  [MODAL_TYPES.SEND_MESSAGE_EXTENSION]: SendMessageExtension,
  [MODAL_TYPES.KICK_ORGANIZATION_MEMBER]: KickOrganizationMember,
  [MODAL_TYPES.GIFT_EXTENSION]: GiftExtensionModal,
  [MODAL_TYPES.CHECK_AVAILABILITY]: CheckAvailability,
  [MODAL_TYPES.EDIT_AVAILABILITY_GROUP_TITLE]: EditAvailabilityGroupTitle,
  [MODAL_TYPES.Search_User_For_Conversation]: SearchUserForConversation,
  [MODAL_TYPES.MEETING_OTP]: MeetingOTP,
  [MODAL_TYPES.MESSAGE_OTP_MODAL]: MessageOtpModal,
  [MODAL_TYPES.MESSAGE_OTP_VERIFY]: MessageOtpVerify,
  [MODAL_TYPES.VERIFIED_ONLY]: VerifiedOnly,
  [MODAL_TYPES.PRE_APPROVAL]: PreApproval,
  [MODAL_TYPES.CHAMGEIMAGE]: ChangeImage,
  [MODAL_TYPES.ADD_PAYMENT_ACCOUNT]: AddPaymentAccount,
  [MODAL_TYPES.VERIFY_SMS_OTP]: VerifySmsOtp,
  [MODAL_TYPES.VERIFY_BOOKING_SMS_OTP]: VerifyBookingSmsOtp,
  [MODAL_TYPES.ATTACHCALENDAR]: Attachcalendar,
  [MODAL_TYPES.EXTENSIONS_CHECKOUT]: CheckoutModal,
  [MODAL_TYPES.SETUP_PAYMENT_ESCROW]: SetupPayment,
  [MODAL_TYPES.SETUP_PAYMENT_DIRECT]: SetupPayment,
  [MODAL_TYPES.CHECKOUT]: Checkout,
  [MODAL_TYPES.AUTH_MODAL]: AuthModal,
  [MODAL_TYPES.FREE_DOWNLOAD_AUTH_MODAL]: FreeDownloadAuthModal,
  [MODAL_TYPES.PUBLICCHECKOUT]: PublicCheckout,
  [MODAL_TYPES.REFUNDPRODUCT]: RefundProduct,
  [MODAL_TYPES.MISSING_EXTENSION]: MissingExtensionModal,
  [MODAL_TYPES.WIRE_TRANSFER]: WireTransfer,
  [MODAL_TYPES.WIRE_TRANSFER_SERVICE]: WireTransferService,
};
