/* eslint-disable import/no-named-as-default-member */
import {useMutation} from '@apollo/client';
import axios from 'axios';
import mutations from 'constants/GraphQL/Integrations/mutations';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {XCircleIcon} from '@heroicons/react/24/outline';
import serviceMutation from 'constants/GraphQL/Service/mutations';
import {LoaderIcon} from 'react-hot-toast';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';

const StepTwo = ({handleClick, prev, integrations, User}) => {
  const router = useRouter();
  const {error} = router.query;
  const {data: session} = useSession();
  const {showModal} = ModalContextProvider();
  const userIntegrations = integrations?.data?.getCredentialsByToken;
  const {googleCredentials, officeCredentials} = userIntegrations;
  const [OfficeCredentials, setOfficeCredentials] = useState<Array<any>>(officeCredentials);
  const [GoogleCredentials, setGoogleCredentials] = useState<Array<any>>(googleCredentials);

  const [noGoogle, setnoGoogle] = useState(true);
  const [noOffice, setHasOffice] = useState(true);
  const [LoadingAPI, setLoadingAPI] = useState(false);

  useEffect(() => {
    if (GoogleCredentials !== null && GoogleCredentials.length > 0) {
      setnoGoogle(false);
    }
    if (OfficeCredentials !== null && OfficeCredentials.length > 0) {
      setHasOffice(false);
    }
  }, [GoogleCredentials, OfficeCredentials]);
  const {t} = useTranslation();

  const handleGoogleIntegration = async () => {
    try {
      const response = await axios.get('/api/integrations/googlecalendar/consentURL', {
        params: {
          REDIRECT_URL: `${router.route}?step=2`,
        },
      });
      router.push(response.data.payload);
      setTimeout(() => {
        setnoGoogle(false);
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOfficeIntegration = async () => {
    try {
      const response = await axios.get('/api/integrations/office365calendar/consentURL');
      router.push(response.data.payload);
      setTimeout(() => {
        setHasOffice(false);
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const [mutation] = useMutation(serviceMutation.createService);

  const SaveInfo = async () => {
    await mutation({
      variables: {
        serviceData: {
          serviceType: 'MEETING',
          title: 'Call',
          duration: 30,
          slug: `${User?.name ? `${User?.name}-` : ''}call`,
          attendeeLimit: 1,
          isRecurring: false,
          recurringInterval: '',
          dueDate: 1,
          isPaid: false,
          currency: '$',
          price: 0,
          isPrivate: false,
          serviceWorkingHours: {
            isCustomEnabled: false,
            sunday: {
              isActive: false,
              availability: [],
            },
            monday: {
              isActive: false,
              availability: [],
            },
            tuesday: {
              isActive: false,
              availability: [],
            },
            wednesday: {
              isActive: false,
              availability: [],
            },
            thursday: {
              isActive: false,
              availability: [],
            },
            friday: {
              isActive: false,
              availability: [],
            },
            saturday: {
              isActive: false,
              availability: [],
            },
          },
          blackList: {
            emails: [],
            domains: [],
          },
          whiteList: {
            emails: [],
            domains: [],
          },
          bookingQuestions: [],
          image: '',
          conferenceType: User?.accountDetails?.allowedConferenceTypes,
          paymentType: 'none',
          description: 'Call me',
        },
        token: session?.accessToken,
      },
    });
  };

  const submitHandler = async () => {
    if (noGoogle && noOffice) {
      showModal(MODAL_TYPES.ATTACHCALENDAR, {
        handleNextBtn: async () => {
          await SaveInfo();
          handleClick();
        },
      });
      return;
    }
    await SaveInfo();
    handleClick();
  };

  const [officeMutation] = useMutation(mutations.deleteOffice365Calendar);
  const [googleMutation] = useMutation(mutations.deleteGoogleCalendar);

  const handleDeleteGoogle = async email => {
    setLoadingAPI(true);
    await googleMutation({
      variables: {
        email: email,
        token: session?.accessToken,
      },
    });
    setnoGoogle(true);
    setGoogleCredentials(GoogleCredentials?.filter(el => el.userEmail !== email));
    setLoadingAPI(false);
    // router.reload();
  };

  const handleDeleteOffice = async email => {
    setLoadingAPI(true);
    await officeMutation({
      variables: {
        email: email,
        token: session?.accessToken,
      },
    });
    setHasOffice(true);
    setOfficeCredentials(OfficeCredentials?.filter(el => el.userEmail !== email));
    setLoadingAPI(false);
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 sm:mt-16 mx-2 md:mx-8'>
      <div className='grid grid-cols-1 sm:grid-cols-1 gap-4 mt-0 mx-4 col-span-3'>
        <div className='pb-3 sm:overflow-hidden'>
          <div className='bg-white p-0 px-4'>
            <div className='mb-10'>
              <h1 className='text-3xl font-extrabold text-gray-900 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-4xl'>
                {t('profile:welcome_attach_calendars')}
              </h1>
              <p className='mt-1 text-sm text-gray-500'>{t('profile:welcome_start_desc')}</p>
              <p className='mt-1 text-sm text-gray-500'>{t('profile:welcome_start_desc_1')}</p>
              <p className='mt-1 font-bold text-sm text-mainBlue'>
                {t('profile:welcome_start_desc_3')}
              </p>
            </div>
            <div className=''>
              <div className='flex w-full flex-col'>
                {GoogleCredentials !== null &&
                  GoogleCredentials.length > 0 &&
                  GoogleCredentials.map((integration, key) => (
                    <div key={key} className='flex flex-row'>
                      <div className='item pr-10'>
                        <div className=''>
                          <div className='w-full'>
                            <p className='font-medium text-black truncate'>
                              {integration.userEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='item'>
                        <button onClick={() => handleDeleteGoogle(integration.userEmail)}>
                          <div className='flex overflow-hidden'>
                            <div className='flex flex-row'>
                              {LoadingAPI ? (
                                <LoaderIcon style={{width: 20, height: 20}} />
                              ) : (
                                <XCircleIcon className='text-red-600 w-5 h-5 mr-1 mt-1' />
                              )}{' '}
                              {t('common:btn_remove')}
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className='box row-start-2 col-start-1 my-3'>
                <button
                  disabled={!noGoogle}
                  role='button'
                  onClick={handleGoogleIntegration}
                  className='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full'
                >
                  <svg
                    width={19}
                    height={20}
                    viewBox='0 0 19 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z'
                      fill='#4285F4'
                    />
                    <path
                      d='M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z'
                      fill='#34A853'
                    />
                    <path
                      d='M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z'
                      fill='#FBBC05'
                    />
                    <path
                      d='M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z'
                      fill='#EB4335'
                    />
                  </svg>
                  <p className='text-base font-medium ml-4 text-gray-700'>
                    {!noGoogle ? t('setting:txt_connected') : t('common:txt_google_calendar_add')}
                  </p>
                </button>
                {!noGoogle && (
                  <button onClick={handleGoogleIntegration}>
                    <span className='text-sm text-mainBlue'>
                      {t('setting:you_can_attach_more_calendars')}
                    </span>
                  </button>
                )}
              </div>
              <div className='flex w-full flex-col'>
                {OfficeCredentials !== null &&
                  OfficeCredentials.length > 0 &&
                  OfficeCredentials.map((integration, key) => (
                    <div key={key} className='flex flex-row'>
                      <div className='item pr-20'>
                        <div className=''>
                          <div className='w-full'>
                            <p className='font-medium text-black truncate'>
                              {integration.userEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='item'>
                        <button onClick={() => handleDeleteOffice(integration.userEmail)}>
                          <div className='flex overflow-hidden'>
                            <div className='flex flex-row'>
                              {LoadingAPI ? (
                                <LoaderIcon style={{width: 20, height: 20}} />
                              ) : (
                                <XCircleIcon className='text-red-600 w-5 h-5 mr-1 mt-1' />
                              )}{' '}
                              {t('common:btn_remove')}
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className='box row-start-2 col-start-2 mt-2'>
                <button
                  disabled={!noOffice}
                  role='button'
                  onClick={handleOfficeIntegration}
                  className='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex justify-start items-center w-full'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    aria-hidden='true'
                    role='img'
                    width={19}
                    height={20}
                    preserveAspectRatio='xMidYMid meet'
                    viewBox='0 0 32 32'
                  >
                    <path
                      fill='#0072c6'
                      d='M19.484 7.937v5.477l1.916 1.205a.489.489 0 0 0 .21 0l8.238-5.554a1.174 1.174 0 0 0-.959-1.128Z'
                    />
                    <path
                      fill='#0072c6'
                      d='m19.484 15.457l1.747 1.2a.522.522 0 0 0 .543 0c-.3.181 8.073-5.378 8.073-5.378v10.066a1.408 1.408 0 0 1-1.49 1.555h-8.874v-7.443Zm-9.044-2.525a1.609 1.609 0 0 0-1.42.838a4.131 4.131 0 0 0-.526 2.218A4.05 4.05 0 0 0 9.02 18.2a1.6 1.6 0 0 0 2.771.022a4.014 4.014 0 0 0 .515-2.2a4.369 4.369 0 0 0-.5-2.281a1.536 1.536 0 0 0-1.366-.809Z'
                    />
                    <path
                      fill='#0072c6'
                      d='M2.153 5.155v21.427L18.453 30V2Zm10.908 14.336a3.231 3.231 0 0 1-2.7 1.361a3.19 3.19 0 0 1-2.64-1.318A5.459 5.459 0 0 1 6.706 16.1a5.868 5.868 0 0 1 1.036-3.616a3.267 3.267 0 0 1 2.744-1.384a3.116 3.116 0 0 1 2.61 1.321a5.639 5.639 0 0 1 1 3.484a5.763 5.763 0 0 1-1.035 3.586Z'
                    />
                  </svg>

                  <p className='text-base flex justify-start font-medium ml-4 text-gray-700 w-full'>
                    {' '}
                    {!noOffice ? t('setting:txt_connected') : t('common:txt_outlook_calendar_add')}
                  </p>
                </button>
                {!noOffice && (
                  <button onClick={handleOfficeIntegration}>
                    <span className='text-sm text-mainBlue'>
                      {t('setting:you_can_attach_more_calendars')}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className='text-base font-medium ml-6 py-1 text-gray-700'>
            {error && <p className='font-xs text-red-600'>{error}</p>}
          </p>
          <div className='flex items-center justify-center mb-4 sm:mb-0 sm:block text-right sm:px-6'>
            <button
              type='button'
              onClick={prev}
              className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 mr-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
            >
              {t('common:btn_previous')}
            </button>

            <button
              onClick={submitHandler}
              type='submit'
              className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
            >
              {t('Continue')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StepTwo;
