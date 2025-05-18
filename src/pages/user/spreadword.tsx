import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import SpreadTheWord from 'components/PostLogin/SpreadTheWord';
import PostLoginLayout from '@root/components/layout/post-login';
import Header from '@root/components/header';

const Spreadword = () => {
  const {t} = useTranslation();

  const crumbs = [{title: t('page:Home'), href: '/'}];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Spread the Word')} />

      <Head>
        <title>{t('page:Spread the Word')}</title>
      </Head>
      <SpreadTheWord />
    </PostLoginLayout>
  );
};

export default Spreadword;
Spreadword.auth = true;
