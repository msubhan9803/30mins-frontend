import {createRef, useEffect, useState} from 'react';

import {GlobeAmericasIcon} from '@heroicons/react/24/outline';
import sanitizeHtml from 'sanitize-html';

const Publications = ({item}: {item: any}) => {
  const [show, setShow] = useState<boolean>(false);
  const [lineHeight, setLineHeight] = useState<number>(3);

  const ref = createRef<HTMLDivElement>();

  useEffect(() => {
    const divHeight = ref.current ? ref.current.offsetHeight : 0;
    const height = ref.current ? parseInt(getComputedStyle(ref.current).lineHeight, 10) : 0;
    const lines = Math.floor(divHeight / height);
    setLineHeight(lines);
  }, []);

  return (
    <li
      className='flex flex-col sm:flex-row gap-2 items-start bg-white mb-2 rounded-md py-3 px-4 w-full list-none overflow-hidden'
      key={item}
    >
      <div className={`w-36 h-36 justify-center text-center`}>
        {item.image && (
          <div className='w-36 h-36 rounded-md overflow-hidden'>
            <img
              className='w-full h-full object-cover object-center'
              src={item?.image}
              alt='avatar'
            />
          </div>
        )}
      </div>
      <div className={`flex flex-col justify-start items-start w-full h-full`}>
        {item.headline && (
          <h1
            title={item.headline}
            className='text-2xl font-bold text-gray-900 w-full break-all line-clamp-1'
          >
            {item.headline}
          </h1>
        )}
        <div className='w-max cursor-pointer'>
          <a href={item.url} className='w-ma' target='_blank' rel='noreferrer'>
            <GlobeAmericasIcon className='w-6 h-6' />
          </a>
        </div>
        <div
          className={`w-full break-all  ${lineHeight > 3 && 'line-clamp-3'}  ${
            show && 'line-clamp-none'
          } `}
          key='key'
          ref={ref}
        >
          {item.description && (
            <div
              className={`custom break-all`}
              dangerouslySetInnerHTML={{__html: sanitizeHtml(item.description)}}
            />
          )}
        </div>
        {lineHeight > 3 && (
          <div
            onClick={() => setShow(!show)}
            className='mt-1 text-black font-bold hover:underline cursor-pointer'
          >
            {show ? 'Hide' : 'More'}
          </div>
        )}
      </div>
    </li>
  );
};
export default Publications;
