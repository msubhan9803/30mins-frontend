import {Elements} from '@stripe/react-stripe-js';
import PaymentMethodForm from 'components/PostLogin/Extensions/PaymentMethodForm';
import getStripe from 'utils/getStripe';

const ElementsFormWrapper = ({
  secret,
  setShowMethodForm,
  customerId,
  modalView = false,
  setPaymentMethods,
}) => (
  <div className='w-full flex justify-center'>
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret: secret,
      }}
    >
      <PaymentMethodForm
        setShowMethodForm={setShowMethodForm}
        customerId={customerId}
        modalView={modalView}
        setPaymentMethods={setPaymentMethods}
      />
    </Elements>
  </div>
);

export default ElementsFormWrapper;
