import Head from 'next/head';
import {useEffect, useState} from 'react';
import classNames from 'classnames';
import {useSession} from 'next-auth/react';
import {useQuery} from '@apollo/client';
import queries from 'constants/GraphQL/LiveChat/queries';

export default function ConversationHeader(
  this: any,
  {username, name, email, v, showConversations, typing}
) {
  const {data: session} = useSession();
  const [Online, setOnline] = useState(undefined);
  useEffect(() => {}, [typing, v.conversationId]);
  const {data, refetch} = useQuery(queries.getLastSeen, {
    variables: {
      email: email,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
  });

  let interval;
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
    <div className='relative flex flex-row items-center p-4 h-20 border-b'>
      <Head>
        <title>{name}</title>
      </Head>
      <div className='w-full flex flex-col pl-2 my-auto justify-center items-start'>
        <a href={`${window?.location?.origin}/${username}`}>
          <span className='text-md underline font-semibold line-clamp-1'>{name}</span>
        </a>
        {typing ? (
          <span className='text-sm font-bold text-mainBlue'>{'typing...'}</span>
        ) : (
          <>
            <span
              className={classNames([
                'text-sm font-bold ',
                Online ? 'text-mainBlue' : 'text-mainText',
              ])}
            >
              {Online ? 'Online' : 'Offline'}
            </span>
          </>
        )}
      </div>
      <button
        className='block md:hidden absolute right-4 top-auto bottom-auto active:ring-2 active:ring-offset-2 active:ring-mainBlue rounded-md shadow-md bg-mainText text-white active:text-mainBlue text-base font-semibold py-2 px-4'
        onClick={() => showConversations()}
      >
        Back
      </button>
    </div>
  );
}
