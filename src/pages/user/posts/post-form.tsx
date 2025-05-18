import {useRef, useState, useEffect} from 'react';
import Head from 'next/head';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';
import {useMutation, useQuery} from '@apollo/client';
import {toast} from 'react-hot-toast';
import {useFormik} from 'formik';

import {ModalContextProvider} from 'store/Modal/Modal.context';

import {MODAL_TYPES} from 'constants/context/modals';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import postMutations from 'constants/GraphQL/Posts/mutations';
import postQueries from 'constants/GraphQL/Posts/queries';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Button from '@root/components/button';
import {FieldError} from '@root/components/forms/error';
import Field from '@components/forms/field';
import CKEditor from 'components/shared/Ckeditor/Ckeditor';
import FieldTags from '@root/components/field-tags';
import Loader from '@root/components/loader';
import FixedLoader from 'components/shared/Loader/Loader';

import {POST_YUP} from 'constants/yup/post';

function charactersCount(str: string | undefined) {
  return (str ?? '').replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/gi, '').length;
}

export default function PostForm() {
  const {t} = useTranslation('common');

  const router = useRouter();
  const {mode, pid} = router.query;

  const crumbs = [
    {title: t('home'), href: '/'},
    {title: t('posts'), href: '/user/posts'},
  ];

  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();

  const [createPost] = useMutation(postMutations.createPost);
  const [editPost] = useMutation(postMutations.editPost);
  const [uploadImageToS3] = useMutation(singleUpload);

  const {data: currentPostData, loading: isPostLoading} = useQuery(postQueries.getPostById, {
    variables: {documentId: pid, token: session?.accessToken},
    skip: pid === undefined,
    fetchPolicy: 'network-only',
  });

  const postImageFileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [enableOnChangeValidation, setEnableOnChangeValidation] = useState(false);

  const [initialFormData, setInitialFormData] = useState({
    title: '',
    postImage: '',
    description: '',
    tags: [],
  });

  const {values, errors, setFieldValue, handleChange, validateForm} = useFormik({
    enableReinitialize: true,
    initialValues: initialFormData,
    onSubmit: () => {
      null;
    },
    validationSchema: POST_YUP,
    validateOnChange: enableOnChangeValidation,
  });

  useEffect(() => {
    if (currentPostData) {
      setInitialFormData({
        title: currentPostData?.getPostById?.postData?.title || '',
        postImage: currentPostData?.getPostById?.postData?.image || null,
        description: currentPostData?.getPostById?.postData?.description || '',
        tags: currentPostData?.getPostById?.postData?.tags || [],
      });

      setFieldValue('postImage', currentPostData?.getPostById?.postData?.image);
      setFieldValue('title', currentPostData?.getPostById?.postData?.title);
    }
  }, [currentPostData]);

  async function uploadPostImage(file) {
    try {
      const response = await uploadImageToS3({
        variables: {
          file: file,
          accessToken: session?.accessToken,
        },
      });

      if ([400, 409, 413, 404].includes(response?.data?.singleUpload?.status)) {
        throw new Error(t('common:txt_valid_upload_image_1mb'));
      }

      return response.data?.singleUpload?.message;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  const handlePostImage = async () => {
    try {
      showModal(MODAL_TYPES.CHAMGEIMAGE, {
        upLoadImage: file => {
          setFieldValue('postImage', URL.createObjectURL(file));
          postImageFileRef.current = file;
        },
        defSize: 1,
        maxSize: 1000000,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSubmitCreatePost = async () => {
    setIsLoading(true);

    try {
      const imageUrl = await uploadPostImage(postImageFileRef?.current);

      const data = {
        title: values.title,
        description: values.description,
        tags: values.tags,
        image: imageUrl,
      };

      const response = await createPost({
        variables: {
          postData: data,
          token: session?.accessToken,
        },
      });

      setIsLoading(false);

      if (response?.data?.createPost?.status === 200) {
        toast.success(t('post_create_success'));
        router.push('/user/posts');
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
        imageUrl = await uploadPostImage(postImageFileRef?.current);
      } else {
        imageUrl = values.postImage;
      }

      const data = {
        title: values.title,
        description: values.description,
        tags: values.tags,
        image: imageUrl,
      };

      const response = await editPost({
        variables: {
          documentId: pid,
          postData: data,
          token: session?.accessToken,
        },
      });

      setIsLoading(false);

      if (response?.data?.editPost?.status === 200) {
        toast.success(t('post_update_success'));
        router.push('/user/posts');
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

  return (
    <PostLoginLayout>
      <Head>
        <title>
          {mode === 'create' ? 'Create' : 'Edit'} {t('posts')}
        </title>
      </Head>
      <Header
        crumbs={crumbs}
        heading={`${mode === 'create' ? t('create_new_post') : t('edit_post')}`}
      />

      {isPostLoading && <FixedLoader />}

      <div className='w-full p-0 md:p-8 lg:p-16 mt-6 border-0 md:border rounded-lg shadow-none md:shadow-md bg-white border-gray-200 pb-20'>
        <div className='flex flex-col w-full'>
          <div className='grid grid-cols-1 sm:grid-cols-4 sm:gap-4 sm:pb-4'>
            <div className='col-span-3 mb-6 flex justify-start'>{t('post_help')}</div>
            <div className='col-span-1 mb-6 flex justify-end w-full'>
              <Button
                className='w-full sm:w-auto'
                type='button'
                variant='solid'
                onClick={handleSumbit}
              >
                {!isLoading ? (
                  mode === 'create' ? (
                    t('save_post')
                  ) : (
                    t('edit_post')
                  )
                ) : (
                  <Loader color={'currentColor'} />
                )}
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4'>
            <div className='relative col-span-1 h-full flex flex-col flex-grow justify-start align-start'>
              <Field
                label={t('post_title')}
                error={errors.title && <FieldError message={errors.title} />}
                required
                isEditor
                className='w-full h-full'
              >
                <textarea
                  rows={12}
                  onChange={handleChange}
                  name='title'
                  value={values.title}
                  maxLength={750}
                  id='title'
                  className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                />
                <span className='absolute top-[10px] right-0 text-xs text-mainText font-bold'>
                  {`${values.title.length}/256`}
                </span>
              </Field>
            </div>
            <div className='col-span-1'>
              <div className='relative flex items-center justify-center overflow-hidden  h-80 w-full rounded bg-[rgb(244_246_248)] border border-dashed border-[rgb(145_158_171)] border-opacity-30 cursor-pointer'>
                {!values.postImage ? (
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
                      src={values.postImage}
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
              {errors.postImage && <FieldError message={errors.postImage} />}
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <div className='relative col-span-2 flex w-full'>
              <Field
                label={t('post_description')}
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

            <div className='col-span-2 flex w-full'>
              <FieldTags
                title={t('add_post_tags')}
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

PostForm.auth = true;
