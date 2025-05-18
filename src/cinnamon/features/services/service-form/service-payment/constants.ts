export const activation = [
  {code: 'yes', title: 'Yes, it is paid'},
  {code: 'no', title: 'No, it is free'},
];

export const currencies = [
  {code: '$', label: '$ USD'},
  {code: '£', label: '£ GBP'},
  {code: '€', label: '€ EUR'},
  {code: '₹', label: '₹ INR'},
];

export const methods = [
  {
    code: 'escrow',
    label: '30mins Escrow',
    description:
      'Client pays to us in advance but payment is released to you only after completion of service.',
  },
  {
    code: 'direct',
    label: 'Direct Payments',
    description:
      'Clients payment is deposited to your account directly. Must be configured in payments.',
  },
  {
    code: 'manual',
    label: 'Manual Payments',
    description:
      'Use cash, check or any method to collect payment from customer. We are not involved.',
  },
];
