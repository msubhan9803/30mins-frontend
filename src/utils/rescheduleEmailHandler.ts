import languageCode from 'utils/languageCode';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import TEMPLATES from '../constants/emailTemplateIDs';
import sendEmailHandler from './sendEmailHandler';

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function sendReschduleEmails(
  req,
  providerTimeZone,
  bookId,
  providerAuthCode,
  clientAuthCode
) {
  try {
    const {
      conferenceLink,
      zoomJoinUrl,
      zoomStartUrl,
      zoomPassword,
      providerLanguage,
      bookerLanguage,
    } = req.body;

    if (req.body.conferenceType === 'googleMeet') {
      req.body.conferenceType = 'Google Meet';
    }

    if (req.body.price > 0) {
      // TO  PAID CC
      req.body.ccRecipients.forEach(async ccEmail => {
        if (ccEmail && ccEmail !== '') {
          await sendEmailHandler(
            {
              subject: req.body.subject,
              clientName: req.body.bookerName,
              ccName: ccEmail,
              isCC: true,
              providerName: req.body.providerName,
              meetingType: req.body.translatedType || req.body.conferenceType,
              conferenceLink,
              zoomJoinUrl,
              zoomPassword,
              meetingDate: dayjs(req.body.startTime)
                .tz(req.body.bookerTimeZone)
                .format('dddd DD MMMM YYYY'),
              clientEmail: req.body.bookerEmail,
              meetingTime: dayjs(req.body.startTime).tz(req.body.bookerTimeZone).format('hh:mm A'),
              meetingCount: req.body.meetingCount,
              meetingDuration: req.body.meetingDuration,
              clientPhone: req.body.bookerPhone,
              currency: req.body.currency,
              totalAmount: req.body.price,
              isPaid: true,
              timeZone: req.body.bookerTimeZone,
              bookingId: bookId,
              additionalNotes: req.body.additionalNotes,
              paymentType: req.body.paymentType,
              [languageCode(bookerLanguage)]: true,
              rescheduleMeetingReason: req.body.rescheduleMeetingReason,
            },
            ccEmail,
            process.env.EMAIL_FROM!,
            TEMPLATES.POST_BOOKING.RESCHEDULE_TO_CLIENT,
            req.body.attachment
          );
        }
      });

      // To  PAID Client
      await sendEmailHandler(
        {
          subject: req.body.subject,
          clientName: req.body.bookerName,
          providerName: req.body.providerName,
          meetingType: req.body.translatedType || req.body.conferenceType,
          conferenceLink,
          zoomJoinUrl,
          zoomPassword,
          meetingDate: dayjs(req.body.startTime)
            .tz(req.body.bookerTimeZone)
            .format('dddd DD MMMM YYYY'),
          clientEmail: req.body.bookerEmail,
          meetingTime: dayjs(req.body.startTime).tz(req.body.bookerTimeZone).format('hh:mm A'),
          meetingCount: req.body.meetingCount,
          meetingDuration: req.body.meetingDuration,
          clientPhone: req.body.bookerPhone,
          currency: req.body.currency,
          totalAmount: req.body.price,
          isPaid: true,
          timeZone: req.body.bookerTimeZone,
          bookingId: bookId,
          paymentType: req.body.paymentType,
          additionalNotes: req.body.additionalNotes,
          [languageCode(bookerLanguage)]: true,
          authCode: clientAuthCode?.authCode,
          cancel: 'client-cancel',
          rescheduleMeetingReason: req.body.rescheduleMeetingReason,
        },
        req.body.bookerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.POST_BOOKING.RESCHEDULE_TO_CLIENT,
        req.body.attachment
      );

      // To PAID Provider
      await sendEmailHandler(
        {
          subject: req.body.subject,
          clientName: req.body.bookerName,
          clientEmail: req.body.bookerEmail,
          clientPhone: req.body.bookerPhone,
          ccList: req.body.ccRecipients ? req.body.ccRecipients.join(', ') : '',
          providerName: req.body.providerName,
          meetingType: req.body.translatedType || req.body.conferenceType,
          conferenceLink,
          zoomJoinUrl,
          zoomPassword,
          zoomStartUrl,
          meetingDate: dayjs(req.body.startTime).tz(providerTimeZone).format('dddd DD MMMM YYYY'),
          meetingTime: dayjs(req.body.startTime).tz(providerTimeZone).format('hh:mm A'),
          meetingCount: req.body.meetingCount,
          meetingDuration: req.body.meetingDuration,
          currency: req.body.currency,
          totalAmount: req.body.price,
          isPaid: true,
          isEscrow: req.body.paymentType === 'escrow',
          timeZone: req.body.bookerTimeZone,
          additionalNotes: req.body.additionalNotes,
          bookingId: bookId,
          paymentType: req.body.paymentType,
          [languageCode(providerLanguage)]: true,
          authCode: providerAuthCode?.authCode,
          cancel: 'provider-cancel',
          decline: 'provider-decline',
          rescheduleMeetingReason: req.body.rescheduleMeetingReason,
        },
        req.body.providerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.POST_BOOKING.RESCHEDULE_TO_PROVIDER,
        req.body.attachment
      );
    }

    if (req.body.price === 0) {
      // TO FREE CC
      req.body.ccRecipients.forEach(async ccEmail => {
        if (ccEmail && ccEmail !== '') {
          await sendEmailHandler(
            {
              subject: req.body.subject,
              clientName: req.body.bookerName,
              ccName: ccEmail,
              isCC: true,
              providerName: req.body.providerName,
              meetingType: req.body.translatedType || req.body.conferenceType,
              conferenceLink,
              zoomJoinUrl,
              zoomPassword,
              meetingDate: dayjs(req.body.startTime)
                .tz(req.body.bookerTimeZone)
                .format('dddd DD MMMM YYYY'),
              clientEmail: req.body.bookerEmail,
              meetingTime: dayjs(req.body.startTime).tz(req.body.bookerTimeZone).format('hh:mm A'),
              meetingCount: req.body.meetingCount,
              meetingDuration: req.body.meetingDuration,
              clientPhone: req.body.bookerPhone,
              currency: req.body.currency,
              totalAmount: req.body.price,
              isPaid: false,
              timeZone: req.body.bookerTimeZone,
              bookingId: bookId,
              paymentType: req.body.paymentType,
              additionalNotes: req.body.additionalNotes,
              [languageCode(bookerLanguage)]: true,
              rescheduleMeetingReason: req.body.rescheduleMeetingReason,
            },
            ccEmail,
            process.env.EMAIL_FROM!,
            TEMPLATES.POST_BOOKING.RESCHEDULE_TO_CLIENT,
            req.body.attachment
          );
        }
      });
      // To FREE Client
      await sendEmailHandler(
        {
          subject: req.body.subject,
          clientName: req.body.bookerName,
          clientEmail: req.body.bookerEmail,
          providerName: req.body.providerName,
          meetingType: req.body.translatedType || req.body.conferenceType,
          conferenceLink,
          zoomJoinUrl,
          zoomPassword,
          clientPhone: req.body.bookerPhone,
          meetingDate: dayjs(req.body.startTime)
            .tz(req.body.bookerTimeZone)
            .format('dddd DD MMMM YYYY'),
          meetingTime: dayjs(req.body.startTime).tz(req.body.bookerTimeZone).format('hh:mm A'),
          meetingCount: req.body.meetingCount,
          meetingDuration: req.body.meetingDuration,
          currency: req.body.currency,
          totalAmount: req.body.price,
          timeZone: req.body.bookerTimeZone,
          bookingId: bookId,
          isPaid: false,
          paymentType: req.body.paymentType,
          additionalNotes: req.body.additionalNotes,
          authCode: clientAuthCode?.authCode,
          cancel: 'client-cancel',
          [languageCode(bookerLanguage)]: true,
          rescheduleMeetingReason: req.body.rescheduleMeetingReason,
        },
        req.body.bookerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.POST_BOOKING.RESCHEDULE_TO_CLIENT,
        req.body.attachment
      );

      // To FREE Provider
      await sendEmailHandler(
        {
          subject: req.body.subject,
          clientName: req.body.bookerName,
          clientEmail: req.body.bookerEmail,
          providerName: req.body.providerName,
          ccList: req.body.ccRecipients ? req.body.ccRecipients.join(', ') : '',
          meetingType: req.body.translatedType || req.body.conferenceType,
          conferenceLink,
          zoomJoinUrl,
          zoomPassword,
          zoomStartUrl,
          meetingDate: dayjs(req.body.startTime).tz(providerTimeZone).format('dddd DD MMMM YYYY'),
          meetingTime: dayjs(req.body.startTime).tz(providerTimeZone).format('hh:mm A'),
          meetingCount: req.body.meetingCount,
          meetingDuration: req.body.meetingDuration,
          currency: req.body.currency,
          totalAmount: req.body.price,
          timeZone: req.body.bookerTimeZone,
          bookingId: bookId,
          clientPhone: req.body.bookerPhone,
          additionalNotes: req.body.additionalNotes,
          isPaid: false,
          paymentType: req.body.paymentType,
          authCode: providerAuthCode?.authCode,
          cancel: 'provider-cancel',
          decline: 'provider-decline',
          [languageCode(providerLanguage)]: true,
          rescheduleMeetingReason: req.body.rescheduleMeetingReason,
        },
        req.body.providerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.POST_BOOKING.RESCHEDULE_TO_PROVIDER,
        req.body.attachment
      );
    }
  } catch (err) {
    console.log('error');
    throw err;
  }
}
