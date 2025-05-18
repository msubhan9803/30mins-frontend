import {useEffect, useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {useSession} from 'next-auth/react';
import {Form, Formik} from 'formik';
import Button from '@components/button';
import Input from '@components/forms/input';
import Field from '@components/forms/field';
import {FieldError} from '@components/forms/error';
import {useMutation} from '@apollo/client';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {toast} from 'react-hot-toast';
import Countdown, {zeroPad} from 'react-countdown';
import Modal from '../Modal';
import userMutations from '../../../../constants/GraphQL/User/mutations';

const VerifyBookingSmsOtp = ({phone, move, setFieldValue}) => {
  const [validateSmsOtp] = useMutation(userMutations.validateSmsOtp);
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {hideModal} = ModalContextProvider();
  const [loading, setloading] = useState(false);
  const [awaitTime, setawaitTime] = useState(false);
  const [sendSmsOtpMutation] = useMutation(userMutations.sendSmsOtp);
  const [timer, settimer] = useState(Date.now() + 30000);

  const sendSmsOtp = async () => {
    const id = toast.loading(<p className='text-mainBlue'>{t('common:sending_otp')}</p>);
    const data = await sendSmsOtpMutation({
      variables: {
        phone: phone,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });

    toast.dismiss(id);
    if (data?.data?.sendSmsOtp?.status === 200) {
      toast.success(<p className='text-mainBlue'>{t('common:sending_otp')}</p>);
    } else {
      toast.error(<p className='text-red-400'>{t('common:failed_to_send_otp')}</p>);
    }
  };

  const submitHandler = async values => {
    setloading(true);
    const id = toast.loading(t('common:checking_txt'));
    const {data: response} = await validateSmsOtp({
      variables: {
        phone: phone,
        otpToken: values.otp,
        forProviderExtension: true,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });
    toast.dismiss(id);
    if (response.validateSmsOtp.status === 200) {
      toast.success(t(`common:${response.validateSmsOtp.message}`));
      setFieldValue('bookingData.bookerNumberVerified', phone);
      setFieldValue('bookingData.bookerSmsVerified', true);
      move('next', false);
      hideModal();
    } else {
      toast.error(t(`common:${response.validateSmsOtp.message}`));
    }
    setloading(false);
  };

  useEffect(() => {
    setawaitTime(true);
    const id = toast.loading(<p className='text-mainBlue'>{t('common:sending_otp')}</p>);
    sendSmsOtpMutation({
      variables: {
        phone: phone,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    }).then(el => {
      toast.dismiss(id);
      if (el?.data?.sendSmsOtp?.status === 200) {
        toast.success(<p className='text-mainBlue'>{t('common:sending_otp')}</p>);
      } else {
        toast.error(<p className='text-red-400'>{t('common:failed_to_send_otp')}</p>);
      }
    });

    setTimeout(() => {
      setawaitTime(false);
    }, 30000);
  }, []);

  const renderer = ({minutes, seconds}) =>
    (minutes > 0 || seconds > 0) && (
      <span>
        {zeroPad(minutes)}:{zeroPad(seconds)}
      </span>
    );

  return (
    <Modal title={t('common:verify_sms_otp')} medium={true}>
      <Formik initialValues={{otp: ''}} onSubmit={async values => submitHandler(values)}>
        {({errors, values, handleChange}) => (
          <Form className={'flex flex-col gap-2 items-center'}>
            <Field
              label={t('common:otp_sent_msg')}
              error={errors?.otp && <FieldError message={errors?.otp} />}
            >
              <Input
                type={'text'}
                required={true}
                placeholder=''
                minLength={6}
                maxLength={6}
                id='otp'
                value={values.otp}
                handleChange={handleChange}
              />
            </Field>

            <div className='grid grid-cols-2 w-full gap-2'>
              <Button
                type={'button'}
                disabled={loading || awaitTime}
                variant={'outline'}
                className={'w-full gap-1'}
                onClick={async () => {
                  setawaitTime(true);
                  settimer(Date.now() + 30000);
                  await sendSmsOtp();
                  setTimeout(() => {
                    setawaitTime(false);
                  }, 30000);
                }}
              >
                {`${t('common:resend_otp')} `}
                <Countdown autoStart renderer={renderer} date={timer} key={timer} />
              </Button>
              <Button type={'submit'} disabled={loading} variant={'solid'} className={'w-full'}>
                {t('common:verify_otp')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export default VerifyBookingSmsOtp;
