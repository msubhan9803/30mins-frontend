import {PAYMENT_STATUS} from 'constants/enums';

export function getOrderPaymentStatus(status: PAYMENT_STATUS) {
  switch (status) {
    case PAYMENT_STATUS.PAID:
      return PAYMENT_STATUS.PAID;
    case PAYMENT_STATUS.UNPAID:
      return PAYMENT_STATUS.UNPAID;
    case PAYMENT_STATUS.PENDING:
      return PAYMENT_STATUS.PENDING;
    default:
      return '';
  }
}

export function getProjectOrderStatus(
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
  if (status.clientConfirmed) {
    return 'meeting:buyer_confirmed';
  }
  if (status.providerDeclined) {
    return 'meeting:buyer_declined';
  }
  if (status.clientCanceled) {
    return 'meeting:buyer_cancel';
  }
  if (status.providerConfirmed) {
    return 'meeting:seller_confirmed';
  }
  if (status.providerCanceled) {
    return 'meeting:seller_cancel';
  }
  return 'meeting:pending';
}
