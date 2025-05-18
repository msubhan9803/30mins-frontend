import Image from 'next/image';
import Link from 'next/link';
import {IPropsBlogCard} from './constants';

const removeTags = (str: string) => str.replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/gi, '');

export default function BlogCard({data}: IPropsBlogCard) {
  return (
    <Link href={`/blog/${data?.slug}`} passHref>
      <a className='group p-4 rounded-lg shadow-lg border border-[rgb(219_219_219)] cursor-pointer'>
        <div className='relative rounded-lg overflow-hidden aspect-[16/9] mb-5 border border-gray-100'>
          <Image
            className='group-hover:scale-110 duration-500'
            src={data?.featuredImage?.node?.sourceUrl}
            alt={data?.slug}
            layout='fill'
            objectFit='cover'
            unoptimized
          />
        </div>

        <div className='flex items-center flex-wrap gap-2'>
          {data?.categories?.nodes?.map((item, i) => (
            <span
              key={i}
              className='text-[rgb(85_33_181)] bg-[rgb(237_235_254)] text-xs font-semibold py-0.5 px-2.5 rounded'
            >
              {item.name}
            </span>
          ))}
        </div>

        <div className='text-lg h-16 min-h-16'>
          <h2 className='text-mainText tracking-tight font-bold text-lg my-2 group-hover:text-mainBlue line-clamp-2'>
            {removeTags(data?.title || '')}
          </h2>
        </div>
        <p className='text-[rgb(107_114_128)] font-light line-clamp-3 text-sm mb-4'>
          {removeTags(data?.content || '')}
        </p>
        <div className='flex items-center'>
          <div className='w-10 h-10 relative overflow-hidden rounded-full border border-gray-100'>
            <Image
              src={data?.author?.node?.avatar?.url || '/assets/default-profile.jpg'}
              alt={data?.author?.node?.name}
              unoptimized
              objectFit='cover'
              layout='fill'
            />
          </div>
          <div className='ml-4'>
            <p className='text-mainText font-medium text-sm leading-tight'>
              {data?.author?.node?.name}
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
}
