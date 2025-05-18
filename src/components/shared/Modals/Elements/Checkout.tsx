import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useEffect, useState} from 'react';
import {LoaderIcon, toast} from 'react-hot-toast';
import {useSession} from 'next-auth/react';
import axios from 'axios';
import Button from '@root/components/button';
import {useRouter} from 'next/router';
import StripeCheckoutWrapper from '../../Stripe/StripeCheckoutWrapperCheckout';
import ModalStepper from '../Modal';

const Checkout = ({amount, Step, invoiceLink, checkoutId}) => {
  const {t} = useTranslation();
  const {push} = useRouter();
  const {hideModal} = ModalContextProvider();
  const {data: session} = useSession();
  const [currentStep, setCurrentStep] = useState(Step ? Step : 'stripeForm');
  const [stripeFormLoading, setStripeFormLoading] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<any>();

  const prepStripeForm = async () => {
    try {
      setStripeFormLoading(true);
      const {data} = await axios.post('/api/stripe/createCheckoutIntent', {
        price: amount,
        email: session?.user?.email,
      });
      setStripeClientSecret(data.clientSecret);
      setStripeFormLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!invoiceLink || amount <= 0) {
      setStripeFormLoading(true);
      prepStripeForm().then(() => {
        setCurrentStep('stripeForm');
        setStripeFormLoading(false);
      });
    }
  }, []);

  const handleStripeSuccess = async () => {
    try {
      return;
    } catch (error) {
      toast.dismiss();
    }
  };

  return (
    <ModalStepper title={t('page:Checkout')} medium>
      {stripeFormLoading ? (
        <div className={'flex justify-center py-6'}>
          <LoaderIcon style={{width: '48px', height: '48px'}} />
        </div>
      ) : currentStep === 'stripeForm' && amount > 0 ? (
        <StripeCheckoutWrapper
          price={amount}
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
                  {t('common:Congratulations_Success')}
                </h3>
              </div>
            </div>
          </div>
          <div className='py-3 flex flex-col gap-2 sm:flex-nowrap '>
            {invoiceLink ? (
              <a href={invoiceLink} target={'_blank'} rel='noreferrer'>
                <Button
                  variant='solid'
                  className='w-full flex flex-col justify-center items-center'
                >
                  {t('common:View Invoice')}
                </Button>
              </a>
            ) : null}
            <Button
              variant='outline'
              onClick={async () => {
                push(`/user/purchases/${checkoutId}`);
              }}
              className='w-full flex flex-col justify-center items-center'
            >
              {t('common:product_checkout_download')}
            </Button>
            <Button
              variant='ghost'
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
export default Checkout;
