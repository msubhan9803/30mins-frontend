import useTranslation from 'next-translate/useTranslation';
import Button from '@root/components/button';
import React from 'react';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';
import {defaulteImage, IPropsCard} from '../constants';

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function PART_TIME_JOB({service, username}: IPropsCard) {
  const {t} = useTranslation();
  return (
    <li
      className='grid overflow-hidden grid-cols-6 hover:shadow-2xl hover:shadow-inherit grid-rows-7 gap-2 grid-flow-row w-auto shadow-md overflow-y-auto border border-gray-200 p-4 rounded-lg'
      key={service.id}
    >
      <div className='row-start-1 col-span-2 row-span-1'>
        <img
          src={service?.image ? service?.image : defaulteImage.PART_TIME_JOB}
          alt='avatar'
          className='w-36 h-auto object-cover object-center rounded-lg'
        />
      </div>

      <div className='box col-start-3 col-span-4 w-full flex flex-col overflow-y-auto px-2'>
        <div className='flex justify-between'>
          <h2 className='text-sm md:text-md font-bold line-clamp-2 text-black'>{service.title}</h2>
          <h2 className='text-md font-bold text-mainBlue mr-1'></h2>
        </div>
        <p className='line-clamp-3 text-sm text-gray-500 font-bold'>
          {service?.userId?.personalDetails?.name
            ? `By ${service?.userId?.personalDetails?.name}`
            : null}
          {service?.userId?.personalDetails?.headline
            ? `, ${service?.userId?.personalDetails?.headline}`
            : null}
        </p>
        <p className='line-clamp-4 md:line-clamp-6 text-xs md:text-sm'>
          {service.description ? (
            <div
              className={`custom break-words `}
              dangerouslySetInnerHTML={{__html: sanitizeHtml(service.description)}}
            />
          ) : null}
        </p>
      </div>

      <div className='col-span-3 col-start-1 place-items-center flex justify-start items-end gap-1'>
        <span className='font-bold text-sm md:text-md'>{t('common:available_for')}</span>
        <span className='font-bold text-sm md:text-md text-mainBlue'>
          {' '}
          Part {t('common:time_job')}
        </span>
      </div>

      <div className='col-span-2 col-start-5 flex items-end justify-end'>
        <Link href={`/${username}/${service?.slug}`} passHref={true}>
          <Button variant='solid'>{t('common:hire_me')}</Button>
        </Link>
      </div>
    </li>
  );
}
