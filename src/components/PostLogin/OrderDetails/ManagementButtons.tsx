import useTranslation from 'next-translate/useTranslation';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';

const ManagementButtons = ({
  showButtonBar,
  showCancelButton,
  showConfirmButton,
  showRefundButton,
  showCompleteButton,
  showCancelForm,
  showCompleteForm,
  showConfirmForm,
  setShowConfirmForm,
  setShowCompleteForm,
  setShowCancelForm,
  orderDetails,
  serviceExists,
}) => {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();

  return (
    <div className='flex flex-col items-center py-4 w-full gap-8'>
      {serviceExists ? (
        showButtonBar() ? (
          <div className='flex gap-4 w-full justify-center sm:justify-start flex-wrap bg-white rounded-md py-3 px-4 shadow-md'>
            {showCancelButton() ? (
              <button
                type='button'
                onClick={() => {
                  showCancelForm ? setShowCancelForm(false) : setShowCancelForm(true);
                  setShowCompleteForm(false);
                  setShowConfirmForm(false);
                }}
                className='bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600'
              >
                {t('common:txt_cancel_order')}
              </button>
            ) : null}

            {showConfirmButton() && (
              <button
                type='button'
                onClick={() => {
                  showConfirmForm ? setShowConfirmForm(false) : setShowConfirmForm(true);
                  setShowCompleteForm(false);
                  setShowCancelForm(false);
                }}
                className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
              >
                {t('meeting:buyer_confirm')}
              </button>
            )}

            {showRefundButton() && (
              <button
                type='button'
                onClick={() => {
                  showModal(MODAL_TYPES.MEETINGS, {
                    mode: 'refund',
                    meetingData: orderDetails,
                    title: t('meeting:refund_order'),
                    labelTitle: t('meeting:reason_refund'),
                  });
                }}
                className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
              >
                {t('meeting:request_refund')}
              </button>
            )}

            {showCompleteButton() && (
              <button
                type='button'
                onClick={() => {
                  showCompleteForm ? setShowCompleteForm(false) : setShowCompleteForm(true);
                  setShowConfirmForm(false);
                  setShowCancelForm(false);
                }}
                className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
              >
                {t('meeting:mark_as_complete')}
              </button>
            )}
          </div>
        ) : null
      ) : (
        <p className='text-red-500'>{t('meeting:service_deleted_by_provider')}</p>
      )}
    </div>
  );
};

export default ManagementButtons;
