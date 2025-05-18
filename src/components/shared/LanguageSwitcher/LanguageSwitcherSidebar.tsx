import {Menu, Transition} from '@headlessui/react';
import {LanguageIcon, ChevronDownIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import setLanguage from 'next-translate/setLanguage';
import useTranslation from 'next-translate/useTranslation';
import {useState} from 'react';

const longs = {
  en: 'English',
  es: 'Española',
  it: 'Italiana',
  pt: 'Português',
  ro: 'Română',
  de: 'Deutsch',
};

const ChangeLanguage = ({isMobile, collapsed}) => {
  const {lang} = useTranslation();
  const onChangeOption = e => {
    setLanguage(e);
  };
  const [show, setshow] = useState(false);
  return (
    <>
      <Menu
        as={'div'}
        className={
          'text-gray-60 hover:text-gray-900 flex items-center py-2 px-4 text-base rounded-lg text-left w-full'
        }
        onClick={() => setshow(!show)}
        title={longs[lang]}
        // className='absolute flex flex-col right-11 xl:right-8 -bottom-0 xl:-bottom-14 w-40 origin-top-right rounded-md bg-white shadow-lg border z-50 p-4'
      >
        <div
          className={`text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center py-2 ${
            !collapsed && 'pr-3 pl-5'
          } text-base rounded-lg cursor-pointer text-left w-full group`}
        >
          <LanguageIcon
            className={` text-gray-400 group-hover:text-mainBlue flex flex-shrink-0 items-start justify-center ${
              collapsed && 'pl-2.5'
            } w-6 h-6`}
            aria-hidden='true'
          />
          {!collapsed && (
            <span className='flex-1 min-w-0 my-0 pl-4 whitespace-nowrap transition-width duration-200 easy group-hover:text-mainBlue'>
              {longs[lang]}
            </span>
          )}
          <ChevronDownIcon
            className={classNames([
              'w-4 h-4',
              show ? (isMobile ? 'rotate-90' : '-rotate-90') : 'rotate-0',
            ])}
          />
        </div>
        <Transition
          as={'div'}
          className={classNames([
            'absolute w-32 p-2',
            collapsed && !isMobile ? 'bottom-2 left-24' : 'left-72 bottom-2',
            !collapsed && isMobile && 'bottom-16 left-28',
          ])}
          onMouseLeave={() => {
            setshow(false);
          }}
          show={show}
        >
          <div className='border-2 rounded-md flex flex-col gap-1 bg-slate-50'>
            <span
              onClick={() => onChangeOption('en')}
              className='hover:bg-slate-300 cursor-pointer'
            >
              English
            </span>
            <span
              onClick={() => onChangeOption('es')}
              className='hover:bg-slate-300 cursor-pointer'
            >
              Española
            </span>
            <span
              onClick={() => onChangeOption('it')}
              className='hover:bg-slate-300 cursor-pointer'
            >
              Italiana
            </span>
            <span
              onClick={() => onChangeOption('pt')}
              className='hover:bg-slate-300 cursor-pointer'
            >
              Português
            </span>
            <span
              onClick={() => onChangeOption('ro')}
              className='hover:bg-slate-300 cursor-pointer'
            >
              Română
            </span>
            <span
              onClick={() => onChangeOption('de')}
              className='hover:bg-slate-300 cursor-pointer'
            >
              Deutsch
            </span>
          </div>
        </Transition>
      </Menu>
    </>
  );
};
export default ChangeLanguage;
