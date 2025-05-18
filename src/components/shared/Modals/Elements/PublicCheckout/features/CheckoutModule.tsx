/* eslint-disable no-lone-blocks */
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useContext, useEffect, useState} from 'react';
import {LoaderIcon, toast} from 'react-hot-toast';
import {useSession} from 'next-auth/react';
import axios from 'axios';
import {UserContext} from '@root/context/user';
import {useMutation} from '@apollo/client';
import Button from '@root/components/button';
import ProductMutations from 'constants/GraphQL/Products/mutations';
import StripeCheckoutWrapper from '../../../../Stripe/StripeCheckoutWrapperCheckout';

const PublicCheckout = ({sellerStripId, sellerId, amount, refetch}) => {
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const {data: session} = useSession();
  const {refetchUser} = useContext(UserContext);

  useEffect(refetchUser);
  const [currentStep, setCurrentStep] = useState('stripeForm');
  const [stripeFormLoading, setStripeFormLoading] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState('');
  const [checkout] = useMutation(ProductMutations.checkout);

  const prepStripeForm = async () => {
    try {
      setStripeFormLoading(true);
      const {data} = await axios.post('/api/stripe/createCheckoutIntent', {
        sellerStripId: sellerStripId,
        price: amount,
        email: session?.user?.email,
      });
      setStripeClientSecret(data.clientSecret);
      setStripeFormLoading(false);
      // setCurrentStep('stripeForm');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setStripeFormLoading(true);
    prepStripeForm().then(() => {
      setCurrentStep('stripeForm');
      setStripeFormLoading(false);
    });
  }, []);

  const handleStripeSuccess = async () => {
    toast.loading('loading');
    await checkout({
      variables: {
        token: session?.accessToken,
        sellerId: sellerId,
      },
    });
    toast.dismiss();
    toast.success('Done successfully');
    await refetch!();
    hideModal();
  };

  return (
    <div>
      {stripeFormLoading ? (
        <div className={'flex justify-center py-6'}>
          <LoaderIcon style={{width: '48px', height: '48px'}} />
        </div>
      ) : currentStep === 'stripeForm' ? (
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
    </div>
  );
};
export default PublicCheckout;
