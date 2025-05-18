import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import formatCurrency from '../../../../utils/formatCurrency';

const ProductDisplay = ({
  pricingData,
  isActive,
  isGifted,
  activateProduct,
  cancelSubscription,
  loadingData,
  discount,
}) => {
  const {t} = useTranslation();
  const {type} = pricingData.product.metadata;

  const recurringInterval = pricingData?.recurring?.interval
    ? `/${pricingData?.recurring?.interval}`
    : '';

  const getProductPrice = () => {
    const productPrice = pricingData.unit_amount / 100;

    if (pricingData.product.metadata?.isFree) {
      return t('common:Free');
    }

    if (isGifted) {
      return t('common:Gifted');
    }

    if (discount) {
      const discountedPrice = productPrice - productPrice * discount;
      return `${formatCurrency.format(discountedPrice)}${recurringInterval}`;
    }

    return `${formatCurrency.format(productPrice)}${recurringInterval}`;
  };

  const isLoading = loadingData.productId === pricingData.product.id && loadingData.loading;

  const isDisabled = loadingData.loading && isActive;

  return (
    <div className={'w-full'}>
      <div className='px-4 pt-0 pb-1 flex justify-center items-end gap-1'>
        {type === 'active' && (
          <span className='text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis min-w-0'>
            {getProductPrice()}
          </span>
        )}
      </div>
      <div className='px-4 pt-0 pb-5 flex justify-end items-end gap-1'>
        {isActive && pricingData.type === 'recurring' ? (
          <button
            className={
              'text-lg bg-red-500 text-white py-2 px-4 rounded-lg w-full hover:bg-white hover:ring-red-500 hover:ring-1 hover:text-red-500 duration-200'
            }
            disabled={isDisabled}
            onClick={() => {
              cancelSubscription(pricingData);
            }}
          >
            {isLoading ? t('common:btn_canceling') : t('common:btn_cancel')}
          </button>
        ) : isActive && pricingData.type === 'one_time' ? (
          <button
            className={
              'text-lg bg-red-500 text-white py-2 px-4 rounded-lg w-full hover:bg-white hover:ring-red-500 hover:ring-1 hover:text-red-500 duration-200'
            }
            disabled={isDisabled}
            onClick={() => {
              cancelSubscription(pricingData);
            }}
          >
            {isLoading ? t('common:btn_removing') : t('common:btn_remove')}
          </button>
        ) : (
          <button
            className={
              'text-lg bg-mainBlue text-white py-2 px-4 rounded-lg w-full hover:bg-white hover:ring-mainBlue hover:ring-1 hover:text-mainBlue duration-200'
            }
            disabled={isDisabled || type === 'coming_soon'}
            onClick={() => {
              activateProduct(pricingData);
            }}
          >
            {type === 'coming_soon'
              ? t('common:coming_soon')
              : isLoading
              ? t('common:Activating')
              : t('common:subscribe_now')}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;
