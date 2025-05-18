/* eslint-disable no-return-assign */
import useTranslation from 'next-translate/useTranslation';
import {ChatBubbleOvalLeftEllipsisIcon, UserIcon} from '@heroicons/react/20/solid';
import queries from 'constants/GraphQL/LiveChat/queries';
import {useMutation, useSubscription, useQuery} from '@apollo/client';
import React, {useContext, useEffect, useState} from 'react';
import {Transition} from '@headlessui/react';
import {useSession} from 'next-auth/react';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import Head from 'next/head';
import subscription from 'constants/GraphQL/LiveChat/subscription';
import ChatMutation from 'constants/GraphQL/LiveChat/mutations';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Header from '@root/components/header';
import {UserContext} from '@root/context/user';
import {useFormik} from 'formik';
import Button from '@root/components/button';
import Conversation from './conversation';
import ConversationItem from './features/conversation-item';
import HeadSearch from './features/head-search';
import {initConv} from './constants';

export default function LiveChat({newConvId, messageErr}) {
  const {t} = useTranslation();
  const {t: tpage} = useTranslation('page');
  const {data: session} = useSession();
  const [LoadAPI, setLoadAPI] = useState(false);
  const [innerWidth, setInnerWidth] = useState<any>(1000);
  const [ShowFirst, setShowFirst] = useState(false);
  const [showNewConv, setshowNewConv] = useState(true);
  let list: any;
  const {setUnreadMessageCount} = useContext(UserContext);

  const {values: v, setFieldValue: setValue} = useFormik({
    initialValues: {...initConv, conversationId: undefined},
    onSubmit: () => {},
  });

  const context = {
    headers: {
      Authorization: session?.accessToken,
      'Content-Type': 'application/json',
    },
  };

  const {showModal} = ModalContextProvider();
  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Chat'), href: '/user/chat'},
  ];

  const {loading: NotifiMsgLoadding, data: NotifiMsg} = useSubscription(subscription.newMessage, {
    variables: {
      email: session?.user?.email,
    },
    context,
  });

  const {
    loading: loadingConvs,
    data: DataConvs,
    called: calledConvs,
    refetch: fetchConvs,
    fetchMore,
  } = useQuery(queries.GetAllConversations, {
    variables: {
      paginationArgs: {
        pageNumber: 1,
        resultsPerPage: 20,
      },
    },
    context,
  });

  const [MarkReadMessageOfCon, {loading: LoadingMardReadCon}] = useMutation(
    ChatMutation.MarkReadMessageOfConversation,
    {
      variables: {
        conversationId: v.conversationId,
      },
      context,
    }
  );

  const handleMarkReadMessage = async ConversationId => {
    await MarkReadMessageOfCon({
      variables: {
        conversationId: ConversationId,
      },
    });
  };

  // update count unread message to sidebir tap
  const handleUpdateUnreadMsgsCount = async newData => {
    if (newData?.getAllConversations?.conversations?.length! > 0) {
      const counts = {
        archive: 0,
        inbox: 0,
        blocked: 0,
      };
      newData?.getAllConversations?.conversations?.forEach(el => {
        if (el.archived.includes(session?.user?.email!)) {
          counts.archive += el.unreadMessageCount;
        } else if (el.blocked.includes(session?.user?.email!)) {
          counts.blocked += el.unreadMessageCount;
        } else {
          counts.inbox += el.unreadMessageCount;
        }
      });
      setValue('options.inbox[1]', counts.inbox);
      setValue('options.archive[1]', counts.archive);
      setValue('options.blocked[1]', counts.blocked);
      setUnreadMessageCount(counts.inbox + counts.archive + counts.blocked);
      if (showNewConv && typeof newConvId === 'string') {
        setValue('conversationId', newConvId || undefined);
        setshowNewConv(false);
      }
    }
  };

  const handleResize = () => {
    setInnerWidth(window.innerWidth);
  };

  const handleShowConversations = () => {
    setValue('conversationId', undefined);
    fetchConvs().then(({data: newData}) => {
      handleUpdateUnreadMsgsCount(newData);
    });
  };

  const handleRefetchConvs = async () => {
    setLoadAPI(true);
    setValue('conversationId', undefined);
    setValue('Convs', undefined);
    const {data: NewData} = await fetchMore({
      variables: {
        conversationId: v.conversationId,
      },
      context,
    });

    setValue('Convs', NewData?.getAllConversations?.conversations);
    handleUpdateUnreadMsgsCount(NewData);
    setLoadAPI(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      handleResize();
    }
    if (!calledConvs) {
      fetchConvs();
    }
    !ShowFirst &&
      (setShowFirst(true),
      messageErr &&
        setTimeout(() => {
          toast.error(messageErr);
        }, 1000),
      messageErr === null && setValue('conversationId', newConvId || undefined));
  });

  useEffect(() => {
    if (calledConvs && !loadingConvs) {
      setValue('Convs', DataConvs?.getAllConversations?.conversations);
    }
  }, [loadingConvs, calledConvs, DataConvs]);

  useEffect(() => {
    fetchConvs().then(({data: newData}) => {
      handleUpdateUnreadMsgsCount(newData);
    });
  }, [loadingConvs, NotifiMsgLoadding, NotifiMsg, v.conversationId, LoadingMardReadCon]);

  useEffect(() => {}, [v.Convs]);

  return (
    <div className='w-full h-full flex flex-col gap-4'>
      <div className='flex justify-between flex-col w-full'>
        <Header
          crumbs={crumbs}
          heading='Chat'
          StartChat={
            <Button
              variant='solid'
              onClick={() => {
                showModal(MODAL_TYPES.Search_User_For_Conversation, {
                  handleEvent: ConversationId => {
                    setValue('conversationId', undefined);
                    fetchConvs().then(({data: newData}) => {
                      handleUpdateUnreadMsgsCount(newData);
                      setValue('conversationId', ConversationId);
                    });
                  },
                });
              }}
            >
              {t('page:start_new_chat')}
            </Button>
          }
        />
      </div>

      <div className=' relative w-full h-full flex border flex-col md:flex-row overflow-hidden'>
        <Head>
          <title>{t('page:Chat')}</title>
        </Head>
        <Transition
          show={(v.conversationId === undefined && innerWidth < 768) || innerWidth >= 768}
          hidden={v.conversationId !== undefined || innerWidth < 768}
          enter='transition duration-700 animate-fadeInLeft md:animate-none'
          leave='transition duration-700 absolute animate-fadeOutLeft md:animate-none'
          className={classNames(['h-full w-full  md:w-4/12 border-b md:border-b-0 flex flex-col'])}
        >
          <HeadSearch
            setValue={setValue}
            options={v.options}
            onSwitch={() => {
              setValue('conversationId', undefined);
            }}
          />
          <div
            className={classNames([
              'w-full h-full overflow-y-scroll border-r overflow-x-hidden flex flex-col',
            ])}
          >
            {loadingConvs || LoadAPI ? (
              <div className='w-full h-full flex'>
                <span className='text-sm font-semibold m-auto'>Loading...</span>
              </div>
            ) : v?.Convs?.length! > 0 ? (
              ((list = v.Convs?.filter(con =>
                con.members.find(
                  el =>
                    el.accountDetails.email !== session?.user?.email &&
                    el.personalDetails.name.toLowerCase().startsWith(v.TextFileter.toLowerCase())
                )
              )
                .filter(el => !el.hidden.includes(session?.user?.email))
                .filter(el =>
                  v.options.archive[0]
                    ? el.archived.includes(session?.user?.email!)
                    : v.options.blocked[0]
                    ? el.blocked.includes(session?.user?.email!)
                    : !el.blocked.includes(session?.user?.email!) &&
                      !el.archived.includes(session?.user?.email!)
                )
                .map((conversation, index) => (
                  <ConversationItem
                    key={index}
                    setValue={setValue}
                    v={v}
                    options={v.options}
                    id={conversation._id}
                    fetchConvs={async () => {
                      await handleRefetchConvs();
                    }}
                    members={conversation.members}
                    unreadMessageCount={conversation.unreadMessageCount}
                    selected={conversation._id === v.conversationId}
                    handleMarkReadMessage={async () => {
                      await handleMarkReadMessage(conversation._id);
                    }}
                    onClick={async () => {
                      setValue('conversationId', conversation._id);
                      await handleMarkReadMessage(conversation._id);
                    }}
                    name={
                      conversation.members.filter(
                        user => user.accountDetails.email !== session?.user?.email
                      )[0]?.personalDetails?.name
                    }
                    avatar={
                      conversation.members.filter(
                        user => user.accountDetails.email !== session?.user?.email
                      )[0]?.accountDetails?.avatar
                    }
                  />
                ))),
              list.length > 0 ? (
                list
              ) : (
                <div className='w-full h-full flex'>
                  <span className='text-sm font-semibold m-auto flex flex-col justify-center items-center'>
                    <UserIcon width={75} height={75} className='text-gray-400' />
                    <span>{t('common:no_user_found')}</span>
                  </span>
                </div>
              ))
            ) : (
              <div className='w-full h-full flex'>
                <span className='text-sm font-semibold m-auto flex flex-col justify-center items-center'>
                  <UserIcon width={75} height={75} className='text-gray-400' />
                  <span>{t('common:no_user_found')}</span>
                </span>
              </div>
            )}
          </div>
        </Transition>
        <Transition
          show={(v.conversationId !== undefined && innerWidth < 768) || innerWidth >= 768}
          hidden={v.conversationId === undefined || innerWidth < 768}
          enter='transition duration-700 animate-fadeIn md:animate-none'
          leave='transition duration-700 absolute animate-fadeOutRight md:animate-none'
          className={classNames(['w-full h-full flex pb-0 md:pb-4 md:w-8/12'])}
        >
          {v.conversationId ? (
            <Conversation
              v={v}
              Conv={
                (v?.conversationId &&
                  v.Convs?.length! > 0 &&
                  v.Convs?.filter(el => el._id === v.conversationId)[0]) ||
                undefined
              }
              NewMessage={v.NewMessage}
              setValue={setValue}
              NotifiMsg={NotifiMsg}
              NotifiMsgLoadding={NotifiMsgLoadding}
              showConversations={handleShowConversations}
              handleMarkReadMessage={handleMarkReadMessage}
            />
          ) : (
            <div className='flex w-full h-full'>
              <span className='m-auto text-md font-semibold'>
                <ChatBubbleOvalLeftEllipsisIcon
                  width={150}
                  height={150}
                  className='text-gray-400 opacity-25'
                />
              </span>
            </div>
          )}
        </Transition>
      </div>
    </div>
  );
}
