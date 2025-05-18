import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../button';

interface IErrorProps {
  image: string;
  title: string;
  description: string;
  linkText?: string;
  linkURL?: string;
}

export default function Error({image, title, description, linkText, linkURL}: IErrorProps) {
  return (
    <div className='flex flex-col items-center justify-center py-24 px-6 border border-gray-200 mt-6 rounded-lg shadow-md'>
      <Image src={image} width={160} height={160} alt='' />
      <h2 className='text-mainText text-center my-2 text-lg font-medium'>{title}</h2>
      <p className='text-center text-gray-500'>{description}</p>
      {linkText && linkURL && (
        <Link href={linkURL} passHref>
          <a className='text-mainBlue mt-2 font-semibold text-base'>{linkText}</a>
        </Link>
      )}
    </div>
  );
}

export function CredentialsError({router}) {
  const {t} = useTranslation('common');

  return (
    <div className='flex flex-col items-center justify-center py-24 px-6 border border-gray-200 mt-6 rounded-lg shadow-md'>
      <Image src='/icons/errors/credentials.svg' width={160} height={160} alt='' />
      <h2 className='text-mainText mb-2 mt-6 text-xl font-medium'>
        {t('credentials_error_title')}
      </h2>
      <p className='text-center text-gray-500 mb-6 max-w-lg'>
        {t('credentials_error_description')}
      </p>
      <Button onClick={() => router.push('/user/integrations')} variant='solid'>
        {t('go_to_connected_calendars')}
      </Button>
    </div>
  );
}

export function OrgExtentionError({router, hideModal}: {router: any; hideModal?(): void}) {
  const {t} = useTranslation('common');

  return (
    <div className='flex flex-col items-center justify-center py-24 px-6 border border-gray-200 mt-6 rounded-lg shadow-md'>
      <Image src='/icons/errors/credentials.svg' width={160} height={160} alt='' />
      <h2 className='text-mainText mb-2 mt-6 text-xl font-medium'>
        {t('org_extention_error_title')}
      </h2>
      <p className='text-center text-gray-500 mb-6 max-w-lg'>
        {t('org_extention_error_description')}
      </p>
      <div className='flex flex-col gap-2'>
        <Button
          onClick={() => {
            router.push('/user/extensions');
            return hideModal && hideModal();
          }}
          variant='solid'
        >
          {t('go_to_extentions')}
        </Button>
        {hideModal && (
          <Button onClick={hideModal} className='flex justify-center bg-red-400' variant='solid'>
            {t('go_back')}
          </Button>
        )}
      </div>
    </div>
  );
}

export function OrgError({router}) {
  const {t} = useTranslation('common');

  return (
    <div className='flex flex-col items-center justify-center py-24 px-6 border border-gray-200 mt-6 rounded-lg shadow-md'>
      <Image src='/icons/errors/credentials.svg' width={160} height={160} alt='' />
      <h2 className='text-mainText mb-2 mt-6 text-xl font-medium'>{t('org_error_title')}</h2>
      <p className='text-center text-gray-500 mb-6 max-w-lg'>{t('org_error_description')}</p>
      <Button onClick={() => router.push('/user/organizations')} variant='solid'>
        {t('go_to_organizations')}
      </Button>
    </div>
  );
}

export function BWError({router}) {
  const {t} = useTranslation('common');

  return (
    <div className='flex flex-col items-center'>
      <Image src='/icons/errors/credentials.svg' width={160} height={160} alt='' />
      <h2 className='text-mainText mb-2 mt-6 text-xl font-medium'>{t('bw_error_title')}</h2>
      <p className='text-center text-gray-500 mb-6 max-w-lg'>{t('bw_error_description')}</p>
      <Button onClick={() => router.push('/user/extensions')} variant='solid'>
        {t('go_to_extentions')}
      </Button>
    </div>
  );
}

export function EscrowAccountNotConnectedError({router}) {
  const {t} = useTranslation('common');

  return (
    <div className='flex flex-col items-center justify-center py-24 px-6 border border-gray-200 mt-6 rounded-lg shadow-md'>
      <Image src='/icons/errors/credentials.svg' width={160} height={160} alt='' />
      <h2 className='text-mainText mb-2 mt-6 text-xl font-medium'>{t('escrow_not_connected')}</h2>
      <p className='text-center text-gray-500 mb-6 max-w-lg whitespace-pre-line'>
        {t('escrow_not_connected_description')}
      </p>
      <Button onClick={() => router.push('/user/paymentOptions/')} variant='solid'>
        {t('go_to_receiving_payments')}
      </Button>
    </div>
  );
}

export function GenericExtensionError({
  router,
  errorTitle,
  errorDescription,
  extensionLink,
  buttonText,
}) {
  return (
    <div className='flex flex-col items-center justify-center py-24 px-6 border border-gray-200 mt-6 rounded-lg shadow-md'>
      <Image src='/icons/errors/credentials.svg' width={160} height={160} alt='' />
      <h2 className='text-mainText mb-2 mt-6 text-xl font-medium'>{errorTitle}</h2>
      <p className='text-center text-gray-500 mb-6 max-w-lg'>{errorDescription}</p>
      <Button onClick={() => router.push(extensionLink)} variant='solid'>
        {buttonText}
      </Button>
    </div>
  );
}
