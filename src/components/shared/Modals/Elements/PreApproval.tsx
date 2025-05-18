/* eslint-disable no-lone-blocks */
import useTranslation from 'next-translate/useTranslation';
import Button from '@root/components/button';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {toast} from 'react-hot-toast';
import {MODAL_TYPES} from 'constants/context/modals';
import ModalStepper from '../Modal';

const PreApproval = ({
  bookingData,
  countStep = 2,
  move,
  approved,
  dayPassed,
  approvalRequested,
  v,
  setFieldValue,
}) => {
  const {t} = useTranslation('common');
  const {hideModal, showModal} = ModalContextProvider();
  const [isDisabled, setDisabled] = useState(true);
  const [state, setState] = useState({approved, dayPassed, approvalRequested});

  const showSmsOtpModal = () => {
    showModal(MODAL_TYPES.VERIFY_BOOKING_SMS_OTP, {
      phone: v.bookingData.bookerPhone,
      move,
      setFieldValue,
    });
  };

  const getPreApprovedUsers = async () => {
    const request = await axios.post('/api/booking/getPreApprovedUsers', {
      bookerEmail: bookingData?.bookerEmail,
      providerEmail: bookingData?.providerEmail,
      serviceId: bookingData?.serviceID,
    });
    setState(request?.data?.getPreApprovedUsers);
    return request?.data?.getPreApprovedUsers;
  };

  useEffect(() => {
    getPreApprovedUsers().then(() => {
      setDisabled(false);
    });
  }, []);
  useEffect(() => {}, [{...state}]);
  const requestApprovalHandler = async () => {
    try {
      const requestApproval = await axios.post('/api/booking/requestApproval', {
        bookerEmail: bookingData?.bookerEmail,
        providerEmail: bookingData?.providerEmail,
        bookerName: bookingData?.bookerName,
        providerName: bookingData?.providerName,
        serviceId: bookingData?.serviceID,
        windowOrigin: window?.origin,
      });
      return requestApproval.status === 200 ? true : false;
      // eslint-disable-next-line no-empty
    } catch (e) {
      return false;
    }
  };

  const disableRequestApprovalButton = () => {
    if (!state.approvalRequested && !state.dayPassed && !state.approved) return false;
    if (state.approvalRequested && state.dayPassed && !state.approved) return false;
    return true;
  };

  const steps: any = [];
  for (let index = 0; index < countStep; index++) {
    steps.push('*');
  }
  return (
    <ModalStepper
      title={t('common:pre_approval')}
      // size={8} step={1} max={steps}
      medium
    >
      <div className='flex gap-2 flex-col'>
        <div className='bg-white'>
          <div className='sm:flex sm:items-start'>
            <div className='mt-3 text-center sm:text-left'>
              <h3 className='text-lg leading-6 font-medium text-gray-900' id='modal-title'>
                {!disableRequestApprovalButton()
                  ? t('common:this_provider_only_allows_pre_approved')
                  : t('common:you_currently_have_a_pending_request')}
              </h3>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <Button
            onClick={async () => {
              if (!isDisabled) {
                setDisabled(true);
                const id = toast.loading(<p>{t('common:loading')}</p>);
                const data = await getPreApprovedUsers();
                // move next
                if (data.approved === true) {
                  if (
                    v.bookingData.bookerSmsReminders &&
                    v.bookingData.bookerNumberVerified !== v.bookingData.bookerPhone
                  ) {
                    await showSmsOtpModal();
                  } else {
                    move('next', false);
                    hideModal();
                  }
                }
                toast.dismiss(id);
                if (data.approvalRequested && !data.approved && !data.dayPassed) {
                  toast.error(<p>{t('meeting:not_approved')}</p>);
                }
                setDisabled(false);
              }
            }}
            variant='solid'
            disabled={!disableRequestApprovalButton() || isDisabled}
            className='space-1 justify-center items-center'
          >
            {t('meeting:check_approval')}
          </Button>
          <Button
            variant='solid'
            onClick={async () => {
              setDisabled(true);
              const id = toast.loading(<p>{t('common:loading')}</p>);
              setState({approved: false, dayPassed: false, approvalRequested: true});
              const res = await requestApprovalHandler();
              toast.dismiss(id);
              if (res) {
                toast.success(<p>{t('common:request_sent')}</p>);
              } else {
                toast.error(<p>{t('common:failed_sending_request')}</p>);
              }
              await getPreApprovedUsers();
              setDisabled(false);
            }}
            disabled={disableRequestApprovalButton() || isDisabled}
            className='space-1 justify-center items-center'
          >
            {t('common:request_approval')}
          </Button>
        </div>
      </div>
    </ModalStepper>
  );
};
export default PreApproval;
