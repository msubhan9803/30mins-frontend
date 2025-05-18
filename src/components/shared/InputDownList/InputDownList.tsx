import {PlusIcon} from '@heroicons/react/24/outline';
import {XMarkIcon} from '@heroicons/react/20/solid';
import {Field} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import React, {useState} from 'react';

type IProps = {
  title?: String;
  type: 'text' | 'email';
  BindListItems: (value: any) => void;
  list: Array<String>;
};

const InputDownList = ({list, type, BindListItems, title}: IProps) => {
  const {t} = useTranslation();
  const [value, setValue] = useState<string>('');

  const handleKeyEnterDown = e => {
    try {
      if (e.which === 13 && value !== '') {
        if (type === 'email') {
          // eslint-disable-next-line
          if (/^([a-zA-Z0-9_\\.\\-])+\@([a-zA-Z0-9\\.])/.exec(value)) {
            BindListItems;
            setValue('');
            e.preventDefault();
          } else {
            // e.preventDefault();
          }
        } else {
          BindListItems && BindListItems([...list, value]);
          setValue('');
          e.preventDefault();
        }
      }
    } catch (err) {} /* eslint-disable-line */
  };

  const handleAddClick = () => {
    handleKeyEnterDown({which: 13});
  };

  const HandleDeleteItem = index => {
    try {
      const newlist = [...list];
      newlist.splice(index, 1);
      BindListItems && BindListItems(newlist);
    } catch (err) {} /* eslint-disable-line */
  };

  return (
    <div className='col-span-6 sm:col-span-3'>
      <label htmlFor='first-name' className='block text-sm font-medium text-gray-700'>
        {title ? t(`common:${title}`) : 'title'}
      </label>
      <div className='flex w-full flex-row h-10 '>
        <Field
          className='w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mainBlue  sm:text-sm'
          value={value}
          type={type}
          id={title ? title : 'title'}
          name={title ? title : 'title'}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => handleKeyEnterDown(e)}
        />
        <div
          className='w-10 ml-2 flex justify-end border rounded-md shadow-sm cursor-pointer text-gray-700 active:bg-mainBlue active:text-white'
          onClick={() => handleAddClick()}
        >
          <PlusIcon className='block m-1' />
        </div>
      </div>
      <ul className='w-full mt-2 pr-2 overflow-y-scroll overflow-x-hidden shadow-sm h-44 max-h-44 border border-gray-200 rounded-sm'>
        {list &&
          list.map((v, i) => (
            <li
              key={i}
              className='my-1 mx-1 py-1 flex w-full px-2 border border-gray-300 rounded-md'
            >
              <span className='text-sm font-medium text-gray-900'>{v}</span>
              <XMarkIcon
                className='ml-auto cursor-pointer text-gray-600 hover:text-red-600'
                onClick={() => HandleDeleteItem(i)}
                width={24}
                height={24}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default InputDownList;
