import useTranslation from 'next-translate/useTranslation';
import {useState} from 'react';
import Field from '../forms/field';
import Select from './select';
import {IProps} from './constants';
import TagElement from './tag-element';

export default function FieldSearchTags({onChange, value, initialTags}: IProps) {
  const {t} = useTranslation();
  const [filterValue, setfilterValue] = useState('');
  return (
    <div className='flex flex-col w-full gap-2'>
      <div className='flex flex-row w-full gap-2'>
        <div className='flex flex-col w-full'>
          <div className='flex flex-row gap-2 items-start'>
            <Field label='' className='w-full'>
              <Select
                tag={filterValue}
                selectedOption={value}
                options={initialTags}
                label={t('common:search_tags')}
                onChange={e => {
                  setfilterValue(e);
                }}
                onSelectedChange={e => {
                  if (!value.includes(e)) {
                    onChange([...value, e]);
                  }
                }}
              />
            </Field>
          </div>
        </div>
      </div>

      {value?.length > 0 && (
        <div className='flex gap-3 flex-wrap p-2 flex-row content-start items-center h-max max-h-max border rounded-md overflow-hidden'>
          {value.map((el, idx) => (
            <TagElement
              key={idx}
              value={el}
              onRemove={() => onChange(value.filter(e => e !== el))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
