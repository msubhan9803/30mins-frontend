import {useEffect, useState} from 'react';
import {PlusIcon} from '@heroicons/react/20/solid';
import {PUBLICATION_STATE, PUBLICATION_YUP} from 'constants/yup/publication';
import {LoaderIcon, toast} from 'react-hot-toast';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Publications/mutations';
import {useSession} from 'next-auth/react';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import UploadImage from 'components/shared/UploadImage/UploadImage';
import queries from 'constants/GraphQL/Publications/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {useRouter} from 'next/router';
import Loader from 'components/shared/Loader/Loader';
import dynamic from 'next/dynamic';
import Field from '@components/forms/field';
import Input from '@components/forms/input';
import Button from '@root/components/button';
import {FieldError} from '@root/components/forms/error';
import Modal from '../Modal';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const Publication = () => {
  const {store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {pubID} = modalProps || {};

  const isAdd = !pubID;
  const [publicationData, setPublicationData] = useState<Object>([]);
  const {data: session} = useSession();
  const [loading, setLoading] = useState(false);
  const [createMutation] = useMutation(mutations.createPublication);
  const [editMutation] = useMutation(mutations.editPublication);
  const router = useRouter();
  const [PubImage, setImage] = useState(null);
  const [imageError, setErrorimage] = useState('');
  const {t} = useTranslation();

  useEffect(() => {
    setLoading(true);
    const getServiceData = async () => {
      const {data} = await graphqlRequestHandler(
        queries.getPublicationById,
        {documentId: pubID, token: session?.accessToken},
        session?.accessToken
      );
      setPublicationData(data);
    };

    if (pubID !== undefined) {
      getServiceData();
    }
    setLoading(false);
  }, [pubID]);

  const pubData =
    publicationData &&
    Object.values(publicationData).map(
      publication => publication?.getPublicationById?.publicationData
    );

  const publicationValues = pubData?.reduce(
    (acc, cur) => ({
      ...acc,
      ...cur,
    }),
    {}
  );

  const [descLength, setDescLength] = useState(
    publicationValues?.description
      ? (publicationValues.description || '')
          .replace(/<\/?[^>]+(>|$)/g, '')
          .replace(/&nbsp;/gi, ' ').length - 7
      : 0
  );

  useEffect(() => {
    setImage(publicationValues?.image);
  }, [publicationValues?.image]);

  const AddPublication = async (values, setSubmitting) => {
    if (PubImage === ' ' || PubImage === '' || PubImage === null || PubImage === undefined) {
      setErrorimage('Please upload an image');
      setSubmitting(false);
      return;
    }

    await createMutation({
      variables: {
        publicationData: {
          headline: values.headline,
          url: values.url,
          type: values.type,
          description: values.description,
          image: PubImage,
        },
        token: session?.accessToken,
      },
    });
    toast.success(t('common:publication_added'));
    router.reload();
    setSubmitting(false);
  };

  const EditPublication = async (id, values, setSubmitting) => {
    if (PubImage === ' ' || PubImage === '' || PubImage === null || PubImage === undefined) {
      setErrorimage('Please upload an image');
      setSubmitting(false);
      return;
    }

    await editMutation({
      variables: {
        publicationData: {
          headline: values.headline,
          url: values.url,
          type: values.type,
          description: values.description,
          image: PubImage,
        },
        token: session?.accessToken,
        documentId: id,
      },
    });
    toast.success(t('common:publication_edited'));
    router.reload();
    setSubmitting(false);
  };

  const submitHandler = async (values, setSubmitting) => {
    if (isAdd) {
      AddPublication(values, setSubmitting);
    } else {
      EditPublication(pubID, values, setSubmitting);
    }
  };

  const [mutateImageUpload, {loading: imageUploading}] = useMutation(singleUpload);

  const handleFileChange = async file => {
    try {
      if (file) {
        const response = await mutateImageUpload({
          variables: {
            file: file,
            accessToken: session?.accessToken,
          },
        });
        if (
          response.data.singleUpload.status === 400 ||
          response.data.singleUpload.status === 409 ||
          response.data.statusCode === 413
        ) {
          toast.success(t('common:maximum_size_allowed_2mb'));
          setErrorimage('Maximum size allowed is 2MB');
          return;
        }
        setErrorimage('');
        setImage(response.data.singleUpload.message);
      }
    } catch (e) {
      if (
        e.response.status === 400 ||
        e.response.status === 409 ||
        e.response.status === 413 ||
        e.response.status === 404
      ) {
        toast.success(t('common:maximum_size_allowed_2mb'));
        setErrorimage('Image too large. Maximum size is 2 MB.');
        return;
      }
      console.log('error', e);
    }
  };

  const handleFileEDIT = async file => {
    try {
      if (file) {
        const response = await mutateImageUpload({
          variables: {
            uploadType: 'EDIT_PUBLICATION_IMAGE',
            documentId: pubID,
            file: file,
            accessToken: session?.accessToken,
          },
        });
        if (
          response.data.singleUpload.status === 400 ||
          response.data.singleUpload.status === 409 ||
          response.data.statusCode === 413
        ) {
          setErrorimage('Maximum size allowed is 2MB');
          return;
        }
        setErrorimage('');
        setImage(response.data.singleUpload.message);
      }
    } catch (e) {
      if (
        e.response.status === 400 ||
        e.response.status === 409 ||
        e.response.status === 413 ||
        e.response.status === 404
      ) {
        setErrorimage('Image too large. Maximum size is 2 MB.');
        return;
      }
      console.log('error', e);
    }
  };

  const SelectOptions = [
    {key: t('profile:Book'), value: 'Book'},
    {key: t('profile:eBook'), value: 'eBook'},
    {key: t('profile:Whitepaper'), value: 'Whitepaper'},
    {key: t('profile:Patent'), value: 'Patent'},
    {key: t('profile:Other'), value: 'Other'},
  ];
  const PublicationType = SelectOptions.map(currency => (
    <option key={currency.key}>{currency.value}</option>
  ));

  if (loading) {
    return <Loader />;
  }
  return (
    <Modal
      title={
        isAdd
          ? t('profile:Add_public')
          : `${`${t('profile:Edit_public')} ${publicationValues.headline}`}`
      }
      icon={<PlusIcon className='h-6 w-6 text-blue-600' aria-hidden='true' />}
    >
      <Formik
        initialValues={isAdd ? PUBLICATION_STATE : publicationValues}
        validationSchema={PUBLICATION_YUP}
        enableReinitialize
        onSubmit={(values, {setSubmitting}) => {
          submitHandler(values, setSubmitting);
        }}
      >
        {({
          isSubmitting,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          touched,
          errors,
        }) => (
          <Form onSubmit={handleSubmit}>
            <>
              <div className='px-4 mt-5 sm:mb-4 text-center sm:text-right sm:px-6'>
                <Button
                  variant='solid'
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  {t('common:btn_save')}
                </Button>
              </div>
              <div className='mt-10 sm:mt-0'>
                <div className='md:grid md:grid-cols-1 md:gap-6'>
                  <div className='mt-5 md:mt-0 md:col-span-2'>
                    <div className='overflow-hidden sm:rounded-md'>
                      <div className='grid grid-cols-6 gap-6'>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('profile:Headline')}
                            error={
                              touched.headline &&
                              errors.headline && <FieldError message={errors.headline} />
                            }
                            required
                          >
                            <Input
                              value={values.headline}
                              handleChange={e => {
                                setFieldValue('headline', e.target.value);
                              }}
                              placeholder={''}
                              onBlur={handleBlur}
                              maxLength={160}
                              type='text'
                              name='headline'
                              id='headline'
                            />
                          </Field>
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('common:Url')}
                            error={touched.url && errors.url && <FieldError message={errors.url} />}
                            required
                          >
                            <Input
                              value={values.url}
                              handleChange={e => {
                                setFieldValue('url', e.target.value);
                              }}
                              placeholder={''}
                              onBlur={handleBlur}
                              type='text'
                              name='url'
                              id='url'
                            />
                          </Field>
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={isAdd ? t('profile:add_pub_image') : t('profile:edit_pub_image')}
                            error={imageError && <FieldError message={imageError} />}
                            required
                            isEditor
                          >
                            {imageUploading ? (
                              <LoaderIcon
                                style={{width: '50px', height: '50px'}}
                                className='my-20 m-auto'
                              />
                            ) : (
                              <UploadImage
                                title={t('profile:Pub_image')}
                                description={t('common:desc_required')}
                                uploadText={t('profile:upload_img')}
                                resetImage={() => {
                                  setImage(null);
                                }}
                                handleChange={isAdd ? handleFileChange : handleFileEDIT}
                                imagePath={PubImage}
                              />
                            )}
                          </Field>
                        </div>

                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('profile:pub_type')}
                            error={
                              touched.type && errors.type && <FieldError message={errors.type} />
                            }
                            required
                          >
                            <select
                              value={values.type}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              id='type'
                              name='type'
                              className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                            >
                              {PublicationType}
                            </select>
                          </Field>
                        </div>
                        <div className=' col-span-6'>
                          <Field
                            className='flex flex-row'
                            label={t('common:Description')}
                            error={
                              touched.description &&
                              errors.description && <FieldError message={errors.description} />
                            }
                            required
                            isEditor
                          >
                            <p className='text-right'>{descLength}/750</p>
                            <CKEditor
                              name={t('common:Description')}
                              setDescLength={e => {
                                const descriptionLength = e - 7;
                                descriptionLength < 0 ? setDescLength(0) : setDescLength(e - 7);
                              }}
                              value={values.description}
                              onChange={data => {
                                setFieldValue('description', data);
                              }}
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export default Publication;
