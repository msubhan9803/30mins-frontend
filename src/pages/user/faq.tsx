import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';
import FAQ from 'components/PostLogin/FAQ/FAQ';

import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

const FAQPage = () => {
  const {t} = useTranslation();
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('FAQ'), href: '/user/faq'},
  ];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:FAQ_full_form')} />
      <Head>
        <title>{t('page:FAQ_full_form')}</title>
      </Head>
      <FAQ />
    </PostLoginLayout>
  );
};

export default FAQPage;
FAQPage.auth = true;
