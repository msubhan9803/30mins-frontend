import languageCode from 'utils/languageCode';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import TEMPLATES from '../constants/emailTemplateIDs';
import sendEmailHandler from './sendEmailHandler';
import {PAYMENT_TYPE} from '../constants/enums';

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function sendFreelanceEmails(req, providerTimeZone, bookId) {
  try {
    const {providerLanguage, bookerLanguage} = req.body;

    // To Client
    await sendEmailHandler(
      {
        clientName: req.body.bookerName,
        providerName: req.body.providerName,
        startTime: dayjs(req.body.startTime)
          .tz(req.body.bookerTimeZone)
          .format('dddd DD MMMM YYYY'),
        endTime: dayjs(req.body.endTime).tz(req.body.bookerTimeZone).format('dddd DD MMMM YYYY'),
        currency: req.body.currency,
        totalAmount: req.body.price,
        bookingId: bookId,
        paymentType: req.body.paymentType,
        additionalNotes: req.body.additionalNotes,
        charityName: req.body.charity,
        donationAmount: req.body.percentDonated,
        serviceTitle: req.body.title,
        serviceSubject: req.body.subject,
        [languageCode(bookerLanguage)]: true,
      },
      req.body.bookerEmail,
      process.env.EMAIL_FROM!,
      TEMPLATES.BOOKING.FREELANCE_ORDER_PLACED_TO_CLIENT
    );

    // To Provider
    await sendEmailHandler(
      {
        clientName: req.body.bookerName,
        clientEmail: req.body.bookerEmail,
        clientPhone: req.body.bookerPhone,
        providerName: req.body.providerName,
        startTime: dayjs(req.body.startTime).tz(providerTimeZone).format('dddd DD MMMM YYYY'),
        endTime: dayjs(req.body.endTime).tz(providerTimeZone).format('dddd DD MMMM YYYY'),
        currency: req.body.currency,
        totalAmount: req.body.price,
        bookingId: bookId,
        additionalNotes: req.body.additionalNotes,
        charityName: req.body.charity,
        paymentType: req.body.paymentType,
        donationAmount: req.body.percentDonated,
        isEscrow: req.body.paymentType === PAYMENT_TYPE.ESCROW,
        serviceTitle: req.body.title,
        serviceSubject: req.body.subject,
        [languageCode(providerLanguage)]: true,
      },
      req.body.providerEmail,
      process.env.EMAIL_FROM!,
      TEMPLATES.BOOKING.FREELANCE_ORDER_PLACED_TO_PROVIDER
    );
  } catch (err) {
    console.log('error');
    throw err;
  }
}
