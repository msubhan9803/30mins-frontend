import {GetServerSideProps} from 'next';
import useTranslation from 'next-translate/useTranslation';
import {CheckCircleIcon, XCircleIcon} from '@heroicons/react/24/outline';
import Layout from '../components/Layout/PreLogin';

const Home = ({message, status, operation, success}) => {
  const {t} = useTranslation('common');
  return (
    <Layout mainStype='h-full'>
      <div className='w-full min-h-full flex flex-col items-center justify-center bg-white'>
        {success && success === '1' ? (
          <CheckCircleIcon className='w-16 h-16 text-green-500' />
        ) : (
          <XCircleIcon className='w-16 h-16 text-red-500' />
        )}
        <h1 className='mt-2 text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl'>
          {' '}
          {operation ? t(operation) : ''}
        </h1>
        <p className='w-full text-center font-normal text-lg'>{status ? t(status) : ''}</p>
        <p className='w-full text-center font-normal text-lg'>{t(message)}</p>
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async context => ({
  props: {
    message: context.query.message || null,
    status: context.query.status || null,
    operation: context.query.operation || null,
    success: context.query.success || null,
  },
});
