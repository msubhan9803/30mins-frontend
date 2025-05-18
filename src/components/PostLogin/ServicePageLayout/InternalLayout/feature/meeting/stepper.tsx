import {useContext, useRef, useState} from 'react';
import axios from 'axios';
import Recaptcha from 'react-google-recaptcha';
import useTranslation from 'next-translate/useTranslation';
import {UserContext} from '@context/user';
import {CheckIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import {toast} from 'react-hot-toast';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/User/queries';
import {AUTHENTICATION_TYPE} from 'constants/enums';
import Button from '@root/components/button';
import {Iaction, IinitialValues, TabSteps} from './constants';
import {schema} from './schema';

type IProps<T> = {
  values: IinitialValues;
  type: T;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  move: (action: Iaction, step: number) => void;
  setFieldError: any;
};

export default function Stepper({
  setFieldValue,
  type,
  values,
  move,
  setFieldError,
}: IProps<
  'MEETING' | 'FULL_TIME_JOB' | 'PART_TIME_JOB' | 'FREELANCING_WORK' | 'ROUND_ROBIN' | 'EVENT' | ''
>) {
  const {user, setUser} = useContext(UserContext);
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const {showModal} = ModalContextProvider();
  const {showCheckoutForm} = values;
  const recaptchaRef = useRef<Recaptcha>();
  const authenticationType = values?.authenticationType;
  values.STEPS?.forEach((tab, index) => {
    if (index === values.step) {
      TabSteps[tab].status = 'current';
    } else if (index < values.step) {
      TabSteps[tab].status = 'complete';
    } else {
      TabSteps[tab].status = 'upcoming';
    }
  });

  const emailRegex =
    /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  function isValidEmail(email) {
    if (!email) return false;

    if (email.length > 254) return false;

    email = email.trim();

    const valid = emailRegex.test(email);
    if (!valid) return false;

    const parts = email.split('@');
    if (parts[0].length > 64) return false;

    const domainParts = parts[1].split('.');
    return !domainParts.some(part => part.length > 63);
  }

  const signInSubmitHandler = async () => {
    try {
      let captchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      let data = await axios.post('/api/otp/handleOtpSignIn', {
        email: values?.bookingData?.bookerEmail,
        captchaToken,
      });
      if (data.status === 201) {
        captchaToken = await recaptchaRef.current.executeAsync();
        recaptchaRef.current.reset();
        data = await axios.post('/api/otp/handleOtpSignUp', {
          email: values?.bookingData?.bookerEmail,
          name: values?.bookingData?.bookerName,
          captchaToken,
        });
        return data.status === 200;
      }
      return true;
      // eslint-disable-next-line no-empty
    } catch (err) {}
    return false;
  };

  const getPreApprovedUsers = async () => {
    const request = await axios.post('/api/booking/getPreApprovedUsers', {
      bookerEmail: values.bookingData?.bookerEmail,
      providerEmail: values.bookingData?.providerEmail,
      serviceId: values.bookingData?.serviceID,
    });
    return request.data.getPreApprovedUsers;
  };

  const showMeetingOTP = async () => {
    try {
      const data = await signInSubmitHandler();
      let countStep = 1;
      if (authenticationType === AUTHENTICATION_TYPE.VERIFIED_ONLY) {
        const checkVerifiedStatus = await graphqlRequestHandler(
          queries.checkVerifiedStatus,
          {
            email: values?.bookingData.bookerEmail,
          },
          ''
        );
        countStep =
          checkVerifiedStatus?.data?.data?.checkVerifiedStatus?.message ===
            'Account Not Verified!' &&
          checkVerifiedStatus?.data?.data?.checkVerifiedStatus?.status === 200
            ? 2
            : 1;
      }
      if (authenticationType === AUTHENTICATION_TYPE.PRE_APPROVED) {
        if (values.serviceData.whiteList.emails.includes(values.bookingData.bookerEmail)) {
          countStep = 1;
        } else {
          const preEmail = values.bookingData.bookerEmail.split('@')[1];
          if (values.serviceData.whiteList.domains.includes(preEmail)) {
            countStep = 1;
          } else {
            countStep = 2;
          }
        }
      }
      if (data) {
        showModal(MODAL_TYPES.MEETING_OTP, {
          setFieldValue,
          bookerEmail: values?.bookingData?.bookerEmail,
          signInSubmitHandler,
          move,
          values,
          user,
          setUser,
          authenticationType,
          countStep,
        });
        return true;
      }
    } catch (e) {
      setFieldError('bookingData.bookerEmail', t('common:required_email_address'));
    }
    return false;
  };

  const showSmsOtpModal = () => {
    showModal(MODAL_TYPES.VERIFY_BOOKING_SMS_OTP, {
      phone: values.bookingData.bookerPhone,
      move,
      setFieldValue,
    });
  };

  // const showOtpModal = async () => {
  //   // BUT IF THE USER REQUIRES BOTH - THEY SHOULD BE SHOWN BACK TO BACK NOT REQUIRING A SECOND CLICK
  //   if (user?.email !== values?.bookingData?.bookerEmail) {
  //     const res = await showMeetingOTP();
  //     if (!res) {
  //       return false;
  //     }
  //   }

  //   // AFTER THE EMAIL OTP HAS BEEN PROCESSED
  //   // WE NEED TO SHOW THE SMS OTP MODAL IF IT IS REQUIRED
  //   // if (values.bookingData.bookerSmsReminders && !values.bookingData.bookerSmsVerified) {
  //   //   await showSmsOtpModal();
  //   // }
  //   return true;
  // };

  return (
    <div className='w-full h-max flex flex-col py-4 '>
      <div className='flex flex-col-reverse md:flex-row w-full  items-center justify-between'>
        <span className='text-xl md:text-2xl font-bold text-mainBlue'>
          {values.STEPS[values.step] === 'payment' && !showCheckoutForm
            ? t(`common:summary`)
            : t(`common:${type && values.STEPS[values.step]}`)}
        </span>
        <Recaptcha
          ref={recaptchaRef}
          size='invisible'
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
        />
        <nav aria-label='Progress'>
          <ol role='list' className='flex items-center justify-center py-3'>
            {type &&
              values.STEPS.map((step, index) => (
                <li
                  key={TabSteps[step].title}
                  className={classNames(
                    index !== values.STEPS.length - 1 ? 'pr-3 sm:pr-10' : '',
                    'relative'
                  )}
                >
                  {TabSteps[step].status === 'complete' ? (
                    <>
                      <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                        <div
                          className={`h-0.5 w-full bg-mainBlue transition-width duration-500 ease-in-out`}
                        />
                      </div>
                      <div className='relative w-10 h-10 flex items-center justify-center bg-mainBlue rounded-full hover:bg-blue-900'>
                        <CheckIcon className='w-5 h-5 text-white' aria-hidden='true' />
                        <span className='sr-only'>{TabSteps[step].title}</span>
                      </div>
                    </>
                  ) : TabSteps[step].status === 'current' ? (
                    <>
                      <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                        <div className='h-0.5 w-full bg-gray-200' />
                      </div>
                      <div
                        className='relative w-10 h-10 flex items-center justify-center bg-white border-2 border-mainBlue rounded-full'
                        aria-current='step'
                      >
                        <span className='h-2.5 w-2.5 bg-mainBlue rounded-full' aria-hidden='true' />
                        <span className='sr-only'>{TabSteps[step].title}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                        <div className='h-0.5 w-full bg-gray-200' />
                      </div>
                      <div className='group relative w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400'>
                        <span
                          className='h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300'
                          aria-hidden='true'
                        />
                        <span className='sr-only'>{TabSteps[step].title}</span>
                      </div>
                    </>
                  )}
                </li>
              ))}
          </ol>
        </nav>
      </div>
      <div className='flex flex-col md:flex-row w-full md:justify-between md:items-start pt-2 gap-2'>
        <span className='text-sm md:text-base font-normal md:w-2/3 text-center md:text-left text-gray-500'>
          {values.STEPS.length - 1 === values.step
            ? t(`common:summary-H`)
            : t(`common:${type && values.STEPS[values.step]}-H`)}{' '}
        </span>
        {values.STEPS[values.step] !== 'payment' && (
          <div className='grid grid-cols-2 gap-2 w-full md:w-1/3 justify-evenly items-end'>
            <Button
              className='col-span-1'
              variant='cancel'
              onClick={() => move('back', values.step)}
            >
              {values.step === 0 ? t('common:cancel') : t('common:back')}
            </Button>
            <Button
              variant='solid'
              className='col-span-1'
              onClick={async () => {
                if (values.bookingData.providerEmail !== values.bookingData.bookerEmail) {
                  if (!loading) {
                    setLoading(true);
                    const stepDetails = Object(schema[values.TYPESERVICE]).find(
                      o => o.index === values.STEPS[0]
                    );
                    try {
                      await stepDetails?.schema?.validate(values, {abortEarly: false});
                      if (!isValidEmail(values?.bookingData?.bookerEmail)) {
                        setFieldError(
                          'bookingData.bookerEmail',
                          t('common:required_email_address')
                        );
                        setLoading(false);
                        return;
                      }
                      if (user?.email !== values?.bookingData?.bookerEmail && values.step === 0) {
                        const id = toast.loading(
                          <p className='text-mainBlue'>{t('common:sending_otp')}</p>
                        );
                        const res = await showMeetingOTP();

                        toast.dismiss(id);
                        if (res) {
                          toast.success(<p className='text-mainBlue'>{t('common:sending_otp')}</p>);
                        } else {
                          toast.error(
                            <p className='text-red-400'>{t('common:failed_to_send_otp')}</p>
                          );
                        }
                        setLoading(false);
                        return;
                      }

                      if (
                        !user?.verifiedAccount &&
                        authenticationType === AUTHENTICATION_TYPE.VERIFIED_ONLY &&
                        values.step === 0
                      ) {
                        showModal(MODAL_TYPES.VERIFIED_ONLY, {
                          providerUsername: values?.bookingData?.providerUsername,
                          setUser,
                          move,
                          user,
                          v: values,
                          setFieldValue,
                        });
                        setLoading(false);
                        return;
                      }

                      if (
                        authenticationType === AUTHENTICATION_TYPE.PRE_APPROVED &&
                        values.step === 0
                      ) {
                        const id = toast.loading('checking...');
                        const data = await getPreApprovedUsers();
                        toast.dismiss(id);
                        if (data?.approved !== true) {
                          showModal(MODAL_TYPES.PRE_APPROVAL, {
                            bookingData: values?.bookingData,
                            setUser,
                            user,
                            approved: data?.approved,
                            dayPassed: data?.dayPassed,
                            approvalRequested: data?.approvalRequested,
                            move,
                            v: values,
                            setFieldValue,
                          });
                          setLoading(false);
                          return;
                        }
                      }

                      if (
                        values.bookingData.bookerSmsReminders &&
                        values.bookingData.bookerNumberVerified !== values.bookingData.bookerPhone
                      ) {
                        await showSmsOtpModal();
                        setLoading(false);
                        return;
                      }

                      values.STEPS.length - 1 === values.step
                        ? move('submit', values.step)
                        : move('next', values.step);
                    } catch (err) {
                      console.log('err: ', err);
                      stepDetails?.fields.forEach(field => {
                        const fieldError = err.inner?.find(o => o.path.startsWith(field));
                        if (fieldError) setFieldError(field, fieldError.message);
                      });
                    }
                    setLoading(false);
                  }
                }
              }}
            >
              {values.STEPS.length - 2 === values.step ? t('common:Preview') : t('common:Next')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
