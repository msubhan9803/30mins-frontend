import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import {DOMAttributes} from 'react';
import InputField from '@root/components/forms/input';

const Input = ({
  handleChange,
  handleBlur,
  value,
  type,
  name,
  label,
  required,
  errors,
  touched,
  className,
  autoFocus,
  onKeyDown,
  onPaste,
}: {
  handleChange;
  handleBlur;
  autoFocus?: boolean;
  value;
  type;
  name;
  label;
  required;
  errors;
  touched;
  onKeyDown?: DOMAttributes<HTMLInputElement>['onKeyDown'];
  className?: string;
  onPaste?: DOMAttributes<HTMLInputElement>['onPaste'];
}) => (
  <div className={className}>
    <Field
      required={required}
      label={label}
      error={errors && touched && <FieldError breakW='words' message={errors} />}
    >
      <InputField
        onKeyDown={onKeyDown}
        type={type}
        autoFocus={autoFocus}
        onPaste={onPaste}
        handleChange={handleChange}
        onBlur={handleBlur}
        value={value}
        name={name}
      />
    </Field>
  </div>
);

export default Input;
