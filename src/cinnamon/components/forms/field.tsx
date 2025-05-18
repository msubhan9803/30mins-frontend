import {HTMLAttributes, ReactNode} from 'react';

type Props = {
  label: string;
  children: ReactNode;
  isEditor?: boolean;
  classes?: string;
  error?: any;
  className?: HTMLAttributes<HTMLDivElement>['className'];
  style?: HTMLAttributes<HTMLDivElement>['style'];
  required?: boolean;
};

const Field = ({
  label,
  children,
  isEditor,
  classes,
  error,
  style,
  className,
  required = false,
}: Props) => (
  <div
    style={style}
    className={`${classes ? classes : ''} ${className ? className : ''} flex flex-col h-max`}
  >
    <label htmlFor={label?.replace(' ', '-')} className='block text-md font-medium text-gray-700'>
      {label} {required && <span className='text-red-400 font-extrabold'>*</span>}
    </label>
    <div
      className={`${!isEditor && 'flex'} mt-1 flex-grow w-full min-w-full editor-field items-start`}
    >
      {children}
    </div>
    {error ? error : null}
  </div>
);

export default Field;
