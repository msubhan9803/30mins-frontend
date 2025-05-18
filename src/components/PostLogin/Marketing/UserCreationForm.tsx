import useTranslation from 'next-translate/useTranslation';
import {Formik} from 'formik';
import Button from '@components/button';
import TimezoneSelect from 'react-timezone-select';
import {useMutation} from '@apollo/client';
import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import Input from '@root/components/forms/input';
import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import {MARKET_USER_YUP} from '../../../constants/yup/marketUser';
import {singleUpload} from '../../../constants/GraphQL/Shared/mutations';
import userMutations from '../../../constants/GraphQL/User/mutations';

const UserCreationForm = ({setDisplayingForm}) => {
  const {t} = useTranslation('common');
  const router = useRouter();
  const [imageError, setImageError] = useState('');
  const [ImageLoading, setImageLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [avatar, setAvatar] = useState('');
  const {data: session} = useSession();
  const {showModal} = ModalContextProvider();

  const [mutateFunction] = useMutation(singleUpload);
  const [createUser] = useMutation(userMutations.marketerCreateUser);

  const handleFileChange = async file => {
    setImageLoading(true);
    try {
      if (file) {
        const {data: response} = await mutateFunction({
          variables: {
            uploadType: 'MARKETER_UPLOAD',
            file: file,
            documentId: '',
            accessToken: session?.accessToken,
          },
        });
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

  const submitHandler = async (values, {setFieldError}) => {
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
                twitter: values.twitter,
                instagram: values.instagram,
                facebook: values.facebook,
                youtube: values.youtube,
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
        // eslint-disable-next-line default-case
        switch (response.marketerCreateUser.message) {
          case 'Username Already Exists':
            setFieldError('username', response.marketerCreateUser.message);
            break;
          case 'Email Already Exists':
            setFieldError('email', response.marketerCreateUser.message);
        }
        setFormLoading(false);
        return;
      }
      router.reload();
    } catch (e) {
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
        twitter: '',
        instagram: '',
        facebook: '',
        youtube: '',
      }}
      validationSchema={MARKET_USER_YUP}
      onSubmit={submitHandler}
      validateOnChange={false}
    >
      {({handleSubmit, setFieldValue, handleChange, handleBlur, values, errors, touched}) => (
        <form onSubmit={handleSubmit} className={'grid grid-cols-1 gap-4'}>
          <div
            className={
              'grid grid-cols-1 mb-4 lg:grid-cols-4 gap-4 border-2 border-double border-slate-100 p-8'
            }
          >
            <div className='col-span-1 lg:col-span-4'>
              <h2 className='text-xl sm:text-2xl font-bold text-mainBlue tracking-tight'>
                {t('create_user')}
              </h2>
            </div>

            <div>
              <Field
                label={'Username'}
                required
                error={errors.username && <FieldError breakW='words' message={errors.username} />}
              >
                <Input
                  placeholder=''
                  type='text'
                  handleChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  name='username'
                />
              </Field>
            </div>

            <div>
              <Field
                label={'Email'}
                required
                error={errors.email && <FieldError breakW='words' message={errors.email} />}
              >
                <Input
                  handleChange={e => {
                    setFieldValue('email', e.target.value.trim());
                  }}
                  placeholder=''
                  type='email'
                  // handleChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  name='email'
                />
              </Field>
            </div>

            <div>
              <Field
                label={'Full Name'}
                required
                error={errors.fullName && <FieldError breakW='words' message={errors.fullName} />}
              >
                <Input
                  placeholder=''
                  type='text'
                  handleChange={handleChange}
                  onBlur={handleBlur}
                  value={values.fullName}
                  name='fullName'
                />
              </Field>
            </div>

            <div>
              <Field
                label={'Headline'}
                required
                error={errors.headline && <FieldError breakW='words' message={errors.headline} />}
              >
                <Input
                  placeholder=''
                  type='text'
                  handleChange={handleChange}
                  onBlur={handleBlur}
                  value={values.headline}
                  name='headline'
                />
              </Field>
            </div>

            <div>
              <Field
                label={'Zip Code'}
                error={errors.zipCode && <FieldError breakW='words' message={errors.zipCode} />}
              >
                <Input
                  placeholder=''
                  type='text'
                  handleChange={handleChange}
                  onBlur={handleBlur}
                  value={values.zipCode}
                  name='zipCode'
                />
              </Field>
            </div>

            <div>
              <Field
                label={'Country'}
                error={errors.country && <FieldError breakW='words' message={errors.country} />}
              >
                <Input
                  placeholder=''
                  type='text'
                  handleChange={handleChange}
                  onBlur={handleBlur}
                  value={values.country}
                  name='country'
                />
              </Field>
            </div>

            <Field
              label={'Linkedin'}
              error={errors.linkedin && <FieldError breakW='words' message={errors.linkedin} />}
            >
              <Input
                placeholder=''
                type='text'
                handleChange={handleChange}
                onBlur={handleBlur}
                value={values.linkedin}
                name='linkedin'
              />
            </Field>

            <Field
              label={'Twitter'}
              error={errors.twitter && <FieldError breakW='words' message={errors.twitter} />}
            >
              <Input
                placeholder=''
                type='text'
                handleChange={handleChange}
                onBlur={handleBlur}
                value={values.twitter}
                name='twitter'
              />
            </Field>

            <Field
              label={'Instagram'}
              error={errors.instagram && <FieldError breakW='words' message={errors.instagram} />}
            >
              <Input
                placeholder=''
                type='text'
                handleChange={handleChange}
                onBlur={handleBlur}
                value={values.instagram}
                name='instagram'
              />
            </Field>

            <Field
              label={'Facebook'}
              error={errors.facebook && <FieldError breakW='words' message={errors.facebook} />}
            >
              <Input
                placeholder=''
                type='text'
                handleChange={handleChange}
                onBlur={handleBlur}
                value={values.facebook}
                name='facebook'
              />
            </Field>

            <Field
              label={'Youtube'}
              error={errors.youtube && <FieldError breakW='words' message={errors.youtube} />}
            >
              <Input
                placeholder=''
                type='text'
                handleChange={handleChange}
                onBlur={handleBlur}
                value={values.youtube}
                name='youtube'
              />
            </Field>

            <Field
              label={t('profile:Timezone')}
              required
              error={errors.timezone && <FieldError breakW='words' message={errors.timezone} />}
              className='!h-full'
            >
              <TimezoneSelect
                onChange={({value}) => setFieldValue('timezone', value)}
                value={values.timezone}
                id='timezone'
                name='timezone'
                labelStyle='abbrev'
                className='w-full h-full timezone-wrapper affiliate-wrapper'
                placeholder='Select Timezone'
              />
            </Field>

            <div className={'flex flex-col items-center'}>
              <div
                className='relative rounded-full overflow-hidden lg:block'
                onClick={() => {
                  try {
                    showModal(MODAL_TYPES.CHAMGEIMAGE, {
                      upLoadImage: handleFileChange,
                      defSize: 1,
                    });
                    // eslint-disable-next-line no-empty
                  } catch (err) {}
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
              {imageError ? (
                <div className='text-red-500 mt-2 text-xs font-normal'>{imageError}</div>
              ) : null}
              <span className='text-xs mt-2 text-gray-500 font-light'>
                Allowed *.jpeg, *.jpg, *.png
              </span>
              <span className='text-xs text-gray-500 font-light'>2 MB</span>
            </div>

            <div className='col-span-1 lg:col-span-2'>
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

            <div>
              <div
                className={
                  'col-span-1 mb-4 sm:mb-0 gap-4 w-full flex justify-end items-center mt-10'
                }
              >
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
                  variant={'solid'}
                  onClick={() => {}}
                >
                  {formLoading ? t('Submitting') : t('Submit')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default UserCreationForm;
