import useTranslation from 'next-translate/useTranslation';
import {useContext} from 'react';
import {UserContext} from '@context/user';
import {CheckBadgeIcon} from '@heroicons/react/20/solid';
import {MODAL_TYPES} from '../../../../../constants/context/modals';
import {ModalContextProvider} from '../../../../../store/Modal/Modal.context';

const VerifiedAccountNotice = () => {
  const {t} = useTranslation();
  const {user, setUser} = useContext(UserContext);
  const {showModal} = ModalContextProvider();

  return (
    <>
      <div className='bg-white px-4 py-5 shadow sm:rounded-lg flex flex-col gap-2'>
        <div className='flex gap-2 items-center'>
          <CheckBadgeIcon className='w-10 h-10 text-mainBlue' />
          <div className={'flex flex-col justify-center'}>
            <h2 className='text-md font-bold'>{t('profile:Verified_Notice_Header')}</h2>
            <h4 className='text-sm font-semibold text-gray-500'>
              {t('profile:Verified_Notice_SubHeader')}
            </h4>
          </div>
        </div>
        <div className={'flex justify-between items-start flex-col gap-2'}>
          <span className={'text-sm'}>{t('profile:Verified_Notice_Description')}</span>
          <button
            className={
              'text-sm mx-auto h-min min-w-max block font-medium rounded-md border sm:px-5 px-2 py-1.5 border-transparent bg-mainBlue text-white shadow duration-150 ease-out hover:bg-blue-800 focus:outline-none focus:ring-2 focus:mainBlue focus:ring-offset-2'
            }
            onClick={() =>
              showModal(MODAL_TYPES.VERIFIED_ONLY, {
                setUser,
                user,
                countStep: 1,
              })
            }
          >
            {t('profile:Get_Verified')}
          </button>
        </div>
      </div>
    </>
  );
};

export default VerifiedAccountNotice;
