import classNames from 'classnames';
import Image from 'next/image';
import {RadioGroup} from '@headlessui/react';

type Props = {
  value: string | number;
  styles: string;
  variant: string;
  image?: string;
  title: string;
  description?: string;
};

const RadioButton = ({value, styles, variant, image, title, description}: Props) => (
  <RadioGroup.Option
    value={value}
    className={({checked}) =>
      classNames(
        checked ? 'border-mainBlue' : 'bg-white',
        variant === 'card' ? 'px-6' : 'px-4',
        'flex-grow select-none flex-shrink-0 flex cursor-pointer rounded-lg py-3 border border-gray-300 shadow-md',
        styles
      )
    }
  >
    {({checked}) => (
      <RadioGroup.Label
        as='div'
        className={classNames(
          checked ? 'text-mainBlue' : 'text-gray-600',
          variant === 'card' && 'space-x-6',
          variant === 'button' && 'flex-col text-lg space-y-3',
          'cursor-pointer flex flex-grow py-2 font-medium items-center'
        )}
      >
        {image && (
          <Image
            src={image}
            height={variant === 'card' ? 160 : 48}
            width={variant === 'card' ? 160 : 48}
            alt=''
          />
        )}
        {variant === 'button' && <span className='capitalize'>{title}</span>}
        {variant === 'card' && (
          <div className='text-sm flex flex-col'>
            <RadioGroup.Label
              className={classNames(
                checked ? 'text-mainBlue' : 'text-mainText',
                'text-lg font-medium '
              )}
            >
              {title}
            </RadioGroup.Label>
            <RadioGroup.Description as='span' className='font-normal text-gray-500'>
              {description}
            </RadioGroup.Description>
          </div>
        )}
      </RadioGroup.Label>
    )}
  </RadioGroup.Option>
);

export default RadioButton;
