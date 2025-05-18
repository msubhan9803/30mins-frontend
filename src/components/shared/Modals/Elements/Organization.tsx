import {useContext, useEffect, useState} from 'react';
import router from 'next/router';
import {Field as FormikField, Form, Formik} from 'formik';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {ORGANIZATION_STATE, ORGANIZATION_YUP} from 'constants/yup/organization';
import {useSession} from 'next-auth/react';
import {LoaderIcon, toast} from 'react-hot-toast';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import useTranslation from 'next-translate/useTranslation';
import UploadImage from 'components/shared/UploadImage/UploadImage';
import dynamic from 'next/dynamic';
import DropDownComponent from 'components/shared/DropDownComponent';
import slug from 'slug';
import {UserContext} from '@root/context/user';
import {OrgExtentionError} from '@root/components/error';
import Button from '@root/components/button';
import FieldTags from '@root/components/field-tags';
import cn from 'classnames';
import {ChevronDownIcon} from '@heroicons/react/24/outline';
import {Transition} from '@headlessui/react';
import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';
import Modal from '../Modal';
import {PUBLIC_ORGANIZATION_FEATURES} from '../../../../constants/enums';
import stripeProductIDs from '../../../../constants/stripeProductIDs';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const OrganizationModal = () => {
  const {t} = useTranslation();
  const {hasOrgExtention, activeExtensions} = useContext(UserContext);
  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {orgId, initdata, onSubmit} = modalProps || {};
  const InitValues: typeof ORGANIZATION_STATE = initdata || ORGANIZATION_STATE;
  const [imageError, setErrorimage] = useState('');
  const [APILoading, setAPILoading] = useState(false);
  const isAdd = !orgId;
  const [hashTags, setHashtags] = useState(initdata?.searchTags || []);
  const {data: session} = useSession();
  const [PubImage, setImage] = useState(null);
  const [createMutation] = useMutation(mutations.createOrganization);
  const [editMutation] = useMutation(mutations.editOrganization);
  const [showMoreOptions, setshowMoreOptions] = useState(false);
  const [showSignupWarning, setShowSignupWarning] = useState(false);

  const SelectMediaType = [
    {key: t('Select'), value: 'None'},
    {
      key: t('common:txt_media_type_google'),
      value: 'Google Slides',
      selected: 'meetingType',
    },
    {key: t('common:txt_media_type_youtube'), value: 'Youtube Embed'},
  ];

  const MediaTypeSelect = SelectMediaType.map(currency => (
    <option key={currency.key}>{currency.value}</option>
  ));

  const selectRestrictedLevel = [
    {
      value: 'RESTRICTED',
      key: t('profile:invite_restricted'),
    },
    {value: 'OPEN', key: t('profile:invite_open')},
    {value: 'LOCKED', key: t('profile:invite_locked')},
  ];

  useEffect(() => {
    setImage(initdata?.image);
  }, [initdata?.image]);

  const AddOrganization = async (values, {setSubmitting, setFieldError}) => {
    try {
      const restrictionData = values.restrictionLevel.split(' - ')[0];
      const response = await createMutation({
        variables: {
          organizationData: {
            title: values.title,
            slug: slug(values.slug),
            headline: values.headline,
            description: values.description,
            website: values.website,
            supportEmail: values.supportEmail,
            supportPhone: values.supportPhone,
            location: values.location,
            restrictionLevel: restrictionData,
            searchTags: hashTags,
            socials: values?.socials,
            media: values.media,
            isPrivate: values.isPrivate,
            image: PubImage,
            publicFeatures: values.publicFeatures,
          },
          token: session?.accessToken,
        },
      });
      if (response.data.createOrganization.status === 409) {
        setSubmitting(false);
        if (response.data.createOrganization.message === 'Organization Title Already In Use') {
          setFieldError('title', t('common:Organization Title Already In Use'));
        }
        if (response.data.createOrganization.message === 'Organization Slug Already In Use') {
          setFieldError('slug', t('common:Organization Slug Already In Use'));
        }
      } else {
        toast.success(t('common:organization_added'));
        setSubmitting(false);
        await onSubmit();
        hideModal();
      }
      setSubmitting(false);
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  const EditOrganization = async (id, values, {setSubmitting, setFieldError}) => {
    const restrictionData = values.restrictionLevel?.split(' - ')[0];
    const response = await editMutation({
      variables: {
        organizationData: {
          title: values.title,
          slug: slug(values.slug),
          headline: values.headline,
          description: values.description,
          website: values.website,
          supportEmail: values.supportEmail,
          supportPhone: values.supportPhone,
          location: values.location,
          searchTags: hashTags,
          restrictionLevel: restrictionData,
          socials: values?.socials,
          media: values.media,
          isPrivate: values.isPrivate,
          image: PubImage,
          publicFeatures: values.publicFeatures,
        },
        token: session?.accessToken,
        documentId: id,
      },
    });
    if (response.data.editOrganization.status === 409) {
      setSubmitting(false);
      if (response.data.createOrganization.message === 'Organization Title Already In Use') {
        setFieldError('title', t('common:Organization Title Already In Use'));
      }
      if (response.data.createOrganization.message === 'Organization Slug Already In Use') {
        setFieldError('slug', t('common:Organization Slug Already In Use'));
      }
    } else {
      toast.success(t('common:organization_edited'));
      setSubmitting(false);
      router.reload();
      hideModal();
    }
    setSubmitting(false);
  };

  const [mutateImageUpload, {loading}] = useMutation(singleUpload);

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
          toast.error(t('common:organization_maximum_size_allowed_2mb'));
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
        toast.error(t('common:organization_maximum_size_allowed_2mb'));
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
            uploadType: 'EDIT_ORGANIZATION_IMAGE',
            documentId: orgId,
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

  const submitHandler = async (values, {setSubmitting, setFieldError}) => {
    setAPILoading(true);
    if (isAdd) {
      await AddOrganization(values, {setSubmitting, setFieldError});
    } else {
      await EditOrganization(orgId, values, {setSubmitting, setFieldError});
    }
    setAPILoading(false);
  };

  if (!hasOrgExtention) {
    return (
      <Modal title='Extension Required'>
        <OrgExtentionError router={router} hideModal={hideModal} />
      </Modal>
    );
  }
  return (
    <Modal
      title={
        isAdd
          ? t('common:add_organization')
          : `${`${t('common:edit_organization')} ${initdata.title}`}`
      }
    >
      <Formik
        initialValues={InitValues}
        validationSchema={ORGANIZATION_YUP}
        onSubmit={(values, {setSubmitting, setFieldError}) => {
          submitHandler(values, {setSubmitting, setFieldError});
        }}
        enableReinitialize
      >
        {({values, errors, touched, handleBlur, isSubmitting, setFieldValue, handleChange}) => {
          const customHandleChange = async e => {
            const {name, value} = e.target;
            if (name === 'title') {
              setFieldValue('title', value);
              setFieldValue('slug', slug(value));
            } else {
              setFieldValue(name, value);
            }
          };

          const submitUserHashag = async e => {
            setHashtags(e);
          };
          return (
            <Form className=''>
              <>
                <div className='px-4 my-3 sm:mb-4 text-right sm:px-6'>
                  <div className='w-full gap-2 flex sm:justify-end justify-center'>
                    <Button
                      variant='solid'
                      type='submit'
                      disabled={isSubmitting}
                      className='w-1/2 sm:w-32'
                    >
                      {!APILoading
                        ? isAdd
                          ? t('common:btn_save')
                          : t('common:btn_update')
                        : t('common:loading')}
                    </Button>
                  </div>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-y-4 sm:gap-4'>
                  <div className='col-span-4 sm:col-span-2'>
                    <Field
                      label={t('event:organization_Name')}
                      required
                      error={
                        touched?.title &&
                        errors?.title && <FieldError breakW='words' message={errors.title} />
                      }
                    >
                      <input
                        value={values.title}
                        onChange={customHandleChange}
                        onBlur={handleBlur}
                        type='text'
                        name='title'
                        id='title'
                        autoFocus
                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                      />
                    </Field>
                  </div>

                  <div className='col-span-4 sm:col-span-2'>
                    <Field
                      label={t('common:slug')}
                      required
                      error={
                        touched.slug &&
                        errors.slug && <FieldError breakW='words' message={errors.slug} />
                      }
                    >
                      <div className='mt-1 flex rounded-md w-full shadow-sm'>
                        <span className='hidden sm:inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
                          https://30mins.com/org/
                        </span>
                        <input
                          type='text'
                          value={values.slug}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name='slug'
                          id='slug'
                          onKeyDown={e =>
                            ['+', '.', ',', ' ', '*', '/', '\\', '='].includes(e.key) &&
                            e.preventDefault()
                          }
                          onPaste={el => el.preventDefault()}
                          className='flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-mainBlue  focus:border-mainBlue sm:text-sm border-gray-300'
                        />
                      </div>
                    </Field>
                  </div>

                  <div className='col-span-4 sm:col-span-2'>
                    <Field
                      label={t('profile:Headline')}
                      error={
                        touched.headline &&
                        errors.headline && <FieldError breakW='words' message={errors.headline} />
                      }
                    >
                      <input
                        value={values.headline}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={160}
                        type='text'
                        name='headline'
                        id='headline'
                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                      />
                    </Field>
                  </div>

                  <div className='col-span-4 sm:col-span-2'>
                    <Field
                      label={t('event:organization_website')}
                      error={
                        touched.website &&
                        errors.website && <FieldError breakW='words' message={errors.website} />
                      }
                    >
                      <input
                        value={values.website}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={254}
                        type='text'
                        name='website'
                        id='website'
                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                      />
                    </Field>
                  </div>

                  <div
                    className={cn([
                      'col-span-4 border flex items-center justify-between py-2 px-4',
                      showMoreOptions ? 'shadow-inner' : 'shadow-sm',
                    ])}
                    onClick={() => setshowMoreOptions(!showMoreOptions)}
                  >
                    <span className='text-slate-700 font-bold text-sm'>
                      {t('common:More_Options')}
                    </span>
                    <ChevronDownIcon
                      className={cn([
                        'w-6 text-slate-700',
                        !Boolean(showMoreOptions)! ? 'rotate-0' : 'rotate-180',
                      ])}
                    />
                  </div>
                  <Transition
                    show={showMoreOptions}
                    enter='transition duration-700 ease-out'
                    enterFrom='transform scale-95 opacity-0'
                    enterTo='transform scale-100 opacity-100'
                    leave='transition duration-700 ease-out'
                    leaveFrom='transform scale-100 opacity-100'
                    leaveTo='transform scale-95 opacity-0'
                    className={cn([
                      'w-full duration-700',
                      'col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4 p-2 border',
                    ])}
                  >
                    <div className='col-span-4 sm:col-span-2'>
                      <Field
                        label={t('event:location')}
                        error={
                          touched.location &&
                          errors.location && <FieldError breakW='words' message={errors.location} />
                        }
                      >
                        <input
                          value={values.location}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={160}
                          type='text'
                          name='location'
                          id='location'
                          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                        />
                      </Field>
                    </div>

                    <div className='col-span-4 sm:col-span-1'>
                      <Field
                        label={t('event:support_email')}
                        error={
                          touched.supportEmail &&
                          errors.supportEmail && (
                            <FieldError breakW='words' message={errors.supportEmail} />
                          )
                        }
                      >
                        <input
                          value={values.supportEmail}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={254}
                          type='text'
                          name='supportEmail'
                          id='supportEmail'
                          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                        />
                      </Field>
                    </div>

                    <div className='col-span-4 sm:col-span-1'>
                      <Field
                        label={t('event:support_phone')}
                        error={
                          touched.supportPhone &&
                          errors.supportPhone && (
                            <FieldError breakW='words' message={errors.supportPhone} />
                          )
                        }
                      >
                        <input
                          value={values.supportPhone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={254}
                          type='text'
                          name='supportPhone'
                          id='supportPhone'
                          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                        />
                      </Field>
                    </div>

                    <div className='col-span-4 sm:col-span-2'>
                      <Field label={t('event:restriction_level')}>
                        <DropDownComponent
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.restrictionLevel}
                          name='restrictionLevel'
                          options={selectRestrictedLevel}
                        />
                      </Field>
                    </div>

                    <div className='col-span-4 sm:col-span-1'>
                      <Field
                        label={t('event:twitter_link')}
                        error={
                          errors?.socials?.twitter && (
                            <FieldError breakW='words' message={errors.socials?.twitter} />
                          )
                        }
                      >
                        <input
                          value={values?.socials.twitter}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={254}
                          type='text'
                          name='socials.twitter'
                          id='socials.twitter'
                          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                        />
                      </Field>
                    </div>

                    <div className='col-span-4 sm:col-span-1'>
                      <Field
                        label={t('event:facebook_link')}
                        error={
                          touched.socials?.facebook &&
                          errors.socials?.facebook && (
                            <FieldError breakW='words' message={errors.socials?.facebook} />
                          )
                        }
                      >
                        <input
                          value={values?.socials.facebook}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={254}
                          type='text'
                          name='socials.facebook'
                          id='socials.facebook'
                          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                        />
                      </Field>
                    </div>

                    <div className='col-span-4 sm:col-span-1'>
                      <Field
                        label={t('event:instagram_link')}
                        error={
                          touched.socials?.instagram &&
                          errors.socials?.instagram && (
                            <FieldError breakW='words' message={errors.socials?.instagram} />
                          )
                        }
                      >
                        <input
                          value={values?.socials.instagram}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={254}
                          type='text'
                          name='socials.instagram'
                          id='socials.instagram'
                          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                        />
                      </Field>
                    </div>

                    <div className='col-span-4 sm:col-span-1'>
                      <Field
                        label={t('event:linkedin_link')}
                        error={
                          touched.socials?.linkedin &&
                          errors.socials?.linkedin && (
                            <FieldError breakW='words' message={errors.socials?.linkedin} />
                          )
                        }
                      >
                        <input
                          value={values?.socials.linkedin}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={254}
                          type='text'
                          name='socials.linkedin'
                          id='socials.linkedin'
                          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                        />
                      </Field>
                      <div className='flex'>
                        <label
                          htmlFor='first-name'
                          className='block text-sm font-medium text-gray-700'
                        ></label>
                      </div>
                    </div>

                    <div className='col-span-4 sm:col-span-2'>
                      <Field
                        label={t('profile:txt_youtube_link')}
                        error={
                          touched.socials?.youtube &&
                          errors.socials?.youtube && (
                            <FieldError breakW='words' message={errors.socials?.youtube} />
                          )
                        }
                      >
                        <input
                          value={values?.socials.youtube}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={254}
                          type='text'
                          name='socials.youtube'
                          id='socials.youtube'
                          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                        />
                      </Field>
                    </div>

                    <div className='col-span-4 sm:col-span-2'>
                      <Field
                        label={t('common:txt_media_link_label')}
                        error={
                          touched.media?.link &&
                          errors.media?.link && (
                            <FieldError breakW='words' message={errors.media.link} />
                          )
                        }
                      >
                        <input
                          value={values.media.link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type='text'
                          name='media.link'
                          id='media.link'
                          className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                        />
                      </Field>
                    </div>

                    <div className='col-span-4 sm:col-span-2'>
                      <Field label={t('common:txt_media_type_label')}>
                        <select
                          value={values.media.type}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          id='media.type'
                          name='media.type'
                          className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                        >
                          {MediaTypeSelect}
                        </select>
                      </Field>
                    </div>
                  </Transition>
                  <div className='col-span-4'>
                    <FieldTags value={hashTags} onChange={e => submitUserHashag(e)} />
                  </div>

                  <div className={'flex flex-col w-full col-span-4 sm:col-span-4'}>
                    <span className={'block text-md font-medium text-gray-700'}>
                      {t('common:organization_public_page_features')}
                    </span>
                    <div
                      role='group'
                      aria-labelledby='public features group'
                      className={'w-full flex gap-4 flex-wrap'}
                    >
                      <label className={'flex gap-2 items-center select-none'}>
                        <FormikField
                          type='checkbox'
                          name='publicFeatures'
                          value={PUBLIC_ORGANIZATION_FEATURES.MEMBERS}
                          className={'rounded-sm border-gray-300 cursor-pointer px-2 my-2'}
                        />
                        {t('common:orgs_show_members')}
                      </label>
                      <label className={'flex gap-2 items-center select-none'}>
                        <FormikField
                          type='checkbox'
                          name='publicFeatures'
                          value={PUBLIC_ORGANIZATION_FEATURES.SERVICES}
                          className={'rounded-sm border-gray-300 cursor-pointer px-2 my-2'}
                        />
                        {t('common:orgs_show_services')}
                      </label>
                      <label className={'flex gap-2 items-center select-none'}>
                        <FormikField
                          type='checkbox'
                          name='publicFeatures'
                          value={PUBLIC_ORGANIZATION_FEATURES.SIGN_UP}
                          className={'rounded-sm border-gray-300 cursor-pointer px-2 my-2'}
                          onChange={e => {
                            if (
                              activeExtensions?.some(
                                extension =>
                                  extension?.extensionProductId ===
                                  stripeProductIDs?.EXTENSIONS?.RESELLER
                              )
                            ) {
                              handleChange(e);
                            } else {
                              console.log(activeExtensions);
                              setShowSignupWarning(true);
                            }
                          }}
                        />
                        {t('common:orgs_show_signup')}
                      </label>
                    </div>
                  </div>
                  {showSignupWarning ? (
                    <div
                      className={
                        'col-span-4 w-full shadow-md px-2 py-1 rounded-md flex justify-center md:justify-between items-center gap-2 flex-wrap'
                      }
                    >
                      <span className={'text-red-400 font-semibold text-center'}>
                        {t('common:reseller_extension_missing_sm')}
                      </span>
                      <Button
                        variant={'solid'}
                        onClick={async () => {
                          await router.push('/user/extensions/reseller');
                          hideModal();
                        }}
                      >
                        {t('common:get_reseller_extension')}
                      </Button>
                    </div>
                  ) : null}

                  <div className='col-span-4 sm:col-span-2 my-auto'>
                    <Field
                      label=''
                      className='w-full'
                      error={
                        touched.image ||
                        (imageError && (
                          <FieldError breakW='words' message={errors.image || imageError} />
                        ))
                      }
                    >
                      {loading ? (
                        <LoaderIcon
                          style={{width: '50px', height: '50px'}}
                          className='my-20 m-auto'
                        />
                      ) : (
                        <UploadImage
                          title={t('profile:Pub_image')}
                          description={t('common:desc_required')}
                          uploadText={t('profile:upload_img')}
                          handleChange={isAdd ? handleFileChange : handleFileEDIT}
                          imagePath={PubImage}
                          resetImage={() => {
                            setImage(null);
                          }}
                        />
                      )}
                    </Field>
                  </div>

                  <div className='col-span-2'>
                    <Field
                      label={t('common:Description')}
                      required
                      error={
                        touched.description &&
                        errors.description && (
                          <FieldError breakW='words' message={errors.description} />
                        )
                      }
                    >
                      <div className='w-full'>
                        <CKEditor
                          name={t('common:Description')}
                          value={values.description}
                          onBlur={() => {
                            handleBlur({target: {name: 'description', value: values.description}});
                          }}
                          onChange={data => {
                            setFieldValue('description', data);
                          }}
                        />
                        {!errors.description &&
                          `${
                            values.description.startsWith('<p>')
                              ? values.description.length - 7
                              : values.description.length
                          }
                        /750`}
                      </div>
                    </Field>
                  </div>
                </div>
              </>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
export default OrganizationModal;
