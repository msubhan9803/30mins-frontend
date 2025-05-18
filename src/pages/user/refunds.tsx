import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

const RefundsPage = () => {
  const {t} = useTranslation();
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Refunds'), href: '/user/refunds'},
  ];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Refunds')} />
      <Head>
        <title>{t('page:Refunds')}</title>
      </Head>
      <div className='grid grid-cols-4 px-0 py-0 flex flex-col gap-8'>
        <div className='grid col-span-1 px-0 py-0 flex flex-col gap-8'>
          <Image
            src='/assets/refund.png'
            alt='refund'
            height={200}
            width={200}
            layout='intrinsic'
            objectFit='contain'
          />
        </div>
        <div className='grid col-span-3 px-0 py-0 flex flex-col gap-8'>
          <h1 className='headerLg font-bold'>{t('page:refunds_header')}</h1>
          <p>{t('page:refunds_01')}</p>
          <p>
            {t('page:refunds_02')}{' '}
            <a className='text-mainBlue' href='https://30mins.com/blog/refunds'>
              {t('page:refunds_03')}
            </a>{' '}
            {t('page:refunds_04')}{' '}
            <a className='text-mainBlue' href='mailto:refunds@30mins.com'>
              {t('page:refunds_05')}
            </a>
          </p>
        </div>
      </div>
    </PostLoginLayout>
  );
};

export default RefundsPage;
RefundsPage.auth = true;
