import {XMarkIcon} from '@heroicons/react/24/outline';
import sanitizeHtml from 'sanitize-html';

export default function NotificationItem({NotifiMsg, onClose}) {
  return (
    <div
      className='w-full md:w-64 my-1 p-2 bottom-5 max-h-52 border-mainBlue bg-white 
      rounded-md shadow-md ring-2 ring-mainBlue h-max overflow-y-hidden'
    >
      <div className='flex flex-row items-center'>
        <span className='text-sm underline font-bold italic'>
          {NotifiMsg?.newMessage?.username}
        </span>
        <button
          title='close'
          onClick={onClose}
          className='text-mainBlue border-0 ml-auto 
          py-2 px-2 inline-flex justify-center text-sm 
          font-medium  underline active:no-underline'
        >
          <XMarkIcon className='text-white bg-red-500 rounded-md' width={25} height={25} />
        </button>
      </div>
      <div className='flex w-full h-full flex-row gap-2 justify-start items-start '>
        <div
          className='w-12 h-12 bg-cover rounded-full'
          style={{
            backgroundImage: `url(${
              NotifiMsg?.newMessage?.avatar || '/assets/default-profile.jpg'
            }`,
          }}
        ></div>
        <dd
          className='text-sm text-black font-semibold break-all h-min line-clamp-6'
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(NotifiMsg?.newMessage?.message),
          }}
        ></dd>
      </div>
    </div>
  );
}
