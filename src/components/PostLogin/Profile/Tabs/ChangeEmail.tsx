import axios from 'axios';
import {Form, Formik} from 'formik';
import Input from '@components/forms/input';
import {FieldError} from '@root/components/forms/error';
import Button from '@root/components/button';
import Field from '@root/components/forms/field';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useContext, useState} from 'react';
import {OTP_STATE, OTP_YUP} from 'constants/yup/otp';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/User/mutations';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';
import {CHANGE_EMAIL_STATE} from 'constants/yup/changeEmail';
import {useRouter} from 'next/router';
import {UserContext} from '@root/context/user';
import {string, object} from 'yup';

const ChangeEmail = () => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const router = useRouter();
  const [showOtpInput, setShowOTP] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [showError, setShowError] = useState('');
  const [showErrorTranslated, setShowErrorTranslated] = useState('');
  const [loading, setLoading] = useState<Boolean>(false);
  const {user} = useContext(UserContext);

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const [updateUser] = useMutation(mutations.updateUser);

  const emailRegex =
    /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  function isEmailValid(email) {
    if (!email) return false;

    if (email.length > 254) return false;

    const valid = emailRegex.test(email);
    if (!valid) return false;

    // Further checking of some things regex can't handle
    const parts = email.split('@');
    if (parts[0].length > 64) return false;

    const domainParts = parts[1].split('.');
    if (domainParts.some(part => part.length > 63)) return false;

    return true;
  }

  const changeEmailHandler = async values => {
    try {
      setShowError('');
      setLoading(true);

      if (!isEmailValid(values.email)) {
        setShowError('Invalid Email');
        setLoading(false);
        return;
      }
      const response = await axios.post('/api/otp/handleEmailChange', {
        email: values.email,
      });
      if (response.status === 203) {
        setShowError(response.data?.message);
        setLoading(false);
        return;
      }
      if (response.data?.emailChangeData.data?.handleEmailChange.status === 409) {
        setShowError(response.data?.emailChangeData.data?.handleEmailChange.message);
        setLoading(false);
        return;
      }

      setCurrentEmail(values.email);
      setLoading(false);
      setShowOTP(true);
    } catch (err) {
      if (err.response.status === 409) {
        setShowError(err.response.message);
      }
    }
  };

  const otpSubmitHandler = async () => {
    try {
      setShowError('');
      const response = await axios.post('/api/otp/validateOtp', {
        email: currentEmail,
        otpToken: otpValue,
      });
      if (response.data?.validateData?.data?.validateOtp?.response?.status === 400) {
        setShowError(response.data?.validateData?.data?.validateOtp?.response?.message);
        return;
      }
      await updateUser({
        variables: {
          userData: {
            accountDetails: {
              email: currentEmail,
            },
          },
          token: session?.accessToken,
        },
      });
      setShowOTP(false);
      showNotification(NOTIFICATION_TYPES.success, 'Email Updated', false);
      router.reload();
    } catch (err) {
      if (err.response.status === 409) {
        setShowError(err.response.message);
      }
    }
  };

  return (
    <>
      <div className='bg-white py-8 shadow sm:rounded-lg px-4'>
        <div className='max-w-lg'>
          {showOtpInput ? (
            <Formik initialValues={OTP_STATE} validationSchema={OTP_YUP} onSubmit={() => {}}>
              {({handleSubmit, errors: formErrors, handleBlur, setFieldValue}) => (
                <>
                  <div>{t('common:otp_sent_to_email')}</div>
                  <div className='text-red-600'>{t('common:otp_expire_10_minutes')}</div>
                  <br />
                  <Form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>
                    <Field
                      label={t('common:otp_token')}
                      error={
                        formErrors.otpToken ? (
                          <FieldError message={formErrors.otpToken} />
                        ) : (
                          showError && showError.length && <FieldError message={showError} />
                        )
                      }
                    >
                      <Input
                        styles='color-red'
                        type='text'
                        name='otpToken'
                        placeholder=''
                        onBlur={handleBlur}
                        handleChange={e => {
                          setShowError('');
                          setFieldValue('otpToken', e.target.value.trim());
                          setOtpValue(e.target.value.trim());
                        }}
                      />
                    </Field>
                    <Button
                      className='w-full pt-6 pb-6'
                      variant='solid'
                      disabled={loading ? true : false}
                      onClick={async () => {
                        setLoading(true);
                        await otpSubmitHandler();
                        setLoading(false);
                      }}
                    >
                      {loading ? t('common:txt_loading') : t('common:verify_otp')}
                    </Button>
                    <Button
                      className='w-full pt-6 pb-6'
                      variant='outline'
                      onClick={() => {
                        changeEmailHandler({email: currentEmail});
                      }}
                      disabled={loading ? true : false}
                    >
                      {t('common:re_send_otp')}
                    </Button>
                  </Form>
                </>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={CHANGE_EMAIL_STATE}
              validationSchema={object().shape({
                email: string().email().required().max(150).label('Email'),
              })}
              validateOnChange={false}
              onSubmit={changeEmailHandler}
            >
              {({values, errors, handleSubmit, handleBlur, setFieldError, setFieldValue}) => (
                <Form onSubmit={handleSubmit}>
                  <Field
                    label={t('profile:enter_new_email')}
                    error={
                      showError
                        ? showError.length > 0 && <FieldError message={showError} />
                        : showErrorTranslated
                        ? showErrorTranslated.length > 0 && (
                            <FieldError message={showErrorTranslated} />
                          )
                        : errors?.email && <FieldError message={errors.email} />
                    }
                  >
                    <Input
                      value={values.email}
                      type='email'
                      required={true}
                      placeholder=''
                      onKeyDown={e => {
                        if (e.key === ' ') {
                          e.preventDefault();
                        }
                      }}
                      onBlur={handleBlur}
                      handleChange={async ({target: {value}}) => {
                        setFieldError('email', undefined);
                        setFieldValue('email', value);
                        if (value.toLowerCase() === user?.email) {
                          setShowErrorTranslated(t('common:this_is_current_email'));
                          return;
                        }
                        setShowError('');
                        setShowErrorTranslated('');
                      }}
                    />
                  </Field>
                  <Button
                    className='w-full pt-6 pb-6 mt-4'
                    variant='solid'
                    type='submit'
                    disabled={showError || showErrorTranslated || loading ? true : false}
                  >
                    {loading ? t('common:txt_loading') : t('common:Change Email')}
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </>
  );
};
export default ChangeEmail;
