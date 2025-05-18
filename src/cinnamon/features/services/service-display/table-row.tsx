import {Menu} from '@headlessui/react';
import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  Square2StackIcon,
} from '@heroicons/react/24/outline';
import Cell from '@root/components/table/cell';
import Row from '@root/components/table/row';
import {UserContext} from '@root/context/user';
import toast from 'react-hot-toast';
import useTranslation from 'next-translate/useTranslation';
import {useContext} from 'react';
import QRCode from 'qrcode.react';
import Actions from './actions';

const TableRow = ({service, refetch, withoutType}: {service; refetch; withoutType?: boolean}) => {
  const {user} = useContext(UserContext);
  const {t} = useTranslation('common');

  const downloadQR = () => {
    const id = `downloadqrcode${service.slug}`;
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (canvas !== null) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `download_${service.slug}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <Row styles='text-sm'>
      <Cell styles='w-24 pr-0 hidden md:table-cell'>
        <div className='w-24 h-24 overflow-hidden flex items-center rounded-lg bg-gray-100 p-4'>
          <img
            src={
              service?.serviceType
                ? `/icons/services/${service?.serviceType}.svg`
                : '/icons/services/service-placeholder.svg'
            }
            alt=''
          />
        </div>
      </Cell>
      <Cell styles='max-w-[320px] lg:max-w-[400px]'>
        <div className='flex flex-col'>
          <div>
            <h2 className='text-[15px] w-5/6 text-justify text-gray-600 break-all line-clamp-1 font-bold leading-0'>
              {service.title}
            </h2>
            <div className='flex items-center space-x-2 mt-1'>
              <button
                onClick={() => {
                  toast.success(t('common:txt_service_copy'), {duration: 1000});
                  navigator.clipboard.writeText(
                    // eslint-disable-next-line no-restricted-globals
                    `${location?.origin}/${user?.username}/${service.slug}`
                  );
                }}
                className='hover:bg-mainBlue hover:bg-opacity-10 rounded-r-md mt-0.5'
              >
                <Square2StackIcon className='w-5 h-5 text-mainBlue flex-shrink-0' />
              </button>
              <p className='truncate w-5/6 text-mainBlue border-opacity-30 text-[15px]'>
                <a
                  // eslint-disable-next-line no-restricted-globals
                  href={`${location?.origin}/${user?.username}/${service.slug}`}
                  className='text-mainBlue'
                  target='_blank'
                  rel='noreferrer'
                >
                  https://30mins.com/{user?.username}/{service.slug}
                </a>
              </p>
            </div>
          </div>
          <div>
            <div className='flex items-start justify-start'>
              <QRCode
                id={`displayqrcode${service.slug}`}
                value={`https://30mins.com/${user?.username}/${service.slug}`}
                size={100}
                level={'H'}
                includeMargin={true}
              />
            </div>
            <div className='hidden'>
              <QRCode
                id={`downloadqrcode${service.slug}`}
                value={`https://30mins.com/${user?.username}/${service.slug}`}
                size={2000}
                level={'H'}
                includeMargin={true}
              />
            </div>
            <div className='flex items-start justify-start'>
              <a className='cursor-pointer text-xs sm:text-sm text-mainBlue' onClick={downloadQR}>
                {' '}
                Download QR{' '}
              </a>
            </div>
          </div>
        </div>
        <div className='flex lg:hidden mt-2 space-x-2 justify-between'>
          <div className='flex space-x-2'>
            <span className='px-4 py-1 rounded-full border border-gray-200 font-medium text-gray-500'>
              {t(service.serviceType)}
            </span>
            <span className='px-4 py-1 rounded-full border border-gray-200 font-semibold text-gray-600'>
              {service.isPaid ? `${service.currency}${service.price}` : 'Free'}
            </span>
          </div>
          <Actions
            button={
              <Menu.Button className='flex items-center justify-center border border-gray-300 rounded-lg w-10 h-7 hover:bg-gray-200 hover:bg-opacity-60 shadow-md z-10'>
                <EllipsisHorizontalIcon className='w-6 h-6 text-gray-400' />
              </Menu.Button>
            }
            serviceID={service._id}
            serviceType={service.serviceType}
            refetch={refetch}
            slug={service.slug}
            isPrivate={service.isPrivate}
            isOrgService={service.isOrgService}
          />
        </div>
      </Cell>
      {!withoutType && <Cell styles='text-sm hidden lg:table-cell'>{t(service.serviceType)}</Cell>}
      <Cell styles='text-sm hidden lg:table-cell font-semibold'>
        {service.isPaid ? `${service.currency}${service.price}` : t('Free')}
      </Cell>
      <Cell styles='text-sm hidden lg:table-cell'>
        {service.isPrivate ? t(`Private`) : t('Public')}
      </Cell>
      <Cell styles='text-sm hidden lg:table-cell'>
        <Actions
          button={
            <Menu.Button className='flex items-center justify-center border border-gray-300 rounded-lg w-7 h-7 hover:bg-gray-200 hover:bg-opacity-60 shadow-md z-10'>
              <ChevronDownIcon className='w-6 h-6 text-gray-400' />
            </Menu.Button>
          }
          serviceID={service._id}
          refetch={refetch}
          slug={service.slug}
          serviceType={service.serviceType}
          isPrivate={service.isPrivate}
          isOrgService={service.isOrgService}
        />
      </Cell>
    </Row>
  );
};

export default TableRow;
