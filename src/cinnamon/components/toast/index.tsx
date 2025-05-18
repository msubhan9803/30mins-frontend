import {Fragment, useEffect} from 'react';
import {Transition} from '@headlessui/react';
import classNames from 'classnames';

export default function Toast({variant, visible, setVisible, message}) {
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  }, [visible]);

  return (
    <Transition
      show={visible}
      as={Fragment}
      enter='duration-300'
      enterFrom='fixed -bottom-14'
      enterTo='fixed bottom-8'
      leave='duration-300'
      leaveFrom='fixed bottom-8'
      leaveTo='fixed -bottom-14'
    >
      <div className='flex fixed left-0 right-0 h-14 justify-end px-8'>
        <div
          className={classNames(
            'h-14 px-8 rounded-xl text-white flex items-center text-lg font-medium',
            variant === 'green' && 'bg-lime-600'
          )}
        >
          {message}
        </div>
      </div>
    </Transition>
  );
}
