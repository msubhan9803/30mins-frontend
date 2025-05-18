import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';
import DefaultHours from 'components/PostLogin/CustomTIme/defaultHours';

export default function MyWorkingHours() {
  const {t} = useTranslation();
  const crumbs = [
    {title: t('Home'), href: '/'},
    {title: t('page:Meeting Services'), href: '#'},
    {title: t('page:My Working Hours'), href: '/user/my-working-hours'},
  ];

  return (
    <div>
      <PostLoginLayout>
        <Header crumbs={crumbs} heading={t('page:My Working Hours')} />
        <Head>
          <title>{t('page:My Working Hours')}</title>
        </Head>
        <div className='border p-2 md:p-4 border-gray-200 rounded-lg shadow-md'>
          <DefaultHours />
        </div>
      </PostLoginLayout>
    </div>
  );
}
MyWorkingHours.auth = true;
