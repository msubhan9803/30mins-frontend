import {
  ClockIcon,
  MapPinIcon,
  EnvelopeIcon,
  LanguageIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import {PencilIcon, PlusIcon} from '@heroicons/react/20/solid';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@root/media-icons';
import useTranslation from 'next-translate/useTranslation';
import {useContext, useEffect} from 'react';
import {UserContext} from 'store/UserContext/User.context';

const Socials = ({User}) => {
  const {t} = useTranslation();
  const {
    state: {
      country,
      zipCode,
      email,
      language,
      instagram,
      timezone,
      facebook,
      twitter,
      linkedin,
      youtube,
      phone,
    },
    actions: {
      setTimezone,
      setCountry,
      setZipCode,
      setEmail,
      setLanguage,
      setFacebook,
      setInstagram,
      setTwitter,
      setLinkedin,
      setYoutube,
      setPhone,
    },
  } = useContext(UserContext);
  useEffect(() => {
    setCountry(User?.locationDetails?.country);
    setZipCode(User?.locationDetails?.zipCode);
    setTimezone(User?.locationDetails?.timezone);
    setEmail(User?.accountDetails?.email);
    setLanguage(User?.personalDetails?.language);
    setFacebook(User?.personalDetails?.socials?.facebook);
    setTwitter(User?.personalDetails?.socials?.twitter);
    setLinkedin(User?.personalDetails?.socials?.linkedin);
    setInstagram(User?.personalDetails?.socials?.instagram);
    setYoutube(User?.personalDetails?.socials?.youtube);
    setPhone(User?.personalDetails?.phone);
  }, [
    User?.locationDetails?.country,
    User?.locationDetails?.timezone,
    User?.locationDetails?.zipCode,
    User?.personalDetails?.language,
    User?.personalDetails?.socials?.facebook,
    User?.personalDetails?.socials?.instagram,
    User?.personalDetails?.socials?.linkedin,
    User?.personalDetails?.socials?.twitter,
    User?.personalDetails?.phone,
  ]);

  const UserSocials = User?.personalDetails?.socials;
  const facebookLink = UserSocials?.facebook;
  const twitterLink = UserSocials?.twitter;
  const instagramLink = UserSocials?.instagram;
  const linkedinLink = UserSocials?.linkedin;
  const youtubeLink = UserSocials?.youtube;

  const hasSocials =
    (UserSocials !== undefined &&
      facebookLink !== '' &&
      facebookLink !== ' ' &&
      facebookLink !== null) ||
    (twitterLink !== '' && twitterLink !== ' ' && twitterLink !== null) ||
    (instagramLink !== '' && instagramLink !== ' ' && instagramLink !== null) ||
    (linkedinLink !== '' && linkedinLink !== ' ' && linkedinLink !== null) ||
    (youtubeLink !== '' && youtubeLink !== ' ' && youtubeLink !== null);

  return (
    <>
      <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
        <div className='flex justify-between'>
          <h2 className='text-md font-bold text-gray-700'>{t('profile:About')}</h2>
          <div className='items-center flex'>
            <a href='/user/edit'>
              <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
            </a>
          </div>
        </div>
        <div className='mb-4'>
          <ul role='list' className='-mb-8 '>
            <div className='flex flex-row py-2'>
              {(country || zipCode) && (
                <MapPinIcon width={20} height={20} className='mr-2 text-sm text-gray-900' />
              )}
              <p className='text-sm text-gray-900'>
                {country && zipCode
                  ? `${country}, ${zipCode}`
                  : country
                  ? `${country}`
                  : zipCode && `${zipCode}`}
              </p>
            </div>

            <div className='flex flex-row py-2'>
              <EnvelopeIcon width={20} height={20} className='mr-2 text-sm text-gray-900' />
              <div className='truncate text-sm text-gray-900'>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            </div>

            <div className='flex flex-row py-2'>
              <PhoneIcon width={20} height={20} className='mr-2 text-sm text-gray-900' />
              <div className='truncate text-sm text-gray-900'>{phone || '--'}</div>
            </div>

            <div className='flex flex-row py-2 '>
              <ClockIcon width={20} height={20} className='mr-2 text-sm text-gray-900' />
              <p className='text-sm text-gray-900'>{timezone}</p>
            </div>

            <div className='flex flex-row py-2 '>
              <LanguageIcon width={20} height={20} className='mr-2 text-sm text-gray-900' />
              <p className='text-sm text-gray-900'>{language}</p>
            </div>
          </ul>
        </div>
      </div>
      {hasSocials &&
        facebook !== undefined &&
        twitter !== undefined &&
        linkedin !== undefined &&
        instagram !== undefined &&
        youtube !== undefined && (
          <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
            <div className='flex justify-between'>
              <h2 className='text-md font-bold text-gray-700'>{t('common:Social Links')}</h2>
              <div className='flex flex-row items-center'>
                <a href='/user/edit?tab=social+links'>
                  <PlusIcon className='w-4 h-4 text-sm font-medium text-gray-500 mr-2' />
                </a>
                <a href='/user/edit?tab=social+links'>
                  <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
                </a>
              </div>
            </div>
            <div className='flex h-10 flex-row justify-start gap-4 items-end'>
              {facebook && <FacebookIcon link={facebook} />}
              {twitter && <TwitterIcon link={twitter} />}
              {linkedin && <LinkedinIcon link={linkedin} />}
              {instagram && <InstagramIcon link={instagram} />}
              {youtube && <YoutubeIcon link={youtube} />}
            </div>
          </div>
        )}
    </>
  );
};

export default Socials;
