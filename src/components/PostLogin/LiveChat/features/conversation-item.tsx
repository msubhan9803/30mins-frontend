import classNames from 'classnames';
import {useMutation, useQuery} from '@apollo/client';
import queries from 'constants/GraphQL/LiveChat/queries';
import mutations from 'constants/GraphQL/LiveChat/mutations';
import {Fragment, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {ArchiveBoxIcon, NoSymbolIcon, InboxIcon, TrashIcon} from '@heroicons/react/24/outline';
import {Menu, Transition} from '@headlessui/react';
import {EllipsisVerticalIcon} from '@heroicons/react/20/solid';
import useTranslation from 'next-translate/useTranslation';
import {InitConv, IOptions, IsetValue, Member} from '../constants';

type IProps = {
  members: [Member];
  id: any;
  name: any;
  avatar: any;
  selected: any;
  onClick: any;
  unreadMessageCount: any;
  fetchConvs: any;
  options: IOptions;
  v: InitConv;
  handleMarkReadMessage: () => void;
  setValue: IsetValue;
};

const ConversationItem = ({
  members,
  id,
  name,
  avatar,
  selected,
  onClick,
  unreadMessageCount,
  handleMarkReadMessage,
  options,
  fetchConvs,
  setValue,
  v,
}: IProps) => {
  const {data: session} = useSession();
  const [online, setOnline] = useState(false);
  const {t} = useTranslation();

  const [ArchiveConversation] = useMutation(mutations.archiveConversation, {
    variables: {
      documentId: id,
      archivedEmail: session?.user?.email,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
  });

  const [HideConversation] = useMutation(mutations.hideConversation, {
    variables: {
      documentId: id,
      hideEmail: session?.user?.email,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
  });

  const [blockConversation] = useMutation(mutations.blockConversation, {
    variables: {
      documentId: id,
      emailBlocker: session?.user?.email,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
  });

  const {data, loading, refetch} = useQuery(queries.getLastSeen, {
    variables: {
      email: members.filter(user => user.accountDetails.email !== session?.user?.email)[0]
        ?.accountDetails.email,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
  });

  let interval: any = null;
  useEffect(() => {
    const DeletedUserCountEmail = v.Convs?.find(el => el._id === v.conversationId)
      ?.members.map(user => user.accountDetails.email)
      .includes(
        members.filter(user => user.accountDetails.email !== session?.user?.email)[0].accountDetails
          .email
      );
    if (DeletedUserCountEmail) {
      if (data?.getLastSeenOfUser?.accountDetails === null) {
        setValue('conversationId', undefined);
        fetchConvs!();
      }
    }
  }, [data, loading]);

  useEffect(() => {
    setOnline(data?.getLastSeenOfUser?.online);
    refetch();
    interval = setInterval(async () => {
      setOnline(data?.getLastSeenOfUser?.online);
      refetch();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div
      className={classNames([
        'flex flex-row h-max w-full border-b bg-white px-2',
        selected && 'bg-blue-200',
      ])}
    >
      <div
        className='w-20 h-20 flex cursor-pointer p-1 flex-col relative'
        onClick={() => {
          onClick();
        }}
      >
        <div
          className='w-14 h-14 bg-cover m-auto rounded-full'
          style={{backgroundImage: `url(${avatar || '/assets/default-profile.jpg'}`}}
        ></div>
        {online !== undefined && online === true && (
          <span className='absolute bottom-3 left-12 transform translate-y-1/4 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-500 rounded-full'></span>
        )}
        {online !== undefined && online === false && (
          <span className='absolute bottom-3 left-12 transform translate-y-1/4 w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-500 rounded-full'></span>
        )}
      </div>
      <div className='relative w-full h-20 flex flex-row pl-2 my-auto justify-center items-start'>
        <label
          className='text-base w-full cursor-pointer h-full flex flex-row items-center font-semibold'
          onClick={() => {
            onClick();
          }}
        >
          <span className='mr-auto'>{`${name || ''}`}</span>
          {unreadMessageCount > 0 && (
            <span className='bg-mainBlue text-base w-8 h-8 grid text-center items-center right-0 text-white rounded-full border-radius-5 '>
              {unreadMessageCount < 10 ? unreadMessageCount : '+9'}
            </span>
          )}
        </label>

        <div className='relative h-full flex justify-center items-center'>
          <Menu as={Fragment}>
            <div>
              <Menu.Button className='inline-flex w-full justify-center p-1 text-white'>
                <EllipsisVerticalIcon width={22} height={22} className='text-black' />
              </Menu.Button>
            </div>
            <Transition
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
              className='z-20 absolute right-6 top-3'
            >
              <Menu.Items className='right-0 w-max origin-top-right divide-y gap-1 divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='px-1 py-1'>
                  {!options.inbox[0] && (
                    <Menu.Item>
                      {({active}) => (
                        <button
                          className={`${
                            active ? 'bg-mainBlue text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md p-2 gap-1 text-sm`}
                          onClick={async () => {
                            if (options.archive[0]) {
                              await ArchiveConversation();
                            }
                            if (options.blocked[0]) {
                              await blockConversation();
                            }
                            await fetchConvs();
                          }}
                          title={t('common:move_to_inbox')}
                        >
                          <InboxIcon className='h-5 w-5 text-mainBlue group-hover:text-white' />
                          {t('common:move_to_inbox')}
                        </button>
                      )}
                    </Menu.Item>
                  )}

                  {options.inbox[0] && (
                    <Menu.Item>
                      {({active}) => (
                        <button
                          className={`${
                            active ? 'bg-mainBlue text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md p-2 gap-1 text-sm`}
                          onClick={async () => {
                            await ArchiveConversation();
                            await fetchConvs();
                          }}
                          title={t('common:move_to_archive')}
                        >
                          <ArchiveBoxIcon className='h-5 w-5 text-mainBlue group-hover:text-white' />
                          {t('common:move_to_archive')}
                        </button>
                      )}
                    </Menu.Item>
                  )}

                  {options.inbox[0] && (
                    <Menu.Item>
                      {({active}) => (
                        <button
                          className={`${
                            active ? 'bg-mainBlue text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md p-2 gap-1 text-sm`}
                          onClick={async () => {
                            await blockConversation();
                            await fetchConvs();
                          }}
                          title={t('common:block')}
                        >
                          <NoSymbolIcon className='h-5 w-5' />
                          {t('common:block')}
                        </button>
                      )}
                    </Menu.Item>
                  )}
                  {options.inbox[0] && (
                    <Menu.Item>
                      {({active}) => (
                        <button
                          className={`${
                            active ? 'bg-mainBlue text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md p-2 gap-1 text-sm`}
                          onClick={async () => {
                            await HideConversation();
                            await handleMarkReadMessage();
                            await fetchConvs();
                          }}
                          title={t('common:remove_conv')}
                        >
                          <TrashIcon className='h-5 w-5 text-red-500 group-hover:text-white' />
                          {t('common:remove_conv')}
                        </button>
                      )}
                    </Menu.Item>
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
