import {SUMMARY_TABS, TABS} from 'constants/context/tabs';
import {Formik, Form, Field as Fieldd, getIn} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {useContext, useEffect, useState} from 'react';
import Recurring from 'components/PostLogin/ServicePage/Tabs/Recurring';
import Security from 'components/PostLogin/ServicePage/Tabs/Security';
import slug from 'slug';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import RoundRobinQuery from 'constants/GraphQL/RoundRobin/queries';
import RoundRobinMutation from 'constants/GraphQL/RoundRobin/mutations';
import {useSession} from 'next-auth/react';
import {NotificationContext} from 'store/Notification/Notification.context';
import {getCustomHours} from 'components/PostLogin/CustomTIme/utils';
import {ROUND_ROBIN_SERVICE_STATE, ROUND_ROBIN_SERVICE_YUP} from 'constants/yup/roundRobinService';
import Button from '@root/components/button';
import Input from '@root/components/forms/input';
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import DropDownComponent from 'components/shared/DropDownComponent';
import Tabs from './Tabs';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

export default function AddRoundRobinService({
  values: ParentValue,
  setFieldValue: setFieldValueParent,
  organization,
  selectOrganizations,
  handleChangeOrganization,
}) {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const router = useRouter();

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const [tab, setTab] = useState(TABS.recurring);

  const baseOption = [
    {
      key: 'On Phone',
      value: 'onPhone',
    },
    {
      key: 'In Person',
      value: 'inPerson',
    },
    {
      key: 'Google Meet',
      value: 'googleMeet',
    },
  ];

  const [TeamsList, setTeamsList] = useState<any>(undefined);
  const GetTeams = async () => {
    const {data} = await graphqlRequestHandler(
      RoundRobinQuery.GetRoundRobinTeamsByOrganizationId,
      {
        organizationId: organization?._id,
      },
      session?.accessToken
    );
    setTeamsList(
      data?.data?.getRoundRobinTeamsByOrganizationId?.roundRobinTeams?.map(item => ({
        _id: item._id,
        name: item.name,
      }))
    );
  };

  useEffect(() => {
    GetTeams();
  }, [organization]);

  const SelectMediaType = [
    {key: t('None'), value: 'None'},
    {key: t('common:txt_media_type_google'), value: 'Google Slides'},
    {key: t('common:txt_media_type_youtube'), value: 'Youtube Embed'},
  ];

  const MediaTypeSelect = SelectMediaType.map(option => (
    <option key={option.value}>{option.value}</option>
  ));

  const SelectTeamsList = TeamsList?.map((item, index) => (
    <option key={index} value={item._id}>
      {item.name}
    </option>
  ));

  const [descLength, setDescLength] = useState(
    ParentValue.initdata?.description
      ? ParentValue.initdata.description.replace(/&nbsp;/gm, ' ').length
      : 0
  );

  const GetAvailability = serviceWorkingHours => {
    if (serviceWorkingHours.isCustomEnabled) {
      let initValue = serviceWorkingHours;
      delete initValue.isCustomEnabled;
      const val = Object.entries(initValue).map(([day, value]) => {
        const dayData: any = {};
        if (Object(value)?.availability?.length === 0) {
          dayData[day] = Object(value);
          delete dayData.availability;
          return dayData;
        }
        if (Object(value)?.availability?.length > 0) {
          /* eslint-disable-line */
          dayData[day] = {
            isActive: Object(value)?.isActive,
            availability: Object(value)?.availability?.map(item => ({
              start: typeof item?.start !== 'number' ? getCustomHours(item?.start) : item?.start,
              end: typeof item?.end !== 'number' ? getCustomHours(item?.end) : item?.end,
            })),
          };
          return dayData;
        }
        dayData[day] = Object(value);
        return dayData;
      });
      initValue = {};
      val.forEach(v => (initValue = {...initValue, ...v})); /* eslint-disable-line */
      return {
        ...serviceWorkingHours,
        isCustomEnabled: true,
        ...initValue,
      };
    }
    return serviceWorkingHours;
  };

  const AddService = async (values, {setSubmitting, setFieldError}) => {
    setSubmitting(true);
    const varaibles = {
      roundRobinServiceData: {
        ...values,
        isOrgService: true,
        price: values?.price ? parseInt(values?.price, 10) : 0,
        percentDonated: values?.percentDonated ? parseInt(values?.percentDonated, 10) : 0,
        roundRobinTeam:
          values?.roundRobinTeam && values?.roundRobinTeam?._id !== ''
            ? values?.roundRobinTeam?._id
            : null,
        serviceWorkingHours: GetAvailability(values.serviceWorkingHours),
      },
    };
    const {data} = await graphqlRequestHandler(
      RoundRobinMutation.CreateOrgRoundRobinService,
      varaibles,
      session?.accessToken
    );
    if (data.data.createOrgRoundRobinService.status === 409) {
      setSubmitting(false);
      setFieldError('slug', data.data.createOrgRoundRobinService.message);
      return;
    }
    if (data.data.createOrgRoundRobinService.status !== 200) {
      setSubmitting(false);
      showNotification(
        NOTIFICATION_TYPES.error,
        `Error: ${data.data.createOrgRoundRobinService.message}`,
        false
      );
      return;
    }
    showNotification(
      NOTIFICATION_TYPES.success,
      data.data.createOrgRoundRobinService.message,
      false
    );
    router.push('/user/round-robin/all-services');
    setSubmitting(false);
  };
  const EditService = async (values, {setSubmitting, setFieldError}) => {
    try {
      const val = values;
      delete val.userId;
      delete val._id;
      delete val.serviceType;

      const varaibles = {
        documentId: ParentValue.initdata._id,
        roundRobinServiceData: {
          ...val,
          organizationId: val.organizationId._id,
          price: values?.price ? parseInt(values?.price, 10) : 0,
          percentDonated: values?.percentDonated ? parseInt(values?.percentDonated, 10) : 0,
          roundRobinTeam:
            values?.roundRobinTeam && values?.roundRobinTeam?._id !== ''
              ? values?.roundRobinTeam?._id
              : null,
          serviceWorkingHours: GetAvailability(values.serviceWorkingHours),
        },
      };

      const {data} = await graphqlRequestHandler(
        RoundRobinMutation.EditOrgRoundRobinService,
        {...varaibles},
        session?.accessToken
      );
      if (data.data.editOrgRoundRobinService.status === 409) {
        setSubmitting(false);
        setFieldError('slug', data.data.createOrgRoundRobinService.message);
        return;
      }
      if (data.data.editOrgRoundRobinService.status !== 200) {
        setSubmitting(false);
        showNotification(
          NOTIFICATION_TYPES.error,
          `Error: ${data.data.editOrgRoundRobinService.message}`,
          false
        );
        return;
      }
      if (data.data.editOrgRoundRobinService.status === 200) {
        showNotification(
          NOTIFICATION_TYPES.success,
          data.data.editOrgRoundRobinService.message,
          false
        );
        setSubmitting(false);
        router.push('/user/round-robin/all-services');
        setFieldValueParent('initdata', undefined);
      }
    } catch (err) {
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitMethod = (values, {setSubmitting, setFieldError}) => {
    !ParentValue.initdata
      ? AddService(values, {setSubmitting, setFieldError})
      : EditService(values, {setSubmitting, setFieldError});
  };

  const init: any = {
    ...(!ParentValue.initdata
      ? {
          ...ROUND_ROBIN_SERVICE_STATE,
          organizationId: organization?._id,
          organizationName: organization?.title,
          orgServiceCategory: '',
        }
      : {
          ...ParentValue.initdata,
        }),
  };

  return (
    <Formik
      initialValues={init}
      validationSchema={ROUND_ROBIN_SERVICE_YUP}
      onSubmit={(values, {setSubmitting, setFieldError}) => {
        handleSubmitMethod(values, {setSubmitting, setFieldError});
      }}
      enableReinitialize={true}
      validateOnChange={false}
    >
      {({
        isSubmitting,
        handleChange,
        setFieldValue,
        handleSubmit,
        handleBlur,
        setFieldError,
        values,
        touched,
        errors,
      }) => {
        const tabsContent = {
          recurring: (
            <Recurring values={values} handleChange={handleChange} setFieldValue={setFieldValue} />
          ),
          Security: <Security values={values} setFieldValue={setFieldValue} />,
          // WhiteList: <WhiteBlacklist type='white' values={values} setFieldValue={setFieldValue} />,
          // BlackList: <WhiteBlacklist type='black' values={values} setFieldValue={setFieldValue} />,
        };

        const customHandleChange = async e => {
          const {name, value} = e.target;
          if (name === 'title') {
            setFieldValue('title', value);
            setFieldValue('slug', slug(value));
          } else {
            setFieldValue(name, value);
          }
        };

        return (
          <Form action='#' className='mx-2 duration h-full overflow-y-auto'>
            <>
              <div className='flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between mb-0 md:mb-4 p-2'>
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
                <span className='flex'>
                  <Button
                    type='button'
                    disabled={isSubmitting}
                    onClick={() => handleSubmit(values)}
                    variant='solid'
                    className='ml-2'
                  >
                    {isSubmitting ? t('common:btn_saving') : t('common:btn_save')}
                  </Button>
                </span>
              </div>

              <div className='mt-10 sm:mt-0'>
                <div className='md:grid md:grid-cols-1'>
                  <div className='mt-5 md:mt-0 md:col-span-2'>
                    <div className='overflow-hidden sm:rounded-md'>
                      <div className='grid grid-cols-6 gap-5 p-2'>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            required
                            label={t('event:Title')}
                            error={
                              touched.title &&
                              errors.title && <FieldError breakW='words' message={errors.title} />
                            }
                          >
                            <Input
                              value={values.title}
                              handleChange={customHandleChange}
                              maxLength={160}
                              onBlur={handleBlur}
                              type='text'
                              name='title'
                              id='title'
                            />
                          </Field>
                        </div>

                        <div className='col-span-6 sm:col-span-2'>
                          <Field
                            required
                            label={t('common:txt_Assigned_team')}
                            error={
                              getIn(touched, 'roundRobinTeam._id') &&
                              getIn(errors, 'roundRobinTeam._id') && (
                                <FieldError
                                  breakW='words'
                                  message={getIn(errors, 'roundRobinTeam._id')}
                                />
                              )
                            }
                          >
                            <select
                              value={values.roundRobinTeam?._id}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              id='roundRobinTeam._id'
                              name='roundRobinTeam._id'
                              className='h-[50px] block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                            >
                              <option key={'Select'} value={''}>
                                {t('Select')}
                              </option>
                              {SelectTeamsList}
                            </select>
                          </Field>
                        </div>

                        <div className='col-span-6 sm:col-span-1'>
                          <Field
                            label={t('event:Duration')}
                            required
                            error={
                              touched.duration &&
                              errors.duration && (
                                <FieldError breakW='words' message={errors.duration} />
                              )
                            }
                          >
                            <Input
                              handleChange={el => {
                                Number(el.target.value) > 300 || Number(el.target.value) < 1
                                  ? el.preventDefault()
                                  : setFieldValue('duration', parseInt(el.target.value, 10));
                              }}
                              onKeyDown={e =>
                                ['e', 'E', '+', '-', '.', ','].includes(e.key) && e.preventDefault()
                              }
                              value={values?.duration.toString()}
                              // handleChange={handleChange}
                              onBlur={handleBlur}
                              type='number'
                              name='duration'
                              placeholder='15'
                              min={'5'}
                              id='duration'
                            />
                          </Field>
                        </div>

                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            required
                            label={t('common:Url')}
                            error={
                              touched.slug &&
                              errors.slug && <FieldError breakW='words' message={errors.slug} />
                            }
                          >
                            <div className='flex rounded-md shadow-sm w-full'>
                              <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
                                https://30mins.com/org/{organization?.slug}/
                              </span>
                              <input
                                type='text'
                                value={values.slug}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name='slug'
                                id='slug'
                                className='flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-mainBlue  focus:border-mainBlue sm:text-sm border-gray-300'
                              />
                            </div>
                          </Field>
                        </div>

                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('event:typeof_meeting')}
                            required
                            error={
                              touched.conferenceType &&
                              errors.conferenceType && (
                                <FieldError breakW='words' message={errors.conferenceType} />
                              )
                            }
                          >
                            <div className='flex flex-row border w-full rounded-md gap-4 items-start p-2 justify-center'>
                              {baseOption.map((option, index) => (
                                <div className='flex gap-2 items-center' key={index}>
                                  <Fieldd
                                    type='checkbox'
                                    className='rounded-sm checked:ring-2 checked:text-mainBlue checked:ring-mainBlue'
                                    name='conferenceType'
                                    id={option.value}
                                    value={option.value}
                                  />
                                  <label
                                    htmlFor={option.value}
                                    className='block text-sm font-medium text-gray-700 '
                                  >
                                    {t(`event:${option.value}`)}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Field>
                        </div>

                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('common:txt_media_type_label')}
                            error={
                              getIn(touched, 'media.type') &&
                              getIn(errors, 'media.type') && (
                                <FieldError breakW='words' message={getIn(errors, 'media.type')} />
                              )
                            }
                          >
                            <select
                              value={values.media?.type}
                              onChange={({target: {value}}) => {
                                setFieldValue('media.type', value);
                                setFieldError('media.link', undefined);
                                setFieldValue('media.link', '');
                              }}
                              onBlur={handleBlur}
                              id='media.type'
                              name='media.type'
                              className='h-[50px] block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                            >
                              {MediaTypeSelect}
                            </select>
                          </Field>
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('common:txt_media_link_label')}
                            error={
                              getIn(errors, 'media.link') && (
                                <FieldError breakW='all' message={getIn(errors, 'media.link')} />
                              )
                            }
                          >
                            <Input
                              disabled={Boolean(
                                values.media?.type === 'None' ||
                                  values.media?.type === '' ||
                                  values.media?.type === undefined
                              )}
                              value={values.media?.link}
                              maxLength={160}
                              handleChange={({target: {value}}) => {
                                setFieldValue('media.link', value);
                              }}
                              onBlur={handleBlur}
                              className='disabled:bg-slate-100'
                              type='text'
                              name='media.link'
                              id='media.link'
                            />
                          </Field>
                        </div>

                        <div className='col-span-6 sm:col-span-6'>
                          <Field
                            label={t('common:Description')}
                            required
                            error={
                              errors.description ? (
                                <FieldError message={errors.description} />
                              ) : (
                                `${descLength > 0 ? descLength - 7 : 0} / 750`
                              )
                            }
                          >
                            <div className='w-full'>
                              <CKEditor
                                name={'description'}
                                value={values.description}
                                onBlur={() =>
                                  handleBlur({
                                    target: {value: values.description, name: 'description'},
                                  })
                                }
                                setDescLength={setDescLength}
                                onChange={data => {
                                  setFieldValue('description', data);
                                }}
                              />{' '}
                              {/* {!errors.description && `${descLength - 7} / 750`} */}
                            </div>
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-start'>
                    <Tabs
                      openedTab={tab}
                      tabsNames={SUMMARY_TABS[TABS.roundRobinService]}
                      onChange={(tabName: string) => setTab(tabName)}
                    />
                  </div>
                </div>
                <div className='w-4/6>'>{tabsContent[tab]}</div>
              </div>
            </>
          </Form>
        );
      }}
    </Formik>
  );
}
