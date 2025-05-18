import React from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import cn from 'classnames';
import parseHTML from 'html-react-parser';
import dayjs from 'dayjs';

import Button from '@root/components/button';

import {CalendarDaysIcon} from '@heroicons/react/20/solid';

const DefaultImage = '/icons/services/MEETING.svg';

const formatEventDate = date => dayjs(date).format('MMM. DD YYYY - h:mmA');

export default function EventCard({eventData, username, isVertical = false}) {
  const {t} = useTranslation('common');

  const router = useRouter();

  const isCompleted = eventData.eventStatus === 'CONCLUDED';

  const parsedContent = parseHTML(eventData?.serviceDescription || '');

  const handleClick = () => {
    if (isCompleted) {
      router.push('/users/?keywords=&tab=Events');
    } else {
      router.push(`/${username}/events/${eventData.serviceSlug}`);
    }
  };

  return (
    <div
      className={cn('bg-gray-100 p-3 flex flex-col sm:flex-row gap-3 rounded-lg', {
        'sm:flex-col': isVertical,
      })}
    >
      <div
        className={cn(
          'w-full sm:w-[40%] sm:min-h-[12rem] relative aspect-[16/9] flex-shrink-0 rounded-lg overflow-hidden',
          {
            'sm:!w-full sm:h-auto': isVertical,
          }
        )}
      >
        <Image
          src={eventData?.serviceImage ? eventData?.serviceImage : DefaultImage}
          alt='...'
          layout='fill'
          objectFit='fill'
        />
      </div>

      <div className='flex flex-col'>
        <div className='flex items-center gap-2'>
          <CalendarDaysIcon className='w-6 h-6' />
          <span className='text-xs text-mainText font-semibold'>
            {formatEventDate(eventData?.serviceDateTime ?? '')}
          </span>
          {isCompleted && (
            <span className='text-xs text-red-500 font-semibold'>{`(${t('ended')})`}</span>
          )}
        </div>

        <h1 className='text-xl font-bold text-mainText leading-tight line-clamp-1'>
          {eventData?.serviceTitle ?? ''}
        </h1>

        <p className='mt-1 text-sm text-mainText font-medium leading-tight line-clamp-3'>
          {parsedContent}
        </p>

        <span
          className={cn('my-2 text-xs text-red-500 font-semibold leading-tight invisible', {
            '!visible': isCompleted,
          })}
        >
          {t('event_expired_desc')}
        </span>

        <Button variant='solid' type='button' className='mt-auto w-fit' onClick={handleClick}>
          {!isCompleted ? t('attend_event') : t('browser_other_events')}
        </Button>
      </div>
    </div>
  );
}
