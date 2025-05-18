import classNames from 'classnames';

const DropDownComponent = ({name, options, className = '', ...rest}) => (
  <select
    id={name}
    name={name}
    className={classNames([
      'border flex-1 block p-2 w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-md sm:text-sm border-gray-300',
      className,
    ])}
    {...rest}
  >
    {options?.map(option => (
      <option key={option.value} value={option.value}>
        {option.key}
      </option>
    ))}
  </select>
);
export default DropDownComponent;
