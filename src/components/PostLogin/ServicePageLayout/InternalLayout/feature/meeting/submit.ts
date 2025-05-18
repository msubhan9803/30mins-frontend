import axios from 'axios';
// import checkEmailFilter, {EmailFilters} from 'utils/checkEmailFilter';
import {PAYMENT_TYPE, SERVICE_TYPES} from 'constants/enums';
import {IinitialValues} from './constants';

const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isBetween = require('dayjs/plugin/isBetween');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

export default async function submitHandler(values: IinitialValues, setFieldValue, t) {
  // try {
  //   const res = await checkEmailFilter({
  //     bookerEmail: values.bookingData.bookerEmail,
  //     accessToken: session?.accessToken,
  //     emailFilterB: values.serviceData?.blackList?.emails,
  //     domainFilterB: values.serviceData?.blackList?.domains,
  //     emailFilterW: values.serviceData?.whiteList?.emails,
  //     domainFilterW: values.serviceData?.whiteList?.domains,
  //   });
  //   switch (res) {
  //     case EmailFilters.blackEmail:
  //       throw new Error('email_blocked');
  //     case EmailFilters.blackDomain:
  //       throw new Error('black_domain_message');
  //     case EmailFilters.whiteEmail:
  //       throw new Error('white_email_message');
  //     case EmailFilters.whiteDomain:
  //       throw new Error('white_domain_message');
  //     default:
  //       break;
  //   }
  // } catch (err) {
  //   throw new Error(err.message);
  // }

  const translatedType = t(`event:${values.bookingData.conferenceType}`);

  if (values.serviceData.price !== 0 && values.serviceData.paymentType !== PAYMENT_TYPE.MANUAL) {
    try {
      const {data} = await axios.post('/api/stripe/createBookingIntent', {
        connectedAccountId: values.user.accountDetails.stripeAccountId,
        price: values.serviceData.price,
        currency: values.serviceData.currency,
        isEscrow: values.serviceData.paymentType === 'escrow',
        meetingCount: parseInt(values.bookingData.meetingCount, 10) + 1,
        bookerEmail: values.bookingData.bookerEmail,
        percentDonated: values.serviceData.percentDonated,
      });
      setFieldValue('clientSecret', data.clientSecret);
      setFieldValue('showCheckoutForm', true);
    } catch (err) {
      throw new Error(t('common:general_api_error'));
    }
  } else {
    try {
      const captchaToken = await values.recaptchaRef.executeAsync();
      values.recaptchaRef.reset();

      const attachment = values.bookingData.attachment ? values.bookingData.attachment : null;
      const dateBooked =
        values.serviceData.serviceType === SERVICE_TYPES.MEETING ||
        values.serviceData.serviceType === SERVICE_TYPES.ROUND_ROBIN
          ? dayjs(values.selectedTime).format()
          : dayjs();
      const bookingStartTime =
        values.serviceData.serviceType === SERVICE_TYPES.MEETING ||
        values.serviceData.serviceType === SERVICE_TYPES.ROUND_ROBIN
          ? values.selectedTime
          : dayjs();
      const bookingEndTime =
        values.serviceData.serviceType === SERVICE_TYPES.MEETING ||
        values.serviceData.serviceType === SERVICE_TYPES.ROUND_ROBIN
          ? dayjs(values.selectedTime).add(values.serviceData.duration, 'minute')
          : dayjs().add(values?.serviceData?.dueDate, 'day');

      const bookingData = {
        serviceID: values.serviceData._id,
        serviceType: values.serviceData.serviceType,
        providerUsername: values.user.accountDetails.username,
        subject: values.bookingData.subject,
        dateBooked: dateBooked,
        bookerName: values.bookingData.bookerName,
        bookerEmail: values.bookingData.bookerEmail,
        providerName: values.user.accountDetails.username,
        providerEmail: values.user.accountDetails.email,
        bookerPhone: values.bookingData.bookerPhone,
        bookerTimeZone: values.selectedBookerTimezone,
        ccRecipients: values.bookingData.ccRecipients?.toString().split(';'),
        additionalNotes: values.bookingData.additionalNotes,
        attachment: attachment,
        meetingCount: parseInt(values.bookingData.meetingCount, 10) + 1,
        price: values.serviceData.price * (values.bookingData.meetingCount + 1),
        paymentAccount: 'Manual',
        paymentType: values.serviceData.paymentType,
        currency: values.serviceData.currency,
        meetingDate: dayjs(values.selectedDate),
        paymentStatus: 'UNPAID',
        percentDonated: values.serviceData.percentDonated,
        charity: values.serviceData.charity,
        title: values.serviceData.title,
        conferenceType: values.bookingData.conferenceType,
        translatedType: translatedType,
        startTime: bookingStartTime,
        endTime: bookingEndTime,
        meetingDuration: values.serviceData.duration,
        reminders: '',
        captchaToken: captchaToken,
        status: {
          clientConfirmed: false,
          clientCanceled: false,
          providerConfirmed: false,
          providerCanceled: false,
          providerDeclined: false,
          refundRequested: false,
          refunded: false,
          hasOpenReport: false,
          reportReason: '',
          postMeetingNotes: '',
          postMeetingFeedback: '',
        },
        answeredQuestions: values.bookingData.answeredQuestions?.map(el => ({
          answer: el.answer,
          question: el.question,
          questionType: el.questionType,
          selectedOptions: el.selectedOptions,
        })),
        smsSettings: {
          bookerSms: {
            phone: values?.bookingData?.bookerPhone || '',
            reminders: values?.bookingData?.bookerSmsReminders || false,
          },
          providerSms: {
            phone: values.user?.accountDetails?.smsSettings?.phone || '',
            reminders: values.user?.accountDetails?.smsSettings?.reminders || false,
          },
        },
      };

      const formData = new FormData();
      if (values.bookingData.attachment && values.bookingData.attachment[0]) {
        formData.append('attachment', values.bookingData.attachment[0]);
      }
      formData.append('bookingData', JSON.stringify(bookingData));

      await axios.post('/api/booking/freeBooking', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFieldValue('confirmBooking', true);
    } catch (err) {
      if (err?.response?.status !== 200) {
        throw new Error(err.response.data.message);
      }
    }
  }
}
