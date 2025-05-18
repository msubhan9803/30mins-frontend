import {useMutation, useSubscription} from '@apollo/client';
import {memo, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import mutations from 'constants/GraphQL/LiveChat/mutations';
import subscription from 'constants/GraphQL/LiveChat/subscription';
import sanitizeHtml from 'sanitize-html';
import SendButtonChat from './features/send-button-chat';
import {InitConv, IsetValue} from './constants';

type IProps = {
  setValue: IsetValue;
  v: InitConv;
  conversationId;
  members;
  setTyping;
  handleMarkReadMessage;
};

function SendMessageInput({
  conversationId,
  members,
  setTyping,
  handleMarkReadMessage,
  setValue,
  v,
}: IProps) {
  const {data: session} = useSession();
  const [msgValue, setMsgValue] = useState('');
  const [notifyTyping] = useMutation(mutations.notifyTyping);
  const {data: dataType} = useSubscription(subscription.startedTyping);

  useEffect(() => {}, [v.AllMessages]);

  const context = {
    headers: {
      Authorization: session?.accessToken,
      'Content-Type': 'application/json',
    },
  };

  useEffect(() => {}, [msgValue]);
  useEffect(() => {
    if (
      dataType?.startedTyping.receiverEmail === session?.user?.email &&
      dataType?.startedTyping.message === 'TYPING' &&
      dataType?.startedTyping.conversationId === conversationId
    ) {
      setTyping(true);
    } else {
      setTyping(false);
    }
  }, [dataType]);

  const [createChatMessage] = useMutation(mutations.createChatMessage);

  const sendChatMessage = async () => {
    try {
      if (
        sanitizeHtml(msgValue.trim()) !== ('' && undefined && null) &&
        sanitizeHtml(msgValue.trim()).trim().length > 0
      ) {
        const date = Date.now().toString();
        const newMessage = {
          createdAt: date,
          message: msgValue,
          conversationId: conversationId,
          senderEmail: session?.user?.email,
          receiverEmail:
            members[0].accountDetails.email === session?.user?.email
              ? members[1].accountDetails.email
              : members[0].accountDetails.email,
          sent: false,
          sendMessage: async () => {
            await createChatMessage({
              variables: {
                message: newMessage.message,
                conversationId: newMessage.conversationId,
                createdAt: date,
                senderEmail: newMessage.senderEmail,
                receiverEmail: newMessage.receiverEmail,
              },
              context,
            });
          },
        };

        setValue('AllMessages', [newMessage, ...(v?.AllMessages || [])]);

        setMsgValue('');
        await createChatMessage({
          variables: {
            message: newMessage.message,
            createdAt: date,
            conversationId: newMessage.conversationId,
            senderEmail: newMessage.senderEmail,
            receiverEmail: newMessage.receiverEmail,
          },
          context,
        });
        notifyTyping({
          variables: {
            senderEmail: session?.user?.email,
            receiverEmail: members.filter(
              user => user.accountDetails.email !== session?.user?.email
            )[0].accountDetails.email,
            message: 'NOT_TYPING',
            conversationId: conversationId,
          },
          context: {
            headers: {
              Authorization: session?.accessToken,
              'Content-Type': 'application/json',
            },
          },
        });
      }
    } catch (err) {} // eslint-disable-line
  };

  const onChangeMsgInput = e => {
    try {
      setMsgValue(e.currentTarget.value);

      if (e.currentTarget.value.trim().length > 0) {
        notifyTyping({
          variables: {
            senderEmail: session?.user?.email,
            receiverEmail: members.filter(
              user => user.accountDetails.email !== session?.user?.email
            )[0]?.accountDetails.email,
            message: 'TYPING',
            conversationId: conversationId,
          },
          context,
        });
      } else {
        notifyTyping({
          variables: {
            senderEmail: session?.user?.email,
            receiverEmail: members.filter(
              user => user.accountDetails.email !== session?.user?.email
            )[0]?.accountDetails.email,
            message: 'NOT_TYPING',
            conversationId: conversationId,
          },
          context,
        });
      }
    } catch (err) {} // eslint-disable-line
  };

  const onBlurMsgInput = () => {
    try {
      notifyTyping({
        variables: {
          senderEmail: session?.user?.email,
          receiverEmail: members.filter(
            user => user.accountDetails.email !== session?.user?.email
          )[0]?.accountDetails.email,
          message: 'NOT_TYPING',
          conversationId: conversationId,
        },
        context,
      });
    } catch (err) {} // eslint-disable-line
  };

  const HandleOnkeyChange = async function (event) {
    try {
      if (!event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        await sendChatMessage();
        await handleMarkReadMessage(conversationId);
      }
      if (event.ctrlKey && event.key === 'Enter') {
        setMsgValue(`${event.currentTarget.value}\n`);
        event.preventDefault();
      }
    } catch (err) {} // eslint-disable-line
  };

  return (
    <div className='flex flex-row justify-around gap-2 items-center h-20 w-full p-2'>
      <div className='h-full w-full'>
        <textarea
          name='messageInput'
          id='messageInput'
          onChange={e => onChangeMsgInput(e)}
          onBlur={() => onBlurMsgInput()}
          value={msgValue}
          onKeyDown={HandleOnkeyChange}
          className='focus:ring-indigo-500 resize-none focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md mr-5'
        />
      </div>
      <div className='flex'>
        <SendButtonChat
          type='submit'
          title='Send'
          onClick={async () => {
            await sendChatMessage();
            await handleMarkReadMessage(conversationId);
          }}
        />
      </div>
    </div>
  );
}

export default memo(SendMessageInput);
