import {ModalContextProvider} from 'store/Modal/Modal.context';
import {ShareIcon} from '@heroicons/react/24/outline';

import {
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappIcon,
  WhatsappShareButton,
  LinkedinShareButton,
  LinkedinIcon,
} from 'next-share';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const ShareProfile = () => {
  const {t} = useTranslation();
  const {store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {name, userLink, sharePage} = modalProps || {};

  return (
    <Modal
      icon={<ShareIcon className='w-6 h-6' />}
      title={sharePage ? t('profile:share_page') : `${t('profile:share_profile')} ${name}`}
      small
    >
      <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
        <div className='flex items-start justify-center'>
          <FacebookShareButton url={userLink} quote={'30mins.com'}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TelegramShareButton url={userLink} title={'30mins.com'}>
            <TelegramIcon size={40} round style={{marginLeft: 10}} />
          </TelegramShareButton>
          <TwitterShareButton url={userLink} title={'30mins.com'}>
            <TwitterIcon size={40} round style={{marginLeft: 10}} />
          </TwitterShareButton>
          <WhatsappShareButton url={userLink} title={'30mins.com'} separator=':: '>
            <WhatsappIcon size={40} round style={{marginLeft: 10}} />
          </WhatsappShareButton>
          <LinkedinShareButton url={userLink}>
            <LinkedinIcon size={40} round style={{marginLeft: 10}} />
          </LinkedinShareButton>
        </div>
      </div>
    </Modal>
  );
};
export default ShareProfile;
