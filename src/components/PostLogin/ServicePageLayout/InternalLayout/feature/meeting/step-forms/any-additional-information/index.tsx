import {useEffect} from 'react';
import useTranslation from 'next-translate/useTranslation';
import Input from '@components/forms/input';
import Field from '@components/forms/field';
// import {FieldError} from '@root/components/forms/error';
import {IFormProps} from '../../constants';
import {FieldError} from '@root/components/forms/error';
import {useLazyQuery} from '@apollo/client';
import queries from 'constants/GraphQL/Booking/queries';
import {LoaderIcon, toast} from 'react-hot-toast';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {array, string} from 'yup';
import Files from 'react-files';
import {XMarkIcon} from '@heroicons/react/24/outline';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function AnyAdditionalInformation({
  values,
  setFieldValue,
  handleChange,
  setFieldError,
  errors,
}: IFormProps) {
  const [checkRecurringAvailibility, {called, loading, data}] = useLazyQuery(
    queries.checkRecurringAvailibility,
    {}
  );

  useEffect(() => {
    checkRecurringAvailibility({
      variables: {
        providerUsername: values?.user?.accountDetails?.username,
        initialBookingDateTime: values?.activeTime,
        meetingCount: values?.bookingData?.meetingCount,
      },
    }).catch();
  }, [
    values?.activeTime,
    values?.bookingData?.meetingCount,
    values?.user?.accountDetails?.username,
  ]);
  const {t} = useTranslation();

  return (
    <div className='flex flex-col gap-2 w-full sm:w-4/6'>
      <div
        className={
          'col-span-1 sm:col-span-4 flex flex-col flex-grow justify-start align-start mb-2'
        }
      >
        <Field
          label={t('common:subject')}
          error={
            errors.bookingData?.subject && <FieldError message={errors.bookingData?.subject} />
          }
          required
        >
          <Input
            type='text'
            placeholder={''}
            id='bookingData.subject'
            handleChange={handleChange}
            value={values.bookingData.subject}
          />
        </Field>
      </div>

      <div
        className={
          'col-span-1 sm:col-span-2 flex flex-col flex-grow justify-start align-start mb-2'
        }
      >
        <Field
          label={t('common:additional_notes')}
          error={
            errors.bookingData?.additionalNotes && (
              <FieldError message={errors.bookingData?.additionalNotes} />
            )
          }
        >
          <textarea
            placeholder={''}
            id='bookingData.additionalNotes'
            name='bookingData.additionalNotes'
            onChange={handleChange}
            className='px-4 py-3 w-full text-base border focus:ring-mainBlue focus:ring-offset-0 focus:ring-0 focus:border-mainBlue border-gray-300 rounded-lg appearance-none hover:appearance-none'
            value={values.bookingData?.additionalNotes}
          />
        </Field>
      </div>

      <div
        className={
          'col-span-1 sm:col-span-2 flex flex-col flex-grow justify-start align-start mb-2'
        }
      >
        <Field
          label={t('common:text_cc')}
          error={
            errors.bookingData?.ccRecipients && (
              <FieldError
                message={
                  typeof errors.bookingData?.ccRecipients === 'string'
                    ? errors.bookingData?.ccRecipients
                    : [...errors.bookingData?.ccRecipients].filter(el => el !== undefined)[0]
                }
              />
            )
          }
        >
          <Input
            type='text'
            placeholder={''}
            id='bookingData.ccRecipients'
            handleChange={async ({target: {value}}) => {
              setFieldError('bookingData.ccRecipients', undefined);
              setFieldValue('bookingData.ccRecipients', value.trim());
            }}
            onBlur={async ({target: {value}}) => {
              try {
                const chackCcRecipients = array()
                  .transform(function (value, originalValue) {
                    if (this.isType(value) && value !== null) {
                      return value;
                    }
                    return originalValue ? originalValue.split(';') : [];
                  })
                  .of(string().email(({value}) => ` *${value.trim()}* is not a valid email`));
                await chackCcRecipients.validate(value.trim());
                setFieldError('bookingData.ccRecipients', undefined);
              } catch (err) {
                setFieldError('bookingData.ccRecipients', err.message);
              }
              setFieldValue('bookingData.ccRecipients', value.trim());
            }}
            value={values.bookingData.ccRecipients?.toString()}
          />
        </Field>
      </div>
      {values.serviceData.isRecurring && (
        <div
          className={'col-span-4 xl:col-span-2 flex flex-col flex-grow justify-start align-start'}
        >
          <Field
            label={t('common:Book_Recurring_Question_Weekly')}
            error={
              errors.bookingData?.recurring && (
                <FieldError message={errors.bookingData?.recurring} />
              )
            }
          >
            <Input
              type='number'
              min='0'
              max='3'
              placeholder={''}
              id='bookingData.recurring'
              disabled={loading && called ? true : false}
              handleChange={e => {
                if (
                  parseInt(Number(e.target.value).toString(), 10) > 0 &&
                  parseInt(Number(e.target.value).toString(), 10) <= 4
                ) {
                  setFieldError('bookingData.recurring', undefined);
                  setFieldValue(
                    'bookingData.recurring',
                    parseInt(Number(e.target.value).toString(), 10)
                  );
                  setFieldValue(
                    'bookingData.meetingCount',
                    parseInt(Number(e.target.value).toString(), 10)
                  );
                  checkRecurringAvailibility();
                }
              }}
              value={values.bookingData.recurring}
            />
          </Field>
        </div>
      )}

      {called && loading ? (
        <LoaderIcon style={{width: '50px', height: '50px'}} className='my-20 m-auto' />
      ) : (
        values.bookingData.recurring > 0 && (
          <div
            className={'col-span-4 xl:col-span-2 flex flex-col flex-grow justify-start align-start'}
          >
            <p className='mt-3 block px-3 font-medium mb-2  border border-mainBlue rounded  bg-mainBlue text-white hover:bg-mainBlue hover:text-white py-2 '>
              {t('common:meeting_dates')}
            </p>
            {data?.checkRecurringAvailability?.availabilities?.map((time: string) => (
              <p className='block px-3 font-medium mb-2 text-mainBlue border border-mainBlue rounded   py-2  '>
                {dayjs(time).tz(values?.selectedBookerTimezone).format('DD MMM YYYY')}
              </p>
            ))}
          </div>
        )
      )}

      <div className={'col-span-4 xl:col-span-2 flex flex-col flex-grow justify-start align-start'}>
        <Field
          label={t('common:attachment')}
          error={
            errors.bookingData?.attachment && (
              <FieldError message={errors.bookingData?.attachment} />
            )
          }
        >
          <div className='relative w-full'>
            <Files
              id='bookingData.attachment'
              className='border rounded-md h-32 flex justify-center items-center w-full group-in-range:bg-slate-600'
              accepts={['image/*', 'video/mp4', 'audio/*', '.pdf']}
              onChange={el => {
                try {
                  if (el && el[0]) {
                    setFieldValue('bookingData.attachment', el);
                    setFieldValue('bookingData.attachmentPath', el[0].name);
                  }
                } catch (err) {}
              }}
              onError={el => {
                toast.error(el.message);
              }}
              multiple={false}
              maxFileSize={2000000}
              minFileSize={0}
              clickable
            >
              {values?.bookingData?.attachmentPath
                ? values?.bookingData?.attachmentPath
                : t('common:drop_files_here_or_click_to_upload')}
            </Files>
            {values.bookingData.attachmentPath && (
              <span
                onClick={() => {
                  setFieldValue('bookingData.attachment', undefined);
                  setFieldValue('bookingData.attachmentPath', undefined);
                }}
                className='absolute right-1 z-50 top-1 w-5 h-5 rounded-full bg-transparent border border-red-500 hover:bg-red-500'
              >
                <XMarkIcon className='text-red-500 hover:text-white' />
              </span>
            )}
          </div>
        </Field>
      </div>
    </div>
  );
}
