import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';

import queries from 'constants/GraphQL/JobHistory/queries';
import {MODAL_TYPES} from 'constants/context/modals';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Button from '@root/components/button';
import Loader from 'components/shared/Loader/Loader';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import HistoryCard from 'components/shared/Card/History/Card';
import Error from '@components/error';

import {PlusIcon} from '@heroicons/react/24/outline';

export default function Publications() {
  const {t} = useTranslation();
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Profile'), href: '/user/profile'},
    {title: tpage('Job History'), href: '/user/job-history'},
  ];

  const {data: session} = useSession();
  const {data, loading} = useQuery(queries.getJobHistoryByUserId, {
    variables: {token: session?.accessToken},
  });

  const {showModal} = ModalContextProvider();

  const jobsData: any =
    data?.getJobHistoryByUserId?.jobHistoryData &&
    Object.values(data?.getJobHistoryByUserId?.jobHistoryData).sort(
      (a: any, b: any) => new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf()
    );

  const toggleAddJob = () => {
    showModal(MODAL_TYPES.JOBHISTORY);
  };

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('common:Job History')}</title>
      </Head>
      <Header crumbs={crumbs} heading={t('common:Job History')} />

      <div className='mt-6 flex justify-end'>
        <Button variant='solid' className='w-full sm:w-auto' onClick={toggleAddJob}>
          <PlusIcon className='mr-2 h-5 w-5' aria-hidden='true' />
          {t('profile:add_job_history_title')}
        </Button>
      </div>

      {loading && (
        <div className='mt-4'>
          <Loader />
        </div>
      )}

      {!loading && jobsData && jobsData.length === 0 && (
        <div className='mt-4 pb-4'>
          <Error
            image={'/icons/errors/no-data.svg'}
            title={t('common:job_history_no_x_added_main')}
            description={t('common:job_history_no_x_added_description')}
            linkText={t('common:job_history_learn_more')}
            linkURL='/blog/help_user_job_history/'
          />
        </div>
      )}

      {!loading && jobsData?.length > 0 && (
        <div className='mt-4 pb-8 grid grid-cols-1 gap-1'>
          {jobsData.map(jobs => (
            <HistoryCard key={jobs.id} jobs={jobs} />
          ))}
        </div>
      )}
    </PostLoginLayout>
  );
}

Publications.auth = true;
