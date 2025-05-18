import {useContext, useEffect, useState} from 'react';
import {LoaderIcon, toast} from 'react-hot-toast';
import {UserContext} from 'store/UserContext/User.context';
import useTranslation from 'next-translate/useTranslation';

import {useSession} from 'next-auth/react';
import {useMutation} from '@apollo/client';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {CheckBadgeIcon} from '@heroicons/react/20/solid';
import {MODAL_TYPES} from 'constants/context/modals';
import * as SdUserContext from '@root/context/user';
import Profile from './Tabs/Profile';

const ProfileHeader = ({user, services, credentials, extensionsArray}) => {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const [uploadingBackground] = useState(false);
  const SdUser = useContext(SdUserContext.UserContext);

  const User = user?.data?.getUserById?.userData;
  const userServices = services?.data?.getServicesByUserId?.serviceData;
  const userCredentials = credentials?.data?.getCredentialsByToken;

  const {
    state: {avatar, fullname, profileBG, timezone},
    actions: {setAvatar, setFullname, setProfileBG, setTimezone},
  } = useContext(UserContext);

  useEffect(() => {
    setAvatar(User?.accountDetails?.avatar);
    setTimezone(User?.locationDetails?.timezone);
    setFullname(User?.personalDetails?.name);
    setProfileBG(User?.accountDetails?.profileBackground);
  }, [
    User?.accountDetails?.avatar,
    User?.accountDetails?.profileBackground,
    User?.personalDetails?.name,
  ]);

  const profileBackgroundTimezone = (timezoneLoc: string) => {
    if (timezoneLoc === null || timezoneLoc === undefined) {
      setProfileBG('/assets/profileBg.jpg');
    } else if (timezoneLoc.startsWith('America') || timezoneLoc.startsWith('Atlantic')) {
      setProfileBG('/assets/profileBackgrounds/america-bg.jpg');
    } else if (timezoneLoc.startsWith('Africa') || timezoneLoc.startsWith('Australia')) {
      setProfileBG('profileBackgrounds/africa-bg.jpg');
    } else if (timezoneLoc.startsWith('Asia')) {
      setProfileBG('/assets/profileBackgrounds/asia-bg.jpg');
    } else if (timezoneLoc.startsWith('Europe')) {
      setProfileBG('/assets/profileBackgrounds/europe-bg.jpg');
    } else if (timezoneLoc.startsWith('Pacific')) {
      setProfileBG('/assets/profileBackgrounds/pacific-bg.png');
    } else if (timezoneLoc.startsWith('Indian')) {
      setProfileBG('/assets/profileBackgrounds/india-bg.png');
    }
  };

  useEffect(() => {
    if (!User?.accountDetails?.profileBackground) {
      profileBackgroundTimezone(timezone);
    }
  }, [timezone]);

  const [mutateFunction, {loading}] = useMutation(singleUpload);

  const upLoadProfile = async file => {
    try {
      if (file) {
        const response = await mutateFunction({
          variables: {
            uploadType: 'USER_AVATAR',
            documentId: User._id,
            file: file,
            accessToken: session?.accessToken,
          },
        });
        if ([400, 409, 413, 404].includes(response.data.singleUpload.status)) {
          toast.error(t('common:txt_valid_upload_image_2mb'));
          return;
        }
        // router.reload();
        setAvatar(response.data.singleUpload.message);
      }
    } catch (e) {
      if ([400, 409, 413, 404].includes(e.response.status)) {
        toast.error(t('common:txt_valid_upload_image_2mb'));
        return;
      }
      console.log('error', e);
    }
  };

  const handleFileChange = async () => {
    try {
      showModal(MODAL_TYPES.CHAMGEIMAGE, {
        upLoadImage: upLoadProfile,
        defSize: 1,
      });
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  const upLoadProfileBG = async file => {
    try {
      if (file) {
        // setUploadingBackground(true);
        const response = await mutateFunction({
          variables: {
            uploadType: 'PROFILE_BACKGROUND',
            documentId: User._id,
            file: file,
            accessToken: session?.accessToken,
          },
        });
        // setUploadingBackground(false);

        if ([400, 409, 413, 404].includes(response.data.singleUpload.status)) {
          toast.error(t('common:txt_valid_upload_image_2mb'));
          return;
        }
        setProfileBG(response.data.singleUpload.message);
      }
    } catch (e) {
      // setUploadingBackground(false);
      if ([400, 409, 413, 404].includes(e.response.status)) {
        toast.error(t('common:txt_valid_upload_image_2mb'));
        return;
      }
      console.log('error', e);
    }
  };

  const handleProfileBG = async () => {
    try {
      showModal(MODAL_TYPES.CHAMGEIMAGE, {
        upLoadImage: upLoadProfileBG,
        defSize: 16 / 6,
      });
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  return (
    <div className='pb-6'>
      <div className='shadow-lg rounded-xl'>
        <div className='h-32 w-full object-cover lg:h-48 rounded-t-xl'>
          <div className='cursor-pointer relative overflow-hidden lg:block'>
            {loading && uploadingBackground ? (
              <LoaderIcon style={{width: '50px', height: '50px'}} className='my-20 m-auto' />
            ) : (
              <img
                className='h-32 w-full object-cover object-center lg:h-48 cursor-pointer'
                src={profileBG || '/assets/profileBg.jpg'}
                alt=''
              />
            )}

            <label
              onClick={handleProfileBG}
              className='cursor-pointer absolute h-32 w-full object-cover lg:h-48 inset-0 bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100'
            >
              <span>{t(`common:change_cover`)}</span>
            </label>
          </div>
        </div>

        <div className='max-w-5xl mt-4 mx-auto px-4 sm:px-6 lg:px-8 '>
          <div className='-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5'>
            <div className='mt-6 lg:mt-0 cursor-pointer lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0'>
              <div className='relative rounded-full cursor-pointer overflow-hidden lg:block'>
                <img
                  className='relative rounded-full w-24 cursor-pointer h-24 object-cover object-center'
                  src={avatar || '/assets/default-profile.jpg'}
                  alt=''
                />
                <label
                  onClick={handleFileChange}
                  className='absolute rounded-full inset-0 w-24 h-24 cursor-pointer bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100'
                >
                  <span>Change</span>
                </label>
              </div>
            </div>
            <div className='mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 '>
              <div className='block mt-6 pb-4 sm:pb-0 mb-4 lg:mb-2 min-w-0 flex-1'>
                <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-1 break-all'>
                  {fullname}
                  {SdUser.user?.verifiedAccount ? (
                    <CheckBadgeIcon width={26} className={'text-mainBlue'} />
                  ) : null}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Profile
        user={user}
        userServices={userServices}
        credentials={userCredentials}
        extensionsArray={extensionsArray}
      />
    </div>
  );
};

export default ProfileHeader;
