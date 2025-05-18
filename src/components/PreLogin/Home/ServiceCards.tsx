import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

const ServiceCards = () => {
  const {t} = useTranslation('page');
  return (
    <div className='py-0'>
      <div className='flex flex-wrap bg-gray-50'>
        <div className='mx-auto w-full grid grid-cols-1 md:grid-cols-2 mt-4 mb-0 sm:mb-0 gap-4 px-6 sm:px-20 pt-6 pb-6'>
          <div className='mx-auto grid col-span-2 gap-4 mt-0 pb-0'>
            <div className='mx-auto grid grid-cols-1 mt-4 px-0 h-full'>
              <h2 className='text-base font-semibold tracking-wider text-mainBlue uppercase'>
                {t('page:Join_as_expert2')}
              </h2>
              <h1
                className='mb-4 text-4xl font-extrabold text-mainText animate__animated animate__fadeIn'
                data-wow-delay='.1s'
              >
                {t('page:We_make_scheduling_and_earning_easy')}
              </h1>
              <p
                className='mb-8 leading-loose text-blueGray-400 wow animate__animated animate__fadeIn'
                data-wow-delay='.3s'
              >
                {t('page:make_money_in_gigeconomy')}
              </p>
            </div>
          </div>
          <div className='mx-auto hidden md:grid grid-cols-1 sm:grid-cols-1 gap-4 mt-0 pb-0'>
            <div className='grid grid-cols-1 mt-4 mx-auto px-0 h-full'>
              <Image
                src='/assets/hero_earnings.svg'
                alt='hero'
                height={300}
                width={400}
                layout='intrinsic'
                objectFit='contain'
              />
            </div>
          </div>
          <div className='mx-auto grid grid-cols-1 gap-4 mt-0 pb-0'>
            <ul className='space-y-12'>
              <li className='flex -mx-4 wow animate__animated animate__fadeIn' data-wow-delay='.3s'>
                <div className='px-4'>
                  <span className='flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-mainBlue text-white'>
                    1
                  </span>
                </div>
                <div className='px-4'>
                  <h3 className='text-2xl font-extrabold text-mainText'>
                    {t('page:Automate_reminders_and_followup')}
                  </h3>
                  <p className='text-blueGray-400'>{t('page:Your_entire_meeting_workflow')}</p>
                </div>
              </li>
              <li className='flex -mx-4 wow animate__animated animate__fadeIn' data-wow-delay='.5s'>
                <div className='px-4'>
                  <span className='flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-mainBlue text-white'>
                    2
                  </span>
                </div>
                <div className='px-4'>
                  <h3 className='text-2xl font-extrabold text-mainText'>
                    {t('page:Get_paid_on_time')}
                  </h3>
                  <p className='text-blueGray-400'>{t('page:Payment_is_transferred_to_you')}</p>
                </div>
              </li>
              <li className='flex -mx-4 wow animate__animated animate__fadeIn' data-wow-delay='.7s'>
                <div className='px-4'>
                  <span className='flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-mainBlue text-white'>
                    3
                  </span>
                </div>
                <div className='px-4'>
                  <h3 className='text-2xl font-extrabold text-mainText'>
                    {t('page:Market_Development')}
                  </h3>
                  <p className='text-blueGray-400'>{t('page:Market_Development_Description')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='mx-auto bg-white grid items-start'>
        <div className='mx-0 sm:mx-20 bg-white grid grid-cols-1 mt-4 mb-4 gap-4 py-4 px-4 sm:px-20 pt-0 pb-4'>
          <div className='bg-white dark:bg-gray-900'>
            <div className='container px-2 py-8 mx-auto'>
              <h1 className='text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl'>
                Pricing Plan
              </h1>

              <p className='max-w-2xl mx-auto mt-4 text-center text-gray-500 xl:mt-6 dark:text-gray-300'>
                Transparent pricing. Affordable for everyone.
              </p>

              <div className='grid grid-cols-1 gap-8 mt-6 xl:mt-12 xl:gap-12 md:grid-cols-2'>
                <div className='w-full p-8 space-y-8 text-center border border-gray-200 rounded-lg dark:border-gray-700'>
                  <div className='h-[6rem] sm:h-[12rem]'>
                    <p className='font-medium text-gray-500 uppercase dark:text-gray-300'>Free</p>

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
                        <span className='mx-4 text-gray-700 dark:text-gray-300'>SMS Reminders</span>
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

                <div className='w-full p-8 space-y-8 text-center bg-blue-600 rounded-lg'>
                  <div className='h-[10rem] sm:h-[12rem]'>
                    <p className='font-medium text-gray-200 uppercase'>Premium</p>

                    <h2 className='text-5xl font-bold text-white uppercase dark:text-gray-100'>
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
                        <span className='mx-4 text-white dark:text-gray-300'>Direct Payments</span>
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
                        <span className='mx-4 text-white dark:text-gray-300'>SMS Reminders</span>
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
                        <span className='mx-4 text-white dark:text-gray-300'>More Extensions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ServiceCards;
