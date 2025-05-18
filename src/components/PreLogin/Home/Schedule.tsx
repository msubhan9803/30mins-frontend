import {ArrowTopRightOnSquareIcon} from '@heroicons/react/24/outline';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

const ScheduleWithUs = () => {
  const {t} = useTranslation();
  const [publicUrl, setPublicUrl] = useState('');
  const router = useRouter();
  useEffect(() => {
    setPublicUrl(`${window.origin + router.asPath}/sales/talktous`);
  }, []);

  return (
    <div className='bg-gray-100 grid grid-cols-1 sm:grid-cols-1 mt-4 mb-0 sm:mb-20 gap-4 px-6 sm:px-20 pt-8 pb-10'>
      <div className='mx-auto grid grid-cols-1 sm:grid-cols-1'>
        <div className=''>
          <h2 className='text-base font-semibold tracking-wider text-mainBlue uppercase'>
            {t('page:have_ques')}?
          </h2>
        </div>
        <p className='mt-2 text-mainText text-3xl font-extrabold tracking-tight sm:text-4xl'>
          {t('page:use_link_desc')}
        </p>
        <div className='mt-8'>
          <div className='inline-flex rounded-md shadow'>
            <a
              href={publicUrl}
              className='inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-mainBlue hover:text-white duration-150 ease-out hover:bg-blue-800'
            >
              {t('page:Schedule_time_with_us')}
              <ArrowTopRightOnSquareIcon
                className='-mr-1 ml-3 h-5 w-5 text-white'
                aria-hidden='true'
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ScheduleWithUs;
