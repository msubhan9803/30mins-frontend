import {useSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import stripeMutations from 'constants/GraphQL/StripeAccount/mutations';
import {useState} from 'react';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Button from '@root/components/button';

const LinkStripeContainer = ({userStripeAccount, accountDocumentId}) => {
  const {data: session} = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const {t} = useTranslation();

  const chargesEnabled = userStripeAccount?.charges_enabled;
  const pendingVerification =
    userStripeAccount?.requirements?.disabled_reason === 'requirements.pending_verification';

  const removeStripeAccount = async () => {
    try {
      setLoading(true);
      await graphqlRequestHandler(
        stripeMutations.deleteStripeAccount,
        {token: session?.accessToken, documentId: accountDocumentId},
        session?.accessToken
      );
      router.reload();
    } catch (err) {
      setLoading(false);
      setApiError(t('common:general_api_error'));
    }
  };

  return (
    <div className='bg-white px-4 py-1 grid grid-cols-2 md:grid-cols-4 gap-2 mt-2'>
      <div className='col-span-2 flex flex-col'>
        <h2 className='text-xl font-bold text-gray-800'>{t('common:stripe_account')}</h2>
        {!userStripeAccount || !chargesEnabled ? (
          <span className='text-sm text-gray-400'>{t('common:no_active_account')}</span>
        ) : null}
        {userStripeAccount && chargesEnabled ? (
          <span>
            {t('common:active_account')}: {userStripeAccount.email}
          </span>
        ) : null}
      </div>
      {userStripeAccount && chargesEnabled && (
        <div className='flex flex-col gap-2 col-span-2 text-lg'>
          <div className='grid grid-cols-2 gap-2 w-full'>
            <a href='/api/stripe/createAccount' className='w-full col-span-1'>
              <Button variant='solid' className='w-full'>
                {!loading ? t('common:update_account') : t('common:txt_loading1')}
              </Button>
            </a>
            <Button
              variant='cancel'
              onClick={async () => {
                await removeStripeAccount();
              }}
              disabled={loading}
            >
              {!loading ? t('common:remove_account') : t('common:txt_loading1')}
            </Button>
          </div>
          {apiError && <span className='text-base text-red-400'>{apiError}</span>}
        </div>
      )}

      {userStripeAccount && !chargesEnabled && (
        <>
          <div className='col-span-4 sm:col-span-2 flex flex-col gap-2'>
            <p className='text-sm text-red-400'>
              {pendingVerification ? t('common:stripe_pending') : t('common:stripe_info_needed')}
            </p>
            <div className='grid grid-cols-2 gap-2'>
              <a href='/api/stripe/createAccount' className='w-full'>
                <Button variant='solid' className='w-full'>
                  {!loading ? t('common:update_account') : t('common:txt_loading1')}
                </Button>
              </a>
              <Button
                variant='cancel'
                onClick={async () => {
                  await removeStripeAccount();
                }}
                disabled={loading}
              >
                {!loading ? t('common:remove_account') : t('common:txt_loading1')}
              </Button>
            </div>
          </div>
        </>
      )}

      {!userStripeAccount && (
        <div className='col-span-1'>
          <a href='/api/stripe/createAccount' className='w-full'>
            <Button variant='solid' disabled={loading} className='w-full'>
              {!loading ? t('common:link_account') : t('common:txt_loading1')}
            </Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default LinkStripeContainer;
