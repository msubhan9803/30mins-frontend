import {FieldError} from '@root/components/forms/error';
import InputDownUp from '@root/components/Input-down-up';
import useTranslation from 'next-translate/useTranslation';
import Field from '@components/forms/field';
import Input from '@components/forms/input';
import CKEditor from 'components/shared/Ckeditor/Ckeditor';
import classNames from 'classnames';
// import {UserContext} from '@root/context/user';
// import {SERVICE_TYPES} from 'constants/enums';
// import serviceTypes from '../service-type/constants';
import {number} from 'yup';
import {TranslationTexts} from '../constants';

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function FREELANCING_WORK({
  handleChange,
  serviceTitle,
  serviceSlug,
  serviceDescription,
  dueDate,
  errors,
  serviceType,
  setValue,
  slugify,
  user,
}) {
  const {t} = useTranslation();
  return (
    <>
      <div className={classNames(['grid grid-cols-4 gap-4 items-start'])}>
        <div
          className={classNames([
            'col-span-4 order-1 flex flex-col flex-grow justify-start align-start',
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
              onKeyDown={el =>
                ['+', '.', ',', '*', '/', '\\', '='].includes(el.key) && el.preventDefault()
              }
              onPaste={el => el.preventDefault()}
              value={serviceTitle}
            />
          </Field>
        </div>

        <div
          className={classNames(['col-span-4 md:col-span-2 xl:col-span-2 flex flex-col order-3'])}
        >
          <InputDownUp
            label={t(`common:${TranslationTexts[serviceType]?.title_input_one}`)}
            error={errors.dueDate && <FieldError message={errors.dueDate} />}
            handleChange={async el => {
              try {
                const num = await number().integer().validate(el.target.value);
                if (num?.toString().length! > 0) {
                  if (Number(num) < 0) {
                    setValue('dueDate', Number(num) * -1);
                  } else if (Number(num) === 0) {
                    el.preventDefault();
                  } else {
                    setValue('dueDate', Number(num));
                  }
                }
                // eslint-disable-next-line no-empty
              } catch (err) {}
            }}
            id='dueDate'
            value={dueDate.toString()}
            onKeyDown={el => {
              if (['-', '+', ',', '.'].includes(el.key)) el.preventDefault();
            }}
            onClickUp={() => {
              dueDate < 999 && setValue('dueDate', parseInt(dueDate, 10) + 1);
            }}
            onClickDown={() => {
              dueDate - 1 >= 1 && setValue('dueDate', parseInt(dueDate, 10) - 1);
            }}
            maxLength={3}
            min='1'
            max='1000'
            type={'date'}
            title={t('common:attendees')}
          />
        </div>

        <div
          className={classNames([
            'col-span-4 md:col-span-2 order-2 xl:col-span-2 flex flex-grow mb-8 md:mb-0 w-full',
          ])}
        >
          <Field
            label={t('common:service_url')}
            classes='flex-grow'
            error={errors.serviceSlug && <FieldError message={errors.serviceSlug} />}
            required
          >
            <div className='flex flex-grow'>
              <div className='border border-gray-300 border-r-0 w-full text-xs font-bold rounded-l-lg justify-start pl-4 pr-2 items-center flex bg-gray-200 bg-opacity-60'>
                {`https://30mins.com/${user?.username}/`}
              </div>

              <Input
                type='text'
                handleChange={handleChange('serviceSlug')}
                styles='rounded-l-none border-gray-300 py-8 w-full'
                placeholder=''
                value={serviceSlug}
              />
            </div>
          </Field>
        </div>

        <div className={classNames(['col-span-4 order-4 flex w-full'])}>
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
