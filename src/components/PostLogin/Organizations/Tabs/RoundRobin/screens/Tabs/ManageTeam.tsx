import {useContext, useEffect, useRef, useState} from 'react';
import {TABS} from 'constants/context/tabs';
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import {PlusIcon, XMarkIcon} from '@heroicons/react/20/solid';
import {useMutation, useQuery} from '@apollo/client';
import RoundRobinQuery from 'constants/GraphQL/RoundRobin/queries';
import RoundRobinMutation from 'constants/GraphQL/RoundRobin/mutations';
import {useSession} from 'next-auth/react';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';
import useTranslation from 'next-translate/useTranslation';
import sanitizeHtml from 'sanitize-html';
import Button from '@root/components/button';
import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';
import classNames from 'classnames';
// import integrationQueries from 'constants/GraphQL/Integrations/queries';

const ManageTeam = ({
  values: ParentValue,
  setFieldValue: ParentsetFieldValue,
  SwitchTab,
  organization,
}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const refInputName = useRef<any>();
  const refSpanName = useRef<any>();

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const isAdd = ParentValue.SelectedTeam === undefined;
  const handleCancelClick = () => {
    SwitchTab(TABS.CurrentTeamsAndServices);
    ParentsetFieldValue('SelectedTeam', undefined);
  };

  // const [getCredentialsByEmail] = useLazyQuery<any>(integrationQueries.getCredentialsByEmail);

  const [keywords, setkeywords] = useState('');

  const [CreateRoundRobinTeam] = useMutation(RoundRobinMutation.CreateRoundRobinTeam);
  const [EditRoundRobinTeam] = useMutation(RoundRobinMutation.EditRoundRobinTeam);

  const {
    data: SearchTeam,
    loading: searchLoading,
    // refetch: refetchSearch,
  } = useQuery(RoundRobinQuery.SearchTeamResults, {
    variables: {
      token: session?.accessToken,
      documentId: organization._id,
      searchParams: {
        keywords: keywords,
        pageNumber: 1,
        resultsPerPage: 10,
      },
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
  });

  useEffect(() => {}, [refSpanName, refInputName, searchLoading]);

  const handleCreatGroup = async values => {
    const {data} = await CreateRoundRobinTeam({
      variables: {
        roundRobinTeamData: {
          name: values.name,
          organizationId: organization._id,
          teamMembers: values.teamMembers.map((item, index) => ({
            priority: index,
            memberEmail: item.accountDetails.email,
          })),
        },
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });

    if (data.createRoundRobinTeam.status === 200) {
      showNotification(NOTIFICATION_TYPES.success, data.createRoundRobinTeam.message, false);
      SwitchTab(TABS.CurrentTeamsAndServices);
    } else {
      showNotification(NOTIFICATION_TYPES.error, data.createRoundRobinTeam.message, false);
    }
  };

  const handleEditGroup = async values => {
    const {data} = await EditRoundRobinTeam({
      variables: {
        documentId: values._id,
        roundRobinTeamData: {
          name: values.name,
          organizationId: organization._id,
          teamMembers: values.teamMembers.map((item, index) => ({
            priority: index,
            memberEmail: item.accountDetails.email,
          })),
        },
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });

    if (data.editRoundRobinTeam.status === 200) {
      showNotification(NOTIFICATION_TYPES.success, data.editRoundRobinTeam.message, false);
      SwitchTab(TABS.CurrentTeamsAndServices);
      ParentsetFieldValue('SelectedTeam', undefined);
    } else {
      showNotification(NOTIFICATION_TYPES.error, data.editRoundRobinTeam.message, false);
    }
  };

  const handleAddMenberToTeam = (teamMembers, values, setSubmitting) => {
    if (
      values.teamMembers.filter(e => e.accountDetails.email === teamMembers.accountDetails.email)
        .length === 0
    ) {
      const remainingSearchResults = values.SearchTeam.filter(e => {
        if (e.userId) {
          return e.userId.accountDetails.email !== teamMembers.accountDetails.email;
        }
        return e.accountDetails.email !== teamMembers.accountDetails.email;
      });
      setSubmitting('SearchTeam', [...remainingSearchResults]);
      setSubmitting('teamMembers', [...values.teamMembers, ...[teamMembers]]);
    }
  };

  const handleRemoveMenberToTeam = (index, values, setSubmitting, setFieldValue) => {
    setSubmitting(true);
    const arraySearch = [...values.SearchTeam, {userId: values.teamMembers[index]}];
    setFieldValue('SearchTeam', arraySearch);
    let list = values.teamMembers;
    list = list.splice(index, 1);
    setSubmitting('teamMembers', list);
    setSubmitting(false);
  };

  // const handleChangeName = () => {
  //   refSpanName.current.style = 'display: none;';
  //   refInputName.current.style = 'display: flex;';
  // };

  const handleSubmitMethod = async values => {
    isAdd ? await handleCreatGroup(values) : await handleEditGroup(values);
  };

  return (
    <Formik
      initialValues={
        ParentValue.SelectedTeam
          ? {
              ...ParentValue.SelectedTeam,
              SearchTeam: searchLoading
                ? []
                : SearchTeam?.getOrganizationMembersById?.members?.filter(
                    o1 =>
                      ParentValue?.SelectedTeam?.teamMembers
                        ?.map(o2 => o2.accountDetails.email)
                        .indexOf(o1.userId.accountDetails.email) === -1
                  ),
            }
          : {
              name: '',
              teamMembers: [],
              SearchTeam: searchLoading ? [] : SearchTeam?.getOrganizationMembersById?.members,

              memberId: {
                accountDetails: [],
              },
            }
      }
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .test({
            test: value =>
              isAdd
                ? !ParentValue?.TeamsName?.includes(value)
                : !ParentValue?.TeamsName?.filter(
                    el => el !== ParentValue.SelectedTeam?.name
                  ).includes(value),
            message: t('common:this_name_already_exist'),
          })
          .test('isEmpty', 'Name is a required field', name => name?.trim() !== '')
          .required()
          .max(25)
          .label('Name'),
      })}
      onSubmit={async (values, {setSubmitting}) => {
        setSubmitting(true);
        await handleSubmitMethod(values);
        setSubmitting(false);
      }}
      enableReinitialize={true}
      validateOnChange={false}
    >
      {({
        isSubmitting,
        handleChange,
        setFieldValue,
        handleSubmit,
        setSubmitting,
        handleBlur,
        values,
        errors,
      }) => (
        <Form action='#' className='mx-2 h-max duration'>
          <div className='flex flex-col px-2 w-full h-full py-2 duration'>
            <div className='flex justify-between sm:items-center flex-col sm:flex-row gap-2'>
              <div className='flex flex-row'>
                <Field
                  label='Name'
                  error={errors?.name && <FieldError message={errors.name} />}
                  required
                >
                  <input
                    className='appearance-none w-full px-2 py-1 border border-gray-300 rounded-md
                        shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue
                        focus:border-mainBlue sm:text-sm'
                    onChange={handleChange}
                    value={values.name}
                    type='text'
                    maxLength={25}
                    onBlur={handleBlur}
                    name='name'
                    id='name'
                    placeholder='Name'
                  />
                </Field>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <Button
                  variant='cancel'
                  type='button'
                  className='col-span-1'
                  onClick={handleCancelClick}
                >
                  {t('common:cancel')}
                </Button>
                <Button
                  variant='solid'
                  type='button'
                  className='col-span-1'
                  onClick={() => {
                    setSubmitting(true);
                    handleSubmit(values);
                    setSubmitting(false);
                  }}
                >
                  {isSubmitting ? t('common:btn_saving') : t('common:btn_save')}
                </Button>
              </div>
            </div>

            <div className='flex h-max gap-2 flex-col sm:flex-row '>
              <div className='w-full md:w-5/12 h-full rounded-sm shadow-lg mb-2'>
                <div className='flex flex-row gap-2 justify-center p-2 sm:justify-start'>
                  <input
                    className={classNames([
                      'appearance-none w-full px-3 py-2 border border-gray-300 rounded-md',
                      'shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue',
                      'focus:border-mainBlue sm:text-sm',
                    ])}
                    type='text'
                    onChange={e => {
                      setkeywords(e.target.value);
                      // refetchSearch();
                    }}
                    value={keywords}
                    placeholder='Search for the member'
                  />
                </div>

                <ul className='flex flex-col h-96 md:h-[577px] px-1 sm:px-2 gap-2 overflow-x-hidden overflow-y-scroll'>
                  {searchLoading ? (
                    <div className='flex m-auto'>
                      <svg
                        className='custom_loader m-auto animate-spin -ml-1 mr-3 h-10 w-10 text-mainBlue'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    values.SearchTeam.filter(el =>
                      el?.userId?.personalDetails?.name
                        ?.toUpperCase()
                        .includes(`${keywords}`.toUpperCase())
                    ).map((item, index) => {
                      if (item?.userId) {
                        item = item.userId;
                      }
                      return (
                        <li
                          key={index}
                          className='relative flex h-max flex-col p-1 gap-1 shadow-lg rounded-md'
                        >
                          <div className='h-32 flex flex-row gap-1'>
                            <div className='flex flex-1 w-1/3 border-r'>
                              <img
                                src={
                                  item.accountDetails.avatar
                                    ? item.accountDetails.avatar
                                    : '/assets/default-profile.jpg'
                                }
                                alt={item.accountDetails.avatar}
                                className='select-none rounded-full shadow-lg m-auto w-6/12 md:w-8/12 sm:w-6/12 h-auto'
                              />
                            </div>
                            <div className='flex flex-col w-2/3 gap-1'>
                              <span
                                className='text-xs md:text-sm font-bold break-all line-clamp-1 w-[80%]'
                                title={item.personalDetails.name}
                              >
                                {item.personalDetails.name}
                              </span>
                              <span
                                className='text-xs md:text-sm font-light line-clamp-1 text-gray-600'
                                title={item.personalDetails.headline}
                              >
                                {item.personalDetails.headline}
                              </span>
                              <dd
                                className='text-xs md:text-sm line-clamp-4'
                                title={item.personalDetails.description}
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHtml(item.personalDetails.description),
                                }}
                              />
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              setSubmitting(true);
                              // const id = toast.loading(t('common:loading'));
                              // const data = await getCredentialsByEmail({
                              //   variables: {email: item?.accountDetails?.email},
                              // });
                              // const {
                              //   hasGoogleCredentials,
                              //   // hasOfficeCredentials,
                              //   // hasZoomCredentials,
                              // } = data?.data?.getCredentialsByEmail || {
                              //   hasGoogleCredentials: null,
                              //   hasOfficeCredentials: null,
                              //   hasZoomCredentials: null,
                              // };
                              // toast.dismiss(id);
                              // if (
                              //   [
                              //     hasGoogleCredentials,
                              //     // hasOfficeCredentials,
                              //     // hasZoomCredentials,
                              //   ].includes(true)
                              // ) {
                              //   handleAddMenberToTeam(item, values, setFieldValue);
                              // } else {
                              //   toast.error(t('common:no_connect_cal'));
                              // }
                              handleAddMenberToTeam(item, values, setFieldValue);
                              setSubmitting(false);
                            }}
                            type={'button'}
                            className='absolute top-1 right-2 rounded-md bg-mainBlue text-white p-1 active:bg-white active:text-mainBlue  active:outline-none active:ring-2 active:ring-offset-2 active:ring-mainBlue'
                          >
                            <PlusIcon width={16} height={16} />
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>

              <div className='w-full h-max rounded-sm shadow-lg mb-2'>
                <div className='flex h-10 items-center'>
                  <span className='text-sm font-bold '>
                    Current members ({values.teamMembers.length})
                  </span>
                </div>
                <ul
                  className='grid grid-flow-row grid-cols-1 px-1 sm:px-2
                                sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3
                                h-96 md:h-[590px] gap-2 overflow-x-hidden overflow-y-scroll'
                >
                  {values.teamMembers.map((item, index) => (
                    <li
                      key={index}
                      className='relative grid h-max col-span-1 row-span-1 p-1 gap-1 shadow-lg rounded-md'
                    >
                      <div className='h-32 flex flex-row gap-1'>
                        <div className='flex flex-1 w-1/3 border-r '>
                          <img
                            src={
                              item?.accountDetails?.avatar
                                ? item.accountDetails.avatar
                                : '/assets/default-profile.jpg'
                            }
                            alt={item.personalDetails.name}
                            className='select-none rounded-full shadow-lg m-auto w-8/12 md:w-10/12 h-auto'
                          />
                        </div>
                        <div className='flex flex-col w-2/3 gap-1'>
                          <span className='text-xs md:text-sm font-bold break-all line-clamp-1 w-[75%]'>
                            {item.personalDetails.name}
                          </span>
                          <span className='text-xs md:text-sm font-light line-clamp-1 text-gray-600'>
                            {item.personalDetails.headline}
                          </span>
                          <dd
                            className='text-xs md:text-sm xl:text-xs line-clamp-4'
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(item.personalDetails.description),
                            }}
                          />
                        </div>
                      </div>

                      <button
                        // disabled={isLoading}
                        type={'button'}
                        className='absolute top-1 right-2 rounded-md bg-red-600 text-white p-1 active:bg-white active:text-red-600  active:outline-none active:ring-2 active:ring-offset-2 active:ring-red-600'
                        onClick={() => {
                          handleRemoveMenberToTeam(index, values, setSubmitting, setFieldValue);
                        }}
                      >
                        <XMarkIcon width={16} height={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ManageTeam;
