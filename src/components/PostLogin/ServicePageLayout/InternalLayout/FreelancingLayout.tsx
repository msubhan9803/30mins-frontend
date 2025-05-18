import React, {useState} from 'react';

import useTranslation from 'next-translate/useTranslation';
import sanitizeHtml from 'sanitize-html';

const FreelancingLayout = ({serviceData}) => {
  const [show, setShow] = useState<boolean>(false);

  const {t} = useTranslation();

  return (
    <div className='xl:w-3/5 lg:w-3/5'>
      <div className='px-3 py-2 text-sm w-full'>
        <span className='font-bold text-4xl' title={serviceData?.title}>
          {serviceData?.title}
        </span>
        <div className='flex text-xl text-left'>
          <span>{`${t('common:price')}:`}</span>
          {serviceData.price > 0 ? (
            <span className='text-xl'>
              {serviceData.currency}
              {serviceData.price} &nbsp;&nbsp;
            </span>
          ) : (
            <span className='text-xl'>&nbsp; Free</span>
          )}
        </div>

        <div className='flex text-xl text-left'>
          <span className='text-xl'>
            {t('common:Meeting_Duration')}: {serviceData.duration} {t('common:txt_mins')}
          </span>
        </div>

        <div className={`w-full ${show ? '' : 'line-clamp-3'}`}>
          <span className='text-xl'>{`${t('common:Description')}: `}</span>
          {serviceData?.description ? (
            <div
              className={`custom break-words text-sm m-0`}
              dangerouslySetInnerHTML={{__html: sanitizeHtml(serviceData?.description)}}
            ></div>
          ) : null}
        </div>
        {serviceData?.description.length > 420 ? (
          <div
            onClick={() => setShow(!show)}
            className='mt-1 text-black font-bold hover:underline cursor-pointer'
          >
            {show ? 'Hide' : 'More'}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FreelancingLayout;
