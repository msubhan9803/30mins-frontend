import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';
import Table from 'components/PostLogin/Orders/Table';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

export default function PendingOrders() {
  const {t} = useTranslation();

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Freelancing Services'), href: '#'},
    {
      title: t('page:Pending Orders'),
      href: '/user/freelancing-services/pending-orders',
    },
  ];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Pending Orders')} />
      <Head>
        <title> {t('page:Pending Orders')}</title>
      </Head>
      <Table filter='Pending' />
    </PostLoginLayout>
  );
}

PendingOrders.auth = true;
