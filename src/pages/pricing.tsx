import Layout from 'components/Layout/PreLogin';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import CenteredContainer from 'components/shared/Container/CenteredContainer';
import headerImage from '../../public/assets/pricing_header.svg';

const Pricing = () => {
  const {t} = useTranslation();

  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/pricing/'}
        description={t('page:pricing_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${t('page:Pricing')} | 30mins`}
      />
      <div className='px-2 sm:px-8 py-12 flex flex-col gap-4 sm:gap-8'>
        <CenteredContainer className='containerCenter gap-4 sm:gap-8'>
          <div className='col-span-8 m-auto'>
            <Image
              src={headerImage}
              alt='People shaking hands after transaction'
              width={800}
              height={300}
            />
          </div>
          <div className='mx-auto bg-white grid items-start'>
            <div className='mx-0 sm:mx-0 bg-white grid grid-cols-1 mt-4 mb-4 gap-4 py-4 px-4 sm:px-20 pt-0 pb-4'>
              <div className='bg-white dark:bg-gray-900'>
                <div className='container px-2 py-8 mx-auto'>
                  <h1 className='headerLg font-bold text-center text-gray-800'>
                    {t('page:pricing_header')}
                  </h1>

                  <p className='max-w-2xl mx-auto mt-0 mb-4 sm:mt-4 text-center text-gray-500 xl:mt-6 dark:text-gray-300'>
                    Transparent pricing. Affordable for everyone.
                  </p>
                  <p className='font-bold'>{t('page:pricing_page_01')}</p>
                  <p className='pt-4'>
                    {t('page:pricing_page_02')} &nbsp; {t('page:pricing_page_03')}
                  </p>

                  <div className='grid grid-cols-1 gap-8 mt-6 xl:mt-12 xl:gap-12 md:grid-cols-2'>
                    <div className='w-full p-2 sm:p-8 space-y-8 text-center border border-gray-200 rounded-lg dark:border-gray-700'>
                      <div className='h-[6rem] sm:h-[12rem]'>
                        <p className='font-medium text-gray-500 uppercase dark:text-gray-300'>
                          Free
                        </p>

                        <h2 className='text-5xl font-bold text-gray-800 uppercase dark:text-gray-100'>
                          $0
                        </h2>

                        <p className='font-medium text-gray-500 dark:text-gray-300'>Life time</p>
                      </div>
                      <hr className='border-gray-200 dark:border-gray-700' />

                      <div className='p-0'>
                        <h1 className='text-lg font-bold text-gray-700 capitalize lg:text-xl dark:text-white'>
                          What’s included:
                        </h1>
                        <div className='mt-8 space-y-4'>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-gray-700'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>Profile</span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-gray-700'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Free Meeting Services
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-gray-700'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Recurring Meetings
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-gray-700'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Freelance Services
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-gray-700'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Sell Digital Products
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-gray-700'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Direct Payments
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-gray-700'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              30mins Escrow Payments
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-gray-700'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Outside 30mins Payments
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-gray-700'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Donate to Charity
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-red-500'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Paid Meeting Services
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-red-500'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Organization Page
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-red-500'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Round Robin Meetings
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-red-500'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Organization Services
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-red-500'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              SMS Reminders
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-red-500'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Advertisement Campaign
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-red-500'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Collective Availability
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-red-500'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              Personalized Chatbot
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-red-500'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-gray-700 dark:text-gray-300'>
                              More Extensions
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='w-full px-2 py-8 sm:p-8 space-y-2 sm:space-y-8 text-center bg-blue-600 rounded-lg'>
                      <div className='h-[8rem] sm:h-[10rem] sm:h-[12rem]'>
                        <p className='font-medium text-gray-200 uppercase'>Premium</p>

                        <h2 className='text-4xl sm:text-5xl font-bold text-white uppercase dark:text-gray-100'>
                          Select your Extensions
                        </h2>
                      </div>
                      <hr className='border-white dark:border-gray-700' />
                      <div className='p-0'>
                        <h1 className='text-lg font-bold text-white capitalize lg:text-xl dark:text-white'>
                          What’s included:
                        </h1>
                        <div className='mt-8 space-y-4'>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>Profile</span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Free Meeting Services
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Recurring Meetings
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Freelance Services
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Sell Digital Products
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Direct Payments
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              30mins Escrow Payments
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Outside 30mins Payments
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Donate to Charity
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Paid Meeting Services
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Organization Page
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Round Robin Meetings
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Organization Services
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              SMS Reminders
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Advertisement Campaign
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Collective Availability
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              Personalized Chatbot
                            </span>
                          </div>

                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5 text-white'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='mx-4 text-white dark:text-gray-300'>
                              More Extensions
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CenteredContainer>
      </div>
    </Layout>
  );
};

export default Pricing;
