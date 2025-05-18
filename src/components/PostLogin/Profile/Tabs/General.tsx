import {useMutation} from '@apollo/client';
import {useSession, signOut} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useContext, useEffect, useState} from 'react';
import TimezoneSelect from 'react-timezone-select';
import {UserContext} from 'store/UserContext/User.context';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import Countries from 'constants/forms/country.json';
import Languages from 'constants/forms/Languages.json';
import mutations from 'constants/GraphQL/User/mutations';
import {TrashIcon} from '@heroicons/react/24/outline';
import {UserContext as UserContext2} from '@root/context/user';
import dynamic from 'next/dynamic';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {NotificationContext} from 'store/Notification/Notification.context';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {isValidPhoneNumber} from 'react-phone-number-input';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import axios from 'axios';
import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const GeneralEdit = ({userData}) => {
  const {
    state: {
      avatar,
      visible,
      fullname,
      username,
      headline,
      country,
      phone,
      timezone,
      profileMediaLink,
      profileMediaType,
      hashtags,
      description,
      zipCode,
      language,
    },
    actions: {
      setAvatar,
      setCountry,
      setProfileMediaLink,
      setMediaType,
      setUsername,
      setheadline,
      setTimezone,
      setZipCode,
      setVisible,
      setFullname,
      setPhone,
      setHashtags,
      setDescription,
      setLanguage,
    },
  } = useContext(UserContext);
  const {user, setUser} = useContext(UserContext2);
  const {t} = useTranslation();
  const [HashtagError, setHashtagErrorMessage] = useState('');
  const [imageError] = useState('');
  const {data: session} = useSession();
  const {showModal} = ModalContextProvider();
  const User = userData?.data?.getUserById?.userData;
  const [updateUser] = useMutation(mutations.updateUser);
  const [deleteUser] = useMutation(mutations.deleteUser);
  const [Country, setCountryInput] = useState('us');
  const [PhoneValid, setPhoneValid] = useState(true);

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const handleSaveButton = () => {
    showNotification(NOTIFICATION_TYPES.success, 'Profile Saved', false);
  };

  const handleuserDelete = async () => {
    try {
      await axios.post('/api/stripe/deleteCustomer');

      await deleteUser({
        variables: {
          token: session?.accessToken,
        },
      });
      signOut();
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  const deleteUserMutation = () => {
    showModal(MODAL_TYPES.DELETE, {
      isDeleteAccount: true,
      name: User?.personalDetails?.name,
      handleDelete: handleuserDelete,
    });
  };

  useEffect(() => {
    setUsername(User?.accountDetails?.username);
    setPhone(User?.personalDetails?.phone);
    setAvatar(User?.accountDetails?.avatar);
    setVisible(!User?.accountDetails?.privateAccount);
    setheadline(User?.personalDetails?.headline);
    setCountry(User?.locationDetails?.country);
    setTimezone(User?.locationDetails?.timezone);
    setFullname(User?.personalDetails?.name);
    setDescription(User?.personalDetails?.description);
    setZipCode(User?.locationDetails?.zipCode);
    setProfileMediaLink(User?.personalDetails?.profileMediaLink);
    setMediaType(User?.personalDetails?.profileMediaType);
    setLanguage(User?.personalDetails?.language);
    setHashtags(User?.personalDetails?.searchTags);
  }, [
    User?.accountDetails?.avatar,
    User?.accountDetails?.privateAccount,
    User?.accountDetails?.username,
    User?.locationDetails?.country,
    User?.locationDetails?.timezone,
    User?.locationDetails?.zipCode,
    User?.personalDetails?.description,
    User?.personalDetails?.headline,
    User?.personalDetails?.name,
    User?.personalDetails?.phone,
    User?.personalDetails?.profileMediaLink,
    User?.personalDetails?.profileMediaType,
    User?.personalDetails?.searchTags,
    User?.personalDetails?.language,
    User?.accountDetails?.isIndividual,
  ]);

  const [mutateFunction] = useMutation(singleUpload);

  const handleFileChange = async file => {
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
        setAvatar(response.data.singleUpload.message);
      }
    } catch (e) {
      if (
        e.response.status === 400 ||
        e.response.status === 409 ||
        e.response.status === 413 ||
        e.response.status === 404
      ) {
        // setImageError('Image too large. Maximum size is 2 MB.');
        // return
      }
    }
    // setImageLoading(false);
  };

  const handleProfileImage = async () => {
    try {
      showModal(MODAL_TYPES.CHAMGEIMAGE, {
        upLoadImage: handleFileChange,
        defSize: 1,
      });
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  const CountriesPicker = Countries.map(countryData => (
    <option key={countryData.label}>{countryData.label}</option>
  ));

  const LanguagesPicker = Languages.map(langEl => (
    <option key={langEl.value}>{langEl.value}</option>
  ));
  const SelectMediaType = [
    {key: t('None'), value: 'None'},
    {key: t('common:txt_media_type_google'), value: 'Google Slides'},
    {key: t('common:txt_media_type_youtube'), value: 'Youtube Embed'},
  ];

  const MediaType = SelectMediaType.map(option => (
    <option key={option.value}>{option.value}</option>
  ));

  const [fullnameError, setFullnameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [phoneErorr, serPhoneerror] = useState(undefined);
  const [zipCodeError, setZipCodeError] = useState('');
  const [mediaLinkError, setMediaLinkError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  function validate(s) {
    if (/^(\w+\s?)*\s*$/.test(s)) {
      return s.replace(/\s+$/, '');
    }
    return false;
  }
  const handleFullName = async ({target: {value}}) => {
    setFullname(value);
    if (value?.trim() === '') {
      setFullnameError(t('profile:err_required'));
      return;
    }
    if (!validate(value)) {
      setFullnameError(t('profile:only_one_space_allowed_and_no_special_characters_are_allowed'));
      return;
    }

    if (value?.trim() === '') {
      setFullnameError(t('profile:err_required'));
    } else {
      setFullnameError('');
      try {
        await updateUser({
          variables: {
            userData: {personalDetails: {name: value?.trim()}},
            token: session?.accessToken,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleUsername = async ({target: {value}}) => {
    const val = value;
    if (value?.trim() === '') {
      setFullnameError(t('profile:err_required'));
      return;
    }

    const regex = /^[a-zA-Z0-9\-._]*$/;
    const inValid = regex.exec(val);

    if (!inValid) {
      setUsernameError(t('profile:no_special_characters_allowed'));
      return;
    }
    setUsername(val);

    if (val === '') {
      setUsernameError(t('profile:err_required'));
    } else {
      setUsernameError('');
      const response = await updateUser({
        variables: {
          userData: {accountDetails: {username: val}},
          token: session?.accessToken,
        },
      });
      const u: any = user;
      setUser({...u, username: val});
      if (response.data.updateUser.status === 409) {
        setUsernameError(response.data.updateUser.message);
      } else setUsernameError('');
    }
  };

  const handlePhone = async value => {
    const val = value;
    setPhone(val);

    const regex = /^[0-9\s)(-._]*$/;
    const inValid = regex.exec(val);

    if (!inValid) {
      serPhoneerror(t('profile:err_phone_format'));
      return;
    }
    serPhoneerror(undefined);
    await updateUser({
      variables: {
        userData: {personalDetails: {phone: val}},
        token: session?.accessToken,
      },
    });
  };
  const handleHeadline = async ({target: {value}}) => {
    const val = value;
    setheadline(val);

    await updateUser({
      variables: {
        userData: {personalDetails: {headline: val}},
        token: session?.accessToken,
      },
    });
  };

  const handleCountry = async ({target: {value}}) => {
    const val = value.trim();
    setCountry(val);

    await updateUser({
      variables: {
        userData: {locationDetails: {country: val}},
        token: session?.accessToken,
      },
    });
  };

  const handleTimezone = async ({value}) => {
    const val = value.trim();
    setTimezone(val);

    await updateUser({
      variables: {
        userData: {locationDetails: {timezone: val}},
        token: session?.accessToken,
      },
    });
  };
  const handleLanguage = async ({target: {value}}) => {
    const val = value.trim();
    setLanguage(val);
    await updateUser({
      variables: {
        userData: {personalDetails: {language: val}},
        token: session?.accessToken,
      },
    });
  };

  const handleZipCode = async ({target: {value}}) => {
    const val = value.trim();
    setZipCode(val);

    const regex = /^[0-9\s\-._]*$/;
    const inValid = regex.exec(val);

    if (!inValid) {
      setZipCodeError(t('profile:no_special_characters_allowed'));
      return;
    }
    setZipCodeError('');
    await updateUser({
      variables: {
        userData: {locationDetails: {zipCode: val}},
        token: session?.accessToken,
      },
    });
  };

  const handleMediaType = async ({target: {value}}) => {
    const val = value.trim();
    setMediaType(val);

    if (val === 'None') {
      setProfileMediaLink('');
      setMediaLinkError('');
      await updateUser({
        variables: {
          userData: {personalDetails: {profileMediaLink: '', profileMediaType: val}},
          token: session?.accessToken,
        },
      });
      return;
    }
    if (val === 'Google Slides') {
      setProfileMediaLink('');
      setMediaLinkError('Must Enter Google Slide Link');
      return;
    }
    if (val === 'Youtube Embed') {
      setProfileMediaLink('');
      setMediaLinkError('Must Enter YouTube Link');
    }
  };

  const handleMediaLink = async ({target: {value}}) => {
    const val = value;
    setProfileMediaLink(val);

    const regex =
      // eslint-disable-next-line no-useless-escape
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const valid = regex.test(val);

    if (!valid && val !== '') {
      setMediaLinkError(t('profile:txt_media_link_error'));
      return;
    }
    setMediaLinkError('');
    if (profileMediaType === 'Google Slides') {
      const regix = /https:\/\/docs\.google\.com\/presentation\/d\/(.*?)\/.*?\?usp=sharing/g;
      regix.test(val)
        ? await updateUser({
            variables: {
              userData: {
                personalDetails: {profileMediaLink: val, profileMediaType: 'Google Slides'},
              },
              token: session?.accessToken,
            },
          })
        : setMediaLinkError(
            'Expected Google Link: https://docs.google.com/presentation/d/1OhnJeSLgBS7sT84cu5XnplUZ4HHquKCUgYLvym30aZQ/edit?usp=sharing'
          );
      return;
    }
    if (profileMediaType === 'Youtube Embed') {
      val.startsWith('https://www.youtube.com/watch?v=')
        ? await updateUser({
            variables: {
              userData: {
                personalDetails: {profileMediaLink: val, profileMediaType: 'Youtube Embed'},
              },
              token: session?.accessToken,
            },
          })
        : setMediaLinkError('Expected YouTube Link: https://www.youtube.com/watch?v=30mins');
    }
  };

  const handleDescription = async descData => {
    setDescription(descData);
    const newdesc = (descData || '').replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/gi, ' ');

    const value = newdesc.length === 0 ? '' : newdesc;

    const isInValid = value.length > 750;
    if (isInValid) {
      setDescriptionError(t('profile:max_750_characters'));
      return;
    }
    setDescriptionError('');

    await updateUser({
      variables: {
        userData: {personalDetails: {description: descData}},
        token: session?.accessToken,
      },
    });
  };

  const handleChangeVisible = async () => {
    const updatedVisibility = !visible;
    setVisible(updatedVisibility);

    await updateUser({
      variables: {
        userData: {accountDetails: {privateAccount: visible}},
        token: session?.accessToken,
      },
    });
  };

  const submitUserHashag = async e => {
    e.preventDefault();
    const value = `#${e.target.hashtags.value.toLowerCase()}`;
    const trimmedValue = value.split(' ').join('');

    const regex = /^.{1}[a-zA-Z0-9\s\\-]{0,20}$/;
    const inValid = regex.exec(value);

    if (value === '# ' || value === '#' || trimmedValue === '# ' || trimmedValue === '#') {
      setHashtagErrorMessage(t('profile:no_empty_hashtags'));
      return;
    }
    if (!inValid) {
      setHashtagErrorMessage(t('profile:no_special_characters_allowed'));
      return;
    }
    setHashtagErrorMessage('');

    if (hashtags.length >= 10) {
      setHashtagErrorMessage(t('profile:no_more_hashtags'));
      return;
    }

    if (hashtags.indexOf(value) !== -1) {
      setHashtagErrorMessage(t('profile:hashtag_already_exists'));
      return;
    }
    setHashtags([...hashtags, value]);

    if (hashtags.length <= 10 && !hashtags.includes(value)) {
      await updateUser({
        variables: {
          userData: {personalDetails: {searchTags: [...hashtags, value]}},
          token: session?.accessToken,
        },
      });
    }
    e.target.reset();
  };

  const removeUserHashtag = async toRemove => {
    const newTags = hashtags.filter(value => value !== toRemove);
    setHashtags(newTags);
    await updateUser({
      variables: {
        userData: {personalDetails: {searchTags: [...newTags]}},
        token: session?.accessToken,
      },
    });
  };

  return (
    <>
      <div className='max-w-6xl grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 gap-4 '>
        <div className='shadow-xl rounded-xl flex justify-center items-center py-10 px-10'>
          <div className='flex flex-col items-center'>
            <div
              className='relative rounded-full overflow-hidden lg:block'
              onClick={() => {
                handleProfileImage();
              }}
            >
              <>
                <img
                  className='relative rounded-full w-24 h-24 object-cover object-center'
                  src={avatar || '/assets/default-profile.jpg'}
                  alt=''
                />
                <label className='absolute rounded-full inset-0 w-24 h-24 bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100'>
                  <span className='text-xs'>Update photo</span>
                </label>
              </>
            </div>
            {imageError && imageError ? (
              <div className='text-red-500 mt-2 text-xs font-normal'>{imageError}</div>
            ) : null}
            <span className='text-xs mt-2 text-gray-500 font-light'>
              Allowed *.jpeg, *.jpg, *.png
            </span>
            <span className='text-xs text-gray-500 font-light'>2 MB</span>

            <div className='flex flex-col items-center mt-8'>
              <button
                onClick={() => handleChangeVisible()}
                className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600'
              >
                {visible ? t('profile:Make_Private') : t('profile:Make_Public')}
              </button>
            </div>
            <button
              onClick={deleteUserMutation}
              className='mt-8 bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600'
            >
              {t('profile:txt_del_acc')}
            </button>
          </div>
        </div>
        <div className='col-span-2 shadow-xl rounded-xl px-4 py-4 justify-center items-center'>
          <div className='overflow-hidden sm:rounded-md p-2'>
            <div className='grid grid-cols-6 gap-6'>
              <div className='col-span-6 sm:col-span-3'>
                <Field
                  label={t('profile:Full_Name')}
                  error={fullnameError && <FieldError message={fullnameError} />}
                >
                  <input
                    onChange={handleFullName}
                    value={fullname}
                    type='text'
                    name='fullname'
                    id='fullname'
                    maxLength={100}
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                  />
                </Field>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <Field
                  label={t('profile:txt_user_name_label')}
                  error={usernameError && <FieldError message={usernameError} />}
                >
                  <input
                    type='text'
                    onChange={handleUsername}
                    value={username}
                    maxLength={32}
                    name='username'
                    id='username'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </Field>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <Field label={t('profile:Timezone')}>
                  <TimezoneSelect
                    value={timezone}
                    onChange={handleTimezone}
                    labelStyle='abbrev'
                    className='w-full mt-1 timezone-wrapper'
                  />
                </Field>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <Field label={t('common:txt_language_label')}>
                  <select
                    onChange={handleLanguage}
                    value={language}
                    id='language'
                    name='language'
                    className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                  >
                    {LanguagesPicker}
                  </select>
                </Field>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <Field
                  label={t('profile:txt_phone')}
                  error={phoneErorr && <FieldError message={phoneErorr} />}
                >
                  <PhoneInput
                    // inputStyle={{width: '100%', padding: '22px 50px'}}
                    inputStyle={{width: '100%', paddingBottom: '18px', paddingTop: '18px'}}
                    value={`${phone}`}
                    country={Country}
                    countryCodeEditable={false}
                    onChange={(_, countryEl: any, {target: {value}}) => {
                      const {countryCode} = countryEl;
                      setCountryInput(countryCode);
                      if (isValidPhoneNumber(value ? value : '', countryCode)) {
                        setPhoneValid(true);
                        serPhoneerror(undefined);
                        handlePhone(value);
                      } else {
                        setPhoneValid(false);
                        serPhoneerror(t('common:phone_number_invalid'));
                      }
                      setPhone(value);
                    }}
                    isValid={PhoneValid}
                    inputProps={{
                      id: 'Phone',
                    }}
                  />
                </Field>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <Field
                  label={t('profile:zip_code')}
                  error={zipCodeError && <FieldError message={zipCodeError} />}
                >
                  <input
                    type='text'
                    onChange={handleZipCode}
                    value={zipCode}
                    maxLength={15}
                    name='zipCode'
                    id='zipCode'
                    className='focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </Field>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <Field label={t('profile:country')}>
                  <select
                    onChange={handleCountry}
                    value={country}
                    id='country'
                    name='country'
                    className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                  >
                    {CountriesPicker}
                  </select>
                </Field>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <Field label={t('profile:Headline')}>
                  <input
                    onChange={handleHeadline}
                    type='text'
                    value={headline}
                    name='headline'
                    maxLength={160}
                    id='headline'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </Field>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <Field label={t('common:txt_media_type_label')}>
                  <select
                    onChange={handleMediaType}
                    value={profileMediaType}
                    id='profileMediaType'
                    name='profileMediaType'
                    className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                  >
                    {MediaType}
                  </select>
                </Field>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <Field
                  label={t('common:txt_media_link_label')}
                  error={mediaLinkError && <FieldError message={mediaLinkError} />}
                >
                  <input
                    onChange={handleMediaLink}
                    type='text'
                    value={profileMediaLink}
                    disabled={!profileMediaType || profileMediaType === 'None'}
                    name='profileMediaLink'
                    id='profileMediaLink'
                    className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm disabled:bg-slate-100 border-gray-300 rounded-md'
                  />
                </Field>
              </div>
              <div className='col-span-6 sm:col-span-6'>
                <label
                  htmlFor='txt_media_link_label'
                  className='block text-sm font-medium text-gray-700'
                >
                  {t('profile:txt_user_hashtags')}
                </label>
                <form onSubmit={submitUserHashag}>
                  <div className='row ml-1'></div>
                  <div className='row mx-0 mb-3'>
                    <div className={'gap-2 flex'}>
                      <input
                        type='text'
                        name='hashtags'
                        maxLength={20}
                        id='hashtags'
                        className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      />
                      <button
                        className='flex flex-grow-0 flex-shrink-0 items-center px-4 py-2 rounded-lg shadow-sm text-md font-medium focus:outline-none bg-mainBlue text-white'
                        onClick={() => submitUserHashag}
                      >
                        {t('profile:add_tag')}
                      </button>
                    </div>
                  </div>
                  {HashtagError && (
                    <div className={'focus:border-blue-500 text-red-600 ml-1 mb-1'}>
                      {HashtagError}
                    </div>
                  )}
                </form>
                {hashtags?.map((tag, i) => (
                  <span
                    key={i}
                    className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 justify-between mr-1 mt-1'
                  >
                    {tag}
                    <button
                      className='ml-1 hover:text-red-500 duration-200 justify-end'
                      type='button'
                      onClick={async () => {
                        await removeUserHashtag(tag);
                      }}
                    >
                      <TrashIcon className='w-5 h-5' />
                    </button>
                  </span>
                ))}
              </div>
              <div className='col-span-6 sm:col-span-6'>
                <div className=' col-span-6'>
                  <label htmlFor='Description' className='block text-sm font-medium text-gray-700'>
                    {t('common:Description')}
                  </label>
                  <CKEditor
                    name={t('common:Description')}
                    value={description}
                    onChange={handleDescription}
                  />
                  {
                    (description || '').replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/gi, ' ')
                      .length
                  }
                  /750
                  {descriptionError && (
                    <div className={'focus:border-blue-500 text-red-600 ml-1 mb-1'}>
                      {descriptionError}
                    </div>
                  )}
                </div>
              </div>
              <div className='col-span-6 sm:col-span-6 justify-end text-right'>
                <button
                  type='button'
                  onClick={handleSaveButton}
                  className='mb-4 bg-mainBlue border disabled:bg-gray-600 border-transparent rounded-md shadow-sm py-2 mr-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  {t('common:btn_save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralEdit;
