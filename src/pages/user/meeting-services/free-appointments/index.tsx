import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Table from 'components/PostLogin/Mymeetings/Table';

export default function FreeAppointments() {
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Meeting Services'), href: '#'},
    {title: tpage('Free Appointments'), href: '/user/meeting-services/free-appointments'},
  ];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={tpage('Free Appointments')} />
      <Head>
        <title> {tpage('Free Appointments')}</title>
      </Head>
      <Table isFree />
    </PostLoginLayout>
  );
}
FreeAppointments.auth = true;
