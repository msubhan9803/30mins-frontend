import {FieldError} from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/20/solid';
import Field from '@components/forms/field';
import Input from '@components/forms/input';
import CKEditor from 'components/shared/Ckeditor/Ckeditor';
import CheckBox from '@root/components/forms/checkbox';
import classNames from 'classnames';
// import {UserContext} from '@root/context/user';
// import {SERVICE_TYPES} from 'constants/enums';
// import serviceTypes from '../service-type/constants';
import {TranslationTexts} from '../constants';

export default function MEETING({
  handleChange,
  serviceTitle,
  serviceSlug,
  meetingDuration,
  meetingRecurring,
  serviceDescription,
  meetingType,
  errors,
  serviceType,
  setValue,
  slugify,
  user,
}) {
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
            label={t('common:service_title')}
            error={errors.serviceTitle && <FieldError message={errors.serviceTitle} />}
            className=''
            required
          >
            <Input
              type='text'
              placeholder={t(`common:${TranslationTexts[serviceType]?.title_input_placeholder}`)}
              handleChange={e => {
                setValue('serviceTitle', e.target.value);
                setValue('serviceSlug', slugify(e.target.value));
              }}
              value={serviceTitle}
            />
          </Field>
        </div>

        <div
          className={classNames([
            'meeting-field-wrapper md:col-span-2 xl:col-span-1 flex flex-col min-[428px]:bg-red-500',
            'justify-end',
          ])}
        >
          <Field
            label={t(`common:${TranslationTexts[serviceType]?.title_input_two}`)}
            error={errors.meetingDuration && <FieldError message={errors.meetingDuration} />}
          >
            <div className='flex flex-grow'>
              <Input
                type='number'
                handleChange={el => {
                  Number(el.target.value) > 300 || Number(el.target.value) < 0
                    ? el.preventDefault()
                    : setValue('meetingDuration', parseInt(el.target.value, 10));
                }}
                styles='rounded-r-none border-gray-300 w-1/2 py-8'
                placeholder='15'
                value={meetingDuration.toString()}
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
                    (meetingDuration || 0) + 5 < 300 &&
                      setValue('meetingDuration', (meetingDuration || 0) + 5);
                  }}
                  className='w-full flex justify-center pt-0.5 h-1/2 border-b border-gray-300 hover:bg-gray-200'
                >
                  <ChevronUpIcon className='w-5 h-5' />
                </button>
                <button
                  onClick={() =>
                    (meetingDuration || 0) >= 5 &&
                    setValue('meetingDuration', (meetingDuration || 0) - 5)
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
          <Field
            label={t(`common:Allow_Recurring_Question`)}
            error={errors.meetingRecurring && <FieldError message={errors.meetingRecurring} />}
          >
            <div className='flex flex-row justify-center items-center h-12 w-full border border-gray-300 rounded-lg'>
              <CheckBox
                key={1}
                code={'Yes'}
                label={'Yes'}
                handleChange={e => {
                  setValue('isRecurring', e.target.checked);
                  setValue('meetingRecurring', e.target.checked);
                }}
                selected={meetingRecurring}
                style='rounded-r-none border-gray-300 w-2/5 py-3 mx-2 px-2'
              />
              <div className=' border-gray-300 h-full rounded-r-lg flex-grow justify-start px-4 items-center flex bg-gray-200 bg-opacity-60'>
                {t('common:txt_weekly')}
              </div>
            </div>
          </Field>
        </div>

        <div
          className={classNames(['col-span-4 md:col-span-2 flex flex-grow mb-8 md:mb-0 w-full'])}
        >
          <Field
            label={t('common:service_url')}
            classes='flex-grow w-full'
            error={errors.serviceSlug && <FieldError message={errors.serviceSlug} />}
            required
          >
            <div className='flex flex-grow w-full'>
              <div className='w-1/2 border border-gray-300 border-r-0 text-xs font-bold rounded-l-lg justify-start pl-4 pr-2 items-center flex bg-gray-200 bg-opacity-60'>
                <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{`https://30mins.com/${user?.username}/`}</p>
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
                value={serviceSlug}
              />
            </div>
          </Field>
        </div>

        <div className='col-span-4 md:col-span-2 flex w-full '>
          <Field
            label={t('common:meeting_type')}
            error={errors.meetingType && <FieldError message={errors.meetingType} />}
            classes='flex w-full justify-start'
          >
            <div className='meeting-checkbox-wrapper  flex flex-wrap md:flex-row  w-full border border-gray-300 rounded-lg h-max md:min-h-[50px]'>
              {user?.allowedConferenceTypes!.map(type => (
                <CheckBox
                  key={type}
                  code={type}
                  label={t(`common:${type}`)}
                  handleChange={handleChange('meetingType')}
                  selected={meetingType && meetingType.includes(type)}
                  style='py-1'
                />
              ))}
            </div>
          </Field>
        </div>

        <div className={classNames(['col-span-4 flex w-full'])}>
          <Field
            label={t('common:service_description')}
            error={errors.serviceDescription && <FieldError message={errors.serviceDescription} />}
            required
            isEditor
            className='w-full'
          >
            <CKEditor
              name=''
              value={serviceDescription}
              setDescLength={undefined}
              onChange={handleChange('serviceDescription')}
            />
          </Field>
        </div>
      </div>
    </>
  );
}
