import useTranslation from 'next-translate/useTranslation';
import {ChevronRightIcon} from '@heroicons/react/20/solid';
import Link from 'next/link';

const Header = ({title}) => {
  const {t} = useTranslation();

  return (
    <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
      <div className='flex-1 min-w-0'>
        <nav className='flex' aria-label='Breadcrumb'>
          <ol role='list' className='flex items-center space-x-4'>
            <li>
              <div className='flex'>
                <a href={'/'} className='text-sm font-medium text-gray-700 hover:text-gray-800'>
                  {t('page:Home')}
                </a>
              </div>
            </li>
            <li>
              <div className='flex items-center'>
                <ChevronRightIcon
                  className='flex-shrink-0 h-5 w-5 text-gray-500'
                  aria-hidden='true'
                />
                <Link href='/user/orders' passHref>
                  <a className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                    {t('common:txt_my_orders')}
                  </a>
                </Link>
              </div>
            </li>
          </ol>
        </nav>
        <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
          {title}
        </h2>
      </div>
    </div>
  );
};

export default Header;
