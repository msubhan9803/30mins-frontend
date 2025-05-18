import useTranslation from 'next-translate/useTranslation';
import Modal from 'components/shared/Modals/Modal';
import WireTransferModule from './WireTransferModule';

export default function WireTransferService(props) {
  const {t} = useTranslation('common');
  return (
    <Modal title={t('wire_transfer')}>
      <WireTransferModule {...props} />
    </Modal>
  );
}
