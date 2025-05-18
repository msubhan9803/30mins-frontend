import React from 'react';
import Button from '@root/components/button';
import useTranslation from 'next-translate/useTranslation';

import ModalStepper from '../Modal';

const MessageOtpModal = ({setFieldValue, signInSMSSubmitHandler}) => {
  const {t} = useTranslation();

  return (
    <ModalStepper title={'Phone Verification'} extraMedium>
      <div className='flex gap-2 flex-col'>
        <div className='bg-white'>
          <div className='sm:flex sm:items-start'>
            <div className='mt-3 text-center sm:text-left'>
              <h3 className='text-lg leading-6 font-medium text-gray-900' id='modal-title'>
                We just sent a one time password to your phone number. You will get an OTP via SMS.
              </h3>
            </div>
          </div>
        </div>
        <div className='flex justify-end mt-5 '>
          <div className='grid grid-cols-2 gap-2 w-full'>
            <Button
              onClick={async () => {
                setFieldValue('verify_otp', true);
                await signInSMSSubmitHandler();
              }}
              variant='outline'
              className='col-span-1 justify-center items-center'
            >
              Send OTP
            </Button>
            <Button variant='cancel' className='col-span-1 justify-center items-center '>
              {t('common:btn_cancel')}
            </Button>
          </div>
        </div>
      </div>
    </ModalStepper>
  );
};
export default MessageOtpModal;
