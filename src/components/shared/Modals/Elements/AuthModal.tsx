import {useState, useRef} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {Formik} from 'formik';
import {toast} from 'react-hot-toast';
import Recaptcha from 'react-google-recaptcha';
import axios from 'axios';
import {signIn} from 'next-auth/react';

import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';
import Input from '@root/components/forms/input';
import Button from '@root/components/button';
import CheckBox from '@root/components/forms/checkbox';

import {LOGIN_YUP} from 'constants/yup/login';
import {OTP_STATE, OTP_YUP} from 'constants/yup/otp';
import {SIGNUP_STATE, SINGUP_YUP} from 'constants/yup/signup';
import {ModalContextProvider} from 'store/Modal/Modal.context';

import Modal from '../Modal';

function SignInSection() {
  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};

  const {t} = useTranslation();

  const [showOtpInput, setShowOTP] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [errors, setErors] = useState('');
  const [loading, setLoading] = useState(false);

  const recaptchaRef = useRef<Recaptcha>();

  const signInSubmitHandler = async (values, {setFieldError}) => {
    setLoading(true);
    try {
      setErors('');
      const captchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      const signinResponse = await axios.post('/api/otp/handleOtpSignIn', {
        email: values.email,
        captchaToken,
      });

      if (signinResponse?.status !== 200) {
        if (signinResponse?.data?.message === 'Account Not Found') {
          setFieldError('email', t('common:Account_Not_Found'));
          setLoading(false);
        } else {
          setErors(signinResponse?.data?.message);
          setLoading(false);
        }
        return;
      }
      setCurrentEmail(values.email);
      setShowOTP(true);
      setErors('');
      setLoading(false);
    } catch (err) {
      if (err.response.status === 404) {
        setErors(t('common:Email_not_found'));
        setLoading(false);
      }
    }
  };

  const otpSubmitHandler = async (values, {setFieldError}) => {
    try {
      setLoading(true);
      const res = await signIn('credentials', {
        email: currentEmail,
        otpToken: values.otpToken,
        redirect: false,
      });
      if (res?.ok === true) {
        hideModal();
        modalProps.onAuthComplete();
      } else setFieldError('otpToken', t('common:Invalid OTP Token'));
      // eslint-disable-next-line no-empty
    } catch (err) {}
    setLoading(false);
  };

  return !showOtpInput ? (
    <div>
      <Formik
        initialValues={{email: ''}}
        validateOnChange={false}
        validationSchema={LOGIN_YUP}
        onSubmit={signInSubmitHandler}
      >
        {({handleSubmit, errors: formikErr, setFieldValue}) => (
          <>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit} noValidate>
              <Recaptcha
                ref={recaptchaRef}
                size='invisible'
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
              />
              <Field
                label={t('common:email_header')}
                error={formikErr.email && <FieldError message={formikErr.email} />}
              >
                <Input
                  type='email'
                  name='email'
                  required
                  placeholder=''
                  handleChange={e => {
                    setFieldValue('email', e.target.value.trim());
                  }}
                />
              </Field>

              {errors && (
                <div>
                  <span className='text-red-500 text-sm font-normal'>{errors}</span>
                </div>
              )}

              <Button
                className={'pt-6 pb-6'}
                variant='solid'
                type='submit'
                disabled={loading ? true : false}
                onClick={() => setErors('')}
              >
                {loading ? t('common:sending_otp') : t('common:sign_in_otp')}
              </Button>
            </form>
          </>
        )}
      </Formik>
    </div>
  ) : (
    <div>
      <Formik
        initialValues={OTP_STATE}
        onSubmit={otpSubmitHandler}
        validateOnChange={false}
        validationSchema={OTP_YUP}
      >
        {({handleSubmit, errors: formErrors, setFieldValue}) => (
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
                error={formErrors.otpToken && <FieldError message={formErrors.otpToken} />}
              >
                <Input
                  name='otpToken'
                  type='text'
                  placeholder=''
                  handleChange={e => {
                    setFieldValue('otpToken', e.target.value.trim());
                  }}
                />
              </Field>
              <Button
                className={'pt-6 pb-6'}
                variant='solid'
                type='submit'
                disabled={loading ? true : false}
              >
                {loading ? t('common:verifying_otp') : t('common:verify_otp')}
              </Button>
              <Button
                className={'pt-6 pb-6'}
                type='button'
                variant='outline'
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  const captchaToken = await recaptchaRef.current.executeAsync();
                  recaptchaRef.current.reset();
                  const data = await axios.post('/api/otp/handleOtpSignIn', {
                    email: currentEmail,
                    captchaToken,
                  });
                  if (data.data?.signInData?.data?.handleOtpSignIn?.status === 200) {
                    toast.success(t('common:OTP_Sent_Successfully'));
                  }
                  setLoading(false);
                }}
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
    </div>
  );
}

function SignUpSection() {
  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};

  const {t} = useTranslation();

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
        hideModal();
        modalProps.onAuthComplete();
      } else setFieldError('otpToken', t('common:Invalid OTP Token'));

      setLoadingVerifyOTP(false);
    } catch (err) {
      setLoadingVerifyOTP(false);
      setErrors('Invalid OTP. Please try again');
    }
  };

  return !showOtpInput ? (
    <div>
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
                  errors.name && <FieldError message={t(`common:${errors.name}`)} breakW='words' />
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
                    <FieldError message={errors.termsOfService} position='center' breakW='words' />
                  )
                }
              >
                <CheckBox
                  code='termsOfService'
                  label={
                    <span className='inline-block text-xs text-mainText opacity-80'>
                      {t('common:terms_agree')}{' '}
                      <a href='/tos' target='_blank' rel='noreferrer' className='text-mainBlue'>
                        {t('common:terms_of_services')}
                      </a>{' '}
                      {t('common:and_the')}{' '}
                      <a href='/privacy' target='_blank' rel='noreferrer' className='text-mainBlue'>
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

              {error ? <div className='text-red-500 mt-2 text-sm font-normal'>{error}</div> : null}
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
    </div>
  ) : (
    <div>
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

              {error ? <div className='text-red-600 mt-2 text-sm font-normal'>{error}</div> : null}
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
                  signUpSubmitHandler({email: currentEmail, name: currentName}, {setFieldError})
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
    </div>
  );
}

const AuthModal = () => {
  const {t} = useTranslation();

  const [isSigninSection, setIsSigninSection] = useState(true);

  const toggleSection = () => setIsSigninSection(!isSigninSection);

  return (
    <Modal small modalWrapperClass='pb-20' title='Add to Cart' medium>
      <div className=''>
        <span className='text-center font-medium'>
          {t('common:purchasing_a_product_requires_an_account')}
        </span>
        <h2 className='text-center text-2xl sm:text-3xl font-extrabold text-gray-900'>
          {isSigninSection ? t('common:Signin_title') : t('common:Signup_title')}
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          {t('page:Or')}{' '}
          <span
            className='font-medium text-mainBlue hover:text-mainBlue cursor-pointer'
            onClick={toggleSection}
          >
            {isSigninSection ? t('common:SIGN_UP') : t('common:Signin')}
          </span>
        </p>
        {isSigninSection ? <SignInSection /> : <SignUpSection />}
      </div>
    </Modal>
  );
};
export default AuthModal;
