import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Link from 'next/link';
import {useSession} from 'next-auth/react';
import Button from '@root/components/button';
import {ExclamationCircleIcon} from '@heroicons/react/20/solid';
import toast from 'react-hot-toast';
import CartHeader from './CartHeader';

const JobCard = ({serviceData, serviceType, user}) => {
  const {data: session} = useSession();
  const {showModal} = ModalContextProvider();
  const {t} = useTranslation();

  const sendMessageExtension = () => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: user?.personalDetails?.name,
      providerEmail: user?.accountDetails?.email,
    });
  };

  return (
    <div className='xl:w-3/5 lg:w-3/5'>
      <div className='flex flex-col px-3 py-2 text-sm w-full min-h-full'>
        <CartHeader {...{serviceData, serviceType}} />
        <div className='self-end mt-auto flex flex-row gap-2'>
          <Button variant='solid' type='button' onClick={sendMessageExtension}>
            {t('common:send_a_message')}
          </Button>
          {session?.user?.email && session?.user?.email !== user?.accountDetails?.email ? (
            <Link
              href={{
                pathname: '/user/chat',
                query: {membersEmail: [session?.user?.email, user?.accountDetails?.email]},
              }}
              as='/user/chat'
              className='flex flex-col justify-center items-center w-full'
              title={t('common:live_chat')}
              passHref
            >
              <Button variant='solid' className='m-auto' onClick={() => {}}>
                {t('common:live_chat')}
              </Button>
            </Link>
          ) : (
            session?.user?.email !== user?.accountDetails?.email && (
              <Button
                variant='ghost'
                className='m-auto cursor-pointer'
                onClick={() => {
                  toast(t('common:please_Sign_In_send_message'), {
                    icon: <ExclamationCircleIcon width={25} height={25} />,
                    duration: 1000,
                  });
                }}
              >
                {t('common:live_chat')}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
export default JobCard;
