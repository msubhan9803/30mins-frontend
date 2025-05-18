import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';
import Table from 'components/PostLogin/Mymeetings/Table';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

const Mymeetings = () => {
  const {t} = useTranslation();

  const crumbs = [{title: t('page:Home'), href: '/'}];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('meeting:txt_my_meeting')} />
      <Head>
        <title> {t('meeting:txt_my_meeting')}</title>
      </Head>
      <Table />
    </PostLoginLayout>
  );
};

export default Mymeetings;
Mymeetings.auth = true;
