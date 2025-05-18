import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import {convert} from 'html-to-text';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {EnvelopeIcon} from '@heroicons/react/24/outline';
import {CheckBadgeIcon} from '@heroicons/react/20/solid';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@root/media-icons';

const MemberListItem = ({member}) => {
  const {t} = useTranslation();
  const [userPublicUrl, setUserPublicUrl] = useState('');

  useEffect(() => {
    setUserPublicUrl(`${window.origin}/${member?.accountDetails?.username}`);
  }, [member]);

  const {showModal} = ModalContextProvider();

  const {facebook, twitter, linkedin, instagram, youtube} = member?.personalDetails?.socials || {};

  const sendMessageExtension = () => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: member?.personalDetails?.name,
      providerEmail: member?.accountDetails?.email,
    });
  };

  return (
    <li className='mt-4 grid overflow-hidden grid-cols-3 grid-rows-7 gap-2 grid-flow-row w-auto shadow-md overflow-y-auto border hover:shadow-2xl hover:shadow-inherit border-gray-200 rounded-lg'>
      <div className='box row-start-1 row-span-1 col-span-1'>
        <img
          src={
            member?.accountDetails.avatar
              ? member?.accountDetails.avatar
              : '/assets/default-profile.jpg'
          }
          alt='avatar'
          className='w-36 h-36 object-cover object-center'
        />
      </div>
      <div className='box col-start-2 col-span-2 w-full flex flex-col overflow-y-auto'>
        <span className='flex flex-row w-full pt-2 pr-1'>
          <span
            className='text-md font-bold line-clamp-1 break-all'
            title={member?.personalDetails?.name}
          >
            {member?.personalDetails?.name}
          </span>
          {member?.accountDetails?.verifiedAccount && (
            <CheckBadgeIcon style={{width: 24, minWidth: 24}} className={'text-mainBlue'} />
          )}
        </span>
        <p className='line-clamp-3 text-sm text-gray-500 font-bold'>
          {member?.personalDetails?.headline}
        </p>
        <p className='line-clamp-4 text-xs'> {convert(member?.personalDetails?.description)}</p>
      </div>
      <div className='flex items-center justify-center pl-2 text-mainBlue col-span-2'>
        <div className='block flex-col w-full items-center justify-center '>
          <div className='flex flex-1 gap-1 items-center my-2'>
            {userPublicUrl && (
              <a
                href={userPublicUrl}
                target='_blank'
                rel='noreferrer'
                className='col-span-1 hover:opacity-75'
              >
                <img src='/assets/logo.svg' alt='logo' style={{width: 20, minWidth: 20}} />
              </a>
            )}
            {facebook && (
              <div className='col-span-1 hover:opacity-75'>
                <FacebookIcon link={facebook} />
              </div>
            )}
            {twitter && (
              <div className='col-span-1 hover:opacity-75'>
                <TwitterIcon link={twitter} />
              </div>
            )}
            {linkedin && (
              <div className='col-span-1 hover:opacity-75'>
                <LinkedinIcon link={linkedin} />
              </div>
            )}
            {instagram && (
              <div className='col-span-1 hover:opacity-75'>
                <InstagramIcon link={instagram} />
              </div>
            )}
            {youtube && (
              <div className='col-span-1 hover:opacity-75'>
                <YoutubeIcon link={youtube} />
              </div>
            )}
            <div className='col-span-1 hover:opacity-75'>
              <EnvelopeIcon
                style={{width: 20, minWidth: 20}}
                className='text-mainBlue cursor-pointer'
                onClick={sendMessageExtension}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='box pr-2 py-2 col-start-3 text-mainBlue flex items-center text-xs font-bold justify-end'>
        <Link href={`/${member?.accountDetails?.username}`} passHref>
          {t('common:view_profile')}
        </Link>
      </div>
    </li>
  );
};
export default MemberListItem;
