export const providerStatusCodes = ['provider-confirm', 'provider-cancel', 'provider-decline'];
export const clientStatusCodes = [
  'client-cancel',
  'client-confirm',
  'client-refund',
  'client-report',
];
export const preBookingStatus = [
  'provider-decline',
  'provider-cancel',
  'client-cancel',
  'provider-reply',
  'client-reply',
];
export const postBookingStatus = [
  'provider-confirm',
  'client-confirm',
  'client-refund',
  'client-report',
];
export const allStatusCodes = providerStatusCodes.concat(clientStatusCodes);
