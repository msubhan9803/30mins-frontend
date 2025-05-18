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

const OrgSignup = ({organizationData}) => {
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
        referralId: organizationData?._id,
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
      <div className='min-h-full flex flex-col justify-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 pb-4'>
        <div className='mt-0 grid col-span-1 lg:col-span-2 items-center flex flex-col'>
          <div className='mt-0 mb-4 pr-4 sm:mt-24 sm:pr-0'>
            <span className='font-bold text-xl my-2'>
              {organizationData?.title} {t('common:org_partner_message')}
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
                          disabled={loading}
                        >
                          {loading ? t('common:signing_up') : t('common:sign_up_otp')}
                        </Button>
                      </form>
                    </>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default OrgSignup;
