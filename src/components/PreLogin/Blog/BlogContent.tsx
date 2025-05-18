import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import parseHTML, {HTMLReactParserOptions, Element, domToReact} from 'html-react-parser';
import {LoaderIcon} from 'react-hot-toast';
import axios from 'axios';

import {BookmarkIcon} from '@heroicons/react/24/outline';

import blogsList from 'utils/blogList';
import BlogHeader from './BlogHeader';
import {IBlog} from './constants';

const removeTags = (str: string) => str?.replace(/<\/?[^>]+(>|$)/g, '')?.replace(/&nbsp;/gi, '');

export default function BlogContent({blogData}) {
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [loadingOtherBlogs, setLoadingOtherBlogs] = useState(true);

  const getOtherBlogs = async currentSlug => {
    try {
      const slugList = blogsList.filter(slug => slug !== currentSlug).splice(0, 5);

      const response = await axios.post('/api/other-blogs', {
        data: slugList,
      });

      setOtherBlogs(response?.data?.blogsData || []);
      setLoadingOtherBlogs(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getOtherBlogs(blogData?.slug);
  }, []);

  const options: HTMLReactParserOptions = {
    replace: domNode => {
      const typedDomNode = domNode as Element;

      if (typedDomNode.attribs && typedDomNode.name === 'p')
        return (
          <p className='text-base font-Karla text-[#707070] leading-tight word-break-cs'>
            {domToReact(typedDomNode.children, options)}
          </p>
        );

      if (typedDomNode.attribs && typedDomNode.name === 'h1')
        return (
          <h1 className='text-[2.5rem] font-Montserrat font-bold text-black leading-none word-break-cs'>
            {domToReact(typedDomNode.children, options)}
          </h1>
        );

      if (typedDomNode.attribs && typedDomNode.name === 'h2')
        return (
          <h2 className='text-[2rem] font-Montserrat font-bold text-black leading-none word-break-cs'>
            {domToReact(typedDomNode.children, options)}
          </h2>
        );

      if (typedDomNode.attribs && typedDomNode.name === 'h3')
        return (
          <h3 className='text-[1.75rem] font-Montserrat font-bold text-black leading-none word-break-cs'>
            {domToReact(typedDomNode.children, options)}
          </h3>
        );

      if (typedDomNode.attribs && typedDomNode.name === 'h4')
        return (
          <h4 className='text-[1.5rem] font-Montserrat font-bold text-black leading-none word-break-cs'>
            {domToReact(typedDomNode.children, options)}
          </h4>
        );

      if (typedDomNode.attribs && typedDomNode.name === 'h5')
        return (
          <h5 className='text-[1rem] font-Montserrat font-bold text-black leading-none word-break-cs'>
            {domToReact(typedDomNode.children, options)}
          </h5>
        );

      if (typedDomNode.attribs && typedDomNode.name === 'h6')
        return (
          <h6 className='text-[.75rem] font-Montserrat font-bold text-black leading-none word-break-cs'>
            {domToReact(typedDomNode.children, options)}
          </h6>
        );

      if (typedDomNode.attribs && typedDomNode.attribs.class === 'wp-block-button') {
        const child = typedDomNode.children[0] as Element;

        if (child.attribs.class.includes('wp-block-button__link')) {
          return (
            <div className='inline-block'>
              <a
                className='bg-black rounded-[2rem] text-white py-[15px] px-6 text-lg font-Karla font-normal cursor-pointer transition-opacity hover:opacity-70'
                href={child.attribs.href}
              >
                {domToReact(child.children, options)}
              </a>
            </div>
          );
        }

        return <div className='inline-block'>{domToReact(child.children, options)}</div>;
      }

      if (typedDomNode.attribs && typedDomNode.name === 'blockquote') {
        return (
          <blockquote className='black-quote-wrapper relative py-6 pl-20 font-Montserrat font-bold text-xl leading-6 text-black border-t border-t-[#e9ecef] border-b border-b-[#e9ecef]'>
            <BookmarkIcon className='absolute top-6 left-0 w-8 h-8 text-[#ced4da]' />
            {domToReact(typedDomNode.children, options)}
          </blockquote>
        );
      }

      if (typedDomNode.attribs && typedDomNode.name === 'ul') {
        return (
          <ul className='pl-10 list-disc text-base font-Karla font-normal text-[#707070] leading-tight'>
            {domToReact(typedDomNode.children, options)}
          </ul>
        );
      }

      if (typedDomNode.attribs && typedDomNode.name === 'a') {
        return (
          <a
            className='transition-colors text-black font-Karla font-normal leading-tight hover:text-[#A0A0A0]'
            href={typedDomNode.attribs.href}
          >
            {domToReact(typedDomNode.children, options)}
          </a>
        );
      }

      return null;
    },
  };

  const parsedContent = parseHTML(blogData?.content || '', options);

  return (
    <div>
      <BlogHeader blogData={blogData} />

      <div className='mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 break-all'>
        <div className='blog-content-wrapper md:col-span-8'>{parsedContent}</div>

        <div className='md:ml-4 md:col-start-9 md:col-end-13 '>
          <h3 className='text-lg font-bold text-center text-mainText'>Other Blogs</h3>

          {loadingOtherBlogs ? (
            <div className='flex flex-row justify-center mt-8'>
              <LoaderIcon style={{width: 25, height: 25}} className='mr-2' />
            </div>
          ) : (
            <div className='mt-6 flex flex-col gap-4'>
              {otherBlogs.map((item: IBlog, index) => (
                <Link key={index} href={`/blog/${item?.slug}`} passHref>
                  <a className='flex items-center gap-2 cursor-pointer group pb-1 border-b border-gray-100'>
                    <div className='flex-shrink-0 w-12 h-12 relative rounded overflow-hidden border border-gray-100'>
                      <Image
                        src={item?.featuredImage?.node?.sourceUrl}
                        alt='...'
                        layout='fill'
                        objectFit='cover'
                      />
                    </div>
                    <p className='text-sm font-medium text-mainText group-hover:text-mainBlue'>
                      {removeTags(item?.title || '')}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
