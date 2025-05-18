import useTranslation from 'next-translate/useTranslation';
import {Menu, Transition} from '@headlessui/react';
import {ArchiveBoxIcon, EllipsisVerticalIcon} from '@heroicons/react/20/solid';
import {NoSymbolIcon, InboxIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {IOptions, IsetValue} from '../constants';

type IProps = {
  setValue: IsetValue;
  onSwitch: () => void;
  options: IOptions;
};

export default function HeadSearch({setValue, options, onSwitch}: IProps) {
  const {t} = useTranslation();

  return (
    <div className='flex w-full px-2 h-20 justify-center border-r items-center border-b'>
      <input
        type={'text'}
        className='w-full h-16 px-4 text-black text-md border-none font-normal focus:ring-0'
        placeholder={t('common:Search_for_username')}
        onChange={e => setValue('TextFileter', e.target.value)}
      />
      <div className='top-16 w-max text-right'>
        <Menu defaultValue={0} as='div' className='relative z-10 inline-block text-left'>
          <div>
            <Menu.Button
              className='flex flex-row justify-center items-center w-full p-1'
              title={
                options.inbox[0]
                  ? 'Inbox'
                  : options.archive[0]
                  ? 'Archive'
                  : options.blocked[0]
                  ? 'Blocked'
                  : ''
              }
            >
              {options.inbox[0] && <InboxIcon className='text-mainBlue w-7' />}
              {options.archive[0] && <ArchiveBoxIcon className='text-purple-400 w-7' />}
              {options.blocked[0] && <NoSymbolIcon className='text-red-400 w-7' />}
              <div className='relative w-max'>
                <EllipsisVerticalIcon width={22} height={22} className='text-black' />
                <span
                  className={classNames([
                    'w-[10px] h-[10px] absolute flex -top-1 -right-1 justify-center items-center rounded-full text-xs font-bold ',
                    options.inbox[1] + options.archive[1] + options.blocked[1] > 0 && 'bg-red-500',
                  ])}
                />
              </div>
            </Menu.Button>
          </div>
          <Transition
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
            className=''
          >
            <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='px-1 py-1'>
                <Menu.Item>
                  <button
                    className={`${
                      options.inbox[0] ? 'bg-mainBlue text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 gap-2 py-2 text-sm`}
                    onClick={() => {
                      setValue('options.archive[0]', false);
                      setValue('options.blocked[0]', false);
                      setValue('options.inbox[0]', true);
                      onSwitch();
                    }}
                  >
                    <div className='relative w-max'>
                      <InboxIcon className='mr-2 h-6 w-6' />
                      <span
                        className={classNames([
                          'w-[19px] h-[19px] absolute flex -top-1 -right-1 justify-center items-center rounded-full text-xs font-bold ',
                          options.inbox[0] ? 'bg-white text-mainBlue' : 'bg-mainBlue text-white',
                        ])}
                      >
                        {options.inbox[1] > 9 ? '+9' : options.inbox[1]}
                      </span>
                    </div>
                    {t('common:inbox')}
                  </button>
                </Menu.Item>

                <Menu.Item>
                  <button
                    className={`${
                      options.archive[0] ? 'bg-mainBlue text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 gap-2 py-2 text-sm`}
                    onClick={() => {
                      setValue('options.archive[0]', true);
                      setValue('options.blocked[0]', false);
                      setValue('options.inbox[0]', false);
                      onSwitch();
                    }}
                  >
                    <div className='relative w-max'>
                      <ArchiveBoxIcon className='mr-2 h-6 w-6' />
                      <span className='w-[19px] h-[19px] absolute flex -top-1 -right-1 justify-center items-center rounded-full  bg-purple-400 text-white  text-xs font-bold '>
                        {options.archive[1] > 9 ? '+9' : options.archive[1]}
                      </span>
                    </div>
                    {t('common:archived_conversations')}
                  </button>
                </Menu.Item>

                <Menu.Item>
                  <button
                    className={`${
                      options.blocked[0] ? 'bg-mainBlue text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 gap-2 py-2 text-sm`}
                    onClick={() => {
                      setValue('options.archive[0]', false);
                      setValue('options.blocked[0]', true);
                      setValue('options.inbox[0]', false);
                      onSwitch();
                    }}
                  >
                    <div className='relative w-max'>
                      <NoSymbolIcon className='mr-2 h-6 w-6' />
                      <span className='w-[19px] h-[19px] absolute flex -top-1 -right-1 justify-center items-center rounded-full  bg-red-400 text-white  text-xs font-bold '>
                        {options.blocked[1] > 9 ? '+9' : options.blocked[1]}
                      </span>
                    </div>
                    {t('common:blocked_conv')}
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
