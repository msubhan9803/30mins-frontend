import React, {useContext, useEffect} from 'react';
import {useSubscription} from '@apollo/client';
import subscription from 'constants/GraphQL/LiveChat/subscription';
import {useSession} from 'next-auth/react';
import {toast} from 'react-hot-toast';
import {UserContext} from '@root/context/user';
import NotificationItem from './notification-item';

const NotificationMessage = () => {
  const {data: session} = useSession();
  const {setUnreadMessageCount} = useContext(UserContext);

  const {loading: NotifiMsgLoadding, data: NotifiMsg} = useSubscription(subscription.newMessage, {
    variables: {
      email: session?.user?.email,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    skip: !session?.accessToken || !session?.user?.email,
  });

  useEffect(() => {
    if (
      !NotifiMsgLoadding &&
      NotifiMsg &&
      NotifiMsg?.newMessage?.message &&
      session?.user?.email === NotifiMsg?.newMessage?.receiverEmail
    ) {
      setUnreadMessageCount(NotifiMsg?.newMessage.unreadMessageCount);
      if (!NotifiMsg?.newMessage?.blocked?.includes(session?.user?.email)) {
        toast.custom(t => (
          <NotificationItem NotifiMsg={NotifiMsg} onClose={() => toast.remove(t.id)} />
        ));
      }
    }
  }, [NotifiMsg?.newMessage, NotifiMsgLoadding]);

  return <></>;
};

export default NotificationMessage;
