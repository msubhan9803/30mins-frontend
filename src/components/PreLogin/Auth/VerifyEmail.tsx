import axios from 'axios';
import {Formik} from 'formik';
import {signIn} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useRef, useState} from 'react';
import {JOIN_HAS_ACCOUNT_YUP, JOIN_NO_ACCOUNT_YUP, JOIN_STATE} from 'constants/yup/join';
import {OTP_STATE, OTP_YUP} from 'constants/yup/otp';
import Recaptcha from 'react-google-recaptcha';
import Button from '@root/components/button';
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import CheckBox from '@root/components/forms/checkbox';

const VerifyEmail = ({emailHint, hasAccount, queryError}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const [showOtpInput, setShowOTP] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentName, setCurrentName] = useState('');
  // const [emailError, setEmailErrors] = useState('');
  let [response] = useState<any>({});
  const [otpError, setOTPError] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<Recaptcha>();

  const signInSubmitHandler = async (values, {setFieldError}) => {
    const captchaToken = await recaptchaRef.current?.executeAsync();
    recaptchaRef.current?.reset();

    if (hasAccount) {
      try {
        setLoading(true);
        await axios.post('/api/otp/handleOtpSignIn', {
          email: values.email,
          captchaToken,
        });

        setCurrentEmail(values.email);
        setShowOTP(true);
        setFieldError('email', undefined);
        setLoading(false);
      } catch (err) {
        if (err.response.status === 404) {
          setFieldError('email', 'Email not found');
        }
      }
    } else {
      try {
        setLoading(true);
        await axios.post('/api/otp/handleOtpSignUp', {
          email: values.email,
          name: values.name,
          captchaToken,
        });

        setCurrentEmail(values.email);
        setCurrentName(values.name);
        setShowOTP(true);
        setFieldError('email', undefined);
        setLoading(false);
      } catch (err) {
        if (err.response.status === 404) {
          setFieldError('email', 'Email not found');
        }

        if (err.response.status === 409) {
          setFieldError('email', 'Email already in use');
        }
      }
    }
  };

  const otpSubmitHandler = async values => {
    try {
      response = await signIn('credentials', {
        email: currentEmail,
        otpToken: values.otpToken,
        callbackUrl: '/user/dashboard',
        redirect: false,
      });
      if (response && response?.error === ('CredentialsSignin' as string)) {
        setOTPError(t('common:invalid_otp'));
      }
      if (response && response?.status === 200) {
        router.push('/user/dashboard');
      }
    } catch (err) {
      setOTPError(t('common:invalid_otp'));
    }
  };

  // const validateEmail = value => {
  //   let error;
  //   if (!value) {
  //     error = 'Required';
  //   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
  //     error = 'Invalid email address';
  //   }
  //   return error;
  // };

  return (
    <>
      <div className='min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <Recaptcha
          ref={recaptchaRef}
          size='invisible'
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
        />
        <div className='sm:mx-auto sm:w-full sm:max-w-md text-center'>
          <Image
            className='mx-auto h-12 w-auto '
            src='/assets/logo.svg'
            alt='30mins'
            height={50}
            width={50}
          />
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            {t('profile:txt_VerifyEmail')}
          </h2>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-xl'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            {!queryError ? (
              <>
                <p className='mt-2 text-left text-md text-mainBlue'>{t('page:get_otp_code')}</p>
                <p className='mt-2 text-left text-sm text-gray-600'>
                  {t('page:get_otp_code_desc')}
                </p>
                <p className='mt-2 text-left text-sm text-gray-600 mb-4'>
                  {t('page:get_otp_code_delay')}
                </p>
                {showOtpInput ? (
                  <Formik
                    initialValues={OTP_STATE}
                    onSubmit={otpSubmitHandler}
                    validationSchema={OTP_YUP}
                  >
                    {({handleSubmit, handleChange, setFieldError, isSubmitting, errors}) => (
                      <div className='flex flex-col gap-4'>
                        <div className=''>
                          <div className='mt-2 text-left text-sm text-mainBlue font-bold'>
                            {t('common:otp_sent_to_email')}
                          </div>
                          <FieldError
                            position='center'
                            message={t('common:otp_expire_10_minutes')}
                          />
                        </div>
                        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                          <Field
                            label=''
                            className=' w-full'
                            error={
                              errors.otpToken && (
                                <FieldError position='center' message={errors.otpToken} />
                              )
                            }
                          >
                            <div className=' w-full flex flex-row gap-2 items-center'>
                              <Input
                                handleChange={handleChange}
                                type='text'
                                name='otpToken'
                                placeholder='OTP Token'
                              />
                              <Button
                                variant='outline'
                                type='button'
                                disabled={loading}
                                onClick={() =>
                                  signInSubmitHandler(
                                    {email: currentEmail, name: currentName},
                                    {setFieldError}
                                  )
                                }
                              >
                                {loading ? t('common:txt_loading') : 'Re-send OTP'}
                              </Button>
                            </div>
                          </Field>
                          {otpError && (
                            <span className='mt-2 text-left text-sm text-red-600 font-bold'>
                              {otpError}
                            </span>
                          )}
                          <Button variant='solid' type='submit'>
                            {isSubmitting ? t('common:txt_loading') : 'Verify OTP Token'}
                          </Button>
                        </form>
                      </div>
                    )}
                  </Formik>
                ) : (
                  <Formik
                    initialValues={JOIN_STATE}
                    onSubmit={signInSubmitHandler}
                    validationSchema={hasAccount ? JOIN_HAS_ACCOUNT_YUP : JOIN_NO_ACCOUNT_YUP}
                  >
                    {({
                      handleSubmit,
                      handleChange,
                      handleBlur,
                      errors,
                      values,
                      touched,
                      isSubmitting,
                    }) => (
                      <>
                        <p className='mt-2 text-left text-sm text-gray-600 mb-4'>
                          Hint: {emailHint}
                        </p>
                        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                          <Field
                            label=''
                            error={
                              errors.email &&
                              touched.email && <FieldError breakW='words' message={errors.email} />
                            }
                          >
                            <Input
                              type='email'
                              handleChange={handleChange}
                              name='email'
                              onBlur={handleBlur}
                              placeholder='Email'
                            />
                          </Field>
                          {/* {emailError && (
                            <span className='text-red-500 mt-2 text-sm font-normal'>
                              {emailError}
                            </span>
                          )} */}
                          {!hasAccount && (
                            <Field
                              label=''
                              error={
                                errors.name &&
                                touched.name && <FieldError breakW='words' message={errors.name} />
                              }
                            >
                              <Input
                                type='text'
                                handleChange={handleChange}
                                name='name'
                                onBlur={handleBlur}
                                placeholder='Name'
                              />
                            </Field>
                          )}

                          <Field
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

                          <Button variant='solid' type='submit'>
                            {isSubmitting ? t('common:txt_loading') : 'Send me One Time Password'}
                          </Button>
                        </form>
                      </>
                    )}
                  </Formik>
                )}
              </>
            ) : (
              <p className='text-center text-red-600 font-bold'>Error: {queryError}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default VerifyEmail;
