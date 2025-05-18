import {SERVICE_TYPES} from 'constants/enums';
import useTranslation from 'next-translate/useTranslation';
import {useState} from 'react';
import sanitizeHtml from 'sanitize-html';

export default function CartHeader({serviceData, serviceType}) {
  const [show, setShow] = useState<boolean>(false);
  const {t} = useTranslation();

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col md:flex-row justify-between gap-2 w-full'>
        <div>
          <span title={serviceData?.title} className='font-bold text-2xl md:text-4xl'>
            {serviceData?.title?.length > 15
              ? `${serviceData?.title.substring(0, 15).trim()}...`
              : serviceData?.title}
          </span>
        </div>
        <div>
          <p className='font-bold text-xl md:text-2xl text-right '>
            {' '}
            {t('common:available_for_hire')}
          </p>
          <p className='text-right text-gray-500'>
            {serviceType === SERVICE_TYPES.PART_TIME_JOB && t('common:part_time_job')}
            {serviceType === SERVICE_TYPES.FULL_TIME_JOB && t('common:full_time_job')}
          </p>
        </div>
      </div>
      <div className='w-full flex-1'>
        <div className={`w-full ${show ? '' : 'line-clamp-3'}`}>
          <span className='text-xl font-semibold'>{`${t('common:Description')}: `}</span>
          {serviceData?.description && (
            <div
              className={`custom break-words text-sm m-0 mb-2`}
              dangerouslySetInnerHTML={{__html: sanitizeHtml(serviceData?.description)}}
            ></div>
          )}
        </div>
        {serviceData?.description.length > 420 && (
          <div
            onClick={() => setShow(!show)}
            className='mt-1 text-black font-bold hover:underline cursor-pointer'
          >
            {show ? 'Hide' : 'More'}
          </div>
        )}
      </div>
    </div>
  );
}
