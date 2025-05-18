import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';
import dayjs from 'dayjs';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import bookingQueries from 'constants/GraphQL/Booking/queries';
import bookingMutations from 'constants/GraphQL/Booking/mutations';
import {
  providerStatusCodes,
  clientStatusCodes,
  preBookingStatus,
  postBookingStatus,
} from 'constants/statusCodes';
import sendEmail from 'utils/sendEmailHandler';
import TEMPLATES from 'constants/emailTemplateIDs';

const getStatusUpdate = (
  message: string,
  status: string,
  bookingId: string,
  bookingPrice: number
) => {
  const statusUpdate = {
    'provider-cancel': {
      providerCanceled: true,
      reportReason: message,
      emailTemplate: TEMPLATES.POST_BOOKING.PROVIDER_CANCELED_MEETING,
    },
    'client-cancel': {
      clientCanceled: true,
      reportReason: message,
      emailTemplate: TEMPLATES.POST_BOOKING.CLIENT_CANCELED_MEETING,
    },
    'provider-confirm': {
      providerConfirmed: true,
      postMeetingNotes: message,
      emailTemplate: TEMPLATES.POST_BOOKING.PROVIDER_COMPLETED_MEETING,
    },
    'client-confirm': {
      clientConfirmed: true,
      postMeetingFeedback: message,
      emailTemplate: TEMPLATES.POST_BOOKING.CLIENT_CONFIRMED_MEETING_COMPLETION,
    },
    'provider-decline': {
      providerDeclined: true,
      reportReason: message,
      emailTemplate: TEMPLATES.POST_BOOKING.PROVIDER_DECLINED_MEETING,
    },
    'client-refund': {
      refundRequested: true,
      hasOpenReport: true,
      refundRequestReason: message,
      emailTemplate: TEMPLATES.POST_BOOKING.CLIENT_REFUNDED_REQUESTED_TO_PROVIDER,
    },
    'client-report': {
      hasOpenReport: true,
      reportReason: message,
      emailTemplate: TEMPLATES.POST_BOOKING.CLIENT_REPORTED_MEETING,
    },
  };

  const returnStatus = statusUpdate[status];
  const isPaid = bookingPrice > 0;

  if (isPaid) {
    returnStatus.refundRequested = true;
  }

  return {
    ...returnStatus,
    bookingId,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {authCode, message = 'No Message'} = req.query;
    const status = req.query.status as string;

    if (!authCode) {
      res.redirect(`/Home?message=AuthCodeMissing&success=0`);
      return;
    }

    switch (status) {
      case 'provider-cancel':
      case 'client-cancel':
      case 'provider-confirm':
      case 'client-confirm':
      case 'provider-decline':
      case 'client-refund':
      case 'client-report':
      case 'provider-reply':
      case 'client-reply':
        break;
      default:
        res.redirect(`/Home?message=InvalidOperation&success=0`);
        return;
    }

    const [userType, operation] = status.split('-');

    if (!operation) {
      res.redirect(`/Home?message=OperationMissing&success=0`);
      return;
    }

    const {data: statusAuthCodeResult} = await graphqlRequestHandler(
      bookingQueries.getStatusAuthCode,
      {
        authCode,
      },
      process.env.BACKEND_API_KEY
    );

    const statusAuthCodeData = statusAuthCodeResult.data.getStatusAuthCode.statusAuthCode;

    if (statusAuthCodeResult.data.getStatusAuthCode.response.status !== 200) {
      res.redirect(
        `/Home?message=${statusAuthCodeResult.data.getStatusAuthCode.response.message}&status=${statusAuthCodeResult.data.getStatusAuthCode.response.status}&operation=${operation}&success=0`
      );
      return;
    }

    if (statusAuthCodeData.used) {
      res.redirect(`/Home?message=AuthCodeAlreadyUsed&status=500&operation=${operation}&success=0`);
      return;
    }

    if (dayjs().isBefore(statusAuthCodeData.expireAt)) {
      if (postBookingStatus.includes(status)) {
        res.redirect(
          `/Home?message=NotAllowedBeforeBookingTime&status=500&operation=${operation}&success=0`
        );
        return;
      }
    }

    if (dayjs().isAfter(statusAuthCodeData.expireAt)) {
      if (preBookingStatus.includes(status)) {
        res.redirect(
          `/Home?message=NotAllowedAfterMeetingTime&status=500&operation=${operation}&success=0`
        );
        return;
      }
    }

    const {data: bookingResult} = await graphqlRequestHandler(
      bookingQueries.getBookingById,
      {
        documentId: statusAuthCodeData.bookingId,
      },
      process.env.BACKEND_API_KEY
    );

    const {bookingData} = bookingResult.data.getBookingById;
    const bookingStatus = bookingData.status;

    if (bookingStatus.clientConfirmed) {
      res.redirect(
        `/Home?message=BookingStatusClientConfirmed&status=500&operation=${operation}&success=0`
      );
      return;
    }

    if (bookingStatus.clientCanceled) {
      res.redirect(
        `/Home?message=BookingStatusClientCanceled&status=500&operation=${operation}&success=0`
      );
      return;
    }

    if (bookingStatus.providerCanceled) {
      res.redirect(
        `/Home?message=BookingStatusProviderCanceled&status=500&operation=${operation}&success=0`
      );
      return;
    }

    if (bookingStatus.providerDeclined) {
      res.redirect(
        `/Home?message=BookingStatusProviderDeclined&status=500&operation=${operation}&success=0`
      );
      return;
    }

    if (bookingStatus.hasOpenReport) {
      res.redirect(
        `/Home?message=BookingStatusHasOpenReport&status=500&operation=${operation}&success=0`
      );
      return;
    }

    const toSendEmail =
      userType === 'provider' ? bookingData.bookerEmail : bookingData.providerEmail;

    let toCheckEmail = '';
    let userId = '';

    if (status === 'provider-reply') {
      await sendEmail(
        {
          senderName: bookingData.providerName,
          receiverName: bookingData.bookerName,
          message: message,
          authCode: authCode,
        },
        toSendEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.BOOKING.REPLY_MEETING
      );
      res.redirect(`/Home?message=EmailSent&status=200&operation=${operation}&success=1`);
      return;
    }

    if (status === 'client-reply') {
      const {data: clientAuthCodeData} = await graphqlRequestHandler(
        bookingQueries.getStatusAuthCode,
        {
          email: toSendEmail,
          bookingId: bookingData._id,
        },
        process.env.BACKEND_API_KEY
      );
      await sendEmail(
        {
          senderName: bookingData.bookerName,
          receiverName: bookingData.providerName,
          message: message,
          authCode: clientAuthCodeData?.data?.getStatusAuthCode?.statusAuthCode?.authCode,
        },
        toSendEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.BOOKING.REPLY_MEETING
      );
      res.redirect(`/Home?message=EmailSent&status=200&operation=${operation}&success=1`);
      return;
    }

    if (statusAuthCodeData.availableStatus.includes(status)) {
      if (providerStatusCodes.includes(status)) {
        toCheckEmail = bookingData.providerEmail;
        userId = bookingData.provider;
      } else if (clientStatusCodes.includes(status)) {
        toCheckEmail = bookingData.bookerEmail;
        userId = bookingData.booker;
      }
    } else {
      res.redirect(`/Home?message=InvalidAuthCode&status=200&operation=${operation}&success=0`);
      return;
    }

    if (toCheckEmail !== statusAuthCodeData.email) {
      res.redirect(`/Home?message=InvalidAuthCode&status=200&operation=${operation}&success=0`);
      return;
    }

    const {emailTemplate, ...statusUpdate} = getStatusUpdate(
      message as string,
      status,
      bookingData._id,
      bookingData.price
    );

    const {data: updateBookingResult} = await graphqlRequestHandler(
      bookingMutations.updateBookingStatus,
      {
        userId,
        statusUpdateData: statusUpdate,
      },
      process.env.BACKEND_API_KEY
    );

    if (updateBookingResult.data.updateBookingStatus.status !== 200) {
      res.redirect(
        `/Home?message=CouldNotUpdateBookingStatus&status=200&operation=${operation}&success=0`
      );
      return;
    }

    if (
      status === 'client-cancel' ||
      status === 'provider-cancel' ||
      status === 'provider-decline'
    ) {
      await axios.post(`${process.env.FRONT_END_URL}/api/booking/deleteCalendarEventApi`, {
        bookingData,
      });
    }

    const {data: postStatusAuthCodeResult} = await graphqlRequestHandler(
      bookingQueries.getStatusAuthCode,
      {
        email: toSendEmail,
        bookingId: bookingData._id,
      },
      process.env.BACKEND_API_KEY
    );

    await sendEmail(
      {
        clientName: bookingData.bookerName,
        bookingId: bookingData._id,
        providerName: bookingData.providerName || 'Account Deleted',
        reason: message,
        postMeetingNotes: message,
        postMeetingFeedback: message,
        refundRequestReason: message,
        isPaid: bookingData.price > 0,
        clientConfirmed: status === 'client-confirm' ? true : false,
        authCode: postStatusAuthCodeResult.data.getStatusAuthCode.statusAuthCode.authCode,
      },
      toSendEmail,
      process.env.EMAIL_FROM!,
      emailTemplate
    );

    await graphqlRequestHandler(
      bookingMutations.updateStatusAuthCode,
      {
        id: statusAuthCodeData.id,
      },
      process.env.BACKEND_API_KEY
    );
    res.redirect(`/Home?message=Successful&status=200&operation=${operation}&success=1`);
    return;
  } catch (error) {
    res.redirect(`/Home?message=GeneralError&status=200&success=0`);
  }
}
