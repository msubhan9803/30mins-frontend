import {Fragment, useState} from 'react';
import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon} from '@heroicons/react/20/solid';
import classNames from 'classnames';

type Props = {
  options?: any;
  selectedOption: Array<string>;
  onSelectedChange: (value) => void;
  onChange?: any;
  tag: string;
  label?: any;
  code?: any;
  mode?: any;
};

export default function Select({
  options,
  selectedOption,
  onSelectedChange,
  onChange,
  label,
  tag,
}: Props) {
  const [ShowList, setShowList] = useState(false);
  return (
    <div className='w-full'>
      <Listbox value={options} onChange={() => {}}>
        <div className='relative'>
          <Listbox.Label
            className={classNames(
              'flex text-base border border-gray-300 flex-row w-full overflow-hidden cursor-default rounded-r-lg bg-white text-left focus:outline-none',
              label ? 'rounded-lg shadow-md' : 'border-l-0'
            )}
          >
            {label && (
              <span className='border-r p-2 min-w-max border-gray-300 py-3 text-gray-500 font-medium'>
                {label}
              </span>
            )}
            <input
              type={'text'}
              className='w-full min-h-max p-2 bg-slate-100 border-0'
              onChange={({target: {value}}) => onChange(value)}
              onFocus={() => setShowList(true)}
              onBlur={() => setShowList(false)}
              value={tag}
            />
          </Listbox.Label>

          <Transition
            show={ShowList}
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {options
                ?.filter(el => el.startsWith(tag))
                .map((option, i) => (
                  <Listbox.Option
                    key={i}
                    className={({active}) =>
                      `relative cursor-pointer select-none py-2 px-4 ${
                        active ? 'bg-blue-100 text-mainBlue' : 'text-gray-900'
                      }`
                    }
                    value={option}
                    onClick={() => {
                      onSelectedChange(option);
                    }}
                  >
                    <div className='w-full h-full'>
                      <span
                        className={`block truncate pl-6 ${
                          selectedOption.includes(option) ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option}
                      </span>
                      {selectedOption.includes(option) ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-mainBlue'>
                          <CheckIcon className='h-5 w-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </div>
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
