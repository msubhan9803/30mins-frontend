import classNames from 'classnames';
// import {XMarkIcon} from '@heroicons/react/24/outline';

const CheckBox = ({code, label, handleChange, selected, style, size = 'large'}) => (
  <label
    htmlFor={code}
    className={classNames(
      'flex rounded-lg border-gray-300 h-full items-center cursor-pointer ml-0 px-2 my-2',
      selected && 'border-mainBlue',
      style,
      size === 'small' && '!text-sm flex-col'
    )}
  >
    <input
      id={code}
      type='checkbox'
      className={classNames(
        'focus:ring-transparent h-5 w-5 text-mainBlue border-gray-300 rounded cursor-pointer',
        size === 'small' && '!w-4 !h-4'
      )}
      onChange={handleChange}
      value={code}
      checked={selected}
    />

    {/* <XMarkIcon  className='close-icon sm:w-7 w-16  mt-1 border-2 border-slate-400	'/> */}

    <span
      className={classNames(
        'text-gray-600 font-medium text-sm xl:text-base	 ml-2  max-w-md',
        size === 'small' && '!text-sm !ml-0 mt-2'
      )}
    >
      {label}
    </span>
  </label>
);

export default CheckBox;
