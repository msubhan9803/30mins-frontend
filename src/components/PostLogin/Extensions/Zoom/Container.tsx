// import Button from '@root/components/button';
import {FieldError} from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import {XMarkIcon} from '@heroicons/react/20/solid';

const Container = ({zoomCredentials, deleteZoom, errors}) => {
  const {t} = useTranslation();

  const isFirst = index => index === 0;

  return (
    <>
      <div className='grid overflow-hidden grid-cols-1 md:grid-cols-2 grid-rows-2 gap-6'>
        <div className='box'>
          <div className='bg-white shadow-lg overflow-hidden rounded-lg mb-4'>
            <div className='d-flex mt-10'>
              <div className=' ml-4'>
                <div className='mb-2 mt-1'>
                  <span className='font-24 font-bold'>{t('common:txt_zoom_account')}</span>
                  <br />
                </div>
                {zoomCredentials !== null && zoomCredentials.length > 0 ? (
                  <div className='mt-2 d-flex'>
                    <span className='font-15 font-medium'>{t('setting:txt_connected')}</span>
                  </div>
                ) : (
                  <div className='mt-2 d-flex'>
                    <span className='text-2xl font-normal text-red-600'>
                      {t('common:txt_not_connected')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <ul className='mt-4'>
              {zoomCredentials !== null &&
                zoomCredentials?.length > 0 &&
                zoomCredentials?.map((email, key) => (
                  <li key={key}>
                    <div className='flex items-center gap-2 px-4'>
                      <p className='font-medium text-black truncate '>
                        {email}
                        {isFirst(key) && (
                          <span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mainBlue text-white'>
                            Primary
                          </span>
                        )}
                      </p>
                      <XMarkIcon
                        width={22}
                        height={22}
                        className='border cursor-pointer border-red-500 rounded-full text-red-500 active:bg-red-500 active:text-white'
                        onClick={() => deleteZoom(email)}
                      />
                    </div>
                  </li>
                ))}
            </ul>

            <div className='p-4 gap-4 flex items-start flex-col justify-start'>
              <button
                role='button'
                className='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700  border rounded-lg border-gray-700 flex items-center w-50'
                disabled={zoomCredentials?.length > 0}
              >
                <a
                  href={
                    zoomCredentials?.length > 0
                      ? '#'
                      : `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID}&redirect_uri=https%3A%2F%2F30mins.com%2Fuser%2Fextensions%2Fzoom`
                  }
                  className='text-base font-medium flex flex-row gap-4 py-3.5 px-4'
                >
                  <img src='https://30mins.com/assets/zoomLogo.png' alt='' height={24} width={24} />
                  {t('common:txt_zoom_integration')}
                </a>
              </button>
              {errors && (
                <FieldError position='center' className='mt-0 ml-0 mr-0' message={errors} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Container;
