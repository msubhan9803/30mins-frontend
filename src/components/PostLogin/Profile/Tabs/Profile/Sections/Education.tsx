import useTranslation from 'next-translate/useTranslation';
import {useSession} from 'next-auth/react';
import {useQuery} from '@apollo/client';

import queries from 'constants/GraphQL/EducationHistory/queries';
import {MODAL_TYPES} from 'constants/context/modals';

import {ModalContextProvider} from 'store/Modal/Modal.context';
import Button from '@root/components/button';
import EducationCard from 'components/shared/Card/Education/Card';

import {AcademicCapIcon} from '@heroicons/react/24/outline';

export default function Education() {
  const {t} = useTranslation();

  const {data: session} = useSession();
  const {data, loading} = useQuery(queries.getEducationHistoryByUserId, {
    variables: {token: session?.accessToken},
  });

  const {showModal} = ModalContextProvider();

  const educationData: any =
    data?.getEducationHistoryByUserId?.educationHistoryData &&
    Object.values(data?.getEducationHistoryByUserId?.educationHistoryData).sort(
      (a: any, b: any) => new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf()
    );

  const toggleAddEducation = () => {
    showModal(MODAL_TYPES.EDUCATION);
  };

  return (
    <div className='bg-white shadow sm:rounded-lg py-4 px-4 mt-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-md font-bold text-gray-700'>{t('common:Education')}</h2>
        <Button variant='solid' className='!text-xs !py-1 !px-3' onClick={toggleAddEducation}>
          {t('profile:add_education_history_title')}
        </Button>
      </div>

      {loading && (
        <div className='mt-4 flex items-center justify-center'>
          <svg
            className='custom_loader animate-spin h-10 w-10 text-mainBlue'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        </div>
      )}

      {!loading && educationData && educationData.length === 0 && (
        <div className='mt-4'>
          <button
            onClick={toggleAddEducation}
            type='button'
            className='relative flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            <AcademicCapIcon className='w-12 h-12' />
            <span className='mt-2 block text-sm font-medium text-gray-900'>
              {t('common:add_first_education')}
            </span>
          </button>
        </div>
      )}

      {!loading && educationData?.length > 0 && (
        <div className='mt-2 grid grid-cols-1 gap-1'>
          {educationData.map((education, index) => (
            <EducationCard key={index} education={education} />
          ))}
        </div>
      )}
    </div>
  );
}
