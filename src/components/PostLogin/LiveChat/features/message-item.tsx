import {memo, useContext, useState, useEffect} from 'react';
import {UserContext} from '@root/context/user';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import sanitizeHtml from 'sanitize-html';
import dayjs from 'dayjs';
// import {LoaderIcon} from 'react-hot-toast';
// import {XCircleIcon} from '@heroicons/react/24/outline';

dayjs.extend(utc);
dayjs.extend(timezone);

const MessageItem = ({
  refernce,
  msg,
  senderAvatar,
  ReceiverAvatar,
  ReceiverName,
}: {
  refernce: any;
  msg: any;
  senderAvatar?: any;
  ReceiverAvatar?: any;
  ReceiverName?: any;
}) => {
  const {user} = useContext(UserContext);
  const [first, setfirst] = useState(false);
  // const [loading, setloading] = useState(false);

  // useEffect(() => {}, [loading]);

  useEffect(() => {
    setTimeout(() => {
      setfirst(true);
    }, 5000);
  });

  useEffect(() => {
    if (!first) {
      setTimeout(() => {
        setfirst(true);
      }, 5000);
    }
  }, [first]);

  // const onSendingMsg = async () => {
  //   try {
  //     setfirst(false);
  //     setloading(true);
  //     await msg?.sendMessage();
  //     setloading(false);
  //   } catch (err) {} // eslint-disable-line
  // };

  return (
    <div ref={refernce} className='flex flex-row items-start p-2 gap-2 w-full'>
      <img
        alt=''
        src={
          msg?.senderEmail === user?.email
            ? senderAvatar || '/assets/default-profile.jpg'
            : ReceiverAvatar || '/assets/default-profile.jpg'
        }
        className='rounded-full w-9 h-9 shadow-md object-contain object-center'
      />
      <div className='flex flex-col w-full'>
        <div className='flex flex-row items-end gap-2'>
          <label className='text-base leading-none font-bold'>
            {msg?.senderEmail === user?.email ? 'Me' : ReceiverName}
          </label>
          <label className='text-xs leading-none text-gray-500 font-medium'>
            {dayjs(Number(msg?.createdAt)).tz(user?.timezone).format('DD MMMM, hh:mmA')}
          </label>
          {/* {msg?.sent === false && first === false && loading && (
            <LoaderIcon style={{borderRightColor: '#195', width: 16, height: 16}} />
          )}
          {msg?.sent === false && first === true && (
            <XCircleIcon onClick={onSendingMsg} style={{width: 18}} className='stroke-red-500' />
          )} */}
        </div>
        <div className='flex flex-col mt-1 w-full break-words'>
          <dd
            className={'h-max w-11/12 text-sm font-normal leading-5 text-gray-600 break-words'}
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(msg?.message),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(MessageItem);
