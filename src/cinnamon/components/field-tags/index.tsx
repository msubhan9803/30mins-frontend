import {useFormik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {useEffect} from 'react';
import Button from '../button';
import {FieldError} from '../forms/error';
import Field from '../forms/field';
import {IProps, schema} from './constants';
import TagElement from './tag-element';

export default function FieldTags({onChange, title, value}: IProps) {
  const {t} = useTranslation();
  const {errors, handleChange, setValues, setFieldValue, submitForm, values} = useFormik({
    initialValues: {value, newTag: ''},
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: () => {
      const newValue = values.newTag.trim();

      if (newValue !== '') {
        setValues({newTag: '', value: [...values.value, newValue]});
      }
    },
  });

  useEffect(() => {
    onChange(values.value);
  }, [values.value]);

  return (
    <form className='flex flex-col w-full gap-2'>
      <div className='flex flex-row w-full gap-2'>
        <div className='flex flex-col w-full'>
          <label className='block text-md font-medium text-gray-700'>
            {title ? title : t('common:search_tags')}
          </label>
          <div className='flex flex-row gap-2 items-start'>
            <Field
              label=''
              className='w-full'
              error={
                (errors.newTag && <FieldError message={t(`common:${errors.newTag}`)} />) ||
                (errors.value && <FieldError message={t(`common:${errors.value}`)} />)
              }
            >
              <input
                className='px-4 py-2 w-full border text-base shadow-sm focus:ring-mainBlue focus:ring-offset-0 focus:ring-0 focus:border-mainBlue border-gray-300 rounded-lg appearance-none hover:appearance-none'
                name='newTag'
                onKeyDown={e => e.key === 'Enter' && (submitForm(), e.preventDefault())}
                value={values.newTag}
                onChange={handleChange}
              />
            </Field>
            <Button
              type={'button'}
              variant='solid'
              className='h-[40px] mt-1'
              onSubmit={submitForm}
              onClick={async () => {
                await submitForm();
              }}
            >
              {t('common:add_tag')}
            </Button>
          </div>
        </div>
      </div>

      {value.length > 0 && (
        <div className='flex gap-3 flex-wrap p-2 flex-row content-start items-center h-max max-h-max border rounded-md overflow-hidden'>
          {value.map((el, idx) => (
            <TagElement
              key={idx}
              value={el}
              onRemove={() =>
                setFieldValue(
                  'value',
                  value.filter(e => e !== el)
                )
              }
            />
          ))}
        </div>
      )}
    </form>
  );
}
