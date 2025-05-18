import {ORDER_FORM_TYPES} from 'constants/enums';
import BottomForm from './BottomForm';

const ButtonFormWrapper = ({
  showCancelForm,
  showCompleteForm,
  showConfirmForm,
  loading,
  onCancel,
  orderDetails,
  cancelOrderHandler,
  completeOrderHandler,
  confirmOrderHandler,
  reasonCancel,
  setReasonCancel,
  reasonComplete,
  setReasonComplete,
  reasonConfirm,
  setReasonConfirm,
  attachment,
  setAttachment,
}) => (
  <>
    {showCancelForm && (
      <BottomForm
        loading={loading}
        reason={reasonCancel}
        setReason={setReasonCancel}
        onCancelHandler={onCancel}
        meetingDetails={orderDetails}
        txtMessage='cancel_msg_order'
        txtButton='cancel_btn_order'
        ManagementHandler={cancelOrderHandler}
        formType={ORDER_FORM_TYPES.CANCEL}
        attachment={attachment}
        setAttachment={setAttachment}
      />
    )}
    {showCompleteForm && (
      <BottomForm
        loading={loading}
        reason={reasonComplete}
        setReason={setReasonComplete}
        onCancelHandler={onCancel}
        meetingDetails={orderDetails}
        txtMessage='completion_msg_order'
        txtButton='completion_btn_order'
        ManagementHandler={completeOrderHandler}
        formType={ORDER_FORM_TYPES.COMPLETE}
        attachment={attachment}
        setAttachment={setAttachment}
      />
    )}
    {showConfirmForm && (
      <BottomForm
        loading={loading}
        reason={reasonConfirm}
        setReason={setReasonConfirm}
        onCancelHandler={onCancel}
        meetingDetails={orderDetails}
        txtMessage='confirmation_msg_order'
        txtButton='confirmation_btn_order'
        ManagementHandler={confirmOrderHandler}
        formType={ORDER_FORM_TYPES.CONFIRM}
        attachment={attachment}
        setAttachment={setAttachment}
      />
    )}
  </>
);

export default ButtonFormWrapper;
