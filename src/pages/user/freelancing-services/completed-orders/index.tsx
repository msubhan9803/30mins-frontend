import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';
import Table from 'components/PostLogin/Orders/Table';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

export default function CompletedOrders() {
  const {t} = useTranslation();

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Freelancing Services'), href: '#'},
    {
      title: t('page:Completed Orders'),
      href: '/user/freelancing-services/completed-orders',
    },
  ];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Completed Orders')} />
      <Head>
        <title> {t('page:Completed Orders')}</title>
      </Head>
      <Table filter='Completed' />
    </PostLoginLayout>
  );
}

CompletedOrders.auth = true;
