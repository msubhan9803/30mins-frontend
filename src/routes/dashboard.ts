import {
  BanknotesIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChartBarIcon,
  ChartPieIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  ComputerDesktopIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  GiftIcon,
  HomeIcon,
  KeyIcon,
  LockClosedIcon,
  MegaphoneIcon,
  PhotoIcon,
  PlusIcon,
  PuzzlePieceIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';

export const users = [
  {name: 'Welcome', href: '/user/welcome', icon: HomeIcon},
  {name: 'Profile', href: '/user/profile', icon: UserIcon},
  {name: 'Calendar Integrations', href: '/user/integrations', icon: CogIcon},
  {
    name: 'Product',
    href: '#',
    icon: BanknotesIcon,
    children: [
      {name: 'Create Product', href: '/user/products/product-form', icon: CreditCardIcon},
      {name: 'All Products', href: '/user/products', icon: BanknotesIcon},
    ],
  },
  {name: 'Chat', href: '/user/chat', icon: ChatBubbleLeftRightIcon},
  {name: 'My Meetings', href: '/user/meetings', icon: CalendarIcon},
  {name: 'Services', href: '/user/services', icon: ComputerDesktopIcon},
  {name: 'Posts', href: '/user/posts', icon: PhotoIcon},
  {name: 'Organizations', href: '/user/organizations', icon: BriefcaseIcon},
  {name: 'Extensions', href: '/user/extensions', icon: PuzzlePieceIcon},
  {name: 'Collective Availability', href: '/user/availability', icon: PlusIcon},
  {name: 'FAQ', href: '/user/faq', icon: QuestionMarkCircleIcon},
  {name: 'Spread the Word', href: '/user/spreadword', icon: MegaphoneIcon},
  {
    name: 'Payments',
    href: '#',
    icon: BanknotesIcon,
    children: [
      {name: 'Billing Address', href: '/user/billing', icon: BanknotesIcon},
      {
        name: 'Receiving Payments',
        href: '/user/paymentOptions',
        icon: CurrencyDollarIcon,
      },
      {name: 'Making Payments', href: '/user/extensions/billing', icon: CreditCardIcon},
    ],
  },
];

export const admin = [
  {name: 'Welcome', href: '/user/welcome', icon: HomeIcon},
  {name: 'Profile', href: '/user/profile', icon: UserIcon},
  {name: 'My Meetings', href: '/user/meetings', icon: CalendarIcon},
  {name: 'Calendar Integrations', href: '/user/integrations', icon: CogIcon},
  {
    name: 'Product',
    href: '#',
    icon: BanknotesIcon,
    children: [
      {name: 'Create Product', href: '/user/products/product-form', icon: CreditCardIcon},
      {name: 'All Products', href: '/user/products', icon: BanknotesIcon},
    ],
  },
  {name: 'Chat', href: '/user/chat', icon: ChatBubbleLeftRightIcon},
  {name: 'Services', href: '/user/services', icon: ComputerDesktopIcon},
  {name: 'Organizations', href: '/user/organizations', icon: BriefcaseIcon},
  {name: 'Extensions', href: '/user/extensions', icon: PuzzlePieceIcon},
  {name: 'Collective Availability', href: '/user/availability', icon: PlusIcon},
  {name: 'FAQ', href: '/user/faq', icon: QuestionMarkCircleIcon},
  {name: 'Spread the Word', href: '/user/spreadword', icon: MegaphoneIcon},
  {
    name: 'Payments',
    href: '#',
    icon: BanknotesIcon,
    children: [
      {name: 'Billing Address', href: '/user/billing', icon: BanknotesIcon},
      {
        name: 'Receiving Payments',
        href: '/user/paymentOptions',
        icon: CurrencyDollarIcon,
      },
      {name: 'Making Payments', href: '/user/extensions/billing', icon: CreditCardIcon},
    ],
  },
  {
    name: 'Admin',
    href: '#',
    icon: LockClosedIcon,
    children: [
      {name: 'Dashboard', href: '/user/admindashboard', icon: ChartPieIcon},
      {name: 'All users', href: '/user/allusers', icon: UsersIcon},
      {name: 'All Meetings', href: '/user/allmeetings', icon: DocumentIcon},
      {name: 'All Organzation', href: '/user/allOrganizations', icon: BriefcaseIcon},
      {name: 'All Logs', href: '/user/logs', icon: ChartBarIcon},
      {name: 'All Services', href: '/user/allServices', icon: ComputerDesktopIcon},
      {name: 'All Extensions', href: '/user/allExtensions', icon: PuzzlePieceIcon},
      {name: 'Misc', href: '/user/miscellaneous', icon: KeyIcon},
      {name: 'Charity', href: '/user/charity', icon: GiftIcon},
    ],
  },
];

export const marketer = [
  {
    name: 'Affiliate',
    href: '#',
    icon: LockClosedIcon,
    children: [
      {name: 'Dashboard', href: '/user/affiliatedashboard', icon: UsersIcon},
      {name: 'Import Users', href: '/user/affiliate', icon: UsersIcon},
    ],
  },
];
