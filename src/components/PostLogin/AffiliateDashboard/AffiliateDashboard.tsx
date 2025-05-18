import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const AffiliateDashboard = () => {
  const {t} = useTranslation();

  return (
    <div className='min-h-screen text-gray-900'>
      <main className='max-w-7xl mx-auto px-0 pt-4'>
        <div className='mt-6'>
          <div className='grid grid-cols-1 mt-6'>
            <div className='grid col-span-1 mr-4 mb-2 bg-white'>
              <div className='flex flex-col'>
                <div className='text-base font-bold text-mainBlue'>{t('page:rewardful_info')}</div>
                <div className='grid grid-cols-1'>
                  <div className='col-span-1 flex flex-col'>
                    <div className='text-sm mt-4'>
                      {t('page:rewardful_info_1')}
                      <a className='font-bold' href='https://30mins-com.getrewardful.com/signup'>
                        {' '}
                        https://30mins-com.getrewardful.com/signup{' '}
                      </a>
                    </div>
                    <div className='text-sm mt-4'>
                      {t('page:rewardful_info_2')}
                      <ul className='list-disc list-inside indent-4'>
                        <li>{t('page:rewardful_info_2_bullet_1')}</li>
                        <li>{t('page:rewardful_info_2_bullet_2')}</li>
                        <li>{t('page:rewardful_info_2_bullet_3')}</li>
                        <li>{t('page:rewardful_info_2_bullet_4')}</li>
                      </ul>
                    </div>
                    <div className='text-sm mt-4'>{t('page:rewardful_info_3')}</div>
                    <div className='text-sm mt-4'>{t('page:rewardful_info_4')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AffiliateDashboard;
