//  eslint-disable import/no-named-as-default-member
import {useMutation} from '@apollo/client';
import axios from 'axios';
import {GetServerSideProps} from 'next';
import {getSession, useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useContext, useState} from 'react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import integrationQueries from 'constants/GraphQL/Integrations/queries';
import {
  deleteOffice365Calendar,
  deleteGoogleCalendar,
  toggleCredentialById,
} from 'constants/GraphQL/Integrations/mutations';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {UserContext} from '@root/context/user';
import {XMarkIcon} from '@heroicons/react/20/solid';

const Integrations = ({integrations}) => {
  const router = useRouter();
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {showModal} = ModalContextProvider();
  const [officeMutation] = useMutation(deleteOffice365Calendar);
  const [googleMutation] = useMutation(deleteGoogleCalendar);
  const [changePrimaryEmailMutation] = useMutation(toggleCredentialById);
  const {hasCalendar} = useContext(UserContext);
  const integrationData = integrations?.data?.getCredentialsByToken;
  const {officeCredentials, googleCredentials} = integrationData;
  // comment above the line and use bottom values for local testing
  // const officeCredentials = [
  //   {userEmail: 'scacjkhacjkahnkjchnaksjnck@csdkj.com'},
  //   {userEmail: 'scacjkhacjkahnkjc@csdkj.com'},
  // ];
  // const googleCredentials = [
  //   {userEmail: 'scacjkhacjkahnkjchnaksjnck@csdkj.com'},
  //   {userEmail: 'scacjkhacjkahnkjc@csdkj.com'},
  // ];

  const [officeLoading, setofficeLoading] = useState(false);
  const [googleLoading, setgoogleLoading] = useState(false);

  // const LastGoogle = googleCredentials !== null && googleCredentials.length === 1;
  // const LastOffice = officeCredentials !== null && officeCredentials.length === 1;

  const handleGoogleIntegration = async () => {
    try {
      setgoogleLoading(true);
      const response = await axios.get('/api/integrations/googlecalendar/consentURL', {
        params: {
          REDIRECT_URL: router.route,
        },
      });
      router.push(response.data.payload);
      setgoogleLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOfficeIntegration = async () => {
    try {
      setofficeLoading(true);

      const response = await axios.get('/api/integrations/office365calendar/consentURL');
      router.push(response.data.payload);
      setofficeLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteGoogle = async email => {
    await googleMutation({
      variables: {
        email: email,
        token: session?.accessToken,
      },
    });
    router.reload();
  };

  const handleDeleteOffice = async email => {
    await officeMutation({
      variables: {
        email: email,
        token: session?.accessToken,
      },
    });
    router.reload();
  };

  const handleChangePrimaryEmail = async credentialId => {
    await changePrimaryEmailMutation({
      variables: {
        credentialId: credentialId,
        token: session?.accessToken,
      },
    });
    router.reload();
  };

  const deleteGoogle = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: itemID,
      id: itemID,
      handleDelete: handleDeleteGoogle,
    });
  };

  const deleteOffice = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: itemID,
      id: itemID,
      handleDelete: handleDeleteOffice,
    });
  };

  const changePrimaryEmail = (data, type) => {
    showModal(MODAL_TYPES.CONFIRM, {
      title: `Change ${type} primary email`,
      message: `Are you sure you want make ${data.userEmail} as your primary email?`,
      handleConfirm: () => handleChangePrimaryEmail(data._id),
    });
  };

  const isFirstCalendar = index => index === 0;

  const queryParams = new URLSearchParams(window.location.search);
  const type = queryParams.get('type');
  const term = queryParams.get('error');

  return (
    <>
      <div className='grid overflow-hidden grid-cols-1 md:grid-cols-2 grid-rows-2 gap-6'>
        <div className='box'>
          <div className='bg-white border-[1px] shadow-lg overflow-hidden rounded-lg mb-4'>
            <div className='d-flex mt-10'>
              <div className=' ml-4'>
                <div className='mb-2 mt-1'>
                  <span className='font-24 font-bold'>{t('common:txt_google_calendar')}</span>
                  <br />
                </div>
                {googleCredentials !== null && googleCredentials.length > 0 ? (
                  <div className='mt-2 d-flex'>
                    <span className='custom-color-green font-15 font-bold text-2xl text-mainBlue'>
                      {t('setting:txt_connected')}
                    </span>
                  </div>
                ) : (
                  <div className='mt-2 d-flex'>
                    <span className='text-2xl font-bold text-red-600'>
                      {t('common:txt_not_connected')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <ul className='mt-4 flex flex-col gap-2 h-[6rem]'>
              {googleCredentials !== null &&
                googleCredentials.length > 0 &&
                googleCredentials.map((integration, key) => (
                  <li key={key}>
                    <div className='flex gap-2 px-4 group'>
                      <p className='font-medium text-black truncate'>
                        {integration.userEmail}
                        {integration.isPrimary && (
                          <span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mainBlue text-white'>
                            Primary
                          </span>
                        )}
                      </p>
                      <XMarkIcon
                        width={22}
                        height={22}
                        className='border cursor-pointer  min-w-[22px] min-h-[22px] border-red-500 rounded-full text-red-500 active:bg-red-500 active:text-white'
                        onClick={() => deleteGoogle(integration.userEmail)}
                      />
                      {!integration.isPrimary && (
                        <span
                          className='flex-shrink-0 px-1 border border-mainBlue rounded-xl text-mainBlue text-[10px] leading-tight flex lg:hidden lg:group-hover:flex items-center justify-center cursor-pointer transition-colors hover:bg-mainBlue hover:text-white active:bg-mainBlue active:text-white'
                          onClick={() => changePrimaryEmail(integration, 'Google Calendar')}
                        >
                          {t('common:make_as_primary')}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
            <div className='pb-4 pt-4 px-4 flex items-center gap-4 '>
              <button
                role='button'
                disabled={googleLoading}
                onClick={() => handleGoogleIntegration()}
                className='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-50'
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
                  {' '}
                  {googleLoading
                    ? t('common:txt_loading')
                    : hasCalendar
                    ? t('common:txt_google_calendar_add')
                    : t('common:txt_google_calendar_add')}
                </p>
              </button>
            </div>
            <p className='text-base font-medium ml-6 py-1 text-gray-700'>
              {type === 'google' ? <p className='font-xs text-red-600'>{term}</p> : null}
            </p>
          </div>
        </div>
        <div className='box'>
          <div className='bg-white border-[1px] shadow-lg overflow-hidden rounded-lg mb-4'>
            <div className='d-flex mt-10'>
              <div className=' ml-4'>
                <div className='mb-2 mt-1'>
                  <span className='font-24 font-bold'>{t('common:txt_outlook_calendar')}</span>
                  <br />
                </div>
                {officeCredentials !== null && officeCredentials.length > 0 ? (
                  <div className='mt-2 d-flex'>
                    <span className='custom-color-green font-15 font-bold text-2xl text-mainBlue'>
                      {t('setting:txt_connected')}
                    </span>
                  </div>
                ) : (
                  <div className='mt-2 d-flex'>
                    <span className='text-2xl font-bold text-red-600'>
                      {t('common:txt_not_connected')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <ul className='mt-4 flex flex-col gap-2 w-full h-[6rem]'>
              {officeCredentials !== null &&
                officeCredentials.length > 0 &&
                officeCredentials.map((integration, key) => (
                  <li key={key}>
                    <div className='flex gap-2 px-4'>
                      <p className='font-medium text-black truncate '>
                        {integration.userEmail}
                        {isFirstCalendar(key) && (
                          <span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mainBlue text-white'>
                            Primary
                          </span>
                        )}
                      </p>
                      <XMarkIcon
                        width={22}
                        height={22}
                        className='border cursor-pointer  min-w-[22px] min-h-[22px] border-red-500 rounded-full text-red-500 active:bg-red-500 active:text-white'
                        onClick={() => deleteOffice(integration.userEmail)}
                      />
                    </div>
                  </li>
                ))}
            </ul>
            <div className='pb-4 pt-4 px-4 flex items-center gap-4 '>
              <button
                role='button'
                disabled={officeLoading}
                onClick={() => handleOfficeIntegration()}
                className='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-50'
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
                <p className='text-base font-medium ml-4 text-gray-700'>
                  {officeLoading ? t('common:txt_loading') : t('common:txt_outlook_calendar_add')}
                </p>
              </button>
            </div>
            <p className='text-base font-medium ml-6 py-1 text-gray-700'>
              {type === 'office' ? <p className='font-xs text-red-600'>{term}</p> : null}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Integrations;

Integrations.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  const {data: integrations} = await graphqlRequestHandler(
    integrationQueries.getCredentialsByToken,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  return {
    props: {
      integrations,
    },
  };
};
