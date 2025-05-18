import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Table from '@root/features/events/attendee-events/Table';

export default function AllEvents() {
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Events'), href: '/user/events/organizing-events'},
    {title: tpage('Attending Events'), href: '/user/events/attending'},
  ];

  return (
    <PostLoginLayout>
      <Head>
        <title> {tpage('Attending Events')}</title>
      </Head>

      <Header crumbs={crumbs} heading={tpage('Attending Events')} />

      <Table />
    </PostLoginLayout>
  );
}
AllEvents.auth = true;
