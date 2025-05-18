import queries from 'constants/GraphQL/LiveChat/queries';
import {useSession} from 'next-auth/react';
import {useEffect} from 'react';
import {useQuery} from '@apollo/client';
import ConversationHeader from './conversation-header';
import SendMessageInput from './send-messages-input';
import Messages from './messages';
import {IConv, IsetValue, InitConv} from './constants';

type IProps = {
  NewMessage: any;
  Conv?: IConv;
  setValue: IsetValue;
  v: InitConv;
  showConversations: any;
  NotifiMsg: any;
  NotifiMsgLoadding: any;
  handleMarkReadMessage: any;
};

export default function Conversation({
  NewMessage,
  Conv,
  setValue,
  v,
  showConversations,
  NotifiMsg,
  NotifiMsgLoadding,
  handleMarkReadMessage,
}: IProps) {
  const {data: session} = useSession();

  const {
    loading: msgsLoading,
    data: dataMsgs,
    refetch,
    observable,
  } = useQuery(queries.getAllMsgsByConversationId, {
    variables: {
      conversationId: Conv?._id,
      paginationArgs: {
        pageNumber: 1,
        resultsPerPage: 25,
      },
    },
    fetchPolicy: 'no-cache',
    context: {
      headers: {
        Authorization: session?.accessToken,
        'Content-Type': 'application/json',
      },
    },
    skip: !Conv?._id,
  });

  // eslint-disable-next-line @typescript-eslint/dot-notation
  if (observable!['last']?.error?.networkError?.response?.status === 400) {
    setValue('conversationId', undefined);
  }

  useEffect(() => {
    refetch();
  }, [Conv?._id]);

  useEffect(() => {
    if (dataMsgs) {
      setValue('AllMessages', dataMsgs.getAllMsgsByConversationId.messages);
    }
  }, [msgsLoading]);

  useEffect(() => {
    if (NotifiMsg?.newMessage && !NotifiMsgLoadding) {
      setValue('NewMessage', NotifiMsg.newMessage);
      const senderMe = Conv?.members.filter(
        user => user.accountDetails.email === session?.user?.email
      )[0]?.accountDetails.email;
      const receiverMe = Conv?.members.filter(
        user => user.accountDetails.email !== session?.user?.email
      )[0]?.accountDetails.email;
      const newMessageItem = NotifiMsg.newMessage;
      if (
        newMessageItem.conversationId === Conv?._id &&
        ((newMessageItem.senderEmail === senderMe && newMessageItem.receiverEmail === receiverMe) ||
          (newMessageItem.senderEmail === receiverMe &&
            newMessageItem.receiverEmail === senderMe)) &&
        v.AllMessages?.filter(msg => msg._id === newMessageItem._id).length === 0
      ) {
        if (v.conversationId === NotifiMsg.newMessage.conversationId) {
          handleMarkReadMessage(NotifiMsg.newMessage.conversationId);
        }

        if (NotifiMsg.newMessage.senderEmail === session?.user?.email) {
          setValue(
            `AllMessages[${v.AllMessages?.map(el => el.createdAt).indexOf(
              NotifiMsg.newMessage.createdAt
            )}]`,
            NotifiMsg.newMessage
          );
        } else {
          setValue('AllMessages', [NotifiMsg.newMessage, ...v.AllMessages]);
        }
      }
    }
  }, [NotifiMsg, NotifiMsgLoadding]);

  useEffect(() => {}, [NewMessage, NotifiMsgLoadding, v.AllMessages]);

  if (msgsLoading) {
    return (
      <div className='w-full h-full flex'>
        <span className='text-xs font-semibold m-auto'>loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-col gap-0 w-full h-full '>
        <ConversationHeader
          v={v}
          username={
            Conv?.members.filter(user => user.accountDetails.email !== session?.user?.email)[0]
              ?.accountDetails.username
          }
          name={
            Conv?.members.filter(user => user.accountDetails.email !== session?.user?.email)[0]
              ?.personalDetails.name
          }
          email={
            Conv?.members.filter(user => user.accountDetails.email !== session?.user?.email)[0]
              ?.accountDetails.email
          }
          typing={Conv?.typing}
          showConversations={showConversations}
        />
        <Messages
          ReceiverName={
            Conv?.members.filter(user => user.accountDetails.email !== session?.user?.email)[0]
              ?.personalDetails.name
          }
          senderAvatar={
            Conv?.members.filter(user => user.accountDetails.email === session?.user?.email)[0]
              ?.accountDetails.avatar
          }
          ReceiverAvatar={
            Conv?.members.filter(user => user.accountDetails.email !== session?.user?.email)[0]
              ?.accountDetails.avatar
          }
          v={v}
          setValue={setValue}
          conversationId={Conv?._id}
        />
        <SendMessageInput
          conversationId={Conv?._id}
          members={Conv?.members}
          setTyping={e => {
            setValue(`Convs[${v.Convs?.indexOf(Conv!)}].typing`, e);
          }}
          handleMarkReadMessage={handleMarkReadMessage}
          setValue={setValue}
          v={v}
        />
      </div>
    </>
  );
}
