import IconX from '@root/components/icon-x';
import {FormikErrors, FormikTouched} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import Files from 'react-files';
import toast from 'react-hot-toast';

type Props = {
  title?: string;
  description?: string;
  uploadText?: string;
  imagePath?: any;
  resetImage: () => void;
  handleChange?: (e: any) => void;
  errors?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[];
};
function UploadImage({imagePath, resetImage, handleChange}: Props) {
  const {t} = useTranslation();
  return (
    <>
      <div className='row ml-1 w-full'>
        <div className=''>
          <div className='mt-1 position-relative w-full'>
            {imagePath ? (
              <div className='relative flex'>
                <label className='relative w-full flex justify-center items-center'>
                  <IconX
                    onClick={resetImage}
                    className='absolute right-1 top-1 border rounded-full cursor-pointer hover:border-red-500 hover:text-red-500'
                  />
                  <div className='w-36 h-36 rounded-md overflow-hidden'>
                    <img
                      className='w-full h-full object-contain object-center'
                      src={imagePath}
                      width='256px'
                      height='256px'
                      alt=''
                    />
                  </div>
                </label>
              </div>
            ) : (
              <>
                <Files
                  id=''
                  className='w-full flex justify-center items-center pr-1 sm:pr-0'
                  accepts={['.png', '.jpeg', '.jpg']}
                  onChange={el => {
                    try {
                      if (el && el[0]) {
                        handleChange!(el[0]);
                      }
                      // eslint-disable-next-line no-empty
                    } catch (err) {}
                  }}
                  onError={() => {
                    toast.error(t(`common:txt_valid_upload_image_2mb`));
                  }}
                  multiple={false}
                  maxFileSize={2000000}
                  minFileSize={0}
                  clickable
                >
                  <label className='flex flex-col w-full h-32 border-4 justify-center items-center border-blue-200 border-dashed hover:bg-gray-100'>
                    <div className='flex flex-col items-center justify-center pt-7'>
                      <svg
                        className='mx-auto h-12 w-12 text-gray-400'
                        stroke='currentColor'
                        fill='none'
                        viewBox='0 0 48 48'
                        aria-hidden='true'
                      >
                        <path
                          d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <p className='pt-1 text-sm tracking-wider  text-gray-400 group-hover:text-gray-600'>
                        {t('common:Allowed')} *.jpeg, *.jpg, *.png{' '}
                        <p className='flex justify-center items-center'>
                          {t('common:Max size of')} 2 MB 256 x 256
                        </p>
                      </p>
                    </div>
                  </label>
                </Files>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default UploadImage;
