const Input = ({
  handleChange,
  handleBlur,
  value,
  type,
  name,
  colSpan,
  label,
  required,
  errors,
  touched,
}) => (
  <div className={`w-full flex flex-col gap-2 mb-4 col-span-${colSpan}`}>
    <label htmlFor={label.replace(' ', '-')} className='block text-md font-medium text-gray-700'>
      {label} {required && <span className='text-red-400 font-extrabold'>*</span>}
    </label>
    <input
      className={`px-4 py-3 w-full text-base shadow-sm focus:ring-mainBlue focus:ring-offset-0 focus:ring-0 focus:border-mainBlue border-gray-300 rounded-lg appearance-none hover:appearance-none`}
      type={type}
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
      name={name}
    />
    {errors && touched && <div className={'text-red-500'}>{errors}</div>}
  </div>
);

export default Input;
