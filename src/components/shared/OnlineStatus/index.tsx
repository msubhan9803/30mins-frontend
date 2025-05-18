import {useEffect} from 'react';
import mutation from 'constants/GraphQL/LiveChat/mutations';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';

export default function OnlineStatusProvider() {
  const {data: session} = useSession();
  let interval: any = null;
  const [updateLastSeen] = useMutation(mutation.updateLastSeen, {
    context: {
      headers: {
        Authorization: session?.accessToken,
        'Content-Type': 'application/json',
      },
      skip: !session?.accessToken,
    },
  });

  const InternetErrMessagenger = async () => {
    await updateLastSeen();
  };

  useEffect(() => {
    InternetErrMessagenger();
    interval = setInterval(InternetErrMessagenger, 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div></div>;
}
