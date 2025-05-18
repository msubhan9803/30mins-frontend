import useTranslation from 'next-translate/useTranslation';
import {Formik} from 'formik';
import Button from '@components/button';
import {useMutation} from '@apollo/client';
import {ChangeEvent, useState} from 'react';
import {LoaderIcon} from 'react-hot-toast';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import Timezones from 'constants/forms/timezones.json';
import Input from './Input';
import {MARKET_USER_YUP} from '../../../constants/yup/marketUser';
import {singleUpload} from '../../../constants/GraphQL/Shared/mutations';
import userMutations from '../../../constants/GraphQL/User/mutations';

const UserCreationForm = ({setDisplayingForm}) => {
  const {t} = useTranslation('common');
  const router = useRouter();
  const [imageError, setImageError] = useState('');
  const [formError, setFormError] = useState('');
  const [ImageLoading, setImageLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [avatar, setAvatar] = useState('');
  const {data: session} = useSession();

  const [mutateFunction] = useMutation(singleUpload);
  const [createUser] = useMutation(userMutations.marketerCreateUser);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setImageLoading(true);
    const {valid} = event.target.validity;
    const image = event.target.files![0];

    try {
      if (valid) {
        if (image.size > 2097152) {
          setImageError('Image too large. Maximum size is 2 MB.');
          setImageLoading(false);
          return;
        }
        const {data: response} = await mutateFunction({
          variables: {
            uploadType: 'MARKETER_UPLOAD',
            file: image,
            documentId: '',
            accessToken: session?.accessToken,
          },
        });
        if (response.singleUpload.status === 400 || response.singleUpload.status === 409) {
          setImageError('Maximum size allowed is 2MB');
          return;
        }
        setImageError('');
        setAvatar(response.singleUpload.message);
      }
    } catch (e) {
      setImageLoading(false);
      if (
        e.response.status === 400 ||
        e.response.status === 409 ||
        e.response.status === 413 ||
        e.response.status === 404
      ) {
        setImageError('Image too large. Maximum size is 2 MB.');
        return;
      }
      console.log('error', e);
    }

    setImageLoading(false);
  };
  const TimezonesPicker = Timezones.map(timezoneEl => (
    <option key={timezoneEl.value}>{timezoneEl.value}</option>
  ));
  const submitHandler = async values => {
    try {
      setFormLoading(true);
      const {data: response} = await createUser({
        variables: {
          userData: {
            personalDetails: {
              name: values.fullName,
              headline: values.headline,
              description: values.description,
              socials: {
                linkedin: values.linkedin,
              },
            },
            accountDetails: {
              username: values.username,
              email: values.email,
              avatar: avatar || '',
            },
            locationDetails: {
              country: values.country,
              zipCode: values.zipCode,
              timezone: values.timezone,
            },
          },
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });

      if (response.marketerCreateUser.status !== 200) {
        setFormError(response.marketerCreateUser.message);
        setFormLoading(false);
        return;
      }

      router.reload();
    } catch (e) {
      console.log('Unknown Error');
      setFormError('Unknown Error');
      setFormLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        fullName: '',
        email: '',
        username: '',
        headline: '',
        description: '',
        country: '',
        zipCode: '',
        linkedin: '',
        timezone: '',
      }}
      validationSchema={MARKET_USER_YUP}
      onSubmit={values => {
        submitHandler(values);
      }}
    >
      {({handleSubmit, handleChange, handleBlur, values, errors, touched}) => (
        <form onSubmit={handleSubmit} className={'grid grid-cols-4 gap-4'}>
          <Input
            type='text'
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.username}
            name='username'
            label={'Username'}
            required
            colSpan={1}
            errors={errors.username}
            touched={touched.username}
          />
          <Input
            type='text'
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.email}
            name='email'
            label={'Email'}
            required
            colSpan={1}
            errors={errors.email}
            touched={touched.email}
          />
          <Input
            type='text'
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.fullName}
            name='fullName'
            label={'Full Name'}
            required
            colSpan={1}
            errors={errors.fullName}
            touched={touched.fullName}
          />
          <Input
            type='text'
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.headline}
            name='headline'
            label={'Headline'}
            required={false}
            colSpan={1}
            errors={errors.headline}
            touched={touched.headline}
          />
          <Input
            type='text'
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.zipCode}
            name='zipCode'
            label={'Zip Code'}
            required={false}
            colSpan={1}
            errors={errors.zipCode}
            touched={touched.zipCode}
          />
          <Input
            type='text'
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.country}
            name='country'
            label={'Country'}
            required={false}
            colSpan={1}
            errors={errors.country}
            touched={touched.country}
          />
          <Input
            type='text'
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.linkedin}
            name='linkedin'
            label={'Linkedin (optional)'}
            required={false}
            colSpan={1}
            errors={errors.country}
            touched={touched.country}
          />
          <div className='w-full flex flex-col gap-2 col-span-1 mt-0'>
            <label htmlFor='timezone' className='block text-md font-medium text-gray-700'>
              {t('profile:Timezone')}
              <span className='text-red-400 font-extrabold m-1'>*</span>
            </label>
            <select
              onChange={handleChange}
              value={values.timezone}
              id='timezone'
              name='timezone'
              required={true}
              className='px-4 py-3 w-full text-base shadow-sm focus:ring-mainBlue focus:ring-offset-0 focus:ring-0 focus:border-mainBlue border-gray-300 rounded-lg appearance-none hover:appearance-none'
            >
              <option value={''} selected disabled>
                {' '}
                Select Timezone
              </option>
              {TimezonesPicker}
            </select>
            {errors.timezone && touched.timezone ? (
              <div className='text-red-500 mt-2 text-sm font-normal'>{errors.timezone}</div>
            ) : null}
          </div>
          <div className={'flex flex-col items-center'}>
            <div className='relative rounded-full overflow-hidden lg:block'>
              {ImageLoading ? (
                <LoaderIcon style={{width: 75, height: 75}} />
              ) : (
                <>
                  <img
                    className='relative rounded-full w-24 h-24 object-cover object-center'
                    src={avatar || '/assets/default-profile.jpg'}
                    alt=''
                  />
                  <label className='absolute rounded-full inset-0 w-24 h-24 bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100'>
                    <span className='text-xs'>Update photo</span>
                    <input
                      disabled={formLoading || ImageLoading}
                      id='user-photo'
                      name='user-photo'
                      accept='image/*'
                      type='file'
                      onChange={event => {
                        handleFileChange(event);
                      }}
                      className='absolute inset-0 w-24 h-24 opacity-0 cursor-pointer rounded-md'
                    />
                  </label>
                </>
              )}
            </div>
            {imageError ? (
              <div className='text-red-500 mt-2 text-xs font-normal'>{imageError}</div>
            ) : null}
            <span className='text-xs mt-2 text-gray-500 font-light'>
              Allowed *.jpeg, *.jpg, *.png
            </span>
            <span className='text-xs text-gray-500 font-light'>2 MB</span>
          </div>

          <div className=' col-span-4'>
            {t('common:Description')}
            <textarea
              rows={4}
              name='description'
              onChange={handleChange}
              onBlur={handleBlur}
              id='description'
              value={values.description}
              className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
            />

            {errors.description && touched.description ? (
              <div className='text-red-500 mt-2 text-sm font-normal'>{errors.description}</div>
            ) : null}
          </div>

          <div className={'col-span-4 gap-4 w-full flex justify-end items-center'}>
            {formError ? (
              <span className={'text-red-500 font-bold'}>
                {t('Error')}: {formError}
              </span>
            ) : null}

            <Button
              disabled={formLoading || ImageLoading}
              type='button'
              variant={'outline'}
              onClick={() => {
                setDisplayingForm('NONE');
              }}
            >
              {t('btn_cancel')}
            </Button>
            <Button
              disabled={formLoading || ImageLoading}
              type='submit'
              variant={'outline'}
              onClick={() => {}}
            >
              {formLoading ? t('Submitting') : t('Submit')}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default UserCreationForm;
