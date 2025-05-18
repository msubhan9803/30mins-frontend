import {Fragment} from 'react';
import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid';
import classNames from 'classnames';

type Props = {
  options?: any;
  selectedOption?: any;
  selectedDisplay?: any;
  onChange?: any;
  length?: number;
  label?: any;
  code?: any;
  index?: any;
  mode?: any;
  type?: any;
  disabled?: boolean;
};

export default function Select({
  options,
  selectedOption,
  selectedDisplay,
  onChange,
  label,
  length,
  code,
  index,
  mode,
  type,
  disabled = false,
}: Props) {
  return (
    <div
      className={classNames(['w-full', index === length ? 'cursor-pointer' : 'cursor-not-allowed'])}
    >
      <Listbox
        value={selectedOption}
        disabled={disabled}
        onChange={type === 'availability' ? e => onChange(e, code, index, mode) : onChange}
      >
        <div
          className={classNames([
            'relative',
            index === length ? 'cursor-pointer' : 'cursor-not-allowed',
          ])}
        >
          <Listbox.Button
            className={classNames(
              'pr-8 pl-4 flex text-base border border-gray-300 relative w-full rounded-r-lg bg-white text-left focus:outline-none',
              label ? 'rounded-lg shadow-md' : 'border-l-0',
              index === length ? 'cursor-pointer' : 'cursor-not-allowed'
            )}
          >
            {label && (
              <span className='border-r pr-4 border-gray-300 py-3 text-gray-500 font-medium'>
                {label}
              </span>
            )}
            <span className='block flex-shrink-0 px-4 py-3'>
              {type === 'question' ? selectedDisplay : selectedOption}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
            </span>
          </Listbox.Button>
          {options?.length > 0 && (
            <Transition
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                {options.map((option, i) => (
                  <Listbox.Option
                    key={i}
                    className={({active}) =>
                      `relative cursor-pointer select-none py-2 px-4 ${
                        active ? 'bg-blue-100 text-mainBlue' : 'text-gray-900'
                      }`
                    }
                    value={option.code}
                  >
                    {({selected}) => (
                      <>
                        <span
                          className={`block truncate pl-6 ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.label}
                        </span>
                        {selected ? (
                          <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-mainBlue'>
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          )}
        </div>
      </Listbox>
    </div>
  );
}
