import {ShoppingCartIcon} from '@heroicons/react/24/outline';
import {UserContext} from '@root/context/user';
import {MODAL_TYPES} from 'constants/context/modals';
import {useSession} from 'next-auth/react';
import {useContext} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';

export default function ShopCartIcon() {
  const {items} = useContext(UserContext);
  const {data: session} = useSession();
  const {showModal} = ModalContextProvider();

  const count = items?.length > 0 ? items?.map(el => el.quantity)?.reduce((a, b) => a + b) : 0;

  const showCheckoutModule = () => {
    if (session?.accessToken) {
      showModal(MODAL_TYPES.PUBLICCHECKOUT, {});
    } else {
      showModal(MODAL_TYPES.AUTH_MODAL, {
        onAuthComplete: () => {
          showModal(MODAL_TYPES.PUBLICCHECKOUT, {});
        },
      });
    }
  };

  return (
    <div
      className='relative cursor-pointer'
      onClick={() => {
        showCheckoutModule();
      }}
    >
      <ShoppingCartIcon className='w-10 h-10 p-2 rounded-full border' />
      {count > 0 && (
        <span className='absolute -right-1 -top-1 text-white bg-mainBlue w-5 font-bold rounded-full p-[2px] text-xs text-center'>
          {count > 9 ? `+9` : count}
        </span>
      )}
    </div>
  );
}
