import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Table from 'components/PostLogin/Mymeetings/Table';

export default function PaidAppointments() {
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Meeting Services'), href: '#'},
    {title: tpage('Paid Appointments'), href: '/user/meeting-services/paid-appointments'},
  ];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={tpage('Paid Appointments')} />
      <Head>
        <title> {tpage('Paid Appointments')}</title>
      </Head>
      <Table isPaid />
    </PostLoginLayout>
  );
}
PaidAppointments.auth = true;
