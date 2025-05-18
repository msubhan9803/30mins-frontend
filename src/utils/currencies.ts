const currencyConversionMap = {
  $: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }),
  '₹': new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }),
  '£': new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }),
  '€': new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: 'EUR',
  }),
};

export default currencyConversionMap;
