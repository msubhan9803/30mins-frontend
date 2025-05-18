import {ExclamationCircleIcon} from '@heroicons/react/20/solid';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';

type IProps = {
  message: any;
  styles: any;
  variant?: 'Red' | 'Blue';
  className?: string;
};

export default function Error({message, styles = '', variant = 'Red', className = ''}: IProps) {
  const {t} = useTranslation('common');
  return (
    <div
      className={classNames(
        'flex space-x-2 px-2 font-medium items-center rounded-md border ',
        variant === 'Red' && 'text-red-500 border-red-300',
        variant === 'Blue' && 'text-mainBlue border-mainBlue',
        className,
        styles
      )}
    >
      <ExclamationCircleIcon className='w-5 h-5 mt-0.5' />
      <span
        className={classNames([
          'py-1 border-l px-4',
          variant === 'Red' && 'border-red-300',
          variant === 'Blue' && 'border-mainBlue',
        ])}
      >
        {t(message)}
      </span>
    </div>
  );
}

export function FieldError({
  message,
  position = 'bottom',
  breakW = 'words',
  className = '',
}: {
  message: any;
  position?: 'top' | 'center' | 'bottom';
  breakW?: 'all' | 'words';
  className?: string;
}) {
  const {t} = useTranslation('common');
  return (
    <div
      className={classNames(
        'bg-red-50 flex space-x-2 px-2 mx-4 text-sm text-red-500 mb-19px font-medium items-center border-red-200',
        position === 'top' && 'rounded-t-md border border-b-0',
        position === 'center' && 'rounded-b-md border rounded-t-md mt-2',
        position === 'bottom' && 'rounded-b-md border border-t-0',
        className
      )}
    >
      <ExclamationCircleIcon className='w-5 h-5 mt-0.5' />
      <span className={`py-1 border-l break-${breakW} border-l-red-200 px-4`}>
        {message?.message ? t(message.message) : t(message)}
      </span>
    </div>
  );
}
