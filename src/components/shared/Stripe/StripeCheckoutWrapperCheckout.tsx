import {Elements} from '@stripe/react-stripe-js';
import getStripe from 'utils/getStripe';
import StripeCheckoutForm from './StripeCheckoutForm';

const StripeCheckoutWrapper = ({clientSecret, price, receiptEmail, postProcessingCallback}) => (
  <>
    <Elements stripe={getStripe()} options={{clientSecret}}>
      <StripeCheckoutForm
        price={price}
        receiptEmail={receiptEmail}
        postProcessingCallback={postProcessingCallback}
      />
    </Elements>
  </>
);

export default StripeCheckoutWrapper;
