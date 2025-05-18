import Header from '@root/components/header';
import useTranslation from 'next-translate/useTranslation';

const BillingHeaderBar = ({getSetupIntent, showMethodForm, existingPaymentMethod}) => {
  const {t} = useTranslation();
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Profile'), href: '/user/profile'},
    {title: tpage('Making Payments'), href: '/user/extensions/billing'},
  ];

  return (
    <div>
      <Header crumbs={crumbs} heading={t('page:Making Payments')} />
      {existingPaymentMethod ? (
        <button
          onClick={getSetupIntent}
          disabled={showMethodForm}
          className='full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-40'
        >
          {t('common:add_payment_method')}
        </button>
      ) : null}
    </div>
  );
};

export default BillingHeaderBar;
