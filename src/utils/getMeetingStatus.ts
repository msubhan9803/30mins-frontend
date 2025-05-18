export default function getMeetingStatus(
  price: number,
  status: {
    providerDeclined: boolean;
    refunded: boolean;
    refundRequested: boolean;
    clientCanceled: boolean;
    conferenceType: boolean;
    providerCanceled: boolean;
    hasOpenReport: boolean;
    clientConfirmed: boolean;
    providerConfirmed: boolean;
  }
) {
  if (status.refunded) {
    return 'meeting:refunded';
  }
  if (status.refundRequested && price > 0) {
    return 'meeting:refund_requested';
  }
  if (status.hasOpenReport) {
    return 'meeting:reported';
  }
  if (status.providerConfirmed) {
    return 'meeting:provider_confirmed';
  }
  if (status.clientConfirmed) {
    return 'meeting:client_confirmed';
  }
  if (status.providerDeclined) {
    return 'meeting:provider_declined';
  }
  if (status.providerCanceled) {
    return 'meeting:provider_cancel';
  }
  if (status.clientCanceled) {
    return 'meeting:client_cancel';
  }
  return 'meeting:pending';
}
