import React from 'react';
import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';

export default function BlogHeader({blogData}) {
  return (
    <div className='relative rounded-2xl overflow-hidden'>
      {blogData?.featuredImage?.node?.sourceUrl ? (
        <div>
          <div className='absolute bottom-10 lg:bottom-20 z-10 w-full flex items-end sm:items-center justify-between pt-4 lg:py-4 pl-6 pr-4 pb-6 sm:pr-6 lg:px-10 lg:py-0 bg-black bg-opacity-70 flex flex-row'>
            <div className='text-base sm:text-[1.75rem] md:text-[2.5rem] lg:text-[2.75rem] text-white leading-tight w-full z-10'>
              <h1
                className='text-white px-0 py-0 font-Montserrat font-bold text-[1.5rem] sm:text-[2.5rem] leading-tight'
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(blogData?.title || ''),
                }}
              />
            </div>
            <div className='flex items-center'>
              <div className='w-12 h-12 relative overflow-hidden rounded-full border border-gray-100'>
                <Image
                  src={blogData?.author?.node?.avatar?.url || '/assets/default-profile.jpg'}
                  alt={blogData?.author?.node?.name || ''}
                  unoptimized
                  objectFit='cover'
                  layout='fill'
                />
              </div>
              <div className='ml-4'>
                <p className='text-white font-medium text-base m-0'>
                  {blogData?.author?.node?.name || ''}
                </p>
              </div>
            </div>
          </div>
          <div className='relative aspect-[16/9] md:aspect-[21/9]'>
            <Image
              src={blogData?.featuredImage?.node?.sourceUrl || '/assets/default-blog.jpg'}
              alt={blogData?.title || ''}
              layout='fill'
              objectFit='cover'
            />
          </div>
        </div>
      ) : (
        <div>
          <div className='text-[1.5rem] sm:text-[1.75rem] md:text-[2.5rem] lg:text-[2.75rem] text-white leading-tight w-full z-10 pb-4'>
            <h1
              className='text-black px-0 py-0'
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(blogData?.title || ''),
              }}
            />
          </div>
          <div className='flex items-center'>
            <div className='w-12 h-12 relative overflow-hidden rounded-full border border-gray-100'>
              <Image
                src={blogData?.author?.node?.avatar?.url || '/assets/default-profile.jpg'}
                alt={blogData?.author?.node?.name || ''}
                unoptimized
                objectFit='cover'
                layout='fill'
              />
            </div>
            <div className='ml-4'>
              <p className='text-black font-medium text-base m-0'>
                {blogData?.author?.node?.name || ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
