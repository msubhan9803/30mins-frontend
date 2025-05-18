import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';

const PreStepOne = ({handleClick}) => {
  const {t} = useTranslation();

  const handleNext = () => {
    handleClick();
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 sm:mt-16 mx-2 md:mx-8'>
      <div className='grid grid-cols-1 sm:grid-cols-1 gap-0 mt-0 mx-4 col-span-3'>
        <div className='text-center'>
          <h1 className='text-3xl font-extrabold text-gray-900 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-4xl'>
            {t('common:welcome_1_0')}
            {t(' ')}
            <span className='text-mainBlue'>{t('common:welcome_1_joining')}</span>
            {t(' ')}
            {t('common:welcome_1_1')}
          </h1>
        </div>
        <div className='flex flex-row align-middle mt-6'>
          <div className='min-w-[50px]'>
            <Image
              src='/icons/services/MEETING.svg'
              alt='welcome'
              height={48}
              width={48}
              layout='intrinsic'
              objectFit='cover'
            />
          </div>
          <p className='px-6 sm:pt-4 text-base text-gray-500'>{t('common:welcome_new_0')}</p>
        </div>
        <div className='flex flex-row align-middle mt-2'>
          <div className='min-w-[50px]'>
            <Image
              src='/icons/services/FREELANCING_WORK.svg'
              alt='welcome'
              height={48}
              width={48}
              layout='intrinsic'
              objectFit='cover'
            />
          </div>
          <p className='px-6 sm:pt-4 text-base text-gray-500'>{t('common:welcome_new_1')}</p>
        </div>
        <div className='flex flex-row align-middle mt-2'>
          <div className='min-w-[50px]'>
            <Image
              src='/icons/services/PRODUCTS.svg'
              alt='welcome'
              height={48}
              width={48}
              layout='intrinsic'
              objectFit='cover'
            />
          </div>
          <p className='px-6 sm:pt-4 text-base text-gray-500'>{t('common:welcome_new_2')}</p>
        </div>
        <p className='mt-6 text-base font-extrabold'>{t('common:welcome_new_3')}</p>
        <p className='mt-6 text-base text-gray-500'>{t('common:welcome_new_4')}</p>
        <div className='flex items-center justify-center sm:block px-4 py-0 text-right sm:px-6'>
          <button
            type='submit'
            onClick={handleNext}
            className={` bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue`}
          >
            {t('common:btn_continue')}
          </button>
        </div>
      </div>
    </div>
  );
};
export default PreStepOne;
