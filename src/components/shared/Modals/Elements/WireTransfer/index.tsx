import useTranslation from 'next-translate/useTranslation';
import WireTransferModule from './WireTransferModule';
import Modal from '../../Modal';

export default function WireTransfer() {
  const {t} = useTranslation('common');
  return (
    <Modal title={t('wire_transfer')}>
      <WireTransferModule />
    </Modal>
  );
}
