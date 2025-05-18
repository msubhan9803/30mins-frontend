import {convert} from 'html-to-text';
import {useRouter} from 'next/router';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {ChatBubbleLeftRightIcon, EnvelopeIcon} from '@heroicons/react/24/outline';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {UserContext} from '@root/context/user';
import {useContext} from 'react';
import toast from 'react-hot-toast';
import {CheckBadgeIcon, ExclamationCircleIcon} from '@heroicons/react/20/solid';

const UserCard = ({member}) => {
  const {user} = useContext(UserContext);
  const router = useRouter();
  const {showModal} = ModalContextProvider();
  const {t} = useTranslation();

  const sendMessageExtension = () => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: member?.personalDetails?.name,
      providerEmail: member?.accountDetails?.email,
    });
  };

  const claimAccount = couponCode => {
    router.push({
      pathname: '/join/',
      query: {code: couponCode},
    });
  };

  return (
    <li
      className='grid overflow-hidden grid-cols-6 grid-rows-7 gap-2 p-4 rounded-lg grid-flow-row w-auto shadow-md overflow-y-auto border border-gray-200'
      key={member?._id}
    >
      <div className='box row-start-1 col-span-2 row-span-1 '>
        <img
          src={
            member?.accountDetails.avatar
              ? member?.accountDetails.avatar
              : '/assets/default-profile.jpg'
          }
          alt='avatar'
          className='w-36 h-36 object-cover object-center rounded-lg'
        />
      </div>

      <div className='box col-start-3 col-span-4 w-full flex flex-col overflow-y-auto px-2'>
        <h2 className='text-md font-bold text-black flex gap-1'>
          {member?.personalDetails?.name}{' '}
          {member?.accountDetails?.verifiedAccount ? (
            <CheckBadgeIcon width={16} className={'text-mainBlue'} />
          ) : null}
        </h2>
        <h4 className='mb-2 text-xs font-bold tracking-tight text-gray-900'>
          {member?.personalDetails?.headline ? (
            <div className='line-clamp-3'>{member?.personalDetails?.headline}</div>
          ) : (
            ''
          )}
        </h4>
        <p className='line-clamp-4 text-xs'> {convert(member?.personalDetails?.description)}</p>
      </div>

      <div className='col-span-3 flex gap-2 px-2 pt-2 text-mainBlue'>
        <a href={`/${member?.accountDetails?.username}`} target='_blank' rel='noreferrer'>
          <img src='/assets/logo.svg' alt='logo' className='w-5 h-5 sm:h-7 sm:w-7 mr-1' />
        </a>

        {user?.email && user?.email !== member?.accountDetails?.email ? (
          <Link
            href={{
              pathname: '/user/chat',
              query: {membersEmail: [user?.email, member?.accountDetails?.email]},
            }}
            as='/user/chat'
            className='text-xs tracking-tight font-bold'
            title={t('common:live_chat')}
            passHref
          >
            <ChatBubbleLeftRightIcon className='w-6 h-6 text-gray-600 cursor-pointer' />
          </Link>
        ) : (
          user?.email !== member?.accountDetails?.email && (
            <ChatBubbleLeftRightIcon
              onClick={() => {
                toast(t('common:please_Sign_In_send_message'), {
                  icon: <ExclamationCircleIcon width={25} height={25} />,
                  duration: 1000,
                });
              }}
              className='w-6 h-6 text-gray-600 cursor-pointer'
            />
          )
        )}

        <a href={`#`} className='text-xs tracking-tight font-bold' title={t('common:message_me')}>
          <EnvelopeIcon
            className='w-6 h-6 text-gray-600 cursor-pointer'
            onClick={sendMessageExtension}
          />
        </a>
      </div>

      <div className='flex justify-end mr-2 gap-2 col-start-4 col-span-3 '>
        <div className='flex text-mainBlue items-center justify-center '>
          {member?.accountDetails?.verifiedEmail ? (
            <a
              href={`/${member?.accountDetails?.username}`}
              className='text-xs tracking-tight font-bold'
            >
              {t('common:my_services')}
            </a>
          ) : (
            <button
              className='text-xs tracking-tight font-bold'
              onClick={() => claimAccount(member?.couponCode)}
            >
              {t('profile:Claim_ac')}
            </button>
          )}
        </div>
      </div>
    </li>
  );
};
export default UserCard;
