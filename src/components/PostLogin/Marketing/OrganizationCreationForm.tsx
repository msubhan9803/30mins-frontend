import useTranslation from 'next-translate/useTranslation';
import {Formik} from 'formik';
import Button from '@components/button';
import {useMutation} from '@apollo/client';
import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';
import Input from './Input';
import {MARKETER_ORGANIZATION_YUP} from '../../../constants/yup/marketOrg';
import {singleUpload} from '../../../constants/GraphQL/Shared/mutations';
import organizationMutations from '../../../constants/GraphQL/Organizations/mutations';

const OrganizationCreationForm = ({setDisplayingForm}) => {
  const {t} = useTranslation('common');
  const router = useRouter();
  const [imageError, setImageError] = useState('');
  const [ImageLoading, setImageLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [orgImage, setOrgImage] = useState('');
  const {data: session} = useSession();

  const [mutateFunction] = useMutation(singleUpload);
  const [createOrg] = useMutation(organizationMutations.marketerCreateOrganization);

  const {showModal} = ModalContextProvider();

  const handleFileChange = async file => {
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
        if (response.singleUpload.status === 400 || response.singleUpload.status === 409) {
          setImageError('Maximum size allowed is 2MB');
          return;
        }
        setImageError('');
        setOrgImage(response.singleUpload.message);
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
      const {data: response} = await createOrg({
        variables: {
          organizationData: {
            title: values.title,
            image: orgImage || '',
            description: values.description,
            website: values.website,
            slug: values.slug,
            headline: values.headline,
            location: values.location,
          },
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });

      if (response.marketerCreateOrganization.status !== 200) {
        switch (response.marketerCreateOrganization.message) {
          case 'Organization Title Already In Use':
            setFieldError('title', t('common:Organization Title Already In Use'));
            break;
          case 'Organization Slug Already In Use':
            setFieldError('slug', t('common:Organization Slug Already In Use'));
            break;
          default:
            break;
        }
        setFormLoading(false);
        return;
      }

      router.reload();
    } catch (e) {
      console.log('Unknown Error');
      setFormLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        title: '',
        website: '',
        description: '',
        slug: '',
        location: '',
        headline: '',
      }}
      validationSchema={MARKETER_ORGANIZATION_YUP}
      onSubmit={(values, {setFieldError}) => {
        submitHandler(values, {setFieldError});
      }}
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
                {t('create_organization')}
              </h2>
            </div>
            <Input
              type='text'
              handleChange={(e: {target: {value: string}}) => {
                const {value} = e.target;
                setFieldValue('title', value);
                setFieldValue('slug', value.toLowerCase().replace(/[^a-z]+/gi, ''));
              }}
              handleBlur={handleBlur}
              value={values.title}
              name='title'
              label={'Title'}
              required
              errors={errors.title}
              touched={touched.title}
            />
            <Input
              type='text'
              onKeyDown={e =>
                ['+', '#', '*', '@', '.', ',', ' ', '/'].includes(e.key) && e.preventDefault()
              }
              onPaste={el => el.preventDefault()}
              handleChange={e => {
                setFieldValue('slug', e.target.value.trim());
              }}
              handleBlur={handleBlur}
              value={values.slug}
              name='slug'
              label={'Slug'}
              required
              errors={errors.slug}
              touched={touched.slug}
            />
            <Input
              type='text'
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.website}
              name='website'
              label={'Website'}
              required={false}
              errors={errors.website}
              touched={touched.website}
            />
            <Input
              type='text'
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.location}
              name='location'
              label={'Location (optional)'}
              required={false}
              errors={errors.location}
              touched={touched.location}
            />{' '}
            <Input
              type='text'
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.headline}
              name='headline'
              label={'Headline (optional)'}
              required={false}
              errors={errors.headline}
              touched={touched.headline}
            />
            <div className={'flex flex-col items-center'}>
              <div
                className='relative overflow-hidden lg:block rounded-full'
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
                    className='relative w-24 h-24 object-contain object-center'
                    src={orgImage || '/assets/default-profile.jpg'}
                    alt=''
                  />
                  <label className='absolute inset-0 w-24 h-24 bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100'>
                    <span className='text-xs cursor-pointer '>Update photo</span>
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
            <div className='lg:col-span-2'>
              <Field
                error={
                  errors.description &&
                  touched.description && <FieldError message={errors.description} />
                }
                label={t('common:Description')}
                required
              >
                <textarea
                  rows={4}
                  name='description'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id='description'
                  value={values.description}
                  className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                />
              </Field>
            </div>
            <div
              className={
                'col-span-1 md:col-span-4 mb-4 sm:mb-0 gap-4 w-full flex justify-end items-center'
              }
            >
              {/* {formError ? (
                <span className={'text-red-500 font-bold'}>
                  {t('Error')}: {formError}
                </span>
              ) : null} */}

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
        </form>
      )}
    </Formik>
  );
};

export default OrganizationCreationForm;
