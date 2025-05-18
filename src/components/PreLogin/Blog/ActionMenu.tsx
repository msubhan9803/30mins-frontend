import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import {Menu, Transition} from '@headlessui/react';

import {EllipsisHorizontalIcon, PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline';

export default function ActionMenu({id, handleOpenDialog}) {
  const router = useRouter();

  const {t} = useTranslation('common');

  const handleEdit = () => {
    router.push(`/user/posts/post-form/?mode=edit&pid=${id}`);
  };

  return (
    <Menu as='div' className='relative z-10 inline-block text-left'>
      <div>
        <Menu.Button className='p-2 flex items-center justify-center cursor-pointer'>
          <EllipsisHorizontalIcon className='w-6 h-6' />
        </Menu.Button>
      </div>
      <Transition
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute right-2 -mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='px-1 py-1'>
            <Menu.Item>
              <button
                className='group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm text-mainText transition-colors hover:bg-mainBlue hover:text-white'
                onClick={handleEdit}
              >
                <PencilSquareIcon className='w-5 h-5' />
                <span className='text-base font-medium'>{t('edit_post')}</span>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className='group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm text-mainText transition-colors hover:bg-mainBlue hover:text-white'
                onClick={handleOpenDialog}
              >
                <TrashIcon className='w-5 h-5' />
                <span className='text-base font-medium'>{t('delete_post')}</span>
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
