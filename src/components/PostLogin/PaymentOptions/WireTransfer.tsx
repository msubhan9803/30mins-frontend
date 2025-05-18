import {useSession} from 'next-auth/react';
import {useContext, useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {UserContext} from '@root/context/user';
import Button from '@root/components/button';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import mutations from 'constants/GraphQL/User/mutations';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';

const LinkStripeContainer = () => {
  const {t} = useTranslation('common');
  const {user} = useContext(UserContext);
  const {data: session} = useSession();
  const {reload} = useRouter();
  const {showModal} = ModalContextProvider();
  const [updateUser] = useMutation(mutations.updateUser);
  const [updatePaymentMethods] = useMutation(mutations.updatePaymentMethods);
  const [loading, setloading] = useState(false);
  const filled = () => user?.bankDetails?.bankName && user?.wireDetails?.nameOnBank;

  const removeWireDetails = async () => {
    setloading(true);
    await updateUser({
      variables: {
        userData: {
          wireDetails: {
            addressOfBank: null,
            country: null,
            nameOnBank: null,
            phoneOfBank: null,
          },
          bankDetails: {
            accountNumber: null,
            bankAddress: null,
            bankName: null,
            categoryAccount: null,
            currencyAccount: null,
            typeAccount: null,
            SWIFTBIC: null,
          },
        },
        token: session?.accessToken,
      },
    });
    if (user?.escrow?.includes('wireTransfer')) {
      await updatePaymentMethods({
        variables: {
          escrow: ['none'],
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
    }
    reload();
    setloading(false);
  };

  return (
    <div className='bg-white px-4 py-1 grid grid-cols-4 gap-2 mt-2'>
      <div className='col-span-2 flex flex-col'>
        <h2 className='text-xl font-bold text-gray-800'>{t('wire_transfer')}</h2>
      </div>

      <div className='col-span-4 md:col-span-2 flex flex-col gap-2'>
        <div className='grid grid-cols-2 gap-2'>
          <Button
            variant='solid'
            className={filled()}
            disabled={loading}
            onClick={() => {
              showModal(MODAL_TYPES.WIRE_TRANSFER, {});
            }}
          >
            {filled() ? t('update') : t('add')}
          </Button>
          {filled() && (
            <Button variant='cancel' disabled={loading} onClick={removeWireDetails}>
              {!loading ? t('common:remove_account') : t('common:txt_loading1')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkStripeContainer;
