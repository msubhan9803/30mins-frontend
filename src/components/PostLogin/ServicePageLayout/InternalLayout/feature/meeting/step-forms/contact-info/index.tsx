import Field from '@components/forms/field';
import Input from '@components/forms/input';
import {FieldError} from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import {isValidPhoneNumber} from 'react-phone-number-input';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {IFormProps} from '../../constants';
import CheckBox from '@root/components/forms/checkbox';
import {string} from 'yup';
import stripeProductIDs from 'constants/stripeProductIDs';

export default function ContactInfo({
  values,
  errors,
  setFieldError,
  setFieldValue,
  providerUser,
}: IFormProps) {
  const {t} = useTranslation();

  const hasSmsExtension = providerUser?.accountDetails?.activeExtensions.includes(
    stripeProductIDs.EXTENSIONS.SMS_REMINDER
  );

  return (
    <div className='flex flex-col gap-2 w-full sm:w-4/6'>
      <div className={'col-span-1 sm:col-span-4 flex flex-col flex-grow justify-start align-start'}>
        <Field
          label={t('common:your_name')}
          required
          error={
            errors.bookingData?.bookerName && (
              <FieldError message={errors.bookingData?.bookerName} />
            )
          }
          className=''
        >
          <Input
            type='text'
            placeholder={''}
            id='bookingData.bookerName'
            handleChange={async ({target: {value}}) => {
              try {
                const validName = string().required().label('Name');
                await validName.validate(value);
                setFieldError('bookingData.bookerName', undefined);
              } catch (err) {
                setFieldError('bookingData.bookerName', err.message);
              }
              setFieldValue('bookingData.bookerName', value);
            }}
            value={values.bookingData.bookerName}
          />
        </Field>
      </div>

      <div className={'col-span-1 sm:col-span-2 flex flex-col flex-grow justify-start align-start'}>
        <Field
          label={t('common:email_address')}
          error={
            errors.bookingData?.bookerEmail && (
              <FieldError message={errors.bookingData?.bookerEmail} />
            )
          }
          required
          className=''
        >
          <Input
            type='text'
            placeholder={''}
            id='bookingData.bookerEmail'
            onKeyDown={e => {
              if (e.key === ' ') {
                e.preventDefault();
              }
            }}
            handleChange={async ({target: {value}}) => {
              try {
                if (value === values.bookingData.providerEmail) {
                  setFieldError('bookingData.bookerEmail', t('common:you_cant_book_your_service'));
                  setFieldValue('bookerEmailValid', false);
                } else {
                  setFieldValue('bookerEmailValid', true);
                  setFieldError('bookingData.bookerEmail', undefined);
                }
              } catch (err) {
                setFieldError('bookingData.bookerEmail', err.message);
              }
              setFieldValue('bookingData.bookerEmail', value);
            }}
            onBlur={async ({target: {value}}) => {
              try {
                const checkEmail = string().email().required().label('Email address');
                await checkEmail.validate(value);
              } catch (err) {
                setFieldError('bookingData.bookerEmail', err.message);
              }
              setFieldValue('bookingData.bookerEmail', value);
            }}
            value={values.bookingData?.bookerEmail}
          />
        </Field>
      </div>

      <div className={'col-span-4 xl:col-span-2 flex flex-col flex-grow justify-start align-start'}>
        <Field
          label={t('common:phone_number')}
          required={values.bookingData.bookerSmsReminders ? true : false}
          error={
            values.bookingData.bookerSmsReminders &&
            errors.bookingData?.bookerPhone && (
              <FieldError message={errors.bookingData?.bookerPhone} />
            )
          }
        >
          <PhoneInput
            inputStyle={{width: '100%', padding: '22px 50px'}}
            value={`${values.bookingData.bookerPhone}`}
            country={values.countryCode}
            countryCodeEditable={false}
            onChange={(_, country: any, {target: {value}}) => {
              const {countryCode} = country;
              if (countryCode !== 'us') {
                setFieldValue('bookingData.bookerSmsReminders', false);
              }
              setFieldValue('countryCode', countryCode);
              if (isValidPhoneNumber(value ? value : '', countryCode)) {
                setFieldValue('PhoneValid', true);
                setFieldError('bookingData.bookerPhone', undefined);
              } else {
                setFieldValue('PhoneValid', false);
                setFieldError('bookingData.bookerPhone', t('phone_number_invalid'));
              }
              setFieldValue('bookingData.bookerPhone', value);
            }}
            isValid={values.PhoneValid}
            inputProps={{
              id: 'bookingData.bookerPhone',
            }}
          />
        </Field>
        {hasSmsExtension && values.countryCode === 'us' && (
          <CheckBox
            key={1}
            code={'Yes'}
            label={
              'Send me reminders via SMS/Text messages. Message and data  rates may apply. Reminders only supported for US Numbers'
            }
            handleChange={e => {
              setFieldValue('bookingData.bookerSmsReminders', e.target.checked);
            }}
            selected={values?.bookingData.bookerSmsReminders}
            style='rounded-r-none border-gray-300 w-100 py-3 mx-2 px-0'
          />
        )}
      </div>
    </div>
  );
}
