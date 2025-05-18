import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import sanitizeHtml from 'sanitize-html';
import useTranslation from 'next-translate/useTranslation';

import Button from '@root/components/button';

import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';

import {ChatBubbleLeftRightIcon, ShareIcon} from '@heroicons/react/24/outline';
import {CheckBadgeIcon} from '@heroicons/react/20/solid';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@root/media-icons';

export default function ProfileLayoutFull({user}) {
  const {t} = useTranslation();

  const {showModal} = ModalContextProvider();
  const router = useRouter();

  const [userData, setUserData] = useState<any>([]);
  const [publicUrl, setPublicUrl] = useState('');

  const UserSocials = userData?.personalDetails?.socials;

  const facebookLink = UserSocials?.facebook;
  const twitterLink = UserSocials?.twitter;
  const instagramLink = UserSocials?.instagram;
  const linkedinLink = UserSocials?.linkedin;
  const youtubeLink = UserSocials?.youtube;

  const hasSocials =
    UserSocials &&
    ((facebookLink && facebookLink !== '') ||
      (instagramLink && instagramLink !== '') ||
      (twitterLink && twitterLink !== '') ||
      (linkedinLink && linkedinLink !== '') ||
      (youtubeLink && youtubeLink !== ''));

  useEffect(() => {
    setPublicUrl(window.origin + router.asPath);
    setUserData(user);
  }, [user]);

  const shareProfile = () => {
    showModal(MODAL_TYPES.SHAREPROFILE, {
      name: userData?.personalDetails?.name,
      userLink: publicUrl,
      sharePage: true,
    });
  };
  const sendMessageExtenmsion = () => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: userData?.personalDetails?.name,
      providerEmail: userData?.accountDetails?.email,
    });
  };

  return (
    <div className='mt-6 mb-2 container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between'>
      <div className='bg-white  shadow rounded xl:flex lg:flex w-full'>
        <div className='xl:w-2/5 lg:w-2/5 bg-gray-100  py-8 border-gray-300  xl:border-r rounded-tl xl:rounded-bl rounded-tr xl:rounded-tr-none lg:border-r-2 border-b xl:border-b-0 flex justify-center items-center'>
          <div className='flex flex-col items-center'>
            <div className='h-36 w-36 rounded-full mb-3'>
              <img
                className='relative rounded-full h-36 w-36 object-cover object-center '
                src={userData?.accountDetails?.avatar || '/assets/default-profile.jpg'}
                alt=''
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Button variant='solid' type='submit' onClick={shareProfile}>
                <ShareIcon className='w-4 h-4 mr-2 ' /> {t('profile:share_page')}
              </Button>
              <Button variant='solid' type='button' onClick={sendMessageExtenmsion}>
                <ChatBubbleLeftRightIcon className='w-4 h-4 mr-2' />{' '}
                {t('page:send_message_extension')}
              </Button>
            </div>
          </div>
        </div>
        <div className='xl:w-3/5 lg:w-3/5 px-6 py-8'>
          <div className='flex-inline'>
            <div className='item w-full'>
              <h1 className='mb-2 text-3xl font-bold text-gray-900 flex gap-2'>
                {userData?.personalDetails?.name}
                {userData?.accountDetails?.verifiedAccount ? (
                  <CheckBadgeIcon width={26} className={'text-mainBlue'} />
                ) : null}
              </h1>
            </div>
            {userData?.personalDetails?.headline && (
              <p className='mb-2 text-sm text-gray-700 font-bold overflow-hidden break-words'>
                {userData?.personalDetails?.headline}
              </p>
            )}
            {hasSocials && (
              <div className='item w-full h-12 flex-row'>
                <>
                  <div className='flex pt-2 text-sm text-gray-500'>
                    <div className='flex-1 inline-flex items-center gap-1'>
                      {twitterLink && <TwitterIcon link={twitterLink} />}
                      {facebookLink && <FacebookIcon link={facebookLink} />}
                      {linkedinLink && <LinkedinIcon link={linkedinLink} />}
                      {instagramLink && <InstagramIcon link={instagramLink} />}
                      {youtubeLink && <YoutubeIcon link={youtubeLink} />}
                    </div>
                  </div>
                </>
              </div>
            )}
            {user?.personalDetails?.description && (
              <div className='sm:col-span-2 text-sm'>
                <dd
                  className='custom'
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(user?.personalDetails?.description),
                  }}
                ></dd>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
