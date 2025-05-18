import useTranslation from 'next-translate/useTranslation';
import Button from '@root/components/button';
import {ModalContextProvider} from '../../../../store/Modal/Modal.context';

export default function Attachcalendar({handleNextBtn}) {
  const {hideModal} = ModalContextProvider();
  const {t} = useTranslation('common');
  return (
    <div
      className='fixed inset-0 overflow-y-auto'
      style={{
        maxHeight: '100vh',
        paddingRight: '10px',
        paddingLeft: '10px',
        zIndex: '60',
      }}
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
    >
      <div className='relative min-h-screen max-h-screen text-center flex justify-center items-center'>
        <div
          className='fixed h-screen w-screen inset-0 bg-black bg-opacity-50 transition-opacity max-h-screen'
          aria-hidden='true'
        ></div>
        <div
          className={`inline-block bg-white rounded-lg mx-4 sm:mx-0 px-4  pb-4 space-y-5  text-left shadow-xl transform transition-all overflow-y-scroll md:overflow-auto lg:overflow-auto md:overflow-x-hidden lg:overflow-x-hidden align-middle max-w-4xl w-full p-6 sm:my-8 sm:align-middle sm:max-w-4xl max-h-[90vh]`}
          style={{
            width: '600px',
          }}
        >
          <div className='flex justify-between items-center'>
            <h3
              className={`text-mainBlue text-xl leading-6 font-bold justify-center  w-3/4 align-middle text-left  ${'line-clamp-1 break-all'}`}
            >
              {t('attach_calendar')}
            </h3>
          </div>

          <div className='flex flex-col md:flex-row gap-2'>
            <div className='flex flex-col w-full md:w-1/3'>
              <img src='/icons/services/calendar.svg' className='h-48 w-48 mx-auto' alt='' />
            </div>
            <div className='flex flex-col w-full md:w-2/3 justify-center gap-2'>
              <div className='font-semibold'>{t('attach_must_1')}</div>
              <div className='font-normal mt-4'>{t('attach_must_2')}</div>
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-2'>
            <div className='font-semibold'>{t('attach_must_3')}</div>
          </div>
          <div className='flex flex-row gap-2 justify-between'>
            <Button
              variant='outline'
              onClick={async () => {
                await handleNextBtn();
                hideModal();
              }}
            >
              {t('No_I_will_attach_later')}
            </Button>
            <Button variant='solid' onClick={() => hideModal()}>
              {t('attach_calendar')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
