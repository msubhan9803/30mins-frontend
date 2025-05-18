import {useContext, useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {getSession, useSession} from 'next-auth/react';
import {useMutation, useQuery} from '@apollo/client';
import {toast} from 'react-hot-toast';
import {useFormik} from 'formik';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import productMutations from 'constants/GraphQL/Products/mutations';
import productQueries from 'constants/GraphQL/Products/queries';
import {PRODUCT_YUP} from 'constants/yup/post';
import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Button from '@root/components/button';
import {FieldError} from '@root/components/forms/error';
import Field from '@components/forms/field';
import CKEditor from 'components/shared/Ckeditor/Ckeditor';
import FieldTags from '@root/components/field-tags';
import Loader from '@root/components/loader';
import FixedLoader from 'components/shared/Loader/Loader';
import Input from '@root/components/forms/input';
import {EscrowAccountNotConnectedError} from '@root/components/error';
import {UserContext} from '@root/context/user';
import ManageType from 'components/PostLogin/Products/ManageType';
import {GetServerSideProps} from 'next';
import {SERVICE_TYPES_ENGLISH} from '../../../constants/enums';
import graphqlRequestHandler from '../../../utils/graphqlRequestHandler';
import servicesQueries from '../../../constants/GraphQL/Service/queries';

function charactersCount(str: string | undefined) {
  return (str ?? '').replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/gi, '').length;
}

