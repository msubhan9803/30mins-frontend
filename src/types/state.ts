import {TABS_TYPES} from 'constants/context/tabs';
import {NOTIFICATION_MESSAGES} from 'constants/context/notification';
import {User} from './user';

export type State = {
  status: StatusState;
  sidebar: CollapseState;
  modal: ModalState;
  user: UserState;
  tabs: TabsState;
  notification: NotificationState;
};

export type StatusState = {
  loading: boolean;
  stateLoaded: boolean;
};

export type CollapseState = {
  isCollapse: boolean;
  collapseClick: boolean;
  collapseHover: boolean;
  currentActiveRoute: {
    routeName: string;
    childRouteName: string;
    href: string;
    isChild: boolean;
    isDropdownOpen: boolean;
  };
  isOrganizationMember: boolean;
  hasOrgEditPermission: boolean;
  onToggleCollapse: () => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  handleClearRouteDropdown: () => void;
  handleActiveRouteToggle: (route: any) => void;
  handleToggleIsOrganizationMember: (val: boolean) => void;
};

export type ModalState = {
  showModal: (modalType: string, modalProps?: any) => void;
  hideModal: () => void;
  store: any;
};

export type NotificationState = {
  show?: boolean;
  notificationType: string;
  message: keyof typeof NOTIFICATION_MESSAGES | '';
  delayed: boolean;
};

export type TabsState = {
  tabsType: keyof typeof TABS_TYPES;
};

export type UserState = User;
