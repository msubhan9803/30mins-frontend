import React, {useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import sanitizeHtml from 'sanitize-html';

export default function EventInfo({serviceData}) {
  const [show, setShow] = useState<boolean>(false);
  const {t} = useTranslation();

  return (
    <div className='flex flex-col gap-1 p-4'>
      <div className='flex w-full flex-col md:flex-row-reverse gap-2'>
        <div className='flex flex-col text-left gap-1 w-full'>
          <span
            title={serviceData?.serviceTitle}
            className='font-bold text-3xl h-max pb-2 break-all line-clamp-1'
          >
            {serviceData?.serviceTitle}
          </span>

          <span className='text-xl text-gray-600 font-bold'>
            {t('common:Meeting_Duration')}: {serviceData.serviceDuration} {t('common:txt_mins')}
          </span>
        </div>
      </div>

      <div className={`w-full ${show ? '' : 'line-clamp-3'}`}>
        {serviceData?.serviceDescription && (
          <div
            className={`custom break-words text-sm`}
            dangerouslySetInnerHTML={{__html: sanitizeHtml(serviceData?.serviceDescription)}}
          />
        )}
      </div>

      {serviceData?.serviceDescription?.length > 420 && (
        <div
          onClick={() => setShow(!show)}
          className='mt-1 text-black font-bold hover:underline cursor-pointer'
        >
          {show ? 'Hide' : 'More'}
        </div>
      )}
    </div>
  );
}
