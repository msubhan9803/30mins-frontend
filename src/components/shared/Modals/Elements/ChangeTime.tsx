import useTranslation from 'next-translate/useTranslation';
import DefaultHours from 'components/PostLogin/CustomTIme/defaultHours';
import Modal from '../Modal';

const ChangeTimeModal = () => {
  const {t} = useTranslation();
  return (
    <Modal title={t('common:change_ava_time')}>
      <DefaultHours />
    </Modal>
  );
};

export default ChangeTimeModal;
