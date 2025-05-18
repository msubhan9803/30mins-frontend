import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';

import queries from 'constants/GraphQL/EducationHistory/queries';
import {MODAL_TYPES} from 'constants/context/modals';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Button from '@root/components/button';
import Loader from 'components/shared/Loader/Loader';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import EducationCard from 'components/shared/Card/Education/Card';
import Error from '@components/error';

import {PlusIcon} from '@heroicons/react/24/outline';

export default function Publications() {
  const {t} = useTranslation();
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Profile'), href: '/user/profile'},
    {title: tpage('Education'), href: '/user/education'},
  ];

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
    <PostLoginLayout>
      <Head>
        <title>{t('common:Education')}</title>
      </Head>
      <Header crumbs={crumbs} heading={t('common:Education')} />

      <div className='mt-6 flex justify-end'>
        <Button variant='solid' className='w-full sm:w-auto' onClick={toggleAddEducation}>
          <PlusIcon className='mr-2 h-5 w-5' aria-hidden='true' />
          {t('profile:add_education_history_title')}
        </Button>
      </div>

      {loading && (
        <div className='mt-4'>
          <Loader />
        </div>
      )}

      {!loading && educationData && educationData.length === 0 && (
        <div className='mt-4 pb-4'>
          <Error
            image={'/icons/errors/no-data.svg'}
            title={t('common:education_no_x_added_main')}
            description={t('common:education_no_x_added_description')}
            linkText={t('common:education_learn_more')}
            linkURL='/blog/help_user_education/'
          />
        </div>
      )}

      {!loading && educationData?.length > 0 && (
        <div className='mt-4 pb-8 grid grid-cols-1 gap-1'>
          {educationData.map((education, index) => (
            <EducationCard key={index} education={education} />
          ))}
        </div>
      )}
    </PostLoginLayout>
  );
}

Publications.auth = true;
