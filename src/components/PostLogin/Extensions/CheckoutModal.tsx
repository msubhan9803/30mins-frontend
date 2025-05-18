/* eslint-disable no-lone-blocks */
import React, {useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import axios from 'axios';
import {useSession} from 'next-auth/react';
import Modal from '../../shared/Modals/Modal';
import formatCurrency from '../../../utils/formatCurrency';
import ElementsFormWrapper from './ElementsFormWrapper';

const CheckoutModal = () => {
  const {data: session} = useSession();
  const {t} = useTranslation();
  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {handleSubmit, productData, price, paymentMethods} = modalProps || {};

  const [loading, setLoading] = useState(false);
  const [showMethodForm, setShowMethodForm] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(paymentMethods[0]);
  const [internalPaymentMethods, setInternalPaymentMethods] = useState(paymentMethods);

  const getSetupIntent = async () => {
    try {
      const {data: intentResponse} = await axios.post('/api/stripe/createSetupIntent', {
        accessToken: session?.accessToken,
      });
      setClientSecret(intentResponse.clientSecret);
      setCustomerId(intentResponse.customerId);
      setShowMethodForm(true);
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  const intervalText =
    productData.recurring?.interval === 'month' ? t('common:monthly') : t('common:annually');

  return (
    <Modal
      title={
        showMethodForm
          ? t('common:add_payment_method')
          : price
          ? `${t('page:You_Are_Subscribing')} ${intervalText}`
          : `${t('common:Activate')} ${productData?.product?.name}`
      }
      extraMedium
      isTrim={false}
    >
      {showMethodForm ? (
        <ElementsFormWrapper
          secret={clientSecret}
          setShowMethodForm={setShowMethodForm}
          customerId={customerId}
          modalView={true}
          setPaymentMethods={setInternalPaymentMethods}
        />
      ) : (
        <>
          <div className={'grid grid-cols-8 w-full border-y-2 p-2'}>
            <span
              className={
                'justify-self-start font-semibold my-auto text-sm col-span-4 md:col-span-2'
              }
            >
              {productData.product.name}
            </span>
            <span className={'hidden text-sm md:line-clamp-3 col-span-4'}>
              {productData.product.description}
            </span>
            <span
              className={'justify-self-end font-semibold my-auto text-sm col-span-4 md:col-span-2'}
            >
              {formatCurrency.format(price)}
            </span>
          </div>
          <div className={'flex justify-between items-center w-full flex-wrap'}>
            {internalPaymentMethods?.length > 0 && price ? (
              <select
                className={
                  'w-64 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 text-sm'
                }
                onChange={e => {
                  setSelectedPaymentMethod(internalPaymentMethods[e.target.value]);
                }}
              >
                {internalPaymentMethods.map((paymentMethod, index) => (
                  <option key={paymentMethod?.id} value={index}>
                    {`**** **** **** ${paymentMethod.card.last4}`} -{' '}
                    {`${
                      paymentMethod.card.exp_month < 10
                        ? `0${paymentMethod.card.exp_month}`
                        : `${paymentMethod.card.exp_month}`
                    }/${paymentMethod.card.exp_year}`}
                  </option>
                ))}
              </select>
            ) : null}
            <span className={'text-sm font-semibold'}>
              {t('common:total_due_today')}: {formatCurrency.format(price)}
            </span>
          </div>
          <div className='flex justify-end flex-wrap sm:flex-nowrap gap-2 mt-2'>
            <button
              type='button'
              onClick={async () => {
                if (!internalPaymentMethods?.length && price) {
                  await getSetupIntent();
                  setShowMethodForm(true);
                } else {
                  setLoading(true);
                  const methodToUse = selectedPaymentMethod
                    ? selectedPaymentMethod
                    : internalPaymentMethods[0];

                  handleSubmit([methodToUse], customerId);
                }
              }}
              className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-mainBlue hover:bg-mainBlue hover:text-white duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
            >
              {loading ? t('common:Activating') : t('common:btn_checkout')}
            </button>

            <button
              type='button'
              disabled={loading}
              onClick={hideModal}
              className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600'
            >
              {t('common:btn_cancel')}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};
export default CheckoutModal;
