import {Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/20/solid';

import classNames from 'classnames';
import React, {useState} from 'react';

export default function TagElement({
  value,
  onRemove,
  className,
}: {
  value: any;
  onRemove: () => void;
  className?: any;
}) {
  const [show, setshow] = useState(false);
  setTimeout(() => {
    setshow(true);
  }, 500);

  return (
    <Transition
      show={show}
      enter='animate-fadeIn duration-300'
      leave='animate-fadeOut duration-500'
      className={classNames([
        'p-2 border gap-2 w-24 hover:shadow shadow-inner shadow-gray-100 flex flex-row justify-between min-w-max items-center rounded-3xl h-max',
        className,
      ])}
    >
      <label className='flex break-all max-w-[300px]'>{value}</label>
      <XMarkIcon
        width={22}
        height={22}
        className='border p-[2px] cursor-pointer border-red-500  rounded-full text-red-500 active:bg-red-500 active:text-white'
        onClick={() => {
          setshow(false);
          setTimeout(onRemove, 500);
        }}
      />{' '}
    </Transition>
  );
}
