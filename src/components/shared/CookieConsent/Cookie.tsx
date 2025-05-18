import Button from '@root/components/button';
import useTranslation from 'next-translate/useTranslation';
import {useEffect, useState} from 'react';

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const {t} = useTranslation();
  const Accept = () => {
    localStorage.setItem('cookiesConsent', 'true');
    setShow(false);
  };

  useEffect(() => {
    const cookiesConsent = document.cookie;

    if (Object.keys(cookiesConsent).length <= 1) {
      localStorage.setItem('cookiesConsent', 'false');
      setShow(true);
    }
  }, []);

  return show ? (
    <div className='flex flex-col justify-center'>
      <div className='z-50 transition border border-mainBlue duration-200 transform ease scale-90 max-w-screen-lg mx-auto fixed bg-white inset-x-5 p-5 bottom-2 rounded-lg drop-shadow-2xl flex gap-4 flex-wrap md:flex-nowrap text-center md:text-left items-center justify-center md:justify-between'>
        <div className='w-full '>{t('common:cookie_txt')}</div>
        <div className='flex flex-col md:flex-row gap-2 items-center w-full md:w-auto'>
          <Button onClick={Accept} className='w-full md:w-auto' variant='outline'>
            {t('common:decline')}
          </Button>
          <Button onClick={Accept} className='w-full md:w-auto' variant='solid'>
            {t('common:accept')}
          </Button>
        </div>
      </div>
    </div>
  ) : null;
};
export default CookieConsent;
