import React from 'react';
import Image from 'next/image';
import Button from '@components/button';
import {useRouter} from 'next/router';
import {ModalContextProvider} from '../../../store/Modal/Modal.context';
import Modal from './Modal';

const MissingExtensionModal = () => {
  const router = useRouter();
  const {store, hideModal} = ModalContextProvider();
  const {modalProps} = store || {};
  const {title, extensionPageUrl, description, buttonText} = modalProps || {};

  return (
    <Modal extraMedium modalWrapperClass='' title={''}>
      <div className='flex flex-col items-center justify-center py-24 px-6 border border-gray-200 mt-6 rounded-lg shadow-md'>
        <Image src='/icons/errors/credentials.svg' width={160} height={160} alt='' />
        <h2 className='text-mainText mb-2 mt-6 text-xl font-medium'>{title}</h2>
        <p className='text-center text-gray-500 mb-6 max-w-lg'>{description}</p>
        <Button
          onClick={async () => {
            await router.push(extensionPageUrl);
            hideModal();
          }}
          variant='solid'
        >
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};

export default MissingExtensionModal;
