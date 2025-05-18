import Button from '@root/components/button';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import formatCurrency from 'utils/formatCurrency';

const ProductCard = ({
  pricingData,
  isActive,
  isGifted,
  activateProduct,
  cancelSubscription,
  loadingData,
  discount,
}) => {
  const {t} = useTranslation();
  const imageLink = pricingData.product.images[0] ? pricingData.product.images[0] : '';
  const {type, resourceLink} = pricingData.product.metadata;

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
    <div className='flex flex-col text-gray-700 col-span-12 sm:col-span-6 lg:col-span-4 shadow-[0px_0px_2px_2px_rgba(120,120,120,0.1)] rounded-md'>
      <div className='px-0 py-0 grid grid-cols-1 h-full w-full gap-0'>
        <img
          className='w-full'
          src={imageLink}
          alt={`Display Image for ${pricingData.product.name} Extension`}
        />
      </div>
      <div className='px-4 py-3 grid grid-cols-1 h-full w-full gap-4'>
        <div className='flex flex-col col-span-8 gap-1'>
          <span className='font-bold w-full break-words'>{pricingData.product.name}</span>
          <span className='text-xs break-words w-full'>{pricingData.product.description}</span>
        </div>
      </div>
      <div className='px-4 pt-0 pb-1 flex justify-end items-end gap-1'>
        {type === 'active' && (
          <span className='font-semibold overflow-hidden whitespace-nowrap text-ellipsis min-w-0'>
            {getProductPrice()}
          </span>
        )}
      </div>
      <div className='grid grid-cols-2'>
        <div className='px-4 pt-0 pb-5 flex justify-start items-start gap-1'>
          {resourceLink && (
            <Link href={resourceLink} passHref>
              <Button variant='solid'>{t('common:Extension_Page')}</Button>
            </Link>
          )}
        </div>
        <div className='px-4 pt-0 pb-5 flex justify-end items-end gap-1'>
          {isActive && pricingData.type === 'recurring' ? (
            <Button
              variant='cancel'
              disabled={isDisabled}
              onClick={() => {
                cancelSubscription(pricingData);
              }}
            >
              {isLoading ? t('common:btn_canceling') : t('common:btn_cancel')}
            </Button>
          ) : isActive && pricingData.type === 'one_time' ? (
            <Button
              variant='cancel'
              disabled={isDisabled}
              onClick={() => {
                cancelSubscription(pricingData);
              }}
            >
              {isLoading ? t('common:btn_removing') : t('common:btn_remove')}
            </Button>
          ) : (
            <Button
              variant='solid'
              disabled={isDisabled || type === 'coming_soon'}
              onClick={() => {
                activateProduct(pricingData);
              }}
            >
              {type === 'coming_soon'
                ? t('common:coming_soon')
                : isLoading
                ? t('common:Activating')
                : t('common:Activate')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
