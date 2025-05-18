import Link from 'next/link';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';

import queries from 'constants/GraphQL/Event/queries';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Button from '@root/components/button';
import Loader from 'components/shared/Loader/Loader';
import Error from '@components/error';
import TableHead from '@root/features/events/organizing-events/TableHead';
import TableRow from '@root/features/events/organizing-events/TableRow';

import {PlusIcon} from '@heroicons/react/24/outline';

export default function OrganizingEvents() {
  const {t: tpage} = useTranslation('page');
  const {t} = useTranslation('');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Events'), href: '#'},
    {title: tpage('Organizing Events'), href: '/user/events/organizing-events'},
  ];

  const {data: session} = useSession();

  const {
    data: {getEventsByUser: {eventsData = null} = {}} = {},
    loading,
    refetch,
  } = useQuery(queries.getEventsByUser, {
    variables: {token: session?.accessToken},
    fetchPolicy: 'cache-and-network',
  });

  console.log(eventsData);

  return (
    <PostLoginLayout>
      <Head>
        <title> {tpage('Organizing Events')}</title>
      </Head>

      <Header crumbs={crumbs} heading={tpage('Organizing Events')} />

      <div className='mt-6 flex justify-end'>
        <Link href='/user/events/add-event/?mode=create&stepType=EVENT' passHref>
          <Button variant='solid' className='w-full sm:w-auto'>
            <PlusIcon className='mr-2 h-5 w-5' aria-hidden='true' />
            {t('common:create_new_event')}
          </Button>
        </Link>
      </div>

      {loading && !eventsData && (
        <div className='mt-4'>
          <Loader />
        </div>
      )}

      {!loading && (!eventsData || eventsData?.length === 0) && (
        <div className='mt-4 pb-4'>
          <Error
            image={'/icons/errors/no-data.svg'}
            title={t('common:events_no_x_added_main')}
            description={t('common:events_no_x_added_description')}
          />
        </div>
      )}

      {eventsData && eventsData?.length > 0 && (
        <div className='border border-gray-300 border-opacity-75 rounded-lg mt-4 shadow-md'>
          <table className='table-auto max-w-full w-full'>
            <TableHead withoutType />
            {eventsData.map((event, index) => (
              <TableRow refetch={refetch} key={index} service={event} withoutType />
            ))}
          </table>
        </div>
      )}
    </PostLoginLayout>
  );
}

OrganizingEvents.auth = true;
