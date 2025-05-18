/* eslint-disable no-lone-blocks */
import {useContext, useEffect, useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import {useLazyQuery, useMutation} from '@apollo/client';
import {XMarkIcon} from '@heroicons/react/20/solid';
import Button from '@root/components/button';
import {UserContext} from '@root/context/user';
import LiveChat from 'constants/GraphQL/LiveChat/mutations';
import userQuery from 'constants/GraphQL/User/queries';
import queries from 'constants/GraphQL/LiveChat/queries';
import {useSession} from 'next-auth/react';
import Input from '@root/components/forms/input';
import Modal from '../Modal';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const SearchUserForConversation = () => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {handleEvent} = modalProps || {};
  const {user: User} = useContext(UserContext);
  const [message, setMessage] = useState<any>(undefined);
  const [ErrorMessage, setErrorMessage] = useState<any>(undefined);
  const [keyword, setKeyword] = useState('');
  const [user, setUser] = useState<any>(undefined);
  const [enable, setEnable] = useState(true);
  const [LoadingAPI, setLoadingAPI] = useState(false);
  const context = {
    headers: {
      Authorization: session?.accessToken,
    },
  };

  const [online, setOnline] = useState(false);

  const [getLastSeen, {data: DataLastSeen}] = useLazyQuery(queries.getLastSeen, {
    context,
  });

  const [getUserForStartConversation] = useLazyQuery(userQuery.getUserForStartConversation, {
    variables: {
      keyword,
    },
    context,
  });

  const [createConversation, {loading: loadingConversationData}] = useMutation(
    LiveChat.CreateConversation,
    {
      context,
    }
  );
  const [createChatMessage, {loading: loadingChatMessage}] = useMutation(
    LiveChat.createChatMessage,
    {
      context,
    }
  );

  const sendMessage = async () => {
    const res = await createConversation({
      variables: {
        membersEmail: [user.accountDetails.email, User?.email],
      },
    });

    const conversationID = res?.data?.createConversation?.conversationID;

    await createChatMessage({
      variables: {
        senderEmail: session?.user?.email,
        receiverEmail: user?.accountDetails?.email,
        message: message,
        unread: true,
        conversationId: conversationID,
      },
      context,
    });

    handleEvent(conversationID);
    hideModal();
  };

  const findUser = async () => {
    try {
      setErrorMessage(undefined);
      if (User?.username === keyword || User?.email === keyword) {
        // eslint-disable-next-line
        throw t('common:you_cant_start_chat_with_your_self');
      }
      setLoadingAPI(true);
      const {data: userData} = await getUserForStartConversation({
        variables: {keyword: keyword},
      });
      if (userData?.getUserForStartConversation?.response?.status === 200) {
        setUser(userData?.getUserForStartConversation.userData);

        await getLastSeen({
          variables: {
            email: userData?.getUserForStartConversation?.userData?.accountDetails?.email,
          },
        });

        setOnline(DataLastSeen?.getLastSeenOfUser?.online);
      } else {
        // eslint-disable-next-line
        throw t('common:Enter_a_valid_username_or_email');
      }
    } catch (err) {
      setUser(undefined);
      setErrorMessage(err);
      setTimeout(() => {
        setErrorMessage(undefined);
      }, 2500);
    }
    setLoadingAPI(false);
  };

  useEffect(() => {}, [user, ErrorMessage]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await getLastSeen({
        variables: {
          email: user?.accountDetails?.email,
        },
      });
      setOnline(DataLastSeen?.getLastSeenOfUser?.online);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    if (message !== '' && message !== undefined && user !== undefined) {
      setEnable(false);
    } else {
      setEnable(true);
    }
  }, [message, user]);

  return (
    <Modal title={t('common:start_conversation')} medium>
      <div className='bg-white flex-1'>
        <div className='sm:flex sm:items-center flex-1'>
          <div className='mt-3 sm:text-left flex-1'>
            <div className='mt-2 w-full'>
              <div className='flex flex-row gap-4'>
                <div className='sm:flex flex-col w-full gap-0'>
                  <h6 className='text-md leading-6 font-medium text-gray-900' id='modal-title'>
                    {t('common:find_user_input_message_chat')}
                  </h6>
                  <Input
                    type='text'
                    autoFocus
                    value={keyword}
                    disabled={LoadingAPI}
                    handleChange={e => {
                      setKeyword(e.target.value);
                      setUser(undefined);
                    }}
                    className='h-[45px]'
                    onKeyPress={e => e.key === 'Enter' && findUser()}
                  />
                </div>

                <Button
                  className='w-4/12 self-end flex h-[45px]
                  justify-center items-center disabled:bg-slate-700
                  active:bg-white active:text-mainBlue '
                  disabled={LoadingAPI}
                  variant='solid'
                  onClick={async () => {
                    await findUser();
                  }}
                >
                  {LoadingAPI ? 'Finding...' : t('common:find_user_input_Button')}
                </Button>
              </div>

              {user && !ErrorMessage && (
                <div
                  className='flex flex-row items-center shadow-sm animate-pulse 
                            shadow-slate-500 gap-2 my-2 p-2 ring-2 bg-gradient-to-r
                            from-cyan-400 to-white ring-blue-300 rounded-md'
                >
                  <div
                    className='w-14 h-14 bg-cover rounded-full'
                    style={{
                      backgroundImage: `url(${
                        user?.accountDetails?.avatar || '/assets/default-profile.jpg'
                      }`,
                    }}
                  ></div>
                  {online ? (
                    <span className='absolute bottom-3 left-12 transform translate-y-1/4 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-500 rounded-full'></span>
                  ) : (
                    <span className='absolute bottom-3 left-12 transform translate-y-1/4 w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-500 rounded-full'></span>
                  )}
                  <span className='text-gray-800 text-lg font-medium'>
                    {user?.personalDetails?.name}
                  </span>
                  <XMarkIcon
                    onClick={() => {
                      setUser(undefined);
                    }}
                    className='ml-auto text-mainBlue mr-2 hover:text-red-500 active:text-red-500'
                    width={24}
                    height={24}
                  />
                </div>
              )}
              {ErrorMessage && (
                <div
                  className='flex flex-row items-center shadow-sm animate-tada 
                            shadow-slate-500 gap-1 my-2 p-2 ring-2 bg-gradient-to-r
                            from-red-600 to-red-200 ring-red-500 rounded-md'
                >
                  <span className='text-white'>{ErrorMessage}</span>
                </div>
              )}
            </div>

            <div className='mt-2 w-full gap-1'>
              <h6 className='text-md leading-6 font-medium text-gray-900' id='modal-title'>
                {t('common:message')}
              </h6>
              <CKEditor
                name={t('common:Description')}
                value={message}
                onChange={data => {
                  setMessage(data);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='py-3 sm:px-6 flex flex-row-reverse flex-wrap sm:flex-nowrap gap-2'>
        <Button
          variant='solid'
          disabled={enable}
          type='button'
          onClick={async () => {
            await sendMessage();
          }}
        >
          {loadingConversationData || loadingChatMessage ? 'Sending...' : t('common:send_message')}
        </Button>
      </div>
    </Modal>
  );
};
export default SearchUserForConversation;
