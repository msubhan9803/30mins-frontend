import {PlusIcon} from '@heroicons/react/20/solid';
import {EDUCATION_HISTORY_STATE, EDUCATION_HISTORY_YUP} from 'constants/yup/education';
import {Form, Formik} from 'formik';
import {toast} from 'react-hot-toast';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import mutations from 'constants/GraphQL/EducationHistory/mutations';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import DropDownComponent from 'components/shared/DropDownComponent';
import Button from '@root/components/button';
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import Modal from '../Modal';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const EducationModal = () => {
  const {data: session} = useSession();

  const {store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {eventID, initdata} = modalProps || {};
  const isAdd = !eventID;

  const [createMutation] = useMutation(mutations.createEducationHistory);
  const [editMutation] = useMutation(mutations.editEducationHistory);

  const {t} = useTranslation();

  const SelectGraduatedOptions = [
    {key: t('common:No'), value: 'false'},
    {key: t('common:Yes'), value: 'true'},
  ];

  const SelectCurrentOptions = [
    {key: t('common:No'), value: 'false'},
    {key: t('common:Yes'), value: 'true'},
  ];

  const router = useRouter();
  const AddEducation = async (values, setSubmitting) => {
    await createMutation({
      variables: {
        educationHistoryData: {
          school: values.school,
          degree: values.degree,
          startDate: values.startDate,
          endDate: values.current === 'false' || values.current === false ? values.endDate : null,
          current:
            values.graduated === 'false' || values.graduated === false
              ? Boolean(values.current)
              : false,
          graduated:
            values.current === 'false' || values.current === false
              ? Boolean(values.graduated)
              : false,
          extracurricular: values.extracurricular,
          fieldOfStudy: values.fieldOfStudy,
        },
        token: session?.accessToken,
      },
    });
    toast.success(t('common:education_added'));
    router.reload();
    setSubmitting(false);
  };

  const EditEducation = async (id, values, setSubmitting) => {
    await editMutation({
      variables: {
        educationHistoryData: {
          school: values.school,
          degree: values.degree,
          startDate: values.startDate,
          endDate: values.current === 'false' || values.current === false ? values.endDate : null,
          current:
            values.graduated === 'false' || values.graduated === false
              ? values.current.toString() === 'true'
                ? true
                : false
              : false,
          graduated:
            values.current === 'false' || values.current === false
              ? values.graduated.toString() === 'true'
                ? true
                : false
              : false,
          extracurricular: values.extracurricular,
          fieldOfStudy: values.fieldOfStudy,
        },
        token: session?.accessToken,
        documentId: id,
      },
    });
    toast.success(t('common:education_edited'));
    router.reload();
    setSubmitting(false);
  };

  const submitHandler = async (values, setSubmitting) => {
    if (isAdd) {
      AddEducation(values, setSubmitting);
    } else {
      EditEducation(eventID, values, setSubmitting);
    }
  };

  return (
    <Modal
      title={
        isAdd
          ? t('profile:add_education_history_title')
          : `${`${t('profile:edit_education_history_title')} ${initdata.school}`}`
      }
      icon={<PlusIcon className='h-6 w-6 text-blue-600' aria-hidden='true' />}
    >
      <Formik
        initialValues={isAdd ? EDUCATION_HISTORY_STATE : initdata}
        validationSchema={EDUCATION_HISTORY_YUP}
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
                      <div className='grid grid-cols-6 gap-6 p-1'>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('profile:education_history_school')}
                            error={
                              touched.school &&
                              errors.school && <FieldError message={errors.school} />
                            }
                            required
                          >
                            <input
                              value={values.school}
                              onChange={handleChange}
                              maxLength={300}
                              onBlur={handleBlur}
                              type='text'
                              name='school'
                              id='school'
                              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                            />
                          </Field>
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('profile:education_history_field_of_study')}
                            error={
                              touched.fieldOfStudy &&
                              errors.fieldOfStudy && <FieldError message={errors.fieldOfStudy} />
                            }
                            required
                          >
                            <input
                              value={values.fieldOfStudy}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              maxLength={160}
                              type='text'
                              name='fieldOfStudy'
                              id='fieldOfStudy'
                              className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            />
                          </Field>
                        </div>

                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('profile:education_history_degree')}
                            error={
                              touched.degree &&
                              errors.degree && <FieldError message={errors.degree} />
                            }
                            required
                          >
                            <input
                              value={values.degree}
                              maxLength={160}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type='text'
                              name='degree'
                              id='degree'
                              className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            />
                          </Field>
                        </div>
                        {values?.current === false || values?.current?.toString() === 'false' ? (
                          <div className='col-span-6 sm:col-span-3'>
                            <Field
                              label={t('profile:education_history_graduated')}
                              error={
                                touched.graduated &&
                                errors.graduated && <FieldError message={errors.graduated} />
                              }
                            >
                              <DropDownComponent
                                name='graduated'
                                className='mt-1'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.graduated}
                                options={SelectGraduatedOptions}
                              />
                            </Field>
                          </div>
                        ) : null}

                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('profile:education_history_start_date')}
                            error={
                              touched.startDate &&
                              errors.startDate && (
                                <FieldError message={t('profile:enter_valid_date')} />
                              )
                            }
                            required
                          >
                            <input
                              value={values.startDate}
                              onChange={handleChange}
                              max={values.endDate}
                              onBlur={handleBlur}
                              type='date'
                              name='startDate'
                              id='startDate'
                              className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            />
                          </Field>
                        </div>

                        {values?.graduated === false ||
                        values?.graduated?.toString() === 'false' ? (
                          <div className='col-span-6 sm:col-span-3'>
                            <Field
                              label={t('profile:education_history_current')}
                              error={
                                touched.current &&
                                errors.current && <FieldError message={errors.current} />
                              }
                            >
                              <DropDownComponent
                                name='current'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className='mt-1'
                                value={values.current}
                                options={SelectCurrentOptions}
                              />
                            </Field>
                          </div>
                        ) : null}

                        {values?.current === false || values?.current?.toString() === 'false' ? (
                          <div className='col-span-6 sm:col-span-3'>
                            <Field
                              label={t('profile:education_history_end_date')}
                              error={
                                touched.endDate &&
                                errors.endDate && (
                                  <FieldError message={t('profile:enter_valid_date')} />
                                )
                              }
                              required
                            >
                              <input
                                required
                                value={values.endDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type='date'
                                name='endDate'
                                id='endDate'
                                className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                              />
                            </Field>
                          </div>
                        ) : null}

                        <div className='col-span-6'>
                          <Field
                            label={t('common:txt_add_note')}
                            className='w-full flex flex-col'
                            error={
                              touched.extracurricular && errors.extracurricular ? (
                                <FieldError message={errors.extracurricular} />
                              ) : (
                                `${
                                  values.extracurricular.length > 0
                                    ? values.extracurricular.length - 7
                                    : 0
                                } / 750`
                              )
                            }
                          >
                            <div className='w-full'>
                              <CKEditor
                                onBlur={() => {
                                  handleBlur({target: {name: 'extracurricular'}});
                                }}
                                setDescLength={undefined}
                                name={'extracurricular'}
                                value={values.extracurricular}
                                onChange={el => setFieldValue('extracurricular', el)}
                              />
                            </div>
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
export default EducationModal;
