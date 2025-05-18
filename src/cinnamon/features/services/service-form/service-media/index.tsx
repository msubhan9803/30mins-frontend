import {useMutation} from '@apollo/client';
import {PhotoIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Files from 'react-files';
import toast from 'react-hot-toast';
import StepHeader from '../step-header';
import {IProps} from './constants';

export default function ServiceMedia({serviceType, setErrors, serviceImage, handleChange}: IProps) {
  //

  const {t} = useTranslation('common');
  const {data: session} = useSession();
  const [mutateFunction, {loading}] = useMutation(singleUpload);

  const uploadImage = async file => {
    try {
      if (loading === false) {
        if (file) {
          const response = await mutateFunction({
            variables: {
              file: file,
              accessToken: session?.accessToken,
            },
          });
          setErrors('serviceImage', undefined);
          handleChange('serviceImage', response.data.singleUpload.message);
        }
      }
    } catch (err) {
      if ([400, 409, 413, 404].includes(err.response?.status)) {
        setErrors('serviceImage', 'image_too_large');
      }
    }
  };

  const title = serviceType === 'EVENT' ? 'event_image_question' : 'service_image_question';
  const description =
    serviceType === 'EVENT' ? 'event_image_description' : 'service_image_description';

  return (
    <>
      <StepHeader
        question={t(title)}
        description={t(description)}
        icon={<PhotoIcon className='w-6 h-6' />}
      />

      <div className='relative'>
        {serviceImage && serviceImage.length > 0 && (
          <div
            className='p-2 z-40 absolute hover:text-red-500 border rounded-md bg-white right-1 top-1'
            onClick={() => {
              handleChange('serviceImage', null);
            }}
          >
            <XMarkIcon className='w-5 h-5' />
          </div>
        )}
        <Files
          id=''
          className='relative cursor-pointer flex items-center justify-center p-4 rounded-md font-medium text-mainBlue h-96 group border border-gray-200 shadow-lg'
          accepts={['.png', '.jpeg', '.jpg']}
          onChange={el => {
            try {
              if (el && el[0]) {
                uploadImage(el[0]);
              }
              // eslint-disable-next-line no-empty
            } catch (err) {}
          }}
          onError={el => {
            toast.error(el.message);
          }}
          multiple={false}
          maxFileSize={2000000}
          minFileSize={0}
          clickable
          htmlFor='file-upload'
        >
          {loading && (
            <div className='absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-75 flex justify-center items-center'>
              <svg
                className='custom_loader animate-spin -ml-1 mr-3 h-10 w-10 text-mainBlue'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            </div>
          )}
          {(!serviceImage || serviceImage === '') && !loading && (
            <div className='flex flex-grow justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-80 mx-4'>
              <div className='space-y-1 text-center'>
                <svg
                  className='mx-auto h-16 w-16 text-gray-400'
                  stroke='currentColor'
                  fill='none'
                  viewBox='0 0 48 48'
                  aria-hidden='true'
                >
                  <path
                    d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <div className='flex items-center justify-center text-lg text-mainBlue'>
                  <span>{t('upload_image')}</span>
                </div>
                <p className='text-sm text-gray-500'>{t('file_type')}</p>
              </div>
            </div>
          )}
          {serviceImage && serviceImage.length > 0 && (
            <>
              <img src={serviceImage} className='h-full' alt='' />
            </>
          )}
        </Files>
      </div>
    </>
  );
}
