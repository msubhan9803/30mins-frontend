/* eslint-disable array-callback-return */
import {Fragment, useContext, useEffect, useState} from 'react';
import {Transition} from '@headlessui/react';
import Link from 'next/link';
import classNames from 'classnames';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import {ChevronDownIcon} from '@heroicons/react/24/outline';
import {CollapseDrawerContext} from 'store/Sidebar/Sidebar.context';

type IProps = {
  route: any;
  isMobile: any;
  isCollapse: any;
  setCollapsed?: any;
  hasOrgEditPermission?: any;
};

const SidebarSubmenu = ({
  route,
  isMobile,
  isCollapse,
  setCollapsed,
  hasOrgEditPermission,
}: IProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {t} = useTranslation();
  const {currentActiveRoute, handleActiveRouteToggle} = useContext(CollapseDrawerContext);
  const {pathname} = useRouter();

  const handleDropdownMenuClick = async () => {
    const newDropdownState = !isDropdownOpen;
    setIsDropdownOpen(newDropdownState);
    setCollapsed && setCollapsed(false);
  };

  const handleMenuChildClick = (item: any, parentRouteName: string) => {
    const routeState = {
      routeName: parentRouteName,
      childRouteName: item?.name,
      isDropdownOpen: currentActiveRoute?.isDropdownOpen,
      href: item?.href,
      isChild: true,
    };
    handleActiveRouteToggle(routeState);
  };

  const getHighlightState = item =>
    item.isStrictCheck ? item.href === pathname : item.href.includes(pathname);

  useEffect(() => {
    if (currentActiveRoute?.routeName === route?.name) {
      setIsDropdownOpen(true);
    }
  }, []);

  const handleShowChildItemForOrgPermission = routes =>
    // eslint-disable-next-line consistent-return
    routes?.filter(elem => {
      if (elem.checkEditOrgPermission === true) {
        if (hasOrgEditPermission) {
          return elem;
        }
      } else {
        return elem;
      }
    });

  return (
    <>
      <span
        key={route.name}
        title={route.name}
        onClick={handleDropdownMenuClick}
        className={classNames(
          route.href === pathname
            ? 'bg-[#eef3fb] text-mainBlue'
            : 'text-gray-600 hover:bg-gray-50 hover:text-mainBlue',
          `flex flex-row items-center py-2 ${
            !isCollapse && 'pl-5 pr-3'
          } text-base rounded-lg cursor-pointer text-left w-full group`
        )}
      >
        <route.icon
          className={classNames(
            route.href === pathname
              ? 'bg-[#eef3fb] text-mainBlue'
              : 'text-gray-400 group-hover:text-mainBlue',
            `mr-4 ${isCollapse && 'ml-2.5'} flex flex-shrink-0 items-start justify-center w-6 h-6`
          )}
          aria-hidden='true'
        />

        <span className='flex-1 min-w-0 my-0 transition-width duration-200 easy w-full break-all line-clamp-1'>
          {isMobile ? t(`page:${route.name}`) : !isCollapse ? t(`page:${route.name}`) : ''}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 mt-1 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </span>
      <Transition
        as={Fragment}
        show={isDropdownOpen}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <ul
          className={classNames(
            'space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-lg py-3',
            isDropdownOpen && 'bg-gray-50'
          )}
          aria-label='submenu'
        >
          {handleShowChildItemForOrgPermission(route?.children)?.map(item => (
            <Link key={item.name} href={item.href} passHref>
              <span
                key={item.name}
                title={item.name}
                className={classNames(
                  getHighlightState(item)
                    ? 'bg-[#eef3fb] text-mainBlue'
                    : 'text-gray-600 hover:text-mainBlue',
                  `flex items-center py-2 ${
                    !isCollapse && 'pl-5 pr-3'
                  } text-sm font-medium rounded-lg cursor-pointer text-left group`
                )}
                onClick={() => handleMenuChildClick(item, route?.name)}
              >
                {item.icon && (
                  <item.icon
                    className={classNames(
                      getHighlightState(item)
                        ? 'bg-[#eef3fb] text-mainBlue'
                        : 'text-gray-400 group-hover:text-mainBlue',
                      `mr-4 ${
                        isCollapse && 'ml-2.5'
                      } flex flex-shrink-0 items-start justify-center w-6 h-6`
                    )}
                    aria-hidden='true'
                  />
                )}
                <span className='flex-1 min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy'>
                  {isMobile ? t(`page:${item.name}`) : !isCollapse ? t(`page:${item.name}`) : ''}
                </span>
              </span>
            </Link>
          ))}
        </ul>
      </Transition>
    </>
  );
};

export default SidebarSubmenu;
