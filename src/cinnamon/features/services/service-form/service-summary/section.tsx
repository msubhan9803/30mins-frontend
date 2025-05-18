import useTranslation from 'next-translate/useTranslation';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import classnames from 'classnames';
import {PencilSquareIcon} from '@heroicons/react/24/outline';

dayjs.extend(duration);

export default function Section({title, content, setStep}) {
  return (
    <div className='flex flex-col rounded-md border border-b-gray-200 mb-6 last:mb-0'>
      <div className='flex p-4 border-b font-medium text-gray-500 bg-gray-100 bg-opacity-60 border-gray-200 justify-between'>
        <h2 className=''>{title}</h2>
        <button onClick={setStep} className='text-gray-500 hover:text-mainBlue'>
          <PencilSquareIcon className='w-6 h-6' />
        </button>
      </div>
      <div className='p-4'>{content}</div>
    </div>
  );
}

export function MiniSection({title, content, wrapperClassName = ''}) {
  return (
    <div
      className={classnames(
        'flex border-b border-gray-200 pb-3 mb-3 last:border-b-0 last:mb-0 gap-2 min-[428px]:gap-0',
        wrapperClassName
      )}
    >
      <span className={'w-1/4 text-sm text-gray-700 font-bold break-words'}>{title}</span>
      <span className='w-3/4 text-sm text-gray-600 italic font-semibold break-all'>{content}</span>
    </div>
  );
}

export function TimeSection({day}) {
  const {t} = useTranslation('common');

  return (
    <div className='flex flex-col'>
      <div>{day.isActive ? t('enabled') : t('disabled')}</div>
      <div className='flex flex-col'>
        {day.hours.map((hour, index) => (
          <div className='flex flex-wrap gap-1 sm:gap-0 sm:space-x-3 mt-2' key={index}>
            <div className='flex border border-gray-200 rounded-md'>
              <span className='py-2 px-4'>{t('start_time')}</span>
              <span className='py-2 px-4 border-l border-gray-200'>
                {dayjs.duration(hour.start, 'minutes').format('HH:mm')}
              </span>
            </div>
            <div className='flex border border-gray-200 rounded-md'>
              <span className='py-2 px-4'>{t('stop_time')}</span>
              <span className='py-2 px-4 border-l border-gray-200'>
                {dayjs.duration(hour.end, 'minutes').format('HH:mm')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
