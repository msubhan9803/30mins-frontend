import React, {useRef, useState} from 'react';

import {PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import Recaptcha from 'react-google-recaptcha';
import useTranslation from 'next-translate/useTranslation';
import axios from 'axios';
import dayjs from 'dayjs';
import checkEmailFilter from 'utils/checkEmailFilter';
import {useSession} from 'next-auth/react';
import {PAYMENT_ACCOUNTS, SERVICE_TYPES} from 'constants/enums';
import {IinitialValues} from '../../constants';

const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isBetween = require('dayjs/plugin/isBetween');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const CheckOutForm = ({values, moveBack}: {values: IinitialValues; moveBack(): void}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const elements = useElements();
  const [paymentError, setPaymentError] = useState('');
  const [emailError, setEmailError] = useState('');
  const stripe = useStripe();
  const {t} = useTranslation();
  const recaptchaRef = useRef<Recaptcha>();
  const {data: session} = useSession();
  const [apiError, setApiError] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();

    setLoading(true);
    setApiError('');
    setPaymentError('');
    setEmailError('');

    try {
      const allowedEmail = await checkEmailFilter({
        bookerEmail: session?.user?.email!,
        accessToken: session?.accessToken,
        emailFilterB: values.serviceData?.blackList?.emails,
        domainFilterB: values.serviceData?.blackList?.domains,
        emailFilterW: values.serviceData?.whiteList?.emails,
        domainFilterW: values.serviceData?.whiteList?.domains,
      });

      if (!allowedEmail) {
        setApiError('This email has been blocked by the Provider');
        setLoading(false);
        return;
      }
    } catch (err) {
      setApiError('An unknown error occurred');
      setLoading(false);
      return;
    }

    try {
      if (!elements || !stripe) {
        setApiError(t('common:stripe_api_error'));
        setLoading(false);
        return;
      }

      const captchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();

      const dateBooked =
        values.serviceData.serviceType === SERVICE_TYPES.MEETING
          ? dayjs(values.selectedTime).format()
          : dayjs();
      const bookingStartTime =
        values.serviceData.serviceType === SERVICE_TYPES.MEETING ? values.selectedTime : dayjs();
      const bookingEndTime =
        values.serviceData.serviceType === SERVICE_TYPES.MEETING
          ? dayjs(values.selectedTime).add(values.serviceData.duration, 'minute')
          : dayjs().add(values?.serviceData?.dueDate, 'day');

      const attachment = values.bookingData.attachment ? values.bookingData.attachment : null;

      const bookingDataSend = {
        serviceID: values.serviceData._id,
        serviceType: values.serviceData.serviceType,
        chargeID: values.clientSecret,
        providerUsername: values.user.accountDetails.username,
        subject: values.bookingData.subject,
        dateBooked: dateBooked,
        bookerName: values.bookingData.bookerName,
        bookerEmail: values.bookingData.bookerEmail,
        providerName: values.user.personalDetails.name,
        providerEmail: values.user.accountDetails.email,
        bookerPhone: values.bookingData.bookerPhone,
        bookerTimeZone: values.selectedBookerTimezone,
        ccRecipients: values.bookingData.ccRecipients?.toString().split(';'),
        attachment: attachment,
        additionalNotes: values.bookingData.additionalNotes,
        meetingCount: parseInt(values.bookingData.meetingCount, 10) + 1,
        price: values.serviceData.price * (parseInt(values.bookingData.meetingCount, 10) + 1),
        paymentAccount: PAYMENT_ACCOUNTS.STRIPE,
        paymentType: values.serviceData.paymentType,
        currency: values.serviceData.currency,
        meetingDate: values.selectedDate,
        paymentStatus: 'PENDING',
        percentDonated: values.serviceData.percentDonated,
        charity: values.serviceData.charity,
        title: values.serviceData.title,
        conferenceType: values.bookingData.conferenceType,
        startTime: bookingStartTime,
        endTime: bookingEndTime,
        meetingDuration: values.serviceData.duration,
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
      };

      const formData = new FormData();
      if (values.bookingData.attachment && values.bookingData.attachment[0]) {
        formData.append('attachment', values.bookingData.attachment[0]);
      }
      formData.append('bookingData', JSON.stringify(bookingDataSend));

      const {data: bookingData} = await axios.post('/api/booking/createPendingBooking', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const {error} = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_FRONT_END_URL!}/confirmBooking?bookingId=${
            bookingData.bookingId
          }&providerUsername=${values.user.accountDetails.username}&serviceTitle=${
            values.serviceData.title
          }&selectedDate=${values.selectedTime}`,
          receipt_email: values.bookingData.bookerEmail,
        },
      });

      if (error?.type === 'invalid_request_error') {
        setLoading(false);
        setPaymentError(t('common:processing_error'));
        return;
      }
      if (error) {
        setLoading(false);
        setPaymentError(`${error.message!} ${t('common:check_info_error')}`);
        return;
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        setEmailError(error.response.data.message);
        setLoading(false);
        return;
      }
      setPaymentError(`${t('common:payment_failed')}. ${t('common:check_info_error')}`);
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex flex-wrap justify-center'>
        <form className='flex flex-wrap gap-3 w-full justify-center p-4' onSubmit={handleSubmit}>
          <span className='text-red-500 text-lg'>{paymentError || emailError || apiError}</span>
          <Recaptcha
            ref={recaptchaRef}
            size='invisible'
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
          />
          <div className='flex flex-col justify-center w-full gap-2'>
            <PaymentElement />
            <button
              disabled={loading}
              className='bg-mainBlue mt-2 flex justify-center items-center px-5 py-3 border border-gray-300 font-bold rounded-md text-white hover:bg-blue-700'
            >
              {loading ? (
                t('common:txt_loading1')
              ) : (
                <>
                  {t('common:txt_Pay')} {values.serviceData.currency}
                  {values.serviceData.price * (parseInt(values.bookingData.meetingCount, 10) + 1)}
                </>
              )}
            </button>
            <button
              className='px-5 py-3 bg-red-400 rounded-md font-bold mx-auto w-full h-full text-white active:opacity-50'
              onClick={() => moveBack()}
            >
              {t('common:back')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CheckOutForm;
