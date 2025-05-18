import {CheckIcon} from '@heroicons/react/20/solid';
import Button from '@root/components/button';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import {useSession} from 'next-auth/react';
import Link from 'next/link';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ManualFreelanceConfirmation({user, serviceData, selectedDate, hidden}) {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {showModal} = ModalContextProvider();

  const sendMessageExtension = () => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: user?.personalDetails?.name,
      providerEmail: user?.accountDetails?.email,
    });
  };

  if (hidden) {
    return <></>;
  }

  return (
    <>
      <div className='grid  tracking-wide h-full '>
        <div className='py-20 place-self-center items-center md:py-3'>
          <div className='flex flex-col gap-2 justify-items-center px-10 py-10 bg-white'>
            <div>
              <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
                <CheckIcon className='h-6 w-6 text-green-600' />
              </div>
              <div className='mt-3 text-center sm:mt-5'>
                <h3 className='text-lg leading-6 font-medium text-gray-900' id='modal-headline'>
                  {t('common:service_successfully_ordered')}
                </h3>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>
                    <span className='text-mainText font-semibold '>
                      {serviceData?.title} {t('common:txt_by')}{' '}
                    </span>

                    <a
                      className='text-mainBlue text-lg font-black underline'
                      href={`${process.env.NEXT_PUBLIC_FRONT_END_URL}/${user?.accountDetails?.username}`}
                    >
                      {user?.personalDetails?.name?.length > 15
                        ? `${user?.personalDetails?.name?.substring(0, 15).trim()}...`
                        : user?.personalDetails?.name}
                    </a>
                  </p>
                </div>
                <div className='mt-4 border-t border-b py-4'>
                  <span className='text-gray-500 mb-2'>
                    {t('common:due_date')}:{' '}
                    {dayjs(selectedDate)
                      .add(serviceData.dueDate, 'day')
                      .format('dddd DD MMMM YYYY')}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2 text-center'>
              <span className=''>{t('common:continue_the_conversation')}...</span>
              <div className='flex flex-col gap-2 '>
                <Button
                  onClick={sendMessageExtension}
                  variant='solid'
                  className='text-sm justify-center gap-1 active:opacity-75'
                >
                  {t('common:send')}{' '}
                  <span className='font-semibold'>
                    {' '}
                    {user?.personalDetails?.name?.length > 15
                      ? `${user?.personalDetails?.name?.substring(0, 15).trim()}...`
                      : user?.personalDetails?.name}
                  </span>{' '}
                  {t('common:an_email')}
                </Button>
                <Link
                  href={{
                    pathname: '/user/chat',
                    query: {membersEmail: [session?.user?.email, user?.accountDetails?.email]},
                  }}
                  as='/user/chat'
                  className='text-xs tracking-tight font-bold'
                  title={t('common:live_chat')}
                  passHref
                >
                  <Button
                    onClick={() => {}}
                    variant='solid'
                    className='text-sm justify-center gap-1 active:opacity-75'
                  >
                    {t('common:live_chat_with')}{' '}
                    <span className='font-semibold'>
                      {user?.personalDetails?.name?.length > 15
                        ? `${user?.personalDetails?.name?.substring(0, 15).trim()}...`
                        : user?.personalDetails?.name}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
