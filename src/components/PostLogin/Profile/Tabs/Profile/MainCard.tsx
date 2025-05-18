import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {useContext, useEffect, useState} from 'react';
import {UserContext} from 'store/UserContext/User.context';
import {PencilIcon, PlusIcon} from '@heroicons/react/20/solid';
import {SERVICE_TYPES} from 'constants/enums';
import sanitizeHtml from 'sanitize-html';
import QRCode from 'qrcode.react';
import toast from 'react-hot-toast';
import {Square2StackIcon} from '@heroicons/react/24/outline';

import Publications from './Sections/Publications';
import Education from './Sections/Education';
import JobHistory from './Sections/JobHistory';

const MainCard = ({User, hasIntegrations, userServices}) => {
  const {t} = useTranslation();
  const [publicUrl, setPublicUrl] = useState('');
  const downloadQR = () => {
    const id = `downloadqrcode${User?.accountDetails?.username}`;
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (canvas !== null) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  useEffect(() => {
    setPublicUrl(`${window.origin}/${User?.accountDetails?.username}`);
  }, []);

  const {
    state: {visible, headline, description},
    actions: {setVisible, setheadline, setDescription},
  } = useContext(UserContext);

  useEffect(() => {
    setVisible(User?.accountDetails?.privateAccount);
    setheadline(User?.personalDetails?.headline);
    setDescription(User?.personalDetails?.description);
  }, [
    User?.accountDetails?.privateAccount,
    User?.personalDetails?.headline,
    User?.personalDetails?.description,
  ]);

  return (
    <section aria-labelledby='user-info'>
      <div className='bg-white shadow sm:rounded-lg py-4 px-4 mb-4'>
        <div>
          <div className='flex justify-end'>
            <div className='flex flex-row items-center'>
              <a href='/user/edit'>
                <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
              </a>
            </div>
          </div>
          <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3'>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-bold text-gray-700'>{t('profile:Username')}</dt>
              <dd className='mt-1 text-sm text-gray-900'>{User?.accountDetails?.username}</dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-bold text-gray-700'>{t('profile:Account_visibility')}</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {visible ? t('profile:Search_Hidden') : t('profile:Search_Visible')}
              </dd>
            </div>

            <div className='sm:col-span-3'>
              <dt className='text-sm font-bold text-gray-700'>{t('profile:Headline')}</dt>
              {headline && (
                <dd
                  className='mt-1 text-sm text-gray-900 custom'
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(headline),
                  }}
                ></dd>
              )}
              {!headline && (
                <dd
                  className='mt-1 text-sm text-gray-900 custom'
                  dangerouslySetInnerHTML={{
                    __html: '--',
                  }}
                ></dd>
              )}
            </div>

            <div className='sm:col-span-3'>
              <dt className='text-sm font-bold text-gray-700'>{t('profile:Description')}</dt>
              {description && (
                <dd
                  className='mt-1 text-sm text-gray-900 custom'
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(description),
                  }}
                ></dd>
              )}
              {!description && (
                <dd
                  className='mt-1 text-sm text-gray-900 custom'
                  dangerouslySetInnerHTML={{
                    __html: '--',
                  }}
                ></dd>
              )}
            </div>
          </dl>
        </div>
      </div>
      <div className='bg-white grid grid-cols-1 sm:grid-cols-4 shadow sm:rounded-lg py-4 px-4 mb-4'>
        <div className='col-span-3'>
          <div className='text-sm font-bold text-gray-700 w-full break-words truncate mt-4 flex flex-row items-center gap-1'>
            <button
              onClick={() => {
                toast.success(t('common:txt_service_copy'), {duration: 1000});
                navigator.clipboard.writeText(`${publicUrl}`);
              }}
              className='hover:bg-mainBlue hover:bg-opacity-10 rounded-r-md mt-0.5'
            >
              <Square2StackIcon className='w-5 h-5 text-mainBlue flex-shrink-0' />
            </button>
            <span className='font-bold text-gray-700'>{t('common:txt_Profile')} : </span>
            <Link href={`${publicUrl}`} passHref>
              <a className='cursor-pointer text-mainBlue w-full mr-4' target={'_blank'}>
                {publicUrl}
              </a>
            </Link>
          </div>
          <div className='text-sm font-bold text-gray-700 w-full break-words truncate mt-4 flex flex-row items-center gap-1'>
            <button
              onClick={() => {
                toast.success(t('common:Link_Copied'), {duration: 1000});
                navigator.clipboard.writeText(`${publicUrl}/products`);
              }}
              className='hover:bg-mainBlue hover:bg-opacity-10 rounded-r-md mt-0.5'
            >
              <Square2StackIcon className='w-5 h-5 text-mainBlue flex-shrink-0' />
            </button>
            <span className='font-bold text-gray-700'>{t('common:products')} : </span>
            <Link href={`${publicUrl}/products`} passHref>
              <a className='cursor-pointer text-mainBlue w-full mr-4' target={'_blank'}>
                {`${publicUrl}/products`}
              </a>
            </Link>
          </div>
          <div className='text-sm font-medium text-gray-500 w-full break-words truncate mt-4'>
            {t('profile:share_QR_code_profile')}
          </div>
        </div>
        <div className='col-span-1 flex justify-center sm:justify-end'>
          <div className='flex flex-col'>
            <div>
              <QRCode
                id={`displayqrcode${User?.accountDetails?.username}`}
                value={`https://30mins.com/${User?.accountDetails?.username}`}
                size={100}
                level={'H'}
                includeMargin={true}
              />
            </div>
            <div className='hidden'>
              <QRCode
                id={`downloadqrcode${User?.accountDetails?.username}`}
                value={`https://30mins.com/${User?.accountDetails?.username}`}
                size={2000}
                level={'H'}
                includeMargin={true}
              />
            </div>
            <div className='flex items-center justify-center'>
              <a className='cursor-pointer text-xs sm:text-sm text-mainBlue' onClick={downloadQR}>
                {' '}
                Download QR{' '}
              </a>
            </div>
          </div>
        </div>
      </div>
      {hasIntegrations && (
        <div className='bg-white shadow sm:rounded-lg py-4 px-4 mb-4'>
          <div className='text-sm font-bold text-gray-700 w-full break-words truncate flex flex-row items-center gap-1'>
            <button
              onClick={() => {
                toast.success(t('common:txt_service_copy'), {duration: 1000});
                navigator.clipboard.writeText(`${publicUrl}/availability`);
              }}
              className='hover:bg-mainBlue hover:bg-opacity-10 rounded-r-md mt-0.5'
            >
              <Square2StackIcon className='w-5 h-5 text-mainBlue flex-shrink-0' />
            </button>
            <span className='font-bold text-gray-700'>{t('profile:availability_link')} : </span>
            <Link href={`${publicUrl}/availability`} passHref>
              <a className='cursor-pointer text-mainBlue w-full mr-4' target={'_blank'}>
                {publicUrl}/availability
              </a>
            </Link>
          </div>
        </div>
      )}

      {userServices && userServices?.length > 0 && (
        <div className='bg-white shadow sm:rounded-lg py-4 px-4 '>
          <div className='sm:col-span-1'>
            <div className='flex justify-between'>
              <h2 className='text-md font-bold text-gray-700'>{t('common:Services')}</h2>
              <div className='flex flex-row items-center'>
                <a href='/user/services/service-form/?mode=create'>
                  <PlusIcon className='w-4 h-4 text-sm font-medium text-gray-500 mr-2' />
                </a>
                <a href='/user/services'>
                  <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
                </a>
              </div>
            </div>
          </div>
          {userServices?.map((item, index) => {
            const itemTitle =
              item.title.length > 50 ? `${item.title.substring(0, 50)}...` : item.title;
            return (
              <div
                className='text-sm font-medium text-gray-500 py-1 w-full break-words truncate gap-1 flex items-center'
                key={index}
              >
                <button
                  onClick={() => {
                    toast.success(t('common:txt_service_copy'), {duration: 1000});
                    navigator.clipboard.writeText(`${publicUrl}/${item?.slug}`);
                  }}
                  className='hover:bg-mainBlue hover:bg-opacity-10 rounded-r-md mt-0.5'
                >
                  <Square2StackIcon className='w-5 h-5 text-mainBlue flex-shrink-0' />
                </button>
                {item.serviceType === SERVICE_TYPES.MEETING && (
                  <>
                    {` ${t('common:MEETING')} `}
                    {item?.duration} min{' : '}
                    {item?.price > 0 ? `${item?.currency}${item?.price}` : t('common:Free')}{' '}
                  </>
                )}
                {item.serviceType === SERVICE_TYPES.FREELANCING_WORK && (
                  <>{` ${t('common:FREELANCING_WORK')}  $${item?.price} : `} </>
                )}
                {item.serviceType === SERVICE_TYPES.FULL_TIME_JOB && (
                  <>{` ${t('common:FULL_TIME_JOB')} : `} </>
                )}
                {item.serviceType === SERVICE_TYPES.PART_TIME_JOB && (
                  <>{` ${t('common:PART_TIME_JOB')} : `} </>
                )}
                {itemTitle}{' '}
                <Link href={`${publicUrl}/${item?.slug}`} passHref>
                  <a className='z-30 cursor-pointer text-mainBlue w-full mr-4' target={'_blank'}>
                    {publicUrl}/{item?.slug}
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <Publications />
      <Education />
      <JobHistory />
    </section>
  );
};
export default MainCard;
