import {
  AcademicCapIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  BanknotesIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ChartBarIcon,
  ChartPieIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CogIcon,
  ComputerDesktopIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  GiftIcon,
  HomeIcon,
  IdentificationIcon,
  InformationCircleIcon,
  KeyIcon,
  LockClosedIcon,
  MegaphoneIcon,
  NewspaperIcon,
  PhotoIcon,
  PlusCircleIcon,
  PlusIcon,
  PuzzlePieceIcon,
  QuestionMarkCircleIcon,
  QueueListIcon,
  Squares2X2Icon,
  StopIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const welcome = {name: 'Welcome', href: '/user/welcome', icon: HomeIcon};

const payments = [
  {name: 'Receiving Payments', href: '/user/paymentOptions', icon: CurrencyDollarIcon},
  {name: 'Making Payments', href: '/user/extensions/billing', icon: CreditCardIcon},
  {name: 'Billing Address', href: '/user/billing', icon: IdentificationIcon},
  {name: 'Refunds', href: '/user/refunds', icon: ArrowUturnLeftIcon},
];

const myMeetingServices = [];

const provider = [
  {name: 'Dashboard', href: '/user/dashboard', icon: ChartPieIcon},
  {
    name: 'Profile',
    href: '#',
    icon: UserIcon,
    children: [
      {name: 'Overview', href: '/user/profile', icon: UserIcon},
      {name: 'Account Settings', href: '/user/edit', icon: CogIcon},
      {name: 'Publications', href: '/user/publications', icon: NewspaperIcon},
      {name: 'Education', href: '/user/education', icon: AcademicCapIcon},
      {name: 'Job History', href: '/user/job-history', icon: BriefcaseIcon},
      {name: 'Org Invites', href: '/user/pendingOrganizationInvites', icon: MegaphoneIcon},
      {name: 'Posts', href: '/user/posts', icon: PhotoIcon},
    ],
  },
  {
    name: 'Meeting Services',
    href: '#',
    icon: CalendarIcon,
    children: [
      {
        name: 'All meeting services',
        href: '/user/meeting-services/all-meeting-services',
        icon: ChartPieIcon,
      },
      {
        name: 'Add service',
        href: '/user/meeting-services/add-services/?mode=create&stepType=MEETING',
        icon: PlusIcon,
      },
      {
        name: 'Calendar Integrations',
        href: '/user/integrations',
        icon: CalendarIcon,
      },
      {
        name: 'Working Hours',
        href: '/user/my-working-hours',
        icon: ClockIcon,
      },
      {
        name: 'Free appointments',
        href: '/user/meeting-services/free-appointments',
        icon: StopIcon,
      },
      {
        name: 'Paid appointments',
        href: '/user/meeting-services/paid-appointments',
        icon: CurrencyDollarIcon,
      },
    ],
  },
  {
    name: 'Freelancing Services',
    href: '#',
    icon: CurrencyDollarIcon,
    children: [
      {
        name: 'All freelancing services',
        href: '/user/freelancing-services/all-freelancing-services',
        icon: ChartPieIcon,
      },
      {
        name: 'Add service',
        href: '/user/freelancing-services/add-services/?mode=create&stepType=FREELANCING_WORK',
        icon: PlusIcon,
      },

      {
        name: 'Pending Orders',
        href: '/user/freelancing-services/pending-orders',
        icon: StopIcon,
      },
      {
        name: 'Completed Orders',
        href: '/user/freelancing-services/completed-orders',
        icon: CurrencyDollarIcon,
      },
    ],
  },
  {
    name: 'Other Services',
    href: '#',
    icon: BriefcaseIcon,
    children: [
      {
        name: 'All Job Posts',
        href: '/user/other-services/all-services',
        icon: BriefcaseIcon,
      },
      {
        name: 'Add Job Post',
        href: '/user/other-services/add-services/?mode=create',
        icon: PlusIcon,
      },
    ],
  },
  {
    name: 'Products',
    href: '#',
    icon: BriefcaseIcon,
    children: [
      {
        name: 'Add product',
        href: '/user/products/product-form/?mode=create',
        icon: PlusIcon,
      },
      {
        name: 'All Products',
        href: '/user/all-products',
        icon: BriefcaseIcon,
      },
      {
        name: 'Purchases',
        href: '/user/purchases',
        icon: BriefcaseIcon,
      },
      {
        name: 'Products Sold',
        href: '/user/products-sold',
        icon: BriefcaseIcon,
      },
    ],
  },
  {name: 'Organizations', href: '/user/organizations', icon: BuildingOfficeIcon},
  {
    name: 'Organizations',
    href: '#',
    icon: BuildingOfficeIcon,
    children: [
      {
        name: 'My Organizations',
        href: '/user/organizations',
        icon: IdentificationIcon,
        isStrictCheck: true,
      },
      {
        name: 'Information',
        href: '/user/organizations/information',
        icon: InformationCircleIcon,
        isStrictCheck: true,
        checkEditOrgPermission: true,
      },
      {
        name: 'Members',
        href: '/user/organizations/members',
        icon: UsersIcon,
        isStrictCheck: true,
        checkEditOrgPermission: true,
      },
      {
        name: 'Services',
        href: '/user/organizations/services',
        icon: Squares2X2Icon,
        isStrictCheck: true,
        checkEditOrgPermission: true,
      },
      {
        name: 'Reseller',
        href: '/user/organizations/reseller',
        icon: ArrowPathIcon,
        isStrictCheck: true,
        checkEditOrgPermission: true,
      },
      {
        name: 'Pending Join Requests',
        href: '/user/organizations/pending-join-requests',
        icon: UserPlusIcon,
        isStrictCheck: true,
        checkEditOrgPermission: true,
      },
      {
        name: 'Pending Invites',
        href: '/user/organizations/pending-invites',
        icon: PlusCircleIcon,
        isStrictCheck: true,
        checkEditOrgPermission: true,
      },
      {
        name: 'Invite Members',
        href: '/user/organizations/invite-members',
        icon: PlusCircleIcon,
        isStrictCheck: true,
        checkEditOrgPermission: true,
      },
    ],
  },

  {name: 'Round Robin Meetings', href: '/user/round-robin', icon: ArrowPathIcon},
  {
    name: 'Round Robin Meetings',
    href: '#',
    icon: ArrowPathIcon,
    children: [
      {
        name: 'All Services',
        href: '/user/round-robin/all-services',
        icon: ChartPieIcon,
        isStrictCheck: true,
      },
      {
        name: 'Add Round Robin Service',
        href: '/user/round-robin/add-round-robin-service',
        icon: PlusIcon,
        isStrictCheck: true,
      },
      {
        name: 'All Teams',
        href: '/user/round-robin/all-teams',
        icon: UsersIcon,
        isStrictCheck: true,
      },
    ],
  },

  {name: 'Organization Services', href: '/user/organization-services', icon: QueueListIcon},
  {
    name: 'Organization Services',
    href: '#',
    icon: QueueListIcon,
    children: [
      {
        name: 'All Organization Services',
        href: '/user/organization-services/all-organization-services',
        icon: PlusIcon,
        isStrictCheck: true,
      },
      {
        name: 'Add Organization Service',
        href: '/user/organization-services/add-organization-service/?mode=create&stepType=organization',
        icon: PlusIcon,
        isStrictCheck: false,
      },
      {
        name: 'Add Service Category',
        href: '/user/organization-services/add-Service-category',
        icon: PlusIcon,
        isStrictCheck: true,
      },
    ],
  },

  {
    name: 'Events',
    href: '#',
    icon: CalendarIcon,
    children: [
      {
        name: 'Add Event',
        href: '/user/events/add-event/?mode=create&stepType=EVENT',
        icon: PlusIcon,
      },
      {
        name: 'Organizing Events',
        href: '/user/events/organizing-events',
        icon: ChartPieIcon,
      },
      {
        name: 'Attending Events',
        href: '/user/events/attending',
        icon: ChartPieIcon,
      },
    ],
  },

  {
    name: 'Extensions',
    href: '#',
    icon: PuzzlePieceIcon,
    children: [
      {
        name: 'All Extensions',
        href: '/user/extensions',
        icon: PuzzlePieceIcon,
        isStrictCheck: true,
      },
      // {name: 'Collective Availability', href: '/user/availability', icon: PlusIcon},
    ],
  },

  {name: 'Payments', href: '#', icon: BanknotesIcon, children: payments},
  {name: 'Chat', href: '/user/chat', icon: ChatBubbleLeftRightIcon},
  {name: 'FAQ', href: '/user/faq', icon: QuestionMarkCircleIcon},
  {name: 'Spread the Word', href: '/user/spreadword', icon: MegaphoneIcon},
];

const admin = [
  {
    name: 'Admin',
    href: '#',
    icon: LockClosedIcon,
    children: [
      {name: 'Dashboard', href: '/user/admindashboard', icon: ChartPieIcon},
      {name: 'All users', href: '/user/allusers', icon: UsersIcon},
      {name: 'All Affiliates', href: '/user/allaffiliates', icon: UsersIcon},
      {name: 'All Meetings', href: '/user/allmeetings', icon: DocumentIcon},
      {name: 'All Organzation', href: '/user/allOrganizations', icon: BriefcaseIcon},
      {name: 'All Logs', href: '/user/logs', icon: ChartBarIcon},
      {name: 'All Services', href: '/user/allServices', icon: ComputerDesktopIcon},
      {name: 'All Extensions', href: '/user/allExtensions', icon: PuzzlePieceIcon},
      {name: 'Misc', href: '/user/miscellaneous', icon: KeyIcon},
      {name: 'Charity', href: '/user/charity', icon: GiftIcon},
      {name: 'Pending Payouts', href: '/user/payouts', icon: BanknotesIcon},
    ],
  },
];

const marketer = [
  {
    name: 'Affiliate',
    href: '#',
    icon: BriefcaseIcon,
    children: [
      {
        name: 'Dashboard',
        href: '/user/affiliatedashboard',
        icon: ChartPieIcon,
        isStrictCheck: true,
      },
      {name: 'Import Users', href: '/user/affiliate', icon: UsersIcon, isStrictCheck: true},
    ],
  },
];

const paymentOperator = [
  {
    name: 'Pending Payouts',
    href: '/user/payouts',
    icon: BanknotesIcon,
  },
];

export {welcome, provider, admin, marketer, myMeetingServices, paymentOperator};
