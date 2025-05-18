import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import {ChatBubbleLeftRightIcon, CheckBadgeIcon, ShareIcon} from '@heroicons/react/20/solid';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';
import Button from '@root/components/button';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@root/media-icons';

const ProfileLayout = ({user}) => {
  const [publicUrl, setPublicUrl] = useState('');
  const {showModal} = ModalContextProvider();
  const router = useRouter();
  const {t} = useTranslation();

  useEffect(() => {
    setPublicUrl(window.origin + router.asPath);
  }, [user]);

  const shareProfile = () => {
    showModal(MODAL_TYPES.SHAREPROFILE, {
      name: user?.personalDetails?.name,
      userLink: publicUrl,
      sharePage: true,
    });
  };
  let UserSocials = user?.personalDetails?.socials;
  if (!UserSocials) UserSocials = user?.socials;

  const facebookLink = UserSocials?.facebook;
  const twitterLink = UserSocials?.twitter;
  const instagramLink = UserSocials?.instagram;
  const linkedinLink = UserSocials?.linkedin;
  const youtubeLink = UserSocials?.youtube;

  // const hasSocials =
  //   (UserSocials !== undefined &&
  //     facebookLink !== '' &&
  //     facebookLink !== ' ' &&
  //     facebookLink !== null) ||
  //   (twitterLink !== '' && twitterLink !== ' ' && twitterLink !== null) ||
  //   (instagramLink !== '' && instagramLink !== ' ' && instagramLink !== null) ||
  //   (linkedinLink !== '' && linkedinLink !== ' ' && linkedinLink !== null) ||
  //   (youtubeLink !== '' && youtubeLink !== ' ' && youtubeLink !== null);

  const sendMessageExtension = () => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: user?.personalDetails?.name,
      providerEmail: user?.accountDetails?.email,
    });
  };
  return (
    <>
      <div className='w-full bg-gray-100 py-8 border-gray-300 xl:w-2/5 lg:w-2/5 xl:border-r rounded-tl xl:rounded-bl rounded-tr xl:rounded-tr-none lg:border-r-2 border-b xl:border-b-0  justify-center items-center'>
        <div className='flex flex-col items-center w-full'>
          <div className='h-24 w-24 rounded-full mb-3'>
            <img
              className='h-full w-full object-cover rounded-full shadow'
              src={`${
                user?.accountDetails?.avatar || user?.image || '/assets/default-profile.jpg'
              }`}
              alt='avatar'
              width={200}
              height={200}
            />
          </div>
          <p className='mb-2 text-lg font-bold text-mainBlue'>
            <a href={`/${user?.accountDetails?.username}/`} className={'flex gap-0.5'}>
              {user?.personalDetails?.name?.length > 15
                ? `${user?.personalDetails?.name?.substring(0, 15).trim()}...`
                : user?.personalDetails?.name}
              {user?.accountDetails?.verifiedAccount ? (
                <CheckBadgeIcon width={16} className={'text-mainBlue'} />
              ) : null}
            </a>
          </p>
          <div className='items-center justify-center w-full flex flex-row my-2 gap-1'>
            <Link
              href={
                user?.accountDetails?.username
                  ? `/${user?.accountDetails?.username}`
                  : `/org/${user?.slug}`
              }
              passHref={true}
              target={'_blank'}
            >
              <img src='/assets/logo.svg' alt='logo' className='w-7 h-7 mr-1 cursor-pointer' />
            </Link>
            {twitterLink && <TwitterIcon link={twitterLink} />}
            {facebookLink && <FacebookIcon link={facebookLink} />}
            {linkedinLink && <LinkedinIcon link={linkedinLink} />}
            {instagramLink && <InstagramIcon link={instagramLink} />}
            {youtubeLink && <YoutubeIcon link={youtubeLink} />}
          </div>

          <Button variant='solid' type='submit' onClick={shareProfile}>
            <ShareIcon className='w-4 h-4 mr-2 ' /> {t('profile:share_page')}
          </Button>

          <div className='py-2'>
            <Button variant='solid' type='button' onClick={sendMessageExtension}>
              <ChatBubbleLeftRightIcon className='w-4 h-4 mr-2 ' />{' '}
              {t('page:send_message_extension')}
            </Button>
          </div>

          <div className='px-3 py-2 mt-2 text-sm w-full'>
            <div className='w-full'>
              {user?.personalDetails?.headline && (
                <div className={`custom break-words w-full font-bold py-1`}>
                  {user?.personalDetails?.headline}
                </div>
              )}
              {user?.headline && (
                <div className={`custom break-words w-full font-bold py-1`}>{user?.headline}</div>
              )}
            </div>

            <div className='w-full'>
              {user?.personalDetails?.description && (
                <div
                  className={`custom break-words w-full`}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(user?.personalDetails?.description),
                  }}
                />
              )}
              {user?.description && (
                <div
                  className={`custom break-words w-full`}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(user?.description),
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfileLayout;
