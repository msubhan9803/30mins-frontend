import useTranslation from 'next-translate/useTranslation';
import * as Yup from 'yup';
import {Form, Formik} from 'formik';
import {useEffect, useRef, useState} from 'react';
import Recaptcha from 'react-google-recaptcha';
import validateProviderReceivingCapabilities from 'utils/validatePaidBookingStatus';
import {PAYMENT_TYPE, SERVICE_TYPES} from 'constants/enums';
import classNames from 'classnames';
import CheckoutWrapper from './CheckoutWrapper';
import {IFormProps} from '../../constants';
import Button from '@root/components/button';
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import CheckBox from '@root/components/forms/checkbox';

const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isBetween = require('dayjs/plugin/isBetween');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

export const PAYMENT_YUP = Yup.object().shape({
  termsOfService: Yup.boolean()
    .required('The terms and conditions must be accepted.')
    .oneOf([true], 'The terms and conditions must be accepted.'),
});

export default function Payment({
  values,
  setFieldValue,
  move,
  errMsg,
}: IFormProps & {move: any} & {errMsg: String}) {
  const {t} = useTranslation();
  const {user, serviceData, bookingData, showCheckoutForm, STEPS, step} = values;
  const recaptchaRef = useRef<Recaptcha>();
  const [apiError] = useState('');

  if (!validateProviderReceivingCapabilities(user, serviceData)) {
    return <div className='py-6 px-4 text-red-500'>{t('common:stripe_inactive_account')}</div>;
  }

  const {paymentType} = serviceData;

  const Item = ({value, title, className = ''}) =>
    value ? (
      <>
        <div className={classNames(['grid grid-cols-1 sm:grid-cols-3', className])}>
          <div className={classNames(['col-span-1 flex flex-col divide-y-2', className])}>
            <label
              htmlFor='ccRecipients'
              className='text-sm p-0 px-1 pt-2 w-full font-bold text-gray-700'
            >
              {title}
            </label>
          </div>
          <div
            className={classNames([
              'col-span-1 sm:col-span-2 flex flex-col w-full divide-y-2 border rounded-md',
              className,
            ])}
          >
            <label htmlFor='ccRecipients' className='text-sm p-2 w-full font-medium text-gray-700'>
              <label className='w-full p-0 break-words'>{value}</label>
            </label>
          </div>
        </div>
      </>
    ) : (
      <></>
    );

  const Item2 = ({value, title, className = ''}) => (
    <>
      <div className={classNames(['grid grid-cols-1 sm:grid-cols-1', className])}>
        <div className={classNames(['col-span-1 flex flex-col divide-y-2', className])}>
          <label
            htmlFor='ccRecipients'
            className='text-sm p-0 px-1 pt-0 pb-0 w-full font-medium text-gray-700'
          >
            {t('common:question')} {title}
          </label>
        </div>
        <div
          className={classNames([
            'col-span-1 sm:col-span-1 flex flex-col w-full divide-y-2',
            className,
          ])}
        >
          <label
            htmlFor='ccRecipients'
            className='text-sm px-1 pb-2 w-full font-medium text-gray-700'
          >
            {t('common:answer')}: <label className='w-full p-0 break-words'>{value}</label>
          </label>
        </div>
      </div>
    </>
  );

  const [X, setX] = useState(true);

  useEffect(() => {
    if (X) {
      setFieldValue('recaptchaRef', recaptchaRef.current);
      setX(false);
    }
  }, [recaptchaRef.current]);

  return (
    <>
      <Recaptcha
        ref={ref => (recaptchaRef.current = ref)}
        size='invisible'
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
      />
      {!values.showCheckoutForm ? (
        <Formik
          initialValues={{...bookingData, termsOfService: false}}
          validationSchema={PAYMENT_YUP}
          enableReinitialize
          onSubmit={() => {}}
        >
          {({values, errors, handleChange, handleSubmit, validateForm}) => (
            <Form onSubmit={handleSubmit}>
              <>
                <div className='mt-1 sm:mt-0'>
                  {apiError && (
                    <div className='px-4 mt-5 sm:mt-0 sm:mb-4 text-right sm:px-0'>
                      <span className='text-red-500 mr-2'>{apiError}</span>
                    </div>
                  )}
                  {serviceData.paymentType === PAYMENT_TYPE.MANUAL && (
                    <div className='px-4 mt-5 sm:mt-1 sm:mb-4 sm:px-1 text-sm text-red-500'>
                      {t('setting:manual_payment_warning2')}
                    </div>
                  )}

                  <div className='md:grid md:grid-cols-1 md:gap-2'>
                    <div className='mt-1 sm:mt-0 md:col-span-2'>
                      <div className='overflow-hidden sm:rounded-md'>
                        <div className='px-4 py-1 bg-white pb-6 sm:pt-6'>
                          <div className='grid grid-cols-1 gap-0 sm:gap-2'>
                            <Item title={t('common:Your_name')} value={values.bookerName} />
                            <Item title={t('common:email_address')} value={values.bookerEmail} />
                            <Item title={t('common:subject')} value={values.subject} />
                            <Item title={t('common:txt_phone_num')} value={values.bookerPhone} />
                            {serviceData.serviceType === SERVICE_TYPES.MEETING ? (
                              <Item
                                title={t('common:booking_conference_type')}
                                value={t(`common:${values.conferenceType}`)}
                              />
                            ) : null}
                            {values.meetingCount > 0 && (
                              <Item
                                title={t('common:Number_occurrences')}
                                value={values.meetingCount}
                              />
                            )}

                            {values.ccRecipients != null &&
                              Object.keys(values.ccRecipients).length !== 0 && (
                                <Item
                                  title={t('common:ccRecipients')}
                                  value={values.ccRecipients}
                                />
                              )}

                            {values.additionalNotes != null && (
                              <Item
                                title={t('common:txt_add_note')}
                                value={values.additionalNotes}
                              />
                            )}

                            {values.attachment != null && (
                              <Item
                                title={t('common:attachment')}
                                value={values.attachment[0].name}
                              />
                            )}

                            {bookingData?.answeredQuestions?.filter(el => el.question)?.length! >
                              0 && (
                              <span className='col-span-1 pt-2 px-1 font-bold text-mainBlue'>
                                {t('common:your_answerrs_to_questions')}
                              </span>
                            )}

                            {bookingData.answeredQuestions
                              ?.filter(el => el.question)
                              .map(el => (
                                <Item2
                                  title={el.question}
                                  value={el.answer || el.selectedOptions?.join(', ')}
                                />
                              ))}

                            <div className='grid grid-cols-1 sm:grid-cols-3'>
                              <div className='cold-span-1' />
                              <Field
                                className='col-span-1 sm:col-span-2'
                                label=''
                                error={
                                  errors.termsOfService && (
                                    <FieldError message={errors.termsOfService} breakW='words' />
                                  )
                                }
                              >
                                <CheckBox
                                  code='termsOfService'
                                  label={
                                    <span className='inline-block text-xs text-mainText opacity-80'>
                                      {t('common:terms_agree')}{' '}
                                      <a
                                        href='/tos'
                                        target='_blank'
                                        rel='noreferrer'
                                        className='text-mainBlue'
                                      >
                                        {t('common:terms_of_services')}
                                      </a>{' '}
                                      {t('common:and_the')}{' '}
                                      <a
                                        href='/privacy'
                                        target='_blank'
                                        rel='noreferrer'
                                        className='text-mainBlue'
                                      >
                                        {t('common:privacy_policy')}
                                      </a>
                                      .
                                    </span>
                                  }
                                  style='!items-start h-auto'
                                  handleChange={handleChange}
                                  selected={values.termsOfService}
                                />
                              </Field>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {STEPS[step] === 'payment' && !showCheckoutForm && (
                      <div>
                        {errMsg && (
                          <div className='px-10 mb-2 mt-0  text-red-500'>
                            {t('common:note')}: {t(`common:${errMsg}`)}
                          </div>
                        )}
                        <div className='grid grid-cols-2 ml-auto gap-2 w-full md:w-1/3 justify-evenly items-end'>
                          <Button
                            variant='cancel'
                            className='col-span-1'
                            onClick={() => move('back', step)}
                          >
                            {step === 0 ? t('common:cancel') : t('common:back')}
                          </Button>

                          <Button
                            variant='solid'
                            className='col-span-1'
                            onClick={async () => {
                              if (STEPS.length - 1 === step) {
                                const isValidated = await validateForm();

                                if (Object.keys(isValidated).length !== 0) return;

                                move('submit', step);
                              } else {
                                move('next', step);
                              }
                            }}
                          >
                            {STEPS.length - 1 === step
                              ? values.price > 0
                                ? values.paymentType !== 'manual'
                                  ? t('common:Pay_Now')
                                  : t('common:book_now')
                                : t('common:Submit')
                              : t('common:Next')}
                          </Button>
                        </div>
                        {paymentType === PAYMENT_TYPE.DIRECT && (
                          <>
                            <div className='text-red-500'>
                              {t('common:Direct_Precaution_Message')}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            </Form>
          )}
        </Formik>
      ) : (
        <CheckoutWrapper
          moveBack={() => {
            move('back', values.step);
            setFieldValue('showCheckoutForm', false);
          }}
          values={values}
        />
      )}
    </>
  );
}
