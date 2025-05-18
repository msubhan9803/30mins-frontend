import React, {useState} from 'react';

import {PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import useTranslation from 'next-translate/useTranslation';
import dayjs from 'dayjs';
import {useRouter} from 'next/router';
import Button from '@root/components/button';
// import {ModalContextProvider} from 'store/Modal/Modal.context';

const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isBetween = require('dayjs/plugin/isBetween');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const StripeCheckOutForm = ({receiptEmail, price, postProcessingCallback}) => {
  const router = useRouter();
  // const {hideModal} = ModalContextProvider();
  const [loading, setLoading] = useState<boolean>(false);
  const elements = useElements();
  const [paymentError, setPaymentError] = useState('');
  const stripe = useStripe();
  const {t} = useTranslation();
  const [apiError, setApiError] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();

    setLoading(true);
    setApiError('');
    setPaymentError('');

    try {
      if (!elements || !stripe) {
        setApiError(t('common:stripe_api_error'));
        setLoading(false);
        return;
      }

      const {error} = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_FRONT_END_URL}${router.asPath}`,
          receipt_email: receiptEmail,
        },
        redirect: 'always',
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
      await postProcessingCallback();
    } catch (error) {
      setPaymentError(`${t('common:payment_failed')}. ${t('common:check_info_error')}`);
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex flex-wrap justify-center'>
        <form className='flex flex-wrap gap-3 w-full justify-center p-4' onSubmit={handleSubmit}>
          <span className='text-red-500 text-lg'>{paymentError || apiError}</span>
          <div className='flex flex-col justify-center gap-2 w-full'>
            <PaymentElement />
            <Button
              variant='solid'
              type='submit'
              className='w-full flex flex-col justify-center items-center'
              onClick={() => {}}
              disabled={loading}
            >
              {loading ? (
                t('common:txt_loading1')
              ) : (
                <>
                  {t('common:txt_Pay')} {'$'}
                  {price}{' '}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default StripeCheckOutForm;
