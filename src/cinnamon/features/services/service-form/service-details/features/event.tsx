import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';

import {FieldError} from '@root/components/forms/error';
import Field from '@components/forms/field';
import Input from '@components/forms/input';
import CKEditor from 'components/shared/Ckeditor/Ckeditor';
import DropDownComponent from 'components/shared/DropDownComponent';
import CheckBox from '@root/components/forms/checkbox';
import FieldTags from '@root/components/field-tags';

import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/20/solid';

const selectEventRecurrings = [
  {
    value: 'NOT_RECURRING',
    key: 'Not Recurring',
  },
  {value: 'WEEKLY', key: 'Weekly'},
  {value: 'MONTHLY', key: 'Monthly'},
];

export default function Event({values, handleChange, errors, setValue, slugify, user}: any) {
  const {t} = useTranslation();

  return (
    <>
      <div className={classNames(['grid grid-cols-4 gap-4 items-stretch sm:items-start'])}>
        <div
          className={classNames([
            'col-span-4 xl:col-span-2 flex flex-col flex-grow justify-start align-start',
            'justify-end',
          ])}
        >
          <Field
            label={t('common:Title')}
            error={errors.serviceTitle && <FieldError message={errors.serviceTitle} />}
            className=''
            required
          >
            <Input
              type='text'
              placeholder={t(`common:event_title_placehodler`)}
              handleChange={e => {
                setValue('serviceTitle', e.target.value);
                setValue('serviceSlug', slugify(e.target.value));
              }}
              value={values.serviceTitle}
            />
          </Field>
        </div>

        <div
          className={classNames([
            'meeting-field-wrapper md:col-span-2 xl:col-span-1 flex flex-col min-[428px]:bg-red-500',
            'justify-end',
          ])}
        >
          <Field label={t(`common:Duration`)}>
            <div className='flex flex-grow'>
              <Input
                type='number'
                handleChange={el => {
                  Number(el.target.value) > 300 || Number(el.target.value) < 0
                    ? el.preventDefault()
                    : setValue('serviceDuration', parseInt(el.target.value, 10));
                }}
                styles='rounded-r-none border-gray-300 w-1/2 py-8'
                placeholder='15'
                value={values.serviceDuration.toString()}
                maxLength={3}
                min='5'
                max='300'
                onKeyDown={e =>
                  ['e', 'E', '+', '-', '.', ',', ' '].includes(e.key) && e.preventDefault()
                }
              />
              <div className='flex flex-col border border-l-0 border-gray-300 w-11 justify-between items-center'>
                <button
                  onClick={() => {
                    (values.serviceDuration || 0) + 5 < 300 &&
                      setValue('serviceDuration', (values.serviceDuration || 0) + 5);
                  }}
                  className='w-full flex justify-center pt-0.5 h-1/2 border-b border-gray-300 hover:bg-gray-200'
                >
                  <ChevronUpIcon className='w-5 h-5' />
                </button>
                <button
                  onClick={() =>
                    (values.serviceDuration || 0) >= 5 &&
                    setValue('serviceDuration', (values.serviceDuration || 0) - 5)
                  }
                  className='w-full flex justify-center pt-0.5 h-1/2 hover:bg-gray-200'
                >
                  <ChevronDownIcon className='w-5 h-5' />
                </button>
              </div>
              <div className='border border-gray-300 border-l-0 rounded-r-lg flex-grow w-max justify-start px-4 items-center flex bg-gray-200 bg-opacity-60'>
                {t('common:minutes')}
              </div>
            </div>
          </Field>
        </div>

        <div
          className={classNames([
            'meeting-field-wrapper self-start md:col-span-2 xl:col-span-1 flex flex-col',
            'justify-end',
          ])}
        >
          <Field label={t(`common:attendee_limit`)}>
            <div className='flex flex-grow'>
              <Input
                type='number'
                handleChange={el => {
                  Number(el.target.value) > 100 || Number(el.target.value) < 0
                    ? el.preventDefault()
                    : setValue('serviceAttendeeLimit', parseInt(el.target.value, 10));
                }}
                styles='rounded-r-none border-gray-300 w-1/2 py-8'
                placeholder='10'
                value={values.serviceAttendeeLimit.toString()}
                maxLength={3}
                min='1'
                max='100'
                onKeyDown={e =>
                  ['e', 'E', '+', '-', '.', ',', ' '].includes(e.key) && e.preventDefault()
                }
              />
              <div className='flex flex-col border border-l-0 border-gray-300 w-11 justify-between items-center'>
                <button
                  onClick={() => {
                    (values.serviceAttendeeLimit || 0) + 1 < 100 &&
                      setValue('serviceAttendeeLimit', (values.serviceAttendeeLimit || 0) + 1);
                  }}
                  className='w-full flex justify-center pt-0.5 h-1/2 border-b border-gray-300 hover:bg-gray-200'
                >
                  <ChevronUpIcon className='w-5 h-5' />
                </button>
                <button
                  onClick={() =>
                    (values.serviceAttendeeLimit || 0) >= 1 &&
                    setValue('serviceAttendeeLimit', (values.serviceAttendeeLimit || 0) - 1)
                  }
                  className='w-full flex justify-center pt-0.5 h-1/2 hover:bg-gray-200'
                >
                  <ChevronDownIcon className='w-5 h-5' />
                </button>
              </div>
              <div className='border border-gray-300 border-l-0 rounded-r-lg flex-grow w-max justify-start px-4 items-center flex bg-gray-200 bg-opacity-60'>
                {t('common:limit')}
              </div>
            </div>
          </Field>
        </div>

        <div
          className={classNames(['col-span-4 md:col-span-2 flex flex-grow mb-8 md:mb-0 w-full'])}
        >
          <Field
            label={t('common:Url')}
            classes='flex-grow w-full'
            error={errors.serviceSlug && <FieldError message={errors.serviceSlug} />}
            required
          >
            <div className='flex flex-grow w-full'>
              <div className='w-1/2 border border-gray-300 border-r-0 text-xs font-bold rounded-l-lg justify-start pl-4 pr-2 items-center flex bg-gray-200 bg-opacity-60'>
                <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{`https://30mins.com/${user?.username}/events/`}</p>
              </div>

              <Input
                type='text'
                handleChange={handleChange('serviceSlug')}
                styles='rounded-l-none border-gray-300 py-8'
                placeholder=''
                onKeyDown={el =>
                  ['+', '.', ',', ' ', '*', '/', '\\', '='].includes(el.key) && el.preventDefault()
                }
                onPaste={el => el.preventDefault()}
                value={values.serviceSlug}
              />
            </div>
          </Field>
        </div>

        <div className='col-span-4 md:col-span-2 flex w-full '>
          <Field label={t(`common:date_time`)} classes='flex w-full justify-start'>
            <Input
              type='datetime-local'
              value={values.serviceDateTime}
              handleChange={e => {
                setValue('serviceDateTime', e.target.value);
              }}
            />
          </Field>
        </div>

        <div className='col-span-4 md:col-span-2 flex w-full relative'>
          <Field label={t('common:Recurring')} classes='flex w-full justify-start'>
            <DropDownComponent
              onChange={handleChange}
              value={values.serviceRecurring}
              name='serviceRecurring'
              options={selectEventRecurrings}
            />
          </Field>
          {values.serviceRecurring !== 'NOT_RECURRING' && (
            <span className='absolute bottom-[-14px] left-0 text-xs text-red-500 leading-none font-medium'>
              *This Event will be recurring indefinitely until Removed
            </span>
          )}
        </div>

        <div className='col-span-4 md:col-span-2 flex w-full mt-auto'>
          <CheckBox
            code='isPublic'
            label='Show this Event on the Public Search Page'
            style='items-center h-auto'
            handleChange={e => setValue('isPublic', e.target.checked)}
            selected={values.isPublic}
          />
        </div>

        <div className='col-span-4 flex w-full'>
          <Field
            label={t('common:brief_description')}
            error={errors.serviceDescription && <FieldError message={errors.serviceDescription} />}
            required
            isEditor
            className='w-full'
          >
            <CKEditor
              name=''
              value={values.serviceDescription}
              setDescLength={undefined}
              onChange={handleChange('serviceDescription')}
            />
          </Field>
        </div>

        <div className='col-span-4 flex w-full'>
          <Field
            label={t('common:message_to_attendees')}
            isEditor
            required
            className='w-full'
            error={
              errors.serviceAttendeesMessage && (
                <FieldError message={errors.serviceAttendeesMessage} />
              )
            }
          >
            <CKEditor
              name=''
              value={values.serviceAttendeesMessage}
              setDescLength={undefined}
              onChange={handleChange('serviceAttendeesMessage')}
            />
          </Field>
        </div>

        <div className='col-span-4 flex w-full'>
          <FieldTags value={values.searchTags ?? []} onChange={e => setValue('searchTags', e)} />
        </div>
      </div>
    </>
  );
}
