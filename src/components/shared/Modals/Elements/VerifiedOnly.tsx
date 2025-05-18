/* eslint-disable no-lone-blocks */
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useContext, useEffect, useState} from 'react';
import {LoaderIcon} from 'react-hot-toast';
import {useSession} from 'next-auth/react';
import axios from 'axios';
import {UserContext} from '@root/context/user';
import {useMutation} from '@apollo/client';
import Button from '@root/components/button';
import mutations from 'constants/GraphQL/User/mutations';
import {MODAL_TYPES} from 'constants/context/modals';
import StripeCheckoutWrapper from '../../Stripe/StripeCheckoutWrapper';
import ModalStepper from '../Modal';

const VerifiedOnly = ({providerUsername, move, countStep = 2, v, setFieldValue}) => {
  const {t} = useTranslation();
  const {hideModal, showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const {refetchUser} = useContext(UserContext);
  const [updateUser] = useMutation(mutations.updateUser);

  useEffect(refetchUser);
  const [currentStep, setCurrentStep] = useState('initial');
  const [stripeFormLoading, setStripeFormLoading] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState('');

  const showSmsOtpModal = () => {
    showModal(MODAL_TYPES.VERIFY_BOOKING_SMS_OTP, {
      phone: v.bookingData.bookerPhone,
      move,
      setFieldValue,
    });
  };

  const prepStripeForm = async () => {
    setStripeFormLoading(true);
    const {data} = await axios.post('/api/stripe/createPaymentIntent', {
      price: 1,
      email: session?.user?.email,
    });

    setStripeClientSecret(data.clientSecret);
    setStripeFormLoading(false);
    setCurrentStep('stripeForm');
  };

  const handleStripeSuccess = async () => {
    await updateUser({
      variables: {
        userData: {accountDetails: {verifiedAccount: true}},
        token: session?.accessToken,
      },
    });
    await refetchUser();
    await axios.post('/api/statistics/globalBusiness', {
      fields: {
        totalUsersVerified: 1,
      },
    });
    setCurrentStep('paymentSuccess');
    if (
      v?.bookingData?.bookerSmsReminders &&
      v?.bookingData?.bookerNumberVerified !== v?.bookingData?.bookerPhone
    ) {
      await showSmsOtpModal();
      return;
    }
    move && move('next', false);
  };
  const steps: any = [];
  for (let index = 0; index < countStep; index++) {
    steps.push('*');
  }
  return (
    <ModalStepper
      title={t('profile:Get_Verified')}
      // size={8} step={1} max={steps}
      medium
    >
      {stripeFormLoading ? (
        <div className={'flex justify-center py-6'}>
          <LoaderIcon style={{width: '48px', height: '48px'}} />
        </div>
      ) : currentStep === 'initial' ? (
        <>
          <div className='bg-white'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 text-center sm:text-left'>
                <h3 className='text-lg leading-6 font-medium text-gray-900' id='modal-title'>
                  {providerUsername
                    ? `${providerUsername} ${t('profile:Verified_Notice_Description')}`
                    : t('profile:Verified_Notice_Description')}
                </h3>
              </div>
            </div>
          </div>
          <div className='py-3  flex flex-row-reverse flex-wrap sm:flex-nowrap '>
            <Button
              variant='solid'
              onClick={async () => {
                await prepStripeForm();
              }}
              className='w-full flex flex-col justify-center items-center'
            >
              {t('profile:Get_Verified')}
            </Button>
          </div>
        </>
      ) : currentStep === 'stripeForm' ? (
        <StripeCheckoutWrapper
          price={1}
          receiptEmail={session?.user?.email}
          postProcessingCallback={handleStripeSuccess}
          clientSecret={stripeClientSecret}
        />
      ) : (
        <>
          <div className='bg-white'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 text-center sm:text-left'>
                <h3 className='text-lg leading-6 font-medium text-gray-900' id='modal-title'>
                  {t('profile:Verified_Success')}
                </h3>
              </div>
            </div>
          </div>
          <div className='py-3  flex flex-row-reverse flex-wrap sm:flex-nowrap '>
            <Button
              variant='solid'
              onClick={async () => {
                await hideModal();
              }}
              className='w-full flex flex-col justify-center items-center'
            >
              {t('common:btn_continue')}
            </Button>
          </div>
        </>
      )}
    </ModalStepper>
  );
};
export default VerifiedOnly;
