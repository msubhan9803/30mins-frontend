import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';
import MultualAuths from '@root/features/mutual-auths';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

export default function MutualAuth() {
  const {t} = useTranslation();

  const crumbs = [{title: t('page:Home'), href: '/'}];
  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('common:Authorized Users')} />
      <Head>
        <title> {t('common:Authorized Users')}</title>
      </Head>
      <MultualAuths />
    </PostLoginLayout>
  );
}

MutualAuth.auth = true;
