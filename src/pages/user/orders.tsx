import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';
import Table from 'components/PostLogin/Orders/Table';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

const MyOrders = () => {
  const {t} = useTranslation();

  const crumbs = [{title: t('page:Home'), href: '/'}];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('common:my_orders')} />
      <Head>
        <title> {t('common:my_orders')}</title>
      </Head>
      <Table />
    </PostLoginLayout>
  );
};

export default MyOrders;
MyOrders.auth = true;
