import classNames from 'classnames';
import {ButtonHTMLAttributes, DetailedHTMLProps, DOMAttributes} from 'react';

interface Props
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  onClick?: DOMAttributes<HTMLButtonElement>['onClick'];
  children: any;
  variant: 'solid' | 'ghost' | 'outline' | 'cancel';
  size?: string;
  type?: 'submit' | 'reset' | 'button' | undefined;
}

const Button = ({children, variant, size, className, type, onClick, ...rest}: Props) => (
  <button
    type={type || 'button'}
    className={classNames(
      'flex flex-grow-0 flex-shrink-0 select-none active:opacity-70 items-center px-4 py-2 h-9 rounded-lg shadow-sm text-md font-medium focus:outline-none text-xs md:text-sm justify-center',
      !size ? 'px-4 py-2 text-md' : 'px-4 py-1 text-sm',
      variant === 'solid' &&
        'bg-mainBlue text-white hover:bg-transparent hover:text-mainBlue hover:ring-1 hover:ring-mainBlue',
      variant === 'ghost' &&
        'bg-gray-200 text-gray-500 hover:bg-transparent hover:text-gray-500 hover:ring-1 hover:ring-gray-500',
      variant === 'cancel' &&
        'bg-red-500 text-white hover:bg-transparent hover:text-red-500 hover:ring-1 hover:ring-red-500',
      variant === 'outline' &&
        'bg-none text-mainBlue hover:bg-mainBlue hover:text-white ring-1 ring-mainBlue',
      size === 'full' && 'w-full',
      rest.disabled &&
        'disabled:bg-slate-500 ring-0 hover:ring-0 disabled:opacity-20 disabled:text-white',
      className
    )}
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
