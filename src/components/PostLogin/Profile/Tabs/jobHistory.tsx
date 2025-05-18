import {useQuery} from '@apollo/client';
import {MODAL_TYPES} from 'constants/context/modals';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import queries from 'constants/GraphQL/JobHistory/queries';
import Loader from 'components/shared/Loader/Loader';
import EmptyService from 'components/shared/Card/States/emptyService';
import HistoryCard from 'components/shared/Card/History/Card';
import Button from '@root/components/button';

const JobHistory = () => {
  const {data: session} = useSession();
  const {data, loading} = useQuery(queries.getJobHistoryByUserId, {
    variables: {token: session?.accessToken},
  });

  const hasJobs = data?.getJobHistoryByUserId?.response?.status !== 404;
  const jobsData: any =
    data?.getJobHistoryByUserId?.jobHistoryData &&
    Object.values(data?.getJobHistoryByUserId?.jobHistoryData).sort(
      (a: any, b: any) => new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf()
    );

  const svg = (
    <svg
      className='mx-auto h-12 w-12 text-gray-400'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      role='img'
      width='1em'
      height='1em'
      preserveAspectRatio='xMidYMid meet'
      viewBox='0 0 16 16'
    >
      <g fill='currentColor'>
        <path d='M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z' />
      </g>
    </svg>
  );

  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  const toggleaddJob = () => {
    showModal(MODAL_TYPES.JOBHISTORY);
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className='justify-end items-end flex mt-2 p-2'>
        <Button onClick={toggleaddJob} variant='solid' className='w-full sm:w-max'>
          {t('profile:add_job_history_title')}
        </Button>
      </div>
      {!hasJobs ? (
        <div className='max-w-lg'>
          <EmptyService title={t('event:txt_not_add_desc2')} svg={svg} onClick={toggleaddJob} />
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-1 gap-1 w-full px-6'>
          {jobsData.map(jobs => (
            <HistoryCard key={jobs.id} jobs={jobs} />
          ))}
        </div>
      )}
    </>
  );
};

export default JobHistory;
