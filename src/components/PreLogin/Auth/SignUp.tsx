import axios from 'axios';
import {OTP_STATE, OTP_YUP} from 'constants/yup/otp';
import {SIGNUP_STATE, SINGUP_YUP} from 'constants/yup/signup';
import {Formik} from 'formik';
import {signIn} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useRef, useState} from 'react';
import Recaptcha from 'react-google-recaptcha';
import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';
import Input from '@root/components/forms/input';
import Button from '@root/components/button';
import CheckBox from '@root/components/forms/checkbox';

const SignUp = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [error, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingVerifyOTP, setLoadingVerifyOTP] = useState(false);

  const recaptchaRef = useRef<Recaptcha>();

  const signUpSubmitHandler = async (values, {setFieldError}) => {
    try {
      setErrors('');
      const captchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      setLoading(true);
      const signupResponse = await axios.post('/api/otp/handleOtpSignUp', {
        email: values.email,
        name: values.name,
        captchaToken,
      });

      if (signupResponse?.status !== 200) {
        setErrors(signupResponse?.data?.message);
        setLoading(false);
        setLoadingVerifyOTP(false);
        return;
      }

      setCurrentEmail(values.email);
      setCurrentName(values.name);
      setShowOtpInput(true);
      setErrors('');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response.status === 409) {
        setFieldError('email', t('common:User_with_this_email_already_exists'));
      }
      if (err.response.status === 400) {
        setErrors(err.response.data.message);
      }
    }
  };

  const otpSubmitHandler = async (values, {setFieldError}) => {
    try {
      setLoadingVerifyOTP(true);
      const res = await signIn('credentials', {
        email: currentEmail,
        otpToken: values.otpToken,
        redirect: false,
      });
      if (res?.ok === true) {
        await router.push('/user/welcome');
      } else setFieldError('otpToken', t('common:Invalid OTP Token'));
      setLoadingVerifyOTP(false);
    } catch (err) {
      setLoadingVerifyOTP(false);
      setErrors('Invalid OTP. Please try again');
    }
  };

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 px-0 sm:pl-12 sm:pr-0 bg-cover bg-center pt-4 pb-24 sm:pt-0 sm:pb-0 bg-[url('/assets/hero_bg_mobile.jpg')] sm:bg-[url('/assets/hero_bg.jpg')] sm:h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <div className='mt-0 grid col-span-1 lg:col-span-2 items-center bg-mainBlue sm:bg-transparent flex flex-col'>
          <div className='mt-0 mb-4 pr-4 sm:mt-24 sm:pr-0'>
            <span className='font-light text-base my-2'>
              <ul className='checkmark_mixed'>
                <li className='text-xs sm:text-base font-normal '>{t('common:why30mins_1')}</li>
                <li className='text-xs sm:text-base font-normal '>{t('common:why30mins_2')}</li>
                <li className='text-xs sm:text-base font-normal '>{t('common:why30mins_3')}</li>
                <li className='text-xs sm:text-base font-normal '>{t('common:why30mins_4')}</li>
                <li className='text-xs sm:text-base font-normal '>{t('common:why30mins_5')}</li>
                <li className='text-xs sm:text-base font-normal '>{t('common:why30mins_6')}</li>
                <li className='text-xs sm:text-base font-normal '>{t('common:why30mins_7')}</li>
              </ul>
            </span>
          </div>
        </div>
        <div className='mx-auto grid col-span-1 lg:col-span-3 flex items-center justify-center'>
          <div className='mt-4 sm:mt-0 sm:mx-auto sm:w-full sm:max-w-md'>
            <div className='bg-white py-4 px-4 shadow sm:rounded-lg sm:px-4'>
              <div className='grid sm:mx-auto sm:w-full sm:max-w-md text-center'>
                <h2 className='mt-2 text-center text-2xl sm:text-3xl font-extrabold text-gray-900'>
                  {t('common:Signup_title')}
                </h2>
                <p className='mt-2 text-center text-sm text-gray-600'>
                  {t('page:Or')}{' '}
                  <a
                    href={`/${router.locale}/auth/login`}
                    className='font-medium text-mainBlue hover:text-mainBlue'
                  >
                    {' '}
                    {t('common:Signin')}
                  </a>
                </p>
              </div>
              {showOtpInput ? (
                <Formik
                  initialValues={OTP_STATE}
                  onSubmit={otpSubmitHandler}
                  validationSchema={OTP_YUP}
                  validateOnChange={false}
                  validateOnBlur={false}
                  validateOnMount={false}
                >
                  {({handleSubmit, errors, setFieldValue, setFieldError}) => (
                    <>
                      <div>{t('common:otp_sent_to_email')}</div>
                      <div className='text-red-600'>{t('common:otp_expire_10_minutes')}</div>
                      <br />

                      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <Recaptcha
                          ref={recaptchaRef}
                          size='invisible'
                          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
                        />
                        <Field
                          label={t('common:otp_token')}
                          error={errors.otpToken && <FieldError message={errors.otpToken} />}
                        >
                          <Input
                            type='text'
                            name='otpToken'
                            required
                            placeholder={''}
                            handleChange={e => {
                              setFieldValue('otpToken', e.target.value.trim());
                            }}
                          />
                        </Field>

                        {error ? (
                          <div className='text-red-600 mt-2 text-sm font-normal'>{error}</div>
                        ) : null}
                        <Button
                          className={'pt-6 pb-6'}
                          variant='solid'
                          type='submit'
                          disabled={loadingVerifyOTP || loading ? true : false}
                        >
                          {loadingVerifyOTP ? t('common:verifying_otp') : t('common:verify_otp')}
                        </Button>
                        <Button
                          className={'pt-6 pb-6'}
                          type='button'
                          variant='outline'
                          disabled={loadingVerifyOTP || loading ? true : false}
                          onClick={() =>
                            signUpSubmitHandler(
                              {email: currentEmail, name: currentName},
                              {setFieldError}
                            )
                          }
                        >
                          {loading ? (
                            <p>{t('common:txt_loading')}</p>
                          ) : (
                            <p className='text-center'> {t('common:re_send_otp')}</p>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </Formik>
              ) : (
                <Formik
                  initialValues={SIGNUP_STATE}
                  validationSchema={SINGUP_YUP}
                  onSubmit={signUpSubmitHandler}
                  validateOnChange={false}
                  validateOnBlur={false}
                  validateOnMount={false}
                >
                  {({handleSubmit, values, errors, handleChange, setFieldValue}) => (
                    <>
                      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <Recaptcha
                          ref={recaptchaRef}
                          size='invisible'
                          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
                        />
                        <Field
                          label={t('common:Email')}
                          error={errors.email && <FieldError message={errors.email} />}
                        >
                          <Input
                            name='email'
                            type='email'
                            value={values.email}
                            required
                            placeholder=''
                            handleChange={e => {
                              setFieldValue('email', e.target.value?.trim());
                            }}
                            onKeyDown={el => {
                              if ([' '].includes(el.key)) el.preventDefault();
                            }}
                          />
                        </Field>

                        <Field
                          label={t('common:full_name')}
                          error={
                            errors.name && (
                              <FieldError message={t(`common:${errors.name}`)} breakW='words' />
                            )
                          }
                        >
                          <Input
                            name='name'
                            type='text'
                            value={values.name}
                            required
                            placeholder=''
                            handleChange={handleChange}
                          />
                        </Field>

                        <Field
                          label=''
                          error={
                            errors.termsOfService && (
                              <FieldError
                                message={errors.termsOfService}
                                position='center'
                                breakW='words'
                              />
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

                        {error ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>{error}</div>
                        ) : null}
                        <Button
                          className={'pt-6 pb-6'}
                          variant='solid'
                          type='submit'
                          disabled={loading ? true : false}
                        >
                          {loading ? t('common:signing_up') : t('common:sign_up_otp')}
                        </Button>
                      </form>
                    </>
                  )}
                </Formik>
              )}

              <div className='mt-6'>
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300' />
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-2 bg-white text-gray-500'>{t('page:Or')} </span>
                  </div>
                </div>
                <button
                  role='button'
                  onClick={() =>
                    signIn('google', {
                      callbackUrl: `/${router.locale}/user/welcome`,
                    })
                  }
                  className='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-4'
                >
                  <svg
                    width={19}
                    height={20}
                    viewBox='0 0 19 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z'
                      fill='#4285F4'
                    />
                    <path
                      d='M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z'
                      fill='#34A853'
                    />
                    <path
                      d='M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z'
                      fill='#FBBC05'
                    />
                    <path
                      d='M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z'
                      fill='#EB4335'
                    />
                  </svg>
                  <p className='text-base font-medium ml-4 text-gray-700'>
                    {t('common:signup_with_google')}
                  </p>
                </button>
                <button
                  role='button'
                  onClick={() =>
                    signIn('facebook', {
                      callbackUrl: `/${router.locale}/user/welcome`,
                    })
                  }
                  className='focus:outline-none  focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-4'
                >
                  <svg
                    width={24}
                    height={24}
                    xmlns='http://www.w3.org/2000/svg'
                    aria-hidden='true'
                    role='img'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='#4267B2'
                      d='M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999c0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891c1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z'
                    />
                  </svg>

                  <p className='text-base font-medium ml-4 text-gray-700'>
                    {t('common:signup_with_facebook')}
                  </p>
                </button>
                <button
                  role='button'
                  onClick={() =>
                    signIn('linkedin', {
                      callbackUrl: `/${router.locale}/user/welcome`,
                    })
                  }
                  className='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-4'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    aria-hidden='true'
                    role='img'
                    width={24}
                    height={24}
                    preserveAspectRatio='xMidYMid meet'
                    viewBox='0 0 256 256'
                  >
                    <path
                      fill='#0A66C2'
                      d='M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4c-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009c-.002-12.157 9.851-22.014 22.008-22.016c12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453'
                    />
                  </svg>

                  <p className='text-base font-medium ml-4 text-gray-700'>
                    {t('common:signup_with_linkedin')}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignUp;
