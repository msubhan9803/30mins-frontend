/* eslint-disable no-lone-blocks */
import useTranslation from 'next-translate/useTranslation';
import ModalStepper from '../../Modal';
import Cart from './features/cart';

const PublicCheckout = () => {
  const {t} = useTranslation();

  return (
    <ModalStepper title={t('page:Cart')}>
      <Cart />
    </ModalStepper>
  );
};
export default PublicCheckout;
