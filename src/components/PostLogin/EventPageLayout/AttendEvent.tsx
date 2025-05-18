/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';

import {UserGroupIcon} from '@heroicons/react/20/solid';

const formatEventDate = date => dayjs(date).format('MMM. DD YYYY - h:mmA');

export default function AttendEvent({serviceData, setFieldValue, eventUpcomingDates}) {
  const onAttendEvent = (event: any) => {
    setFieldValue('attendingDateTime', event.eventDateTime);
  };

  return (
    <div className='flex flex-col gap-3'>
      {eventUpcomingDates.map((item, i) => (
        <Event
          key={i}
          data={item}
          limit={serviceData.serviceAttendeeLimit}
          handleClick={onAttendEvent}
        />
      ))}
    </div>
  );
}

function Event({data, limit, handleClick}) {
  let status = '';

  if (data.attendeeCount === limit) status = 'FULL';
  else if (data.attendeeCount < limit && data.isAttending) status = 'ATTENDING';
  else status = 'ATTEND';

  return (
    <div className='max-w-sm flex items-center justify-between bg-gray-100 px-2 py-1.5 rounded-lg'>
      <p className='text-xs text-mainText font-semibold'>{formatEventDate(data.eventDateTime)}</p>

      <div className='flex items-center gap-3'>
        <button
          type='button'
          className={cn(
            'px-3 py-1.5 min-w-[90px] text-xs text-white font-semibold rounded-lg capitalize',
            {
              'bg-mainBlue': status === 'ATTEND',
              'bg-red-500  opacity-75 cursor-not-allowed': status === 'FULL',
              'bg-mainBlue opacity-75 cursor-not-allowed': status === 'ATTENDING',
            }
          )}
          disabled={status === 'ATTENDING' || status === 'FULL'}
          onClick={() => handleClick(data)}
        >
          {status}
        </button>

        <div className='flex items-center gap-1'>
          <UserGroupIcon className='w-5 h-5' />
          <span className='text-xs font-bold'>
            {data.attendeeCount}/{limit}
          </span>
        </div>
      </div>
    </div>
  );
}
