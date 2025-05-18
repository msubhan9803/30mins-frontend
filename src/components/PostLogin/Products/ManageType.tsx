import useTranslation from 'next-translate/useTranslation';
import {toast} from 'react-hot-toast';
import {FieldError} from '@root/components/forms/error';
import Field from '@components/forms/field';

import Files from 'react-files';
import {XCircleIcon} from '@heroicons/react/24/outline';

export default function ManageType({values, errors, setFieldValue, handleChange}) {
  const {t} = useTranslation('common');
  return (
    <>
      <Field
        label={t('File')}
        error={errors?.file && <FieldError message={errors.file} />}
        isEditor
        className='w-full h-full relative'
      >
        <Files
          id=''
          className='cursor-pointer w-full flex p-4 rounded-md font-medium text-mainBlue h-20 group border border-dashed border-gray-200'
          onChange={el => {
            try {
              if (el && el[0]) {
                setFieldValue('file.name', el[0].name);
                setFieldValue('attachedFile', el[0]);
              }
              // eslint-disable-next-line no-empty
            } catch (err) {}
          }}
          onError={el => {
            toast.error(el.message);
          }}
          multiple={false}
          maxFileSize={16000000}
          minFileSize={0}
          clickable
          htmlFor='file-upload'
        >
          {values.file?.name ? (
            <div className='w-full flex justify-center items-center gap-1'>{values.file.name}</div>
          ) : (
            <div className='w-full flex justify-center items-center'>
              {t('Click/drag to upload the digital product')}
            </div>
          )}
        </Files>
        {values.file?.name && (
          <XCircleIcon
            className='absolute w-6 right-0 top-1/4 hover:bg-red-500 hover:text-white rounded-full cursor-pointer text-red-500'
            onClick={() => {
              setFieldValue('file.name', null);
              setFieldValue('file.link', null);
              setFieldValue('attachedFile', undefined);
            }}
          />
        )}
      </Field>
      <Field
        label={t('Response Text')}
        error={errors?.file && <FieldError message={errors.file} />}
        isEditor
        className='w-full h-full'
      >
        <textarea
          value={values.resText}
          placeholder={'Thank you purchasing. (Please change this message as you wish)'}
          name='resText'
          className='focus:ring-mainBlue mt-auto resize-none focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          style={{
            height: '80px',
          }}
          onChange={handleChange}
        />
      </Field>
    </>
  );
}
