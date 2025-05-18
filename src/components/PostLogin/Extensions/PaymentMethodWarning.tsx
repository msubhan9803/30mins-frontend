import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import Button from '@root/components/button';
import IconX from '@root/components/icon-x';

const PaymentMethodWarning = ({closeWarning}) => {
  const {t} = useTranslation();

  return (
    <div className='flex flex-col md:flex-row items-start md:items-center justify-between border mb-2 rounded-md shadow-sm hover:shadow-inner gap-4 px-4 py-2'>
      <span className='text-xs font-medium w-full sm:w-max'>
        {t('common:checkout_payment_method_warning')}
      </span>
      <div className='flex flex-row items-center justify-center gap-2 w-max'>
        <Link href='/user/extensions/billing' passHref>
          <Button variant='solid'>{t('common:manage_payment_methods')}</Button>
        </Link>
        <button onClick={closeWarning} className='self-start my-auto'>
          <IconX />
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodWarning;
