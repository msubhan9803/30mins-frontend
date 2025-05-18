import {Fragment, useContext, useEffect, useState} from 'react';
import {Disclosure, Menu, Transition} from '@headlessui/react';
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import classNames from 'classnames';
import {signOut, useSession} from 'next-auth/react';
import Button from '@root/components/button';
import Link from 'next/link';
import {UserContext} from '@root/context/user';
import {CollapseDrawerContext} from 'store/Sidebar/Sidebar.context';

const Header = () => {
  const {t, lang} = useTranslation();
  const {data: session} = useSession();
  const router = useRouter();
  const [scrollActive, setScrollActive] = useState(false);
  const {user} = useContext(UserContext);
  const {handleClearRouteDropdown, handleActiveRouteToggle} = useContext(CollapseDrawerContext);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScrollActive(window.scrollY > 20);
    });
  }, []);

  const PAGES = {
    home: {name: t('page:Home'), pathname: '/'},
    pricing: {name: t('page:Pricing'), pathname: '/pricing/'},
    privacy: {name: t('page:Privacy'), pathname: '/privacy/'},
    tos: {name: t('page:terms_of_service'), pathname: '/tos/'},
    blog: {name: t('common:Blog'), pathname: '/blog/'},
    contact: {name: t('common:Contact_Us'), pathname: '/contact-us/'},
  };

  const desktopLink = ({pathname, name}: typeof PAGES['home'], index: number) => (
    <Link href={pathname} key={index} className='flex items-center w-max justify-center'>
      <a
        key={index}
        className={classNames(
          router.asPath === pathname
            ? 'border-mainBlue text-mainBlue inline-flex items-center border-b-2 text-sm font-medium'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center text-center border-b-2 text-sm font-medium'
        )}
      >
        {name}
      </a>
    </Link>
  );

  const mobileLink = ({pathname, name}: typeof PAGES['home'], index: number) => (
    <Link href={pathname} key={index}>
      <a
        key={index}
        className={classNames(
          router.asPath === pathname
            ? 'bg-indigo-50 border-mainBlue text-mainBlue block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
            : 'border-transparent text-gray-500 hover:bg-gray-50  hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
        )}
      >
        {name}
      </a>
    </Link>
  );

  const handleLinkClick = async (route: string) => {
    handleClearRouteDropdown();
    await router.push(route);
  };

  const handleSettingsClick = async (route: string) => {
    handleActiveRouteToggle({
      routeName: 'Meeting Services',
      childRouteName: 'Calendar Integrations',
      isDropdownOpen: false,
      href: '/user/integrations',
      isChild: true,
    });
    await router.push(route);
  };

  return (
    <Disclosure
      as='nav'
      id='nav'
      className={`fixed top-0 w-full z-30 bg-white transition-all ${
        scrollActive ? ' shadow-md pt-2' : ' pt-4'
      }`}
    >
      {({open}) => (
        <nav className='w-full flex flex-col md:flex-row justify-between'>
          <div className='max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-row gap-2'>
            <div className='w-full flex justify-between h-16 gap-2'>
              <div className='flex gap-2'>
                <div className='flex-shrink-0 flex items-center'>
                  <Link href='/' passHref>
                    <a>
                      <Image
                        src={'/assets/logo.svg'}
                        width={60}
                        height={60}
                        alt='logo'
                        className='hover:cursor-pointer'
                      />
                    </a>
                  </Link>
                </div>
                <div className='hidden sm:flex gap-4 md:gap-6 lg:space-x-8 md:ml-4'>
                  {Object.values(PAGES).map(desktopLink)}
                </div>
              </div>
              {session ? (
                <div className='hidden sm:ml-2 sm:flex gap-2 sm:items-center'>
                  <Button
                    type='button'
                    variant='solid'
                    onClick={async () => handleLinkClick(`/${lang}/user/dashboard`)}
                  >
                    {t('common:myaccount')}
                  </Button>

                  <Menu as='div' className='relative'>
                    <Menu.Button className='bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'>
                      <span className='sr-only'>Open user menu</span>
                      <div
                        className={`relative flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden`}
                      >
                        <img
                          className='relative rounded-full w-10 h-10 object-cover object-center '
                          src={user?.avatar || '/assets/default-profile.jpg'}
                          alt=''
                        />
                      </div>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter='transition ease-out duration-200'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'
                    >
                      <Menu.Items className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        <Menu.Item>
                          {({active}) => (
                            <span
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                              onClick={async () => handleLinkClick('/user/dashboard')}
                            >
                              {t('common:view_profile')}
                            </span>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({active}) => (
                            <span
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                              onClick={async () => handleSettingsClick('/user/integrations')}
                            >
                              {t('Settings')}
                            </span>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({active}) => (
                            <span
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                              onClick={() => signOut()}
                            >
                              {t('common:signout')}
                            </span>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : (
                <div className='hidden sm:flex felx-col gap-2 justify-center items-center '>
                  <Button
                    type='button'
                    className='h-max'
                    variant='outline'
                    onClick={async () => {
                      await router.push(`/${router.locale}/auth/login`);
                    }}
                  >
                    {t('common:LOGIN')}
                  </Button>

                  <Button
                    type='button'
                    className='h-max'
                    variant='solid'
                    onClick={async () => {
                      await router.push(`/${router.locale}/auth/signup`);
                    }}
                  >
                    {t('common:SIGN_UP')}
                  </Button>
                </div>
              )}
              <div className='-mr-2 flex items-center sm:hidden'>
                <Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mainBlue'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className='sm:hidden h-max flex flex-col animate-fadeIn duration-700 shadow-lg'>
            <div className='pt-2 pb-3 space-y-1'>{Object.values(PAGES).map(mobileLink)}</div>
            {session ? (
              <div className='pt-4 pb-3 border-t border-gray-200'>
                <div className='flex items-center px-4'>
                  <div className='flex-shrink-0'>
                    <div
                      className={`relative flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden`}
                    >
                      <img
                        className='relative rounded-full w-10 h-10 object-cover object-center'
                        src={user?.avatar || '/assets/default-profile.jpg'}
                        alt=''
                      />
                    </div>
                  </div>
                  <div className='ml-3'>
                    <div className='text-base font-medium text-gray-800'>{session.user?.name}</div>
                    <div className='text-sm font-medium text-gray-500'>{session.user?.email}</div>
                  </div>
                </div>
                <div className='mt-3 space-y-1'>
                  <Disclosure.Button
                    as='a'
                    href='/user/profile'
                    className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  >
                    {t('common:view_profile')}
                  </Disclosure.Button>
                  <Disclosure.Button
                    as='a'
                    href='/user/integrations'
                    className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  >
                    {t('common:Settings')}
                  </Disclosure.Button>
                  <a
                    onClick={() => signOut()}
                    className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer'
                  >
                    {t('common:signout')}
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className='mt-6 px-5'>
                  <Button
                    type='button'
                    className='hidden sm:inline-flex mr-3 buttonBase'
                    variant='solid'
                    onClick={async () => {
                      await router.push(`/${router.locale}/auth/signup`);
                    }}
                  >
                    {t('common:SIGN_UP')}
                  </Button>
                </div>
                <div className='mt-6 px-5 mb-5'>
                  <p className='text-center text-base font-medium text-gray-500'>
                    {t('page:already_have_account')}
                    <a
                      className='text-gray-700  no-underline'
                      href={`/${router.locale}/auth/login`}
                    >
                      &nbsp; {t('common:LOGIN')}
                    </a>
                  </p>
                </div>
              </>
            )}
          </Disclosure.Panel>
        </nav>
      )}
    </Disclosure>
  );
};
export default Header;
