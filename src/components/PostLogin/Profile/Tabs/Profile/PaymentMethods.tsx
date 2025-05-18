import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Button from 'components/shared/Button/Button';

import {DIRECT_PAYMENT_OPTIONS} from 'constants/enums';

import {PencilIcon, PlusIcon} from '@heroicons/react/20/solid';

const checkIfEmpty = arr => {
  if (arr.length === 0) return true;

  if (arr?.[0] === '' || arr?.[0] === 'none') return true;

  return false;
};

const PaymentMethods = ({User, fromDashboard}) => {
  const {t} = useTranslation();

  const accounts = User?.accountDetails?.paymentAccounts ?? {direct: [], escrow: []};

  const NoMethodFound = checkIfEmpty(accounts.direct) && checkIfEmpty(accounts.escrow);

  const stripeDirectAndEscrow =
    accounts?.direct?.includes(DIRECT_PAYMENT_OPTIONS.STRIPE) &&
    accounts?.escrow?.includes(DIRECT_PAYMENT_OPTIONS.STRIPE);

  const directMethod = checkIfEmpty(accounts.direct) ? '' : accounts?.direct?.[0];
  const escrowMethod = checkIfEmpty(accounts.escrow) ? '' : accounts?.escrow?.[0];

  const returnPaymentName = value => {
    switch (value) {
      case 'stripe':
        return 'Stripe';

      case 'upiId':
        return 'UPI';

      case 'payoneerId':
        return 'Payoneer';

      case 'paypalId':
        return 'Paypal';
      default:
        return '';
    }
  };

  return !fromDashboard ? (
    <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
      <div className='flex justify-between'>
        <h2 className='text-md font-bold text-gray-700'>{t('common:receiving_payment')}</h2>
        <div className='flex flex-row items-center'>
          <a href='/user/paymentOptions/'>
            <PlusIcon className='w-4 h-4 text-sm font-medium text-gray-500 mr-2' />
          </a>
          <a href='/user/paymentOptions/'>
            <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
          </a>
        </div>
      </div>

      {NoMethodFound && (
        <span className='mt-1 text-sm text-gray-900 overflow-hidden break-words'>
          {t('common:no_receiving_payment_msg')}
        </span>
      )}

      {!NoMethodFound && stripeDirectAndEscrow && (
        <span className='mt-1 text-sm text-gray-900 overflow-hidden break-words'>
          {t('common:receiving_payment_stripe')}
        </span>
      )}

      {!NoMethodFound && !stripeDirectAndEscrow && (
        <>
          {directMethod ? (
            <span className='mt-1 text-sm text-gray-900 overflow-hidden break-words'>
              {t('common:receiving_direct_payment')}{' '}
              <strong>{returnPaymentName(directMethod)}</strong>
            </span>
          ) : (
            <span className='mt-1 text-sm text-gray-900 overflow-hidden break-words'>
              {t('common:direct_method_not_configured')}
            </span>
          )}

          {escrowMethod ? (
            <span className='block mt-1 text-sm text-gray-900 overflow-hidden break-words'>
              {t('common:receiving_escrow_payment')}{' '}
              <strong>{returnPaymentName(escrowMethod)}</strong>
            </span>
          ) : (
            <span className='block mt-1 text-sm text-gray-900 overflow-hidden break-words'>
              {t('common:escrow_method_not_configured')}
            </span>
          )}
        </>
      )}
    </div>
  ) : (
    <div className='bg-white'>
      <div className='flex flex-col justify-between items-center'>
        <div className='text-blue-500 mx-auto mb-0'>
          <Image src={`/icons/services/manual.svg`} height={96} width={96} alt='' />
        </div>
        <h3 className='mb-2 font-bold font-heading'>{t('common:receiving_payment')}</h3>

        <div className='text-xs text-blueGray-400 h-[6rem]'>
          {NoMethodFound && (
            <span className='mt-1 text-xs text-gray-900 overflow-hidden break-words'>
              {t('common:no_receiving_payment_msg')}
            </span>
          )}

          {!NoMethodFound && stripeDirectAndEscrow && (
            <span className='mt-1 text-xs text-gray-900 overflow-hidden break-words'>
              {t('common:receiving_payment_stripe')}
            </span>
          )}

          {!NoMethodFound && !stripeDirectAndEscrow && (
            <>
              {directMethod ? (
                <span className='mt-1 text-xs text-gray-900 overflow-hidden break-words'>
                  {t('common:receiving_direct_payment')}{' '}
                  <strong>{returnPaymentName(directMethod)}</strong>
                </span>
              ) : (
                <span className='mt-1 text-xs text-gray-900 overflow-hidden break-words'>
                  {t('common:direct_method_not_configured')}
                </span>
              )}

              {escrowMethod ? (
                <span className='block mt-1 text-xs text-gray-900 overflow-hidden break-words'>
                  {t('common:receiving_escrow_payment')}{' '}
                  <strong>{returnPaymentName(escrowMethod)}</strong>
                </span>
              ) : (
                <span className='block mt-1 text-xs text-gray-900 overflow-hidden break-words'>
                  {t('common:escrow_method_not_configured')}
                </span>
              )}
            </>
          )}
        </div>
        <Button
          type='button'
          // href={`/user/services/service-form/?mode=create`}
          href={'/user/paymentOptions/'}
          text={t('common:edit_receiving_account')}
          className='inline-flex text-xs mb-4 w-3/4 sm:text-sm justify-center mt-2 mr-3 sm:w-3/4 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
        />
      </div>
    </div>
  );
};
export default PaymentMethods;
