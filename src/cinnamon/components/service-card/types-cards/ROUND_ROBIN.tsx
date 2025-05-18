import {defaulteImage} from '@components/service-card/constants';
import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import Button from '@root/components/button';

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function ROUND_ROBIN({service}) {
  const {t} = useTranslation();
  return (
    <li
      className='grid overflow-hidden grid-cols-6 hover:shadow-2xl hover:shadow-inherit grid-rows-7 gap-2 grid-flow-row w-auto shadow-md overflow-y-auto border border-gray-200 p-4 rounded-lg'
      key={service.id}
    >
      <div className='row-start-1 col-span-2 row-span-1'>
        <img
          src={service?.image ? service?.image : defaulteImage.MEETING}
          alt='avatar'
          className='w-36 h-auto object-cover object-center rounded-lg'
        />
      </div>

      <div className='box col-start-3 col-span-4 w-full flex flex-col overflow-y-auto px-2'>
        <div className='flex justify-between'>
          <h2 className='text-sm md:text-md font-bold line-clamp-2 text-black'>{service.title}</h2>
          <h2 className='text-md font-bold text-mainBlue mr-1'>
            {service?.price > 0 ? `${service?.currency}${service?.price}` : t('event:Free')}
          </h2>
        </div>
        <p className='line-clamp-3 text-sm text-gray-500 font-bold'>
          {service?.userId?.personalDetails?.name ? `By ${service?.organizationId?.title}` : null}
        </p>
        <p className='line-clamp-4 md:line-clamp-6 text-xs md:text-sm'>
          {service.description ? (
            <div
              className={`custom break-words `}
              dangerouslySetInnerHTML={{__html: service.description}}
            />
          ) : null}
        </p>
      </div>

      <div className='col-span-3 place-items-center flex flex-col items-start justify-end'>
        <div className='flex items-center gap-2'>
          <span className='font-bold text-base sm:text-xl md:text-2xl text-mainBlue'>
            {service.duration}
          </span>
          <span className='font-medium'> minutes</span>
        </div>

        <div className='flex flex-row text-xs md:text-sm text-gray-500'>
          {service.attendeeLimit > 1
            ? `${t('common:group_meeting')} (${service.attendeeLimit})`
            : t('common:one_on_one')}
        </div>
      </div>

      <div className='col-span-2 col-start-5 flex items-end justify-end'>
        <Link href={`/org/${service.organizationId.slug}/${service?.slug}`} passHref={true}>
          <Button variant='solid'>{t('common:book_new')}</Button>
        </Link>
      </div>
    </li>
  );
}
