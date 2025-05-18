import classNames from 'classnames';
import {DOMAttributes, InputHTMLAttributes} from 'react';

type Props = {
  handleChange: InputHTMLAttributes<HTMLInputElement>['onChange'];
  type: InputHTMLAttributes<HTMLInputElement>['type'];
  styles?: InputHTMLAttributes<HTMLInputElement>['className'];
  className?: InputHTMLAttributes<HTMLInputElement>['className'];
  value?: string | number | undefined;
  placeholder?: string;
  id?: string;
  name?: string;
  onKeyDown?: DOMAttributes<HTMLInputElement>['onKeyDown'];
  onKeyPress?: DOMAttributes<HTMLInputElement>['onKeyPress'];
  onBlur?: DOMAttributes<HTMLInputElement>['onBlur'];
  onPaste?: DOMAttributes<HTMLInputElement>['onPaste'];
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  size?: number;
};

const Input = ({
  handleChange,
  placeholder,
  styles,
  type,
  value,
  id,
  name,
  onKeyPress,
  onKeyDown,
  min,
  max,
  disabled,
  required = false,
  maxLength,
  minLength,
  onBlur,
  onPaste,
  className,
  autoFocus,
  size,
}: Props) => {
  const maxLengthCheck = object => {
    if (maxLength) {
      if (object.target.value.length > object.target.maxLength) {
        object.target.value = object.target.value.slice(0, object.target.maxLength);
      }
    }
  };
  return (
    <input
      type={type}
      size={size}
      className={classNames(
        'px-4 py-3 w-full text-base shadow-sm focus:ring-mainBlue focus:ring-offset-0 focus:ring-0 focus:border-mainBlue border-gray-300 rounded-lg appearance-none hover:appearance-none',
        styles,
        className
      )}
      autoFocus={autoFocus}
      required={required}
      id={id}
      name={name}
      onPaste={onPaste}
      onChange={handleChange}
      placeholder={placeholder}
      value={value}
      onKeyPress={onKeyPress}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      minLength={minLength}
      min={min}
      max={max}
      disabled={disabled}
      maxLength={maxLength}
      onInput={maxLengthCheck}
    />
  );
};

export default Input;
