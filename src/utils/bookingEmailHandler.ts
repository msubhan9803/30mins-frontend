import languageCode from 'utils/languageCode';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import fs from 'fs';
import TEMPLATES from '../constants/emailTemplateIDs';
import sendEmailWithContextHandler from './sendEmailWithContextHandler';

const ics = require('ics');

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function sendBookingEmails(
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
      meetingDuration,
      dateBooked,
      title,
      bookerName,
      bookerEmail,
      providerName,
      providerEmail,
    } = req.body;
    const startDate = new Date(dateBooked);

    const bookerEvent = {
      start: [
        startDate.getUTCFullYear(),
        startDate.getUTCMonth() + 1,
        startDate.getUTCDate(),
        startDate.getUTCHours(),
        startDate.getUTCMinutes(),
      ],
      startInputType: 'utc',
      duration: {minutes: meetingDuration},
      title: `Meeting with ${providerName}`,
      description: `Meeting with ${providerName}: ${title}`,
      url: 'https://www.30mins.com/',
      status: 'CONFIRMED',
      organizer: {
        name: bookerName,
        email: bookerEmail,
      },
      attendees: [
        {
          name: bookerName,
          email: bookerEmail,
          role: 'BOOKER',
        },
        {
          name: providerName,
          email: providerEmail,
          role: 'PROVIDER',
        },
      ],
    };
    const bookerEventIcs = ics.createEvent(bookerEvent);
    const bookerAttachments = [
      {
        content: Buffer.from(bookerEventIcs.value).toString('base64'),
        type: 'application/ics',
        name: 'event.ics',
        filename: 'event.ics',
        disposition: 'attachment',
      },
    ];

    const providerEvent = {
      start: [
        startDate.getUTCFullYear(),
        startDate.getUTCMonth() + 1,
        startDate.getUTCDate(),
        startDate.getUTCHours(),
        startDate.getUTCMinutes(),
      ],
      startInputType: 'utc',
      duration: {minutes: meetingDuration},
      title: `Meeting with ${bookerName}`,
      description: `Meeting with ${bookerName}: ${title}`,
      url: 'https://www.30mins.com/',
      status: 'CONFIRMED',
      organizer: {
        name: bookerName,
        email: bookerEmail,
      },
      attendees: [
        {
          name: bookerName,
          email: bookerEmail,
          role: 'BOOKER',
        },
        {
          name: providerName,
          email: providerEmail,
          role: 'PROVIDER',
        },
      ],
    };
    const providerEventIcs = ics.createEvent(providerEvent);
    const providerAttachments = [
      {
        content: Buffer.from(providerEventIcs.value).toString('base64'),
        type: 'application/ics',
        name: 'event.ics',
        filename: 'event.ics',
        disposition: 'attachment',
      },
    ];
    if (req.body.attachment) {
      const {attachment} = req.body;
      const attachment64 = fs.readFileSync(attachment.filepath).toString('base64');
      bookerAttachments.push({
        content: attachment64,
        filename: attachment.originalFilename,
        name: attachment.originalFilename,
        type: attachment.mimetype,
        disposition: 'attachment',
      });
      providerAttachments.push({
        content: attachment64,
        filename: attachment.originalFilename,
        name: attachment.originalFilename,
        type: attachment.mimetype,
        disposition: 'attachment',
      });
    }

    if (req.body.price > 0) {
      // TO  PAID CC
      req.body.ccRecipients.forEach(async ccEmail => {
        if (ccEmail && ccEmail !== '') {
          await sendEmailWithContextHandler(
            {
              serviceTitle: req.body.title,
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
            },
            ccEmail,
            process.env.EMAIL_FROM!,
            TEMPLATES.BOOKING.TO_CLIENT,
            bookerAttachments
          );
        }
      });

      // To  PAID Client
      await sendEmailWithContextHandler(
        {
          serviceTitle: req.body.title,
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
        },
        req.body.bookerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.BOOKING.TO_CLIENT,
        bookerAttachments
      );

      // To PAID Provider
      await sendEmailWithContextHandler(
        {
          serviceTitle: req.body.title,
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
        },
        req.body.providerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.BOOKING.TO_PROVIDER,
        providerAttachments
      );
    }

    if (req.body.price === 0) {
      // TO FREE CC
      req.body.ccRecipients.forEach(async ccEmail => {
        if (ccEmail && ccEmail !== '') {
          await sendEmailWithContextHandler(
            {
              serviceTitle: req.body.title,
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
            },
            ccEmail,
            process.env.EMAIL_FROM!,
            TEMPLATES.BOOKING.TO_CLIENT,
            bookerAttachments
          );
        }
      });
      // To FREE Client
      await sendEmailWithContextHandler(
        {
          serviceTitle: req.body.title,
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
        },
        req.body.bookerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.BOOKING.TO_CLIENT,
        bookerAttachments
      );

      // To FREE Provider
      await sendEmailWithContextHandler(
        {
          serviceTitle: req.body.title,
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
        },
        req.body.providerEmail,
        process.env.EMAIL_FROM!,
        TEMPLATES.BOOKING.TO_PROVIDER,
        providerAttachments
      );
    }
  } catch (err) {
    console.log('bookingEmailHandler err: ', err.message);
    throw err;
  }
}
