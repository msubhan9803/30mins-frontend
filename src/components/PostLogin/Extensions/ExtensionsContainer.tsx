/* eslint-disable @typescript-eslint/dot-notation */
import {useSession} from 'next-auth/react';
import React, {useEffect, useState} from 'react';
import ProductCard from 'components/PostLogin/Extensions/ProductCard';
import axios from 'axios';
import {useStripe} from '@stripe/react-stripe-js';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {useRouter} from 'next/router';
import activeExtensionsQueries from 'constants/GraphQL/ActiveExtension/queries';
import activeExtensionsMutations from 'constants/GraphQL/ActiveExtension/mutations';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import createSubscriptionHandler from 'utils/createSubscriptionHandler';
import chargeCardHandler from 'utils/chargeCardHandler';
import PaymentError from './PaymentError';
import stripeProductIDs from '../../../constants/stripeProductIDs';

const ExtensionsContainer = ({
  prices,
  paymentMethods,
  customerId,
  activeExtensions,
  giftedExtensions,
  discount,
}) => {
  const stripe = useStripe();
  const {data: session} = useSession();
  const router = useRouter();
  const {showModal, hideModal} = ModalContextProvider();
  const {t} = useTranslation();

  const [paymentError, setPaymentError] = useState('');
  const [loadingData, setLoadingData] = useState({
    productId: '',
    loading: false,
  });

  const activateProduct = async (
    priceObject,
    customPaymentMethods = paymentMethods,
    customCustomerId = customerId
  ) => {
    try {
      setLoadingData({
        productId: priceObject.product.id,
        loading: true,
      });

      const customerIdToUse = customCustomerId ? customCustomerId : customerId;

      if (priceObject.type === 'recurring') {
        const response = await createSubscriptionHandler(
          session,
          priceObject,
          customerIdToUse,
          stripe,
          customPaymentMethods
        );

        if (!response.success) {
          setPaymentError(response.message);
        }
      }

      if (priceObject.type === 'one_time') {
        const response = await chargeCardHandler(
          priceObject,
          customerId,
          session,
          customPaymentMethods
        );
        if (!response.success) {
          setPaymentError(response.message);
        }
      }

      router.reload();
    } catch (err) {
      hideModal();
      setPaymentError('Unknown Error');
      setLoadingData({
        productId: '',
        loading: false,
      });
    }
  };

  const cancelSubscription = async priceObject => {
    try {
      await axios.post('/api/stripe/cancelSubscription', {
        productId: priceObject.id,
      });

      router.reload();
    } catch (err) {
      console.log('Unknown Error');
      hideModal();
    }
  };

  const removeFreeExtenstion = async priceObject => {
    try {
      const {data: extensionDataResponse} = await graphqlRequestHandler(
        activeExtensionsQueries.getActiveExtensionByProductId,
        {
          token: session?.accessToken,
          productId: priceObject?.id,
        },
        session?.accessToken
      );

      const {_id: documentId} =
        extensionDataResponse.data.getActiveExtensionByProductId.activeExtensionData;

      await graphqlRequestHandler(
        activeExtensionsMutations.deleteActiveExtension,
        {
          token: session?.accessToken,
          documentId,
        },
        session?.accessToken
      );
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };
  const sortedPrices = prices.sort((a, b) => {
    if (a?.product?.name < b?.product?.name) {
      return -1;
    }
    if (a?.product?.name > b?.product?.name) {
      return 1;
    }
    return 0;
  });

  const getProductPrice = unitPrice => {
    const productPrice = unitPrice / 100;
    if (discount) {
      return productPrice - productPrice * discount;
    }
    return productPrice;
  };

  const showCheckoutModal = priceObject => {
    if (priceObject?.product?.metadata?.type === 'active') {
      showModal(MODAL_TYPES.EXTENSIONS_CHECKOUT, {
        handleSubmit: async (customPaymentMethods, customCustomerId) => {
          await activateProduct(priceObject, customPaymentMethods, customCustomerId);
        },
        productData: priceObject,
        price: getProductPrice(priceObject.unit_amount),
        paymentMethods,
      });
    }
  };

  useEffect(() => {
    prices?.forEach(price => {
      if (router?.query?.extension) {
        if (price.id === stripeProductIDs.EXTENSIONS[router.query.extension.toString()]) {
          showCheckoutModal(price);
        }
      }
    });
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      {paymentError ? (
        <PaymentError
          closeError={() => {
            setPaymentError('');
          }}
          errorMessage={paymentError}
        />
      ) : null}
      <div className='grid grid-cols-12 gap-6'>
        {sortedPrices.map((price, index) => {
          if (price.product.metadata?.type !== 'disabled') {
            return (
              <ProductCard
                key={index}
                pricingData={price}
                discount={discount}
                isActive={activeExtensions.includes(price.id)}
                isGifted={giftedExtensions.includes(price.id)}
                activateProduct={priceObject => {
                  showModal(MODAL_TYPES.EXTENSIONS_CHECKOUT, {
                    handleSubmit: async (customPaymentMethods, customCustomerId) => {
                      await activateProduct(priceObject, customPaymentMethods, customCustomerId);
                    },
                    productData: priceObject,
                    price: getProductPrice(priceObject.unit_amount),
                    paymentMethods,
                  });
                }}
                cancelSubscription={priceObject => {
                  showModal(MODAL_TYPES.CONFIRM, {
                    handleConfirm: () => {
                      priceObject?.product?.metadata?.isFree ||
                      giftedExtensions?.includes(priceObject?.id)
                        ? removeFreeExtenstion(priceObject)
                        : cancelSubscription(priceObject);
                    },

                    title:
                      priceObject?.product?.metadata?.isFree ||
                      giftedExtensions?.includes(priceObject?.id)
                        ? t('common:extension_cancel_free_title')
                        : t('common:extension_cancel_title'),
                    message:
                      priceObject?.product?.metadata?.isFree ||
                      giftedExtensions?.includes(priceObject?.id)
                        ? `${t('common:extension_cancel_free_question')} ${
                            priceObject.product.name
                          }?`
                        : `${t('common:extension_cancel_question')} ${priceObject.product.name}?`,
                  });
                }}
                loadingData={loadingData}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ExtensionsContainer;
