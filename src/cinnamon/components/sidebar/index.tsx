import {useContext, useEffect} from 'react';
import {useRouter} from 'next/router';
import classNames from 'classnames';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {UserContext} from '@context/user';
import NavLink from '@components/sidebar/nav-link';
import Branding from '@components/sidebar/branding';
import {admin, marketer, paymentOperator, provider} from '@root/routes';
import ChangeLanguage from 'components/shared/LanguageSwitcher/LanguageSwitcherSidebar';
import {ArrowRightCircleIcon, PlusIcon} from '@heroicons/react/24/outline';
import useTranslation from 'next-translate/useTranslation';
import extensionList from 'utils/extensions/extensionList';
import SwitcherAuth from './features/switcher-auth';

type Props = {
  isMobile?: boolean;
  setClosed?: any;
  setCollapsed?: any;
  collapsed: boolean;
};

const Sidebar = ({isMobile, setClosed, collapsed, setCollapsed}: Props) => {
  let routes: any;
  const {t} = useTranslation();
  const {pathname} = useRouter();
  const {user, activeExtensions} = useContext(UserContext);
  const {showModal} = ModalContextProvider();

  if (user && user.accountType === 'provider') {
    routes = provider;
  } else if (user && user.accountType === 'admin') {
    routes = provider.concat(admin);
  } else if (user && user.accountType === 'payoutOperator') {
    routes = provider.concat(paymentOperator);
  }

  if (user && user.isMarketer) {
    routes = routes.concat(marketer);
  }

  if (user && activeExtensions.length > 0) {
    const extensionsRoutes: any = [];
    activeExtensions.forEach(current => {
      const extension = extensionList.find(item => item.ids.includes(current.extensionProductId));

      if (extension) {
        const isExist = extensionsRoutes.find(item => item.name === extension.name);

        if (!isExist) {
          extensionsRoutes.push({
            name: extension.name,
            href: extension.resourceLink,
            icon: PlusIcon,
            isStrictCheck: true,
          });
        }
      }
    });

    routes = routes.map(item =>
      item.name !== 'Extensions'
        ? item
        : {
            ...item,
            children: [...item.children, ...extensionsRoutes],
          }
    );
  }

  useEffect(() => {
    if (isMobile && !collapsed) {
      document.body.style.setProperty('overflow', 'hidden');
    } else {
      document.body.style.setProperty('overflow', 'auto');
    }
  }, [isMobile, collapsed]);

  return (
    <div
      className={classNames(
        collapsed ? 'w-24' : 'w-72',
        'flex-col justify-between fixed inset-y-0 transition-width duration-300 easy z-50 bg-white select-none',
        isMobile ? 'flex' : 'hidden xl:flex'
      )}
    >
      <div className='flex flex-col flex-grow overflow-hidden justify-between border-r border-gray-300 border-opacity-70 bg-white overflow-y-auto bg-opacity-80'>
        <Branding collapsed={collapsed} setCollapsed={setCollapsed} setClosed={setClosed} />
        <nav className='flex flex-col flex-1 flex-grow px-4 pb-4 space-y-2 mt-2 bg-white'>
          {routes &&
            routes.map((route, index) => (
              <NavLink
                key={index}
                name={route.name}
                href={route.href}
                icon={route.icon}
                pathname={pathname}
                setCollapsed={setCollapsed}
                collapsed={collapsed}
                route={route}
              />
            ))}
        </nav>
        <ChangeLanguage collapsed={collapsed} isMobile={isMobile} />
        <SwitcherAuth collapsed={collapsed} isMobile={isMobile} pathname={pathname} />
        <span
          className={classNames(
            'text-gray-600 mb-4 hover:bg-gray-50 hover:text-gray-900 flex items-center py-2 rounded-lg cursor-pointer text-left',
            collapsed && '!mb-6 pl-6',
            !collapsed && 'pr-3 pl-9'
          )}
          onClick={() => {
            showModal(MODAL_TYPES.SIGN_OUT);
          }}
        >
          <ArrowRightCircleIcon
            className={
              'text-gray-400 group-hover:text-gray-500 mr-4 flex flex-shrink-0 items-start justify-center w-6 h-6'
            }
            aria-hidden='true'
          />
          {!collapsed && (
            <span
              className={classNames(
                'flex-1 min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy'
              )}
            >
              {t(`profile:sign_out`)}
              <p className='text-xs text-gray-600 truncate'>{user?.email}</p>
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
