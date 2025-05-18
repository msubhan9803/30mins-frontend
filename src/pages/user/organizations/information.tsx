import {useEffect, useState} from 'react';
import Head from 'next/head';
import router from 'next/router';
import dynamic from 'next/dynamic';

import {Field as FormikField, Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import slug from 'slug';
import cn from 'classnames';
import {LoaderIcon, toast} from 'react-hot-toast';
import {useMutation, useQuery} from '@apollo/client';
import {getSession, useSession} from 'next-auth/react';

import mutations from 'constants/GraphQL/Organizations/mutations';
import queries from 'constants/GraphQL/Organizations/queries';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import {ORGANIZATION_STATE, ORGANIZATION_YUP} from 'constants/yup/organization';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Button from '@root/components/button';
import DropDownComponent from 'components/shared/DropDownComponent';
import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';
import FieldTags from '@root/components/field-tags';
import UploadImage from 'components/shared/UploadImage/UploadImage';
import Loader from 'components/shared/Loader/Loader';
import {GetServerSideProps} from 'next';
import {PUBLIC_ORGANIZATION_FEATURES} from '../../../constants/enums';
import graphqlRequestHandler from '../../../utils/graphqlRequestHandler';
import userQueries from '../../../constants/GraphQL/User/queries';
import stripeProductIDs from '../../../constants/stripeProductIDs';
import {ModalContextProvider} from '../../../store/Modal/Modal.context';
import {MODAL_TYPES} from '../../../constants/context/modals';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

export default function OrganizationInformation({hasResellerExtension}) {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Organizations'), href: '/user/organizations'},
    {title: t('page:Information'), href: '/user/organizations/information'},
  ];

  const {data: session} = useSession();

  const [editMutation] = useMutation(mutations.editOrganization);

  const [mutateImageUpload, {loading}] = useMutation(singleUpload);

  const {data: organizations, loading: orgLoading} = useQuery(
    queries.getOrganizationManagementDetails,
    {
      variables: {
        token: session?.accessToken,
      },
    }
  );

  const organizationsData = organizations?.getOrganizationManagementDetails?.membershipData;

  const [currentSelectedOrg, setCurrentSelectedOrg] = useState<any>(null);
  const [InitValues, setInitValues] = useState(ORGANIZATION_STATE);
  const [imageError, setErrorimage] = useState('');
  const [APILoading, setAPILoading] = useState(false);
  const [hashTags, setHashtags] = useState(InitValues?.searchTags || []);
  const [PubImage, setImage] = useState<null | string>(null);

  useEffect(() => {
    if (organizationsData) {
      setCurrentSelectedOrg(organizationsData[0]?.organizationId || null);
    }
  }, [organizationsData]);

  useEffect(() => {
    if (currentSelectedOrg) {
      setInitValues(currentSelectedOrg);
    }
  }, [currentSelectedOrg]);

  useEffect(() => {
    setImage(InitValues?.image);
  }, [InitValues?.image]);

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

  const selectOrganizations =
    organizationsData
      ?.filter(item => item.role === 'owner' || item.role === 'admin')
      ?.map(item => ({
        value: item.organizationId._id,
        key: item.organizationId.title,
      })) ?? [];

  const selectRestrictedLevel = [
    {
      value: 'RESTRICTED',
      key: t('profile:invite_restricted'),
    },
    {value: 'OPEN', key: t('profile:invite_open')},
    {value: 'LOCKED', key: t('profile:invite_locked')},
  ];

  const EditOrganization = async (id, values, {setSubmitting, setFieldError}) => {
    try {
      const restrictionData = values?.restrictionLevel?.split(' - ')?.[0];

      const response = await editMutation({
        variables: {
          organizationData: {
            publicFeatures: values.publicFeatures,
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
            socials: {
              twitter: values.socials.twitter,
              instagram: values.socials.instagram,
              linkedin: values.socials.linkedin,
              facebook: values.socials.facebook,
              youtube: values.socials.youtube,
            },
            media: {
              link: values.media.link,
              type: values.media.type,
            },
            isPrivate: values.isPrivate,
            image: PubImage,
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
      }

      setSubmitting(false);
    } catch (err) {
      toast.dismiss();
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  const handleFileEDIT = async file => {
    try {
      if (file) {
        const response = await mutateImageUpload({
          variables: {
            uploadType: 'EDIT_ORGANIZATION_IMAGE',
            documentId: currentSelectedOrg?._id,
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

    await EditOrganization(currentSelectedOrg?._id, values, {setSubmitting, setFieldError});

    setAPILoading(false);
  };

  const handleChangeOrganization = e => {
    const {value} = e.target;

    const currentOrg = organizationsData.find(item => item.organizationId._id === value);

    setCurrentSelectedOrg(currentOrg?.organizationId);
  };

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:Information')}</title>
      </Head>
      <Header crumbs={crumbs} heading={t('page:Information')} />

      {orgLoading && !organizationsData && (
        <div className='mt-6'>
          <Loader />
        </div>
      )}

      {!orgLoading && !organizationsData && (
        <div className='mt-6 text-center'>
          <p className='text-gray-500 text-2xl'>{t('common:no_organization_found')}</p>
        </div>
      )}

      {organizationsData && (
        <div className='mt-6'>
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
                    <div className='flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                        <p className='text-lg font-semibold text-mainText'>
                          {t('common:select_organization')}
                        </p>
                        <DropDownComponent
                          name='currentOrganization'
                          options={selectOrganizations}
                          className='min-w-[300px]'
                          onChange={handleChangeOrganization}
                        />
                      </div>
                      <Button
                        type='submit'
                        variant='solid'
                        className='w-full sm:w-32'
                        disabled={isSubmitting}
                      >
                        {!APILoading ? t('common:btn_update') : t('common:loading')}
                      </Button>
                    </div>

                    <div className='mt-4 grid grid-cols-2 sm:grid-cols-4 gap-y-4 sm:gap-4 pb-4'>
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

                      <div
                        className={cn([
                          'w-full duration-700',
                          'col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4',
                        ])}
                      >
                        <div className='col-span-4 sm:col-span-2'>
                          <Field
                            label={t('profile:Headline')}
                            error={
                              touched.headline &&
                              errors.headline && (
                                <FieldError breakW='words' message={errors.headline} />
                              )
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
                            label={t('event:location')}
                            error={
                              touched.location &&
                              errors.location && (
                                <FieldError breakW='words' message={errors.location} />
                              )
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

                        <div className='col-span-4 sm:col-span-2'>
                          <Field
                            label={t('event:organization_website')}
                            error={
                              touched.website &&
                              errors.website && (
                                <FieldError breakW='words' message={errors.website} />
                              )
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
                              value={values?.socials?.twitter}
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
                              value={values?.socials?.facebook}
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
                              value={values?.socials?.instagram}
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
                              value={values?.socials?.linkedin}
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
                              value={values?.socials?.youtube}
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
                              value={values?.media?.link}
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
                              value={values?.media?.type}
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
                      </div>

                      <div className='col-span-4 sm:col-span-2'>
                        <FieldTags value={hashTags} onChange={e => submitUserHashag(e)} />
                      </div>
                      <div className={'flex flex-col w-full col-span-4 sm:col-span-2'}>
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
                                if (hasResellerExtension) {
                                  handleChange(e);
                                } else {
                                  showModal(MODAL_TYPES.MISSING_EXTENSION, {
                                    title: t('page:Reseller_Extension'),
                                    description: t('common:reseller_extension_missing'),
                                    buttonText: t('common:get_reseller_extension'),
                                    extensionPageUrl: '/user/extensions/reseller',
                                  });
                                }
                              }}
                            />
                            {t('common:orgs_show_signup')}
                          </label>
                        </div>
                      </div>

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
                              handleChange={handleFileEDIT}
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
                                handleBlur({
                                  target: {name: 'description', value: values.description},
                                });
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
        </div>
      )}
    </PostLoginLayout>
  );
}
OrganizationInformation.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const session = await getSession(context);

    const {data: userDataResponse} = await graphqlRequestHandler(
      userQueries.getUserById,
      {
        token: session?.accessToken,
      },
      session?.accessToken
    );

    const userData = userDataResponse?.data?.getUserById?.userData;
    const hasResellerExtension = userData?.accountDetails?.activeExtensions?.includes(
      stripeProductIDs.EXTENSIONS.RESELLER
    );

    return {
      props: {
        hasResellerExtension,
      },
    };
  } catch {
    return {notFound: true};
  }
};
