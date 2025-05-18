import {Elements} from '@stripe/react-stripe-js';
import getStripe from 'utils/getStripe';
import {IinitialValues} from '../../constants';
import CheckOutForm from './CheckOutForm';

function CheckoutWrapper({values, moveBack}: {values: IinitialValues; moveBack(): void}) {
  return (
    <>
      {values.serviceData.paymentType !== 'escrow' ? (
        <Elements
          stripe={getStripe(values.user.accountDetails.stripeAccountId)}
          options={{clientSecret: values.clientSecret}}
        >
          <CheckOutForm moveBack={moveBack} values={values} />
        </Elements>
      ) : (
        <Elements stripe={getStripe()} options={{clientSecret: values.clientSecret}}>
          <CheckOutForm moveBack={moveBack} values={values} />
        </Elements>
      )}
    </>
  );
}

export default CheckoutWrapper;
