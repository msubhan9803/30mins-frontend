import React, {useCallback, useEffect, useRef, useState} from 'react';
import queries from 'constants/GraphQL/LiveChat/queries';
import {useSession} from 'next-auth/react';
import {useLazyQuery} from '@apollo/client';
import dayjs from 'dayjs';
import lodash from 'lodash';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {InitConv, IsetValue} from './constants';
import MessageItem from './features/message-item';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Messages({
  conversationId,
  v,
  setValue,
  ...rest
}: {
  v: InitConv;
  conversationId;
  senderAvatar;
  ReceiverAvatar;
  ReceiverName;
  setValue: IsetValue;
}) {
  const {data: session} = useSession();
  const refList = useRef<any>(null);
  const [countPage, setcountPage] = useState(2);
  const [hasMore, setHasMore] = useState(v.AllMessages?.length! > 0);
  const [msgs, setMsgs] = useState<any>([]);
  const [Moremsgs, setMoreMsgs] = useState<any>([]);

  const [ReadMore, {loading: ReadMoreLoading}] = useLazyQuery(queries.getAllMsgsByConversationId, {
    variables: {
      conversationId,
      paginationArgs: {
        pageNumber: countPage,
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
  });
  useEffect(() => {}, [conversationId]);

  const handleReadMore = async () => {
    const {data} = await ReadMore({
      variables: {
        conversationId,
        paginationArgs: {
          pageNumber: countPage,
          resultsPerPage: 25,
        },
      },
    });

    if (data?.getAllMsgsByConversationId?.messages?.length > 0) {
      await setMoreMsgs(
        lodash
          .union(Moremsgs, data.getAllMsgsByConversationId.messages)
          .map((el: any) => ({...el, sent: true, sendMessage: undefined}))
      );
      await setMsgs(
        lodash.union(msgs, Moremsgs).map((el: any) => ({...el, sent: true, sendMessage: undefined}))
      );
      setHasMore(true);
    } else {
      setHasMore(false);
    }
  };
  const persistScrollPos = () => {
    refList.current.scrollTo(0, 1996);
  };
  useEffect(() => {
    handleReadMore();
  }, [countPage]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastBookElementRef = useCallback(
    node => {
      if (ReadMoreLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async entries => {
        if (entries[0].isIntersecting && hasMore) {
          if (v.AllMessages?.length! >= 25) {
            await setcountPage(countPage + 1);
            await handleReadMore();
          }
          persistScrollPos();
        }
      });
      if (node) observer?.current.observe(node);
    },
    [ReadMoreLoading, hasMore]
  );

  const scrollToBottom = () => {
    refList.current.scrollTo(0, refList.current.scrollHeight);
  };

  useEffect(() => {
    scrollToBottom();
  }, [v.AllMessages]);

  // useEffect(() => {
  // if (v.AllMessages) {
  //   setMsgs(lodash.union(v.AllMessages, msgs).map(el => ({...el, sent: true,sendMessage:undefined})));
  // }
  // }, [v.AllMessages]);

  // useEffect(() => {
  //   if (conversationId) {
  //     scrollToBottom();
  //   }
  // }]);

  return (
    <div
      ref={refList}
      className='h-full flex flex-col p-2 gap-5 overflow-y-overlay w-full overflow-x-hidden'
    >
      {ReadMoreLoading && (
        <div className='text-sm font-bold italic text-mainBlue w-full flex justify-center items-center text-center h-10'>
          <svg
            className='custom_loader animate-spin -ml-1 mr-3 h-10 w-10 text-mainBlue'
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
      )}
      {Object.values(Moremsgs)
        .reverse()
        .map((msg: any, index) => {
          if (index === 1) {
            return <MessageItem refernce={lastBookElementRef} msg={msg} key={msg._id} {...rest} />;
          }
          return <MessageItem refernce={null} msg={msg} key={msg._id + index} {...rest} />;
        })}
      {v.AllMessages &&
        Object?.values(lodash.union(v.AllMessages.filter(el => el.createdAt)))
          .reverse()
          .map((msg: any, index) => (
            <MessageItem refernce={null} msg={msg} key={msg._id + index} {...rest} />
          ))}
    </div>
  );
}
