import {useEffect, useState} from 'react';
import {PlusIcon} from '@heroicons/react/20/solid';
import {JOB_HISTORY_STATE, JOB_HISTORY_YUP} from 'constants/yup/jobHistory';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import mutations from 'constants/GraphQL/JobHistory/mutations';
import {toast} from 'react-hot-toast';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/JobHistory/queries';
import Loader from 'components/shared/Loader/Loader';
import dynamic from 'next/dynamic';
import Button from '@root/components/button';
import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';
import Modal from '../Modal';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const JobHistoryModal = () => {
  const {store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {eventID} = modalProps || {};

  const {data: session} = useSession();
  const {t} = useTranslation();
  const isAdd = !eventID;
  const [JobHistoryData, setJobHistoryData] = useState<Object>([]);
  const [loading, setLoading] = useState(false);
  const [createMutation] = useMutation(mutations.createJobHistory);
  const [editMutation] = useMutation(mutations.editJobHistory);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const getServiceData = async () => {
      const {data} = await graphqlRequestHandler(
        queries.getJobHistoryById,
        {documentId: eventID, token: session?.accessToken},
        session?.accessToken
      );
      setJobHistoryData({
        ...data,
        data: {
          ...data.data.getJobHistoryById,
          getJobHistoryById: {
            ...data.data.getJobHistoryById,
            jobHistoryData: {
              ...data.data.getJobHistoryById.jobHistoryData,
              endDate: data.data.getJobHistoryById.jobHistoryData.endDate
                ? data.data.getJobHistoryById.jobHistoryData.endDate
                : '',
            },
          },
        },
      });
    };

    if (eventID !== undefined) {
      getServiceData();
    }
    setLoading(false);
  }, [eventID]);

  const jobData =
    JobHistoryData &&
    Object.values(JobHistoryData).map(job => job?.getJobHistoryById?.jobHistoryData);

  const jobHistoryValues = jobData?.reduce(
    (acc, cur) => ({
      ...acc,
      ...cur,
    }),
    {}
  );
  const [descLength, setDescLength] = useState(
    jobHistoryValues?.roleDescription
      ? (jobHistoryValues.roleDescription || '')
          .replace(/<\/?[^>]+(>|$)/g, '')
          .replace(/&nbsp;/gi, ' ').length - 7
      : 0
  );

  const AddJobHistory = async (values, setSubmitting) => {
    await createMutation({
      variables: {
        jobHistoryData: {
          position: values.position,
          company: values.company,
          startDate: values.startDate,
          endDate: values.current.toString() === 'false' ? values.endDate : null,
          current: values.current.toString() === 'true' ? true : false,
          location: values.location,
          employmentType: values.employmentType,
          roleDescription: values.roleDescription,
        },
        token: session?.accessToken,
      },
    });
    toast.success(t('common:job_added_to_history'));
    router.reload();
    setSubmitting(false);
  };

  const EditJobHistory = async (id, values, setSubmitting) => {
    await editMutation({
      variables: {
        jobHistoryData: {
          position: values.position,
          company: values.company,
          startDate: values.startDate,
          endDate: values.current.toString() === 'false' ? values.endDate : null,
          current: values.current.toString() === 'true' ? true : false,
          location: values.location,
          employmentType: values.employmentType,
          roleDescription: values.roleDescription,
        },
        token: session?.accessToken,
        documentId: id,
      },
    });
    toast.success(t('common:job_edited_to_history'));
    router.reload();
    setSubmitting(false);
  };

  const submitHandler = async (values, setSubmitting) => {
    if (isAdd) {
      AddJobHistory(values, setSubmitting);
    } else {
      EditJobHistory(eventID, values, setSubmitting);
    }
  };

  const SelectTypeOptions = [
    {
      key: t('profile:add_job_history_employment_type_full_time'),
      value: 'Full-Time',
    },
    {
      key: t('profile:add_job_history_employment_type_part_time'),
      value: 'Part-Time',
    },
    {
      key: t('profile:add_job_history_employment_type_contract'),
      value: 'Contract',
    },
    {
      key: t('profile:add_job_history_employment_type_self_employed'),
      value: 'Self-Employed',
    },
    {
      key: t('profile:add_job_history_employment_type_freelance'),
      value: 'Freelance',
    },
    {
      key: t('profile:add_job_history_employment_type_internship'),
      value: 'Internship',
    },
    {
      key: t('profile:add_job_history_employment_type_seasonal'),
      value: 'Seasonal',
    },
    {key: t('profile:Other'), value: 'Other'},
  ];

  const JobTypes = SelectTypeOptions.map(currency => (
    <option key={currency.key}>{currency.value}</option>
  ));

  if (loading) {
    return <Loader />;
  }
  return (
    <Modal
      title={
        isAdd
          ? t('profile:add_job_history_title')
          : `${`${t('profile:edit_job_history_title')} ${jobHistoryValues.position}`}`
      }
      icon={<PlusIcon className='h-6 w-6 text-blue-600' aria-hidden='true' />}
    >
      <Formik
        initialValues={isAdd ? JOB_HISTORY_STATE : jobHistoryValues}
        validationSchema={JOB_HISTORY_YUP}
        onSubmit={(values, {setSubmitting}) => {
          submitHandler(values, setSubmitting);
        }}
        enableReinitialize={true}
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
                      <div className='grid grid-cols-6 gap-6 p-1'>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            // htmlFor='first-name'
                            label={t('profile:add_job_history_position')}
                            className='block text-sm font-medium text-gray-700'
                            error={
                              touched.position &&
                              errors.position && <FieldError message={errors.position} />
                            }
                            required
                          >
                            <input
                              value={values.position}
                              maxLength={160}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type='text'
                              name='position'
                              id='position'
                              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                            />
                          </Field>
                          {/* {touched.position && errors.position ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.position}
                            </div>
                          ) : null} */}
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            // htmlFor='mediaLink'
                            label={t('profile:add_job_history_company')}
                            className='block text-sm font-medium text-gray-700'
                            error={
                              touched.company &&
                              errors.company && <FieldError message={errors.company} />
                            }
                            required
                          >
                            <input
                              value={values.company}
                              maxLength={160}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type='text'
                              name='company'
                              id='company'
                              className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            />
                          </Field>

                          {/* {touched.company && errors.company ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.company}
                            </div>
                          ) : null} */}
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            // htmlFor='mediaLink'
                            label={t('profile:add_job_history_location')}
                            error={
                              touched.location &&
                              errors.location && <FieldError message={errors.location} />
                            }
                            required
                            className='block text-sm font-medium text-gray-700'
                          >
                            <input
                              value={values.location}
                              maxLength={160}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type='text'
                              name='location'
                              id='location'
                              className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            />
                          </Field>
                          {/* {touched.location && errors.location ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.location}
                            </div>
                          ) : null} */}
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            // htmlFor='type'
                            label={t('profile:add_job_history_employment_type')}
                            className='block text-sm font-medium text-gray-700'
                            error={
                              touched.employmentType &&
                              errors.employmentType && (
                                <FieldError message={errors.employmentType} />
                              )
                            }
                            required
                          >
                            <select
                              value={values.employmentType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              id='employmentType'
                              name='employmentType'
                              className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                            >
                              {JobTypes}
                            </select>
                          </Field>
                          {/* {touched.employmentType && errors.employmentType ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.employmentType}
                            </div>
                          ) : null} */}
                        </div>

                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            //  htmlFor='type'
                            label={t('profile:add_job_history_current')}
                            className='block text-sm font-medium text-gray-700'
                            error={
                              touched.current &&
                              errors.current && <FieldError message={errors.current} />
                            }
                            required
                          >
                            <select
                              value={values.current}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              id='current'
                              name='current'
                              className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                            >
                              <option value='true'> {t('common:Yes')}</option>
                              <option value='false'> {t('common:No')}</option>
                            </select>
                          </Field>
                          {/* {touched.current && errors.current ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.current}
                            </div>
                          ) : null} */}
                        </div>

                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            // htmlFor='type'
                            label={t('profile:add_job_history_start_date')}
                            className='block text-sm font-medium text-gray-700'
                            error={
                              touched.startDate &&
                              errors.startDate && <FieldError message={errors.startDate} />
                            }
                            required
                          >
                            <input
                              value={values.startDate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type='date'
                              name='startDate'
                              id='startDate'
                              className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            />
                          </Field>
                          {/* {touched.startDate && errors.startDate ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {t('profile:enter_valid_date')}
                            </div>
                          ) : null} */}
                        </div>

                        {values.current === 'false' || values.current === false ? (
                          <div className='col-span-6 sm:col-span-3'>
                            <Field
                              // htmlFor='type'
                              label={t('profile:education_history_end_date')}
                              className='block text-sm font-medium text-gray-700'
                              error={
                                touched.endDate &&
                                errors.endDate && <FieldError message={errors.endDate} />
                              }
                              required
                            >
                              <input
                                required={values.current === 'false'}
                                value={values.endDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type='date'
                                name='endDate'
                                id='endDate'
                                className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                              />
                            </Field>
                            {/* {touched.endDate && errors.endDate ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {t('profile:enter_valid_date')}
                              </div>
                            ) : null} */}
                          </div>
                        ) : null}

                        <div className=' col-span-6'>
                          {t('common:txt_add_note')}
                          <CKEditor
                            setDescLength={e => {
                              const descriptionLength = e - 7;
                              descriptionLength < 0 ? setDescLength(0) : setDescLength(e - 7);
                            }}
                            name={t('profile:add_job_history_role_description')}
                            value={values.roleDescription}
                            onChange={data => {
                              setFieldValue('roleDescription', data);
                            }}
                          />
                          {descLength}/750
                          {/* {touched.roleDescription && errors.roleDescription ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.roleDescription}
                            </div>
                          ) : null} */}
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
export default JobHistoryModal;
