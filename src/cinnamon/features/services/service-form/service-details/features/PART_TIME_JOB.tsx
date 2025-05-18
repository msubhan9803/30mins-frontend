import {FieldError} from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import Field from '@components/forms/field';
import Input from '@components/forms/input';
import CKEditor from 'components/shared/Ckeditor/Ckeditor';
import classNames from 'classnames';
import {TranslationTexts} from '../constants';

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function PART_TIME_JOB({
  handleChange,
  serviceTitle,
  serviceSlug,
  serviceDescription,
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
            'col-span-4 md:col-span-2 order-1 flex flex-col flex-grow justify-start align-start',
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
                styles='rounded-l-none border-gray-300 py-8 px-2 w-full'
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
