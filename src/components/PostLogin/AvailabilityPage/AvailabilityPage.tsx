import {PlusSmallIcon} from '@heroicons/react/20/solid';
import useTranslation from 'next-translate/useTranslation';
import {useState} from 'react';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {Field as FieldFormik, Form, Formik} from 'formik';
import AvailabilityQueries from 'constants/GraphQL/CollectiveAvailability/queries';
import AvailabilityMutations from 'constants/GraphQL/CollectiveAvailability/mutations';
import {
  COLLECTIVE_AVAILABILITY_STATE,
  COLLECTIVE_AVAILABILITY_YUP,
} from 'constants/yup/ColectaveAvailablaty';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import dayjs from 'dayjs';
import classNames from 'classnames';
import {toast} from 'react-hot-toast';
import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';
import Button from '@root/components/button';
import ListGroups from './ListGroups';
import ListEmails from './ListEmails';
import Calendar from './AvailabilityCalendar';

const Availability = ({session, integrations, isExtensionActivate}) => {
  const {showModal, hideModal} = ModalContextProvider();

  const {t} = useTranslation();
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);

  const [Ref, setRef] = useState<any>(null);
  const handleClear = setFieldValue => {
    setFieldValue('idSelectedGroup', '');
    setFieldValue('availableTimeSlots', []);
    setFieldValue('emails', []);
    setFieldValue('email', '');
  };
  const GetAllGroups = async setFieldValue => {
    const {data} = await graphqlRequestHandler(
      AvailabilityQueries.getAllGroups,
      {},
      session?.accessToken
    );
    const getAllGroups = data?.data?.getAllGroups;
    setFieldValue('groups', getAllGroups?.groupData);
  };

  const CheckUserEmailAndCalendar = async (values, setFieldValue) => {
    setIsCheckingEmail(true);
    const {data} = await graphqlRequestHandler(
      AvailabilityQueries.CheckUserEmailAndCalendar,
      {
        email: values.email,
      },
      session?.accessToken
    );
    if (
      !data?.data?.checkUserEmailAndCalendar?.hasCalendar ||
      !data?.data?.checkUserEmailAndCalendar?.userExists
    ) {
      toast.dismiss();
      toast.error(data?.data?.checkUserEmailAndCalendar?.response?.message);
      setIsCheckingEmail(false);
      return false;
    }
    values.emails?.push({
      email: values.email,
      _id: data?.data?.checkUserEmailAndCalendar?.guestID,
    });
    setFieldValue('emails', values.emails);
    setFieldValue('email', '');
    setIsCheckingEmail(false);
    return true;
  };

  const handleDeleteGroup = async (values, setFieldValue) => {
    const {data: deleteGroup} = await graphqlRequestHandler(
      AvailabilityMutations.DeleteGroup,
      {
        documentId: values.idSelectedGroup,
      },
      session?.accessToken
    );
    if (deleteGroup?.data?.deleteGroup?.status === 200) {
      toast.dismiss();
      toast.success(deleteGroup?.data?.deleteGroup?.message);
      handleClear(setFieldValue);
      await GetAllGroups(setFieldValue);
      hideModal();
    }
  };

  const showDeleteGroup = async (values, setFieldValue) => {
    showModal(MODAL_TYPES.CONFIRM, {
      handleConfirm: async () => handleDeleteGroup(values, setFieldValue),
      title: 'Delete group',
      message: `Are you sure you want to delete group ${
        values.groups.filter(item => item._id === values.idSelectedGroup)[0].name
      }?`,
    });
  };

  const CheckAvailabilityTimeSlots = async (duration, values, setFieldValue) => {
    try {
      const {data} = await graphqlRequestHandler(
        AvailabilityQueries.getCollectiveAvailability,
        {
          emails: values.emails.map(item => item.email),
          date: dayjs(values.selectedDate).format('YYYY-MM-DD'),
          duration: Number(duration),
          checkExtension: true,
        },
        session?.accessToken
      );

      if (data.data.getCollectiveAvailability.response.status === 200) {
        setFieldValue(
          'availableTimeSlots',
          Object.values(data?.data?.getCollectiveAvailability?.availableTimeSlots)
        );
        toast.dismiss();
        toast.success(data?.data.getCollectiveAvailability.response.message);
      } else {
        toast.dismiss();
        toast.error(data?.data.getCollectiveAvailability.response.message);
      }
      window.scrollTo(0, Ref.offsetTop);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditGroup = async (values, setFieldValue) => {
    const {data} = await graphqlRequestHandler(
      AvailabilityMutations.EditGroup,
      {
        groupData: {
          guestIDs: Object.values(values.emails.map(item => item._id)),
          name: values.groups?.filter(group => group._id === values.idSelectedGroup)[0].name,
        },
        documentId: values.idSelectedGroup,
      },
      session?.accessToken
    );
    const editGroup = data?.data?.editGroup;
    if (editGroup?.status === 200) {
      toast.dismiss();
      toast.success(editGroup?.message);
      handleClear(setFieldValue);
      await GetAllGroups(setFieldValue);
      hideModal();
    }
  };

  const showDuration = (values, setFieldValue) => {
    showModal(MODAL_TYPES.CHECK_AVAILABILITY, {
      handleConfirm: CheckAvailabilityTimeSlots,
      values: values,
      setFieldValue: setFieldValue,
    });
  };

  const showUpdateGroup = (values, setFieldValue) => {
    showModal(MODAL_TYPES.CONFIRM, {
      handleConfirm: () => handleEditGroup(values, setFieldValue),
      title: 'Update group',
      message: t('common:txt_save_changes'),
      values,
      setFieldValue,
    });
  };

  const CheckEmailThenAddToList = async (el, values, setFieldValue, setFieldError) => {
    setFieldError('email', undefined);
    if (values.emails.length > 9) {
      toast.dismiss();
      toast.error(t('common:txt_max_10_people_per_group'));
    } else if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(values.email)
    ) {
      if (values.emails.filter(item => item.email === values.email).length === 0) {
        await CheckUserEmailAndCalendar(values, setFieldValue);
      } else {
        setFieldError('email', t('common:this_email_already_added'));
        el.preventDefault();
      }
    }
  };

  const handleKeyEnterDown = async (e, values, setFieldValue, setFieldError) => {
    setFieldError('email', undefined);
    try {
      if (e.which === 13 && values.email !== '') {
        if (values.emails.length > 9) {
          toast.dismiss();
          toast.error(t('common:max_10_emails'));
        } else {
          // eslint-disable-next-line
          if (
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
              values.email
            )
          ) {
            if (values.emails.filter(item => item.email === values.email).length === 0) {
              await CheckUserEmailAndCalendar(values, setFieldValue);
              e.preventDefault();
            } else {
              setFieldError('email', t('common:this_email_already_added'));
              e.preventDefault();
            }
          }
        }
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  const handleCreateGroup = async (values, setFieldValue) => {
    setIsAddingGroup(true);
    const {data} = await graphqlRequestHandler(
      AvailabilityMutations.CreateGroup,
      {
        groupData: {
          guestIDs: Object.values(values?.emails?.map(item => item._id)),
        },
      },
      session?.accessToken
    );
    const createGroup = data?.data?.createGroup;
    if (createGroup?.status === 200) {
      toast.dismiss();
      toast.success(createGroup?.message);
      handleClear(setFieldValue);
      await GetAllGroups(setFieldValue);
    } else {
      toast.dismiss();
      toast.error(createGroup?.message);
    }
    setIsAddingGroup(false);
  };

  return (
    <>
      <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4'>
        {isExtensionActivate ? (
          <div className='flex flex-1'>
            <Formik
              initialValues={
                integrations.data.getAllGroups
                  ? {
                      ...COLLECTIVE_AVAILABILITY_STATE,
                      ...{groups: integrations.data.getAllGroups.groupData},
                    }
                  : COLLECTIVE_AVAILABILITY_STATE
              }
              validationSchema={COLLECTIVE_AVAILABILITY_YUP}
              onSubmit={() => {}}
              validateOnChange={false}
            >
              {({values, handleBlur, setFieldValue, validateField, setFieldError, errors}) => (
                <>
                  <Form className='flex flex-1 flex-col sm:flex-row'>
                    <div
                      onSubmit={() => {}}
                      className='flex flex-col sm:w-6/6 md:w-2/6 px-1 w-full'
                    >
                      <span className='font-bold'>
                        {values?.idSelectedGroup !== ''
                          ? `${
                              values.groups.filter(item => item._id === values.idSelectedGroup)[0]
                                ?.name.length < 30
                                ? values.groups.filter(
                                    item => item._id === values.idSelectedGroup
                                  )[0]?.name
                                : `${values.groups
                                    .filter(item => item._id === values.idSelectedGroup)[0]
                                    ?.name.substring(0, 20)
                                    .trim()}...`
                            }`
                          : t('common:txt_add_group_participant')}
                      </span>
                      <div className='mt-2 grid col-span-6 row-span-1 grid-flow-col gap-2 px-1'>
                        <Field
                          label=''
                          error={
                            errors.email && (
                              <FieldError position='center' breakW='words' message={errors.email} />
                            )
                          }
                        >
                          <div className='gap-2 flex flex-row w-full'>
                            <FieldFormik
                              type={'email'}
                              onKeyDown={e =>
                                handleKeyEnterDown(e, values, setFieldValue, setFieldError)
                              }
                              onBlur={handleBlur}
                              value={values.email}
                              placeholder={t('common:txt_enter_an_email')}
                              name='email'
                              id='email'
                              disabled={isCheckingEmail}
                              className='col-span-4 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            />
                            <Button
                              variant='solid'
                              onClick={el => {
                                validateField('email');
                                CheckEmailThenAddToList(el, values, setFieldValue, setFieldError);
                              }}
                              disabled={isCheckingEmail}
                            >
                              <div className='m-auto flex flex-row'>
                                <span>{t('common:Add')}</span>
                              </div>
                            </Button>

                            <Button
                              variant='solid'
                              onClick={() => {
                                setFieldError('email', undefined);
                                handleClear(setFieldValue);
                              }}
                              disabled={isCheckingEmail}
                            >
                              <div className='m-auto flex flex-row'>
                                <span className='m-auto'>{t('common:Clear')}</span>
                              </div>
                            </Button>
                          </div>
                        </Field>
                      </div>
                      <ListEmails emails={values.emails} setFieldValue={setFieldValue} />
                      <div
                        className={classNames([
                          'grid grid-cols-2 grid-rows-2 gap-1 p-2',
                          'col-span-1> row-span-1>',
                        ])}
                      >
                        <Button
                          variant='solid'
                          disabled={
                            !(values?.emails?.length > 0 && values?.idSelectedGroup === '') ||
                            isAddingGroup
                          }
                          onClick={() => handleCreateGroup(values, setFieldValue)}
                        >
                          {t('common:btn_add_group')}
                        </Button>

                        <Button
                          variant='solid'
                          disabled={
                            !(values?.emails?.length >= 0 && values?.idSelectedGroup !== '')
                          }
                          onClick={() => showUpdateGroup(values, setFieldValue)}
                        >
                          {t('common:btn_update_group')}
                        </Button>

                        <Button
                          variant='solid'
                          disabled={
                            !(values?.emails?.length >= 0 && values?.idSelectedGroup !== '')
                          }
                          onClick={() => showDeleteGroup(values, setFieldValue)}
                        >
                          {t('common:btn_delete_group')}
                        </Button>

                        <Button
                          variant='solid'
                          disabled={!(values?.emails?.length > 0 && values?.idSelectedGroup !== '')}
                          onClick={() => showDuration(values, setFieldValue)}
                        >
                          {t('common:txt_check_availability')}
                        </Button>
                      </div>
                      <span className='mt-3 font-bold'>{t('common:txt_Current_groups')}</span>
                      <ListGroups
                        session={session}
                        t={t}
                        setFieldValue={setFieldValue}
                        values={values}
                        handleClear={handleClear}
                      />
                    </div>
                    <div className='block w-full pl-4 mt-2 sm:pl-2 md:w-4/6 sm:mt-0'>
                      <Calendar setRef={setRef} setFieldValue={setFieldValue} values={values} />
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
            <PlusSmallIcon width={44} height={44} className='text-gray-600' />
            <span className='mt-2 block text-sm font-medium text-gray-900'>
              {t('event:txt_requires_Activ_extention_availability')}
            </span>
          </div>
        )}
      </div>
    </>
  );
};
export default Availability;
