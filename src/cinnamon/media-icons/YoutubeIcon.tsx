import React from 'react';

export default function YoutubeIcon({link = undefined}: {link?: string}) {
  return link ? (
    <a
      href={link.startsWith('http') ? link : `https://${link}`}
      target='_blank'
      rel='noreferrer'
      className='bg-[#FF0000] flex justify-center items-center rounded-full w-[24px] h-[24px]'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
        role='img'
        width='1em'
        className='w-4 h-4 text-white'
        height='1em'
        preserveAspectRatio='xMidYMid meet'
        viewBox='0 0 24 24'
      >
        <path
          fill='currentColor'
          fillRule='evenodd'
          d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
          clipRule='evenodd'
        />
      </svg>
    </a>
  ) : (
    <div className='bg-[#FF0000] flex justify-center items-center rounded-full w-[24px] h-[24px]'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
        role='img'
        width='1em'
        className='w-4 h-4 text-white'
        height='1em'
        preserveAspectRatio='xMidYMid meet'
        viewBox='0 0 24 24'
      >
        <path
          fill='currentColor'
          fillRule='evenodd'
          d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
          clipRule='evenodd'
        />
      </svg>
    </div>
  );
}
