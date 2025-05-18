import classNames from 'classnames';
import RoundRobinQuery from 'constants/GraphQL/RoundRobin/queries';
import RoundRobinMutation from 'constants/GraphQL/RoundRobin/mutations';
import {useSession} from 'next-auth/react';
import {Menu, Transition} from '@headlessui/react';
import {Fragment, useContext, useEffect, useState} from 'react';
import {EllipsisVerticalIcon, PencilSquareIcon, TrashIcon} from '@heroicons/react/20/solid';
import {TABS} from 'constants/context/tabs';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {useMutation, useQuery} from '@apollo/client';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import {NotificationContext} from 'store/Notification/Notification.context';
import useTranslation from 'next-translate/useTranslation';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {toast} from 'react-hot-toast';
import Error from '@components/error';

type IProps = {
  setFieldValue: any;
  organization: any;
  SwitchTab: any;
  values: any;
};

const ListOfTeams = ({SwitchTab, values: ParentValue, setFieldValue, organization}: IProps) => {
  const {data: session} = useSession();
  const {t} = useTranslation();
  const {showModal, hideModal} = ModalContextProvider();
  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const [deleteMutation] = useMutation(RoundRobinMutation.DeleteRoundRobinTeam);
  const [roundRobinTeams, setroundRobinTeams] = useState<any>([]);
  const {
    data: dataRoundRobinTeams,
    loading,
    refetch,
  } = useQuery(RoundRobinQuery.GetRoundRobinTeamsByOrganizationId, {
    variables: {
      organizationId: organization._id,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
  });

  useEffect(() => {
    if (!loading) {
      setroundRobinTeams(dataRoundRobinTeams?.getRoundRobinTeamsByOrganizationId?.roundRobinTeams);
      setFieldValue(
        'TeamsName',
        dataRoundRobinTeams.getRoundRobinTeamsByOrganizationId.roundRobinTeams?.map(el => el.name)
      );
    }
  }, [loading, dataRoundRobinTeams]);

  useEffect(() => {
    refetch();
  });

  const EditTeam = SelectedTeam => {
    setFieldValue('SelectedTeam', {
      ...SelectedTeam,
      teamMembers: SelectedTeam.teamMembers.map(item => item.memberId),
    });
    SwitchTab(TABS.ManageTeam);
  };

  const handleDeleteOrgService = async id => {
    const {data} = await deleteMutation({
      variables: {
        documentId: id,
        organizationId: organization._id,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });
    showNotification(NOTIFICATION_TYPES.info, data.deleteRoundRobinTeam.message, false);
    hideModal();
  };

  const deleteTeam = (id, nameTeam) => {
    showModal(MODAL_TYPES.DELETE, {
      name: nameTeam,
      id: id,
      handleDelete: handleDeleteOrgService,
    });
  };

  const AssignedCount = ({TeamID}) => {
    const [count, setcount] = useState(0);
    const {
      data: dataAssigned,
      loading: loadingAssigned,
      refetch: refetchAssigned,
    } = useQuery(RoundRobinQuery.GetServiceCountWithRRId, {
      variables: {
        roundRobinTeamId: TeamID,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });

    useEffect(() => {
      refetchAssigned();
    }, [ParentValue?.ServicesData]);
    useEffect(() => {
      setcount(
        parseInt(dataAssigned?.getServiceCountWithRRId?.serviceCount, 10)
          ? parseInt(dataAssigned?.getServiceCountWithRRId?.serviceCount, 10)
          : 0
      );
    }, [loadingAssigned, ParentValue?.ServicesData]);

    return (
      <h3 className='text-xs'>
        Assigned: <span className='font-bold'>{count}</span>
      </h3>
    );
  };

  return (
    <ul
      className={classNames([
        'h-96 md:h-[650px] p-2 flex flex-col gap-2 overflow-x-hidden overflow-y-auto',
        loading && 'flex',
      ])}
    >
      {loading ? (
        <div className='flex m-auto h-1/5'>
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
        <div className='grid grid-cols-3 grid-flow-row gap-2'>
          {roundRobinTeams?.map((item, index) => (
            <li
              key={index}
              className='col-span-3 md:col-span-1 content-around p-2 shadow-sm border-2 rounded'
            >
              <div className=''>
                <div className='flex flex-row'>
                  <h3 className='text-lg  font-bold truncate'>
                    {item.name.length > 10 ? `${item.name.substring(0, 10)}...` : item.name}
                  </h3>
                </div>

                <h3 className='text-xs'>
                  Members: <span className='font-bold'>{item.teamMembers.length}</span>
                </h3>
                <AssignedCount TeamID={item._id} />
                <h3 className='text-xs'>
                  {t('common:Next_Member')}:{' '}
                  <span className='font-bold'>
                    {item.teamMembers.length > 0 &&
                      Object.values<any>(item.teamMembers)?.sort((a, b) =>
                        a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0
                      )[0].memberId?.personalDetails?.name}
                  </span>
                </h3>
              </div>
              <div className='justify-end text-right'>
                <Menu as='div' className='relative inline-block text-left'>
                  <div>
                    <Menu.Button>
                      <EllipsisVerticalIcon className='w-4 h-4' />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items className='origin-top-right absolute right-4 -top-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      <div className='py-1'>
                        <Menu.Item>
                          {({active}) => (
                            <button
                              onClick={() => EditTeam(item)}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'w-24 px-4 py-2 text-sm  flex gap-1'
                              )}
                            >
                              <PencilSquareIcon className='w-5 h-5 text-mainBlue' />
                              <span>{t('common:edit')}</span>
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({active}) => (
                            <button
                              onClick={async () => {
                                const id = toast.loading(t('common:loading'));
                                const data = await graphqlRequestHandler(
                                  RoundRobinQuery.GetServiceCountWithRRId,
                                  {
                                    roundRobinTeamId: item._id,
                                  },
                                  session?.accessToken
                                );
                                toast.dismiss(id);
                                if (data.data?.data?.getServiceCountWithRRId?.serviceCount > 0) {
                                  toast.error(t('common:this_team_responsible'));
                                  return;
                                }
                                deleteTeam(item._id, item.name);
                              }}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'w-24 px-4 py-2 text-sm flex gap-1'
                              )}
                            >
                              <TrashIcon className='w-5 h-5 text-red-600' />
                              <span>{t('common:delete')}</span>
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
        </div>
      )}
      {!roundRobinTeams && !loading && (
        <div className='w-full h-full md:ml-2'>
          <Error
            image={'/icons/errors/no-data.svg'}
            title={t('common:oops_no_teams')}
            description=''
          />
        </div>
      )}
    </ul>
  );
};

export default ListOfTeams;
