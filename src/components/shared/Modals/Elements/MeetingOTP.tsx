import {useContext} from 'react';
import Button from '@root/components/button';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import Error, {FieldError} from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useFormik} from 'formik';
import {signIn} from 'next-auth/react';
import {MODAL_TYPES} from 'constants/context/modals';
import {UserContext} from '@root/context/user';
import {AUTHENTICATION_TYPE} from 'constants/enums';
import toast from 'react-hot-toast';
import ModalStepper from '../Modal';

const MeetingOTP = ({
  bookerEmail,
  setUser,
  signInSubmitHandler,
  move,
  setFieldValue,
  authenticationType,
  countStep = 2,
  values: v,
}) => {
  const {t} = useTranslation();
  const {hideModal, showModal} = ModalContextProvider();
  const {user, refetchUser} = useContext(UserContext);
  const {
    values,
    setFieldValue: setValues,
    setFieldError,
    errors,
  } = useFormik({
    initialValues: {
      inputOTP: '',
      error: '',
      loading: false,
      verifying: false,
      bookerEmail,
      setUser,
      signInSubmitHandler,
      move,
      authenticationType,
    },
    validateOnChange: false,
    onSubmit: () => {},
  });

  const showSmsOtpModal = async () => {
    showModal(MODAL_TYPES.VERIFY_BOOKING_SMS_OTP, {
      phone: v.bookingData.bookerPhone,
      move,
      setFieldValue,
    });
  };

  const otpSubmitHandler = async () => {
    setValues('verifying', true);
    const response = await signIn('credentials', {
      email: bookerEmail,
      otpToken: values.inputOTP,
      redirect: false,
    });

    if (response?.status === 401) {
      setValues('verifying', false);
      setFieldError('inputOTP', 'Invalid OTP, Please Retry.');
      return;
    }
    if (response?.status === 200) {
      const id = toast.loading(<p className='text-mainBlue'>{'Loading'}</p>);
      const data: any = await refetchUser();
      toast.dismiss(id);
      const verifiedAccount = data?.data?.getUserById?.userData?.accountDetails?.verifiedAccount;
      if (!verifiedAccount && authenticationType === AUTHENTICATION_TYPE.VERIFIED_ONLY) {
        if (authenticationType === 'VERIFIED_ONLY') {
          if (!verifiedAccount) {
            showModal(MODAL_TYPES.VERIFIED_ONLY, {
              providerUsername: v.bookingData?.providerUsername,
              setUser: setUser,
              user,
              move,
              v,
              setFieldValue,
            });
            return;
          }
          if (
            v.bookingData.bookerSmsReminders &&
            v.bookingData.bookerNumberVerified !== v.bookingData.bookerPhone
          ) {
            await showSmsOtpModal();
            return;
          }
          move('next', false);
          hideModal();
        }
      }

      if (authenticationType === AUTHENTICATION_TYPE.PRE_APPROVED) {
        const preEmail = bookerEmail.split('@')[1];
        if (
          v.serviceData.whiteList.emails.includes(bookerEmail) ||
          v.serviceData.whiteList.domains.includes(preEmail)
        ) {
          if (
            v.bookingData.bookerSmsReminders &&
            v.bookingData.bookerNumberVerified !== v.bookingData.bookerPhone
          ) {
            await showSmsOtpModal();
          } else {
            move('next', false);
            hideModal();
          }
        } else {
          showModal(MODAL_TYPES.PRE_APPROVAL, {
            providerUsername: v.bookingData?.providerUsername,
            setUser: setUser,
            user,
            move,
            countStep: 2,
            bookingData: v.bookingData,
            v,
            setFieldValue,
          });
          return;
        }
      }

      if (authenticationType === AUTHENTICATION_TYPE.NONE) {
        hideModal();
        if (
          v.bookingData.bookerSmsReminders &&
          v.bookingData.bookerNumberVerified !== v.bookingData.bookerPhone
        ) {
          await showSmsOtpModal();
        } else {
          move('next', false);
        }
      }

      if (
        v.bookingData.bookerSmsReminders &&
        v.bookingData.bookerNumberVerified !== v.bookingData.bookerPhone
      ) {
        await showSmsOtpModal();
      } else {
        move('next', false);
      }

      setValues('step', 1);
      return;
    }
    setValues('verifying', false);
  };
  const steps: any = [];
  for (let index = 0; index < countStep; index++) {
    steps.push('*');
  }
  return (
    <ModalStepper
      title={t('common:OTP')}
      // size={8} step={0}
      // max={steps}
      medium
    >
      <div className='flex gap-2 flex-col'>
        <div className='bg-white'>
          <div className='sm:flex sm:items-start'>
            <div className='mt-3 text-center sm:text-left'>
              <h3 className='text-lg leading-6 font-medium text-gray-900' id='modal-title'>
                {t('common:meeting_otp_text')}
              </h3>
              <div className='mt-2'>
                <Error message={t('common:meeting_otp_time')} variant={'Red'} styles='mb-4' />
              </div>
            </div>
          </div>
        </div>
        <form
          onSubmit={el => {
            otpSubmitHandler();
            el.preventDefault();
          }}
        >
          <Field label='' error={errors?.inputOTP && <FieldError message={errors?.inputOTP} />}>
            <Input
              type={'number'}
              required={true}
              placeholder=''
              minLength={6}
              maxLength={6}
              id='inputOTP'
              value={values.inputOTP}
              handleChange={e => setValues('inputOTP', Math.abs(Number(e.target.value)).toString())}
            />
          </Field>
          <div className='py-3  flex flex-row-reverse flex-wrap sm:flex-nowrap '>
            <Button
              onClick={() => {}}
              disabled={values.verifying || values.loading || values.inputOTP.length < 6}
              variant='solid'
              type={'submit'}
              className='w-full justify-center items-center'
            >
              {values.verifying ? t('common:verifying_otp') : t('common:verify_otp')}
            </Button>
          </div>
        </form>
        <div className='grid grid-cols-2 gap-2'>
          <Button
            onClick={hideModal}
            variant='cancel'
            className='col-span-1 justify-center items-center'
          >
            {t('common:btn_cancel')}
          </Button>
          <Button
            variant='outline'
            onClick={async () => {
              setValues('loading', true);
              await values.signInSubmitHandler();
              setValues('loading', false);
            }}
            disabled={values.loading}
            className='col-span-1 justify-center items-center'
          >
            {values.loading ? t('common:resending_otp') : t('common:resend_otp')}
          </Button>
        </div>
      </div>
    </ModalStepper>
  );
};
export default MeetingOTP;
