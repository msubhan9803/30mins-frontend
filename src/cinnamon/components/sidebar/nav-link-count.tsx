import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {SVGProps} from 'react';

type IProps = {
  name: string;
  pathname: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  href: string;
  collapsed: boolean;
  route: any;
  value: any;
  handleClearRouteDropdown: () => void;
};

export default function NavLinkCount({
  value,
  collapsed,
  name,
  href,
  pathname,
  icon: Icon,
  handleClearRouteDropdown,
}: IProps) {
  const {t} = useTranslation();

  return (
    <Link key={name} href={href} passHref title={name}>
      <span
        key={name}
        title={name}
        className={classNames(
          href === pathname
            ? 'bg-mainBlue bg-opacity-[12.5%] text-mainBlue'
            : 'text-gray-600 hover:text-mainBlue',
          `flex group space-x-4 items-center py-2 ${
            !collapsed && 'pr-3 pl-5'
          } text-base font-normal rounded-lg cursor-pointer text-left`
        )}
        onClick={handleClearRouteDropdown}
      >
        <div className='relative'>
          <Icon
            className={classNames(
              href === pathname ? 'text-mainBlue' : 'text-gray-400 group-hover:text-mainBlue',
              `flex flex-shrink-0 items-start justify-center ${
                collapsed && 'pl-2.5 w-8 h-8'
              } w-6 h-6`
            )}
            aria-hidden='true'
          />
          {collapsed && value > 0 && (
            <span className='absolute -top-3 font-bold -right-2 bg-mainBlue text-xs text-white w-[22px] h-[22px] rounded-full flex justify-center items-center shadow-sm shadow-mainBlue'>
              {value < 10 ? value : '+9'}
            </span>
          )}
        </div>
        {!collapsed && (
          <span className='flex-1 flex flex-row justify-between min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy'>
            <span>{t(name)}</span>
            {value > 0 && (
              <span className='bg-mainBlue text-white font-bold w-[26px] h-[26px] flex justify-center items-center rounded-full shadow-sm shadow-mainBlue'>
                {value < 10 ? value : '+9'}
              </span>
            )}
          </span>
        )}
      </span>
    </Link>
  );
}