export default function ProductForm({serviceData}) {
  const {t} = useTranslation('common');
  const router = useRouter();
  const {mode, pid} = router.query;

  const crumbs = [
    {title: t('home'), href: '/'},
    {title: t('Products'), href: '/user/all-products'},
    {
      title: mode === 'create' ? t('Add product') : t('Edit product'),
      href: '#',
    },
  ];

  const {user} = useContext(UserContext);

  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();

  const [createProduct] = useMutation(productMutations.createProduct);
  const [editProduct] = useMutation(productMutations.editProduct);
  const [uploadImageToS3] = useMutation(singleUpload);
  const [uploadLoading, setUploadLoading] = useState(false);

  const {data: currentProductData, loading: isProductLoading} = useQuery(
    productQueries.getProductById,
    {
      variables: {documentId: pid, token: session?.accessToken},
      skip: pid === undefined,
      fetchPolicy: 'network-only',
    }
  );

  const postImageFileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [enableOnChangeValidation, setEnableOnChangeValidation] = useState(false);

  const [initialFormData, setInitialFormData] = useState({
    title: '',
    price: 0,
    type: 'Digital',
    file: {
      name: '',
      link: '',
    },
    attachedFile: undefined,
    resText: '',
    discount: 0,
    image: '',
    description: '',
    service: '',
    serviceMessage: '',
    tags: [],
  });

  const {values, errors, setFieldValue, handleChange, validateForm} = useFormik({
    enableReinitialize: true,
    initialValues: initialFormData,
    onSubmit: () => {
      null;
    },
    validationSchema: PRODUCT_YUP,
    validateOnChange: enableOnChangeValidation,
  });

  useEffect(() => {
    if (currentProductData) {
      setInitialFormData({
        title: currentProductData?.getProductById?.product?.title || '',
        type: currentProductData?.getProductById?.product?.type || '',
        file: {
          name: currentProductData?.getProductById?.product?.file?.name,
          link: currentProductData?.getProductById?.product?.file?.link,
        },
        attachedFile: undefined,
        resText: currentProductData?.getProductById?.product?.resText,
        price: currentProductData?.getProductById?.product?.price,
        discount: currentProductData?.getProductById?.product?.discount,
        image: currentProductData?.getProductById?.product?.image || null,
        description: currentProductData?.getProductById?.product?.description || '',
        tags: currentProductData?.getProductById?.product?.tags || [],
        service: currentProductData?.getProductById?.product?.service?._id || '',
        serviceMessage: currentProductData?.getProductById?.product?.serviceMessage || '',
      });

      setFieldValue('image', currentProductData?.getProductById?.product?.image);
      setFieldValue('title', currentProductData?.getProductById?.product?.title);
    }
  }, [currentProductData]);

  async function uploadProductImage(file, uploadType) {
    try {
      setUploadLoading(true);
      const response = await uploadImageToS3({
        variables: {
          file: file,
          accessToken: session?.accessToken,
          uploadType,
        },
      });

      if ([400, 409, 413, 404].includes(response?.data?.singleUpload?.status)) {
        setUploadLoading(false);
        throw new Error(t('common:txt_valid_upload_image_1mb'));
      }
      setUploadLoading(false);

      return response.data?.singleUpload?.message;
    } catch (err) {
      setUploadLoading(false);

      throw new Error(err.message);
    }
  }

  const handlePostImage = async () => {
    try {
      setUploadLoading(true);
      showModal(MODAL_TYPES.CHAMGEIMAGE, {
        upLoadImage: file => {
          setFieldValue('image', URL.createObjectURL(file));
          postImageFileRef.current = file;
        },
        defSize: 1,
        maxSize: 1000000,
      });
      setUploadLoading(false);
    } catch (err) {
      setUploadLoading(false);

      console.error(err.message);
    }
  };

  const handleSubmitCreatePost = async () => {
    setIsLoading(true);

    try {
      const imageUrl = await uploadProductImage(postImageFileRef?.current, 'PRODUCT_IMAGE');

      let fileUploaded: any;
      if (values.attachedFile) {
        fileUploaded = await uploadProductImage(values.attachedFile, 'PRODUCT_FILE');
      } else {
        fileUploaded = null;
      }

      const data = {
        title: values.title,
        description: values.description,
        price: values.price,
        discount: values.discount,
        tags: values.tags,
        image: imageUrl,
        resText: values.resText,
        file: {
          name: values.file.name,
          link: fileUploaded,
        },
        service: values?.service || null,
        serviceMessage: values?.serviceMessage || null,
      };

      const response = await createProduct({
        variables: {
          productData: data,
          token: session?.accessToken,
        },
      });

      setIsLoading(false);

      if (response?.data?.createProduct?.status === 200) {
        toast.success(t('product_create_success'));
        router.push('/user/all-products');
      }

      if (response?.data?.editPost?.status === 500) {
        toast.error(response?.data?.editPost?.message);
      }
    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  const handleSubmitEditPost = async () => {
    setIsLoading(true);

    try {
      let imageUrl = '';

      if (postImageFileRef?.current) {
        imageUrl = await uploadProductImage(postImageFileRef?.current, 'PRODUCT_IMAGE');
      } else {
        imageUrl = values.image;
      }

      let fileUploaded: any = null;
      if (values.attachedFile) {
        fileUploaded = await uploadProductImage(values.attachedFile, 'PRODUCT_FILE');
      }

      const fileData: any = {name: null, link: null};

      if (values.file?.name && fileUploaded) {
        fileData.name = values.file?.name;
        fileData.link = fileUploaded;
      } else if (values?.file?.name && !fileUploaded) {
        fileData.name = values.file?.name;
        fileData.link = currentProductData?.getProductById?.product?.file?.link;
      }

      const data = {
        title: values.title,
        description: values.description,
        price: values.price,
        discount: values.discount,
        tags: values.tags,
        image: imageUrl,
        resText: values.resText,
        file: fileData,
        service: values.service,
        serviceMessage: values.serviceMessage,
      };

      const response = await editProduct({
        variables: {
          documentId: pid,
          productData: data,
          token: session?.accessToken,
        },
      });

      setIsLoading(false);

      if (response?.data?.editProduct?.status === 200) {
        toast.success(t('product_update_success'));
        router.push('/user/all-products');
      }

      if (response?.data?.editPost?.status === 500) {
        toast.error(response?.data?.editPost?.message);
      }
    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  const handleSumbit = async () => {
    setEnableOnChangeValidation(true);

    const isValidated = await validateForm();

    if (Object.keys(isValidated).length !== 0) return;

    if (mode === 'create') {
      handleSubmitCreatePost();
    } else {
      handleSubmitEditPost();
    }
  };

  if (!user) {
    return (
      <PostLoginLayout>
        <Head>
          <title>
            {mode === 'create' ? 'Create' : 'Edit'} {t('product')}
          </title>
        </Head>
        <Header
          crumbs={crumbs}
          heading={`${mode === 'create' ? t('create_new_product') : t('edit_product')}`}
        />
        <FixedLoader />
      </PostLoginLayout>
    );
  }

  if (!user?.escrowAccount) {
    return (
      <PostLoginLayout>
        <Head>
          <title>
            {mode === 'create' ? 'Create' : 'Edit'} {t('product')}
          </title>
        </Head>
        <Header
          crumbs={crumbs}
          heading={`${mode === 'create' ? t('create_new_product') : t('edit_product')}`}
        />
        <EscrowAccountNotConnectedError router={router} />
      </PostLoginLayout>
    );
  }

  return (
    <PostLoginLayout>
      <Head>
        <title>
          {mode === 'create' ? 'Create' : 'Edit'} {t('product')}
        </title>
      </Head>
      <Header
        crumbs={crumbs}
        heading={`${mode === 'create' ? t('create_new_product') : t('edit_product')}`}
      />

      {isProductLoading && <FixedLoader />}

      <div className='w-full p-0 md:p-4 border-0 md:border rounded-b-lg mt-12 md:mt-0 shadow-none md:shadow-md bg-white border-gray-200 pb-20 rounded-t-lg'>
        <div className='flex flex-col w-full'>
          <div className='flex flex-col md:flex-row justify-between gap-4 mb-2'>
            <div className='mb-2 flex justify-center items-center space-x-5 '>
              <div className='flex flex-col gap-1 items-start'>
                <h2 className='text-base leading-5 lg:text-xl font-bold text-mainText'>
                  {t('describe_the_product')}
                </h2>
                <p className='hidden text-gray-500 pl-1 text-sm leading-snug md:block'>
                  {t('describe_the_product_details')}
                </p>
              </div>
            </div>
            <div className='gap-2 grid grid-cols-2 sm:grid-cols-3 mx-auto justify-center md:justify-end md:ml-auto md:mr-0 items-center min-w-max w-full sm:w-6/12 xl:w-4/12'>
              <Button
                className='flex flex-grow-0 flex-shrink-0 select-none active:opacity-70 items-center px-4 py-2 h-9 rounded-lg shadow-sm text-md font-medium focus:outline-none text-xs md:text-sm justify-center px-4 py-2 text-md bg-mainBlue text-white hover:bg-transparent hover:text-mainBlue hover:ring-1 hover:ring-mainBlue h-max text-xs sm:text-sm flex justify-center items-center order-0 col-start-2 sm:order-2 sm:col-start-3'
                type='button'
                variant='solid'
                disabled={uploadLoading}
                onClick={handleSumbit}
              >
                {!isLoading ? (
                  mode === 'create' ? (
                    t('save_product')
                  ) : (
                    t('save_product')
                  )
                ) : (
                  <Loader color={'currentColor'} />
                )}
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4'>
            <div className='col-span-1'>
              <div className='relative flex items-center justify-center overflow-hidden  h-80 w-full rounded bg-[rgb(244_246_248)] border border-dashed border-[rgb(145_158_171)] border-opacity-30 cursor-pointer'>
                {!values.image ? (
                  <div
                    className='w-full h-full flex flex-col items-center justify-center'
                    onClick={handlePostImage}
                  >
                    <span className='text-base font-medium text-mainText'>
                      {t('upload_post_image')}*
                    </span>
                    <span className='text-xs text-mainText'>{t('post_recommended_size')}</span>
                    <span className='text-xs text-mainText'>{t('post_max_size')}</span>
                  </div>
                ) : (
                  <>
                    <Image
                      src={values.image}
                      alt=''
                      className='rounded'
                      width={250}
                      height={250}
                      objectFit='contain'
                    />

                    <label
                      onClick={handlePostImage}
                      className='cursor-pointer absolute  w-full rounded  object-cover inset-0 bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100'
                    >
                      <span>{t(`change_post`)}</span>
                    </label>
                  </>
                )}
              </div>
              {errors.image && <FieldError message={errors.image} />}
            </div>
            <div className='relative col-span-1 lg:col-span-2 h-full flex flex-col gap-2 justify-start align-start'>
              <Field
                label={t('title')}
                error={errors.title && <FieldError message={errors.title} />}
                required
                isEditor
                className='w-full h-full'
              >
                <Input
                  handleChange={handleChange}
                  type='text'
                  name='title'
                  value={values.title}
                  maxLength={750}
                  id='title'
                />
              </Field>

              <div className='flex flex-col lg:flex-row gap-2'>
                <Field
                  label={t('price')}
                  error={errors.price && <FieldError message={errors.price} />}
                  required
                  isEditor
                  className='w-full h-full'
                >
                  <div className='flex flex-row'>
                    <Input
                      handleChange={({target: {value}}) => {
                        setFieldValue('price', Math.floor(parseInt(`${value || 0}`, 10)));
                      }}
                      type='number'
                      name='price'
                      value={values.price}
                      maxLength={750}
                      id='price'
                      className='rounded-r-none '
                    />
                    <span className='flex flex-col font-bold justify-center items-center w-8 bg-slate-200 border rounded-l-none border-gray-300 rounded-lg'>
                      $
                    </span>
                  </div>
                </Field>

                <Field
                  label={t('discount')}
                  error={errors.discount && <FieldError message={errors.discount} />}
                  required
                  isEditor
                  className='w-full h-full'
                >
                  <div className='flex flex-row'>
                    <Input
                      handleChange={({target: {value}}) => {
                        setFieldValue('discount', Math.floor(parseInt(`${value || 0}`, 10)));
                      }}
                      type='number'
                      name='discount'
                      value={values.discount}
                      maxLength={750}
                      id='discount'
                      className='rounded-r-none '
                    />
                    <span className='flex flex-col font-bold justify-center items-center w-8 bg-slate-200 border rounded-l-none border-gray-300 rounded-lg'>
                      %
                    </span>
                  </div>
                </Field>
              </div>
              <div className='flex flex-col lg:flex-row gap-2 w-full'>
                <ManageType
                  values={values}
                  errors={errors}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <div className='relative col-span-2 flex w-full'>
              <Field
                label={t('Description')}
                error={errors.description && <FieldError message={errors.description} />}
                required
                isEditor
                className='w-full'
              >
                <CKEditor
                  name=''
                  value={values.description}
                  onChange={handleChange('description')}
                  setDescLength={undefined}
                />
              </Field>
              <span className='absolute top-[10px] right-0 text-xs text-mainText font-bold'>
                {`${charactersCount(values.description)}/1024`}
              </span>
            </div>

            <div className='relative col-span-2 flex w-full'>
              <p className='hidden text-gray-500 pl-1 text-sm leading-snug md:block'>
                {t('describe_the_product_service')}
              </p>
            </div>

            <div className='col-span-1'>
              <label htmlFor='service' className='block text-md font-medium text-gray-700'>
                {t('common:service')}
              </label>
              <div className='mt-1 rounded-md shadow-sm flex'>
                <select
                  onChange={handleChange('service')}
                  value={values.service}
                  id='service'
                  name='service'
                  className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
                >
                  <option value={''}>{t('common:none')}</option>
                  {serviceData?.map(service => (
                    <option key={service._id} value={service._id}>
                      {service.title} - {SERVICE_TYPES_ENGLISH[service?.serviceType]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={'col-span-1'}>
              <Field
                label={t('common:service_advertisement')}
                error={errors?.serviceMessage && <FieldError message={errors?.serviceMessage} />}
                isEditor
                className='w-full h-full'
              >
                <textarea
                  value={values.serviceMessage}
                  name='serviceMessage'
                  placeholder={'Looking to learn more? Book a meeting with me today!'}
                  className='focus:ring-mainBlue mt-auto resize-none focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  style={{
                    height: '80px',
                  }}
                  onChange={handleChange}
                />
              </Field>
            </div>

            <div className='col-span-2 flex w-full'>
              <FieldTags
                title={t('add_tags')}
                value={values.tags}
                onChange={e => {
                  setFieldValue('tags', e);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </PostLoginLayout>
  );
}

ProductForm.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const session = await getSession(context);

    const {data: serviceDataResponse} = await graphqlRequestHandler(
      servicesQueries.getServicesByUserId,
      {token: session?.accessToken},
      session?.accessToken
    );

    return {
      props: {
        serviceData: serviceDataResponse.data.getServicesByUserId.serviceData || [],
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
