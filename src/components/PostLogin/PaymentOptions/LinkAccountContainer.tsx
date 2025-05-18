import {useSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import userMutations from 'constants/GraphQL/User/mutations';
import {useState} from 'react';
import {useRouter} from 'next/router';
import Button from '@root/components/button';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from '../../../store/Modal/Modal.context';
import {MODAL_TYPES} from '../../../constants/context/modals';

const LinkAccountContainer = ({userPaymentAccount, paymentType, paymentTypeId, user}) => {
  const {data: session} = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();

  const removePaymentAccount = async () => {
    try {
      setLoading(true);
      await graphqlRequestHandler(
        userMutations.updateUser,
        {
          userData: {
            accountDetails: {
              [paymentTypeId]: '',
              paymentAccounts: {
                escrow: user?.accountDetails?.paymentAccounts?.escrow.includes(paymentTypeId)
                  ? ['none']
                  : user?.accountDetails?.paymentAccounts?.escrow,
              },
            },
          },
          token: session?.accessToken,
        },
        session?.accessToken
      );
      router.reload();
    } catch (err) {
      setLoading(false);
      setApiError(t('common:general_api_error'));
    }
  };

  return (
    <div className='bg-white px-4 py-1 grid grid-cols-4 gap-2 mt-2'>
      <div className='col-span-4 md:col-span-2 flex flex-col break-all'>
        <h2 className='text-xl font-bold text-gray-800'>{t(`common:${paymentType}`)}</h2>
        {userPaymentAccount && (
          <span>
            {t('common:active_account')}: {userPaymentAccount}
          </span>
        )}
        {!userPaymentAccount && (
          <span className='text-sm text-gray-400'>{t('common:no_active_account')}</span>
        )}
      </div>
      {userPaymentAccount && (
        <div className='flex flex-col gap-2 col-span-4 md:col-span-2 text-lg'>
          <div className='grid grid-cols-2 gap-2'>
            <Button
              onClick={() =>
                showModal(MODAL_TYPES.ADD_PAYMENT_ACCOUNT, {
                  paymentType: paymentType,
                  paymentTypeId: paymentTypeId,
                  userPaymentAccount: userPaymentAccount,
                })
              }
              variant='solid'
              disabled={loading}
            >
              {!loading ? t('common:update_account') : t('common:txt_loading1')}
            </Button>
            <Button
              variant='cancel'
              onClick={async () => {
                await removePaymentAccount();
              }}
              disabled={loading}
            >
              {!loading ? t('common:remove_account') : t('common:txt_loading1')}
            </Button>
          </div>
          {apiError && <span className='text-base text-red-400'>{apiError}</span>}
        </div>
      )}

      {!userPaymentAccount && (
        <div className='grid grid-cols-1 col-span-4 md:col-span-1'>
          <Button
            variant='solid'
            onClick={() =>
              showModal(MODAL_TYPES.ADD_PAYMENT_ACCOUNT, {
                paymentType: paymentType,
                paymentTypeId: paymentTypeId,
                userPaymentAccount: userPaymentAccount,
              })
            }
          >
            {t('common:link_account')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LinkAccountContainer;
