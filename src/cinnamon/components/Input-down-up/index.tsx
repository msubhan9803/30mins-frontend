import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/20/solid';
import Field from '@components/forms/field';
import Input from '@components/forms/input';
import dayjs from 'dayjs';
import {IProps} from './constants';

export default function InputDownUp({
  label,
  error,
  handleChange,
  value,
  onClickUp,
  onClickDown,
  type,
  id,
  title,
  onKeyDown,
  maxLength,
  onBlur,
  min = '0',
  max = '1000',
}: IProps) {
  return (
    <Field label={label} error={error}>
      <div className='flex flex-grow'>
        <Input
          type='number'
          id={id}
          handleChange={handleChange}
          onKeyDown={onKeyDown}
          styles='rounded-r-none border-gray-300 w-1/2 py-8'
          placeholder='15'
          min={min}
          max={max}
          maxLength={maxLength}
          onBlur={onBlur}
          value={value}
        />
        <div className='flex flex-col border border-l-0 border-gray-300 w-11 justify-between items-center'>
          <button
            onClick={onClickUp}
            onCompositionEndCapture={onClickUp}
            className='w-full flex justify-center pt-0.5 h-1/2 border-b border-gray-300 hover:bg-gray-200'
          >
            <ChevronUpIcon className='w-5 h-5' />
          </button>
          <button
            onClick={onClickDown}
            className='w-full flex justify-center pt-0.5 h-1/2 hover:bg-gray-200'
          >
            <ChevronDownIcon className='w-5 h-5' />
          </button>
        </div>
        <div className='border border-gray-300 border-l-0 rounded-r-lg flex-grow w-max justify-start px-4 items-center flex bg-gray-200 bg-opacity-60'>
          {type === 'date' ? dayjs(new Date()).add(value, 'day').format('MMM D, YYYY') : title}
        </div>
      </div>
    </Field>
  );
}
