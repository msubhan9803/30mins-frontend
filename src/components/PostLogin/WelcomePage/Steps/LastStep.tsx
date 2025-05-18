import useTranslation from 'next-translate/useTranslation';
import Button from 'components/shared/Button/Button';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import mutations from 'constants/GraphQL/User/mutations';
import {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {UserContext} from '@root/context/user';
import {randomUUID} from 'crypto';

const StepFour = ({User, integrations}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  // const router = useRouter();
  const {refetchUser, user} = useContext(UserContext);
  const [publicUrl, setPublicUrl] = useState('');
  const [mutateUpdateWelcome] = useMutation(mutations.updateUserWelcome);
  const userIntegrations = integrations?.data?.getCredentialsByToken;
  const {googleCredentials, officeCredentials} = userIntegrations;
  const hasCalendars = googleCredentials || officeCredentials || true;

  useEffect(() => {
    setPublicUrl(`${window.origin}/${user?.username}`);
    const updateWelcome = async () => {
      if (!User.welcomeComplete) {
        await mutateUpdateWelcome({
          variables: {
            userData: {
              welcomeComplete: true,
            },
            token: session?.accessToken,
          },
        });
        await axios.post('/api/statistics/globalBusiness', {
          fields: {
            totalUsersWelcomeComplete: 1,
          },
        });
        refetchUser();
      }

      // @ts-ignore
      if (!User?.billingDetails && Rewardful?.referral) {
        await axios.post('/api/stripe/createCustomer', {
          email: User?.accountDetails?.email,
          name: user?.name,
          // @ts-ignore
          referral: Rewardful?.referral || randomUUID(),
          // @ts-ignore
          coupon: Rewardful?.coupon?.id || '',
        });
      }
    };
    updateWelcome().catch(() => console.log('Unknown Error Updating User'));
  }, []);

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-6 py-0 text-left sm:px-12 md:px-0'>
        <div className='col-span-1 pt-4 sm:pt-0'>
          <img src='/icons/services/celebration.svg' alt='' className='w-32 mx-auto' />
        </div>
        <div className='col-span-5 justify-start self-center'>
          <h1 className='font-normal text-2xl md:text-3xl px-4 self-center'>
            {t('profile:welcome_final_title')}
          </h1>
        </div>
      </div>
      <div>
        <div className='mt-4 text-sm px-2 py-2 flex flex-row'>
          <div className='text-sm sm:text-xl font-bold mr-5 text-gray-700'>
            {t('profile:Your_Public_URL')}:
          </div>
          <div className='text-sm sm:text-xl text-mainBlue text-mainBlue break-all'>
            <a href={publicUrl} target='_blank' rel='noreferrer'>
              {publicUrl}
            </a>
          </div>
        </div>
      </div>
      <div>
        {hasCalendars && (
          <>
            <div className='mt-4 text-sm px-2 text-gray-700'>
              {t('common:tier_last_step_share_call_1')}
              {t(' ')}
              {t('common:tier_last_step_share_call_2')}
              {t(' ')}
              <a
                href={`/user/meeting-services/all-meeting-services/`}
                className='font-bold'
                target='_blank'
                rel='noreferrer'
              >
                {t('common:tier_last_step_share_call_here')}
              </a>
            </div>
          </>
        )}

        {hasCalendars && (
          <>
            <div className='mt-4 text-sm px-2 text-gray-700 flex flex-row'>
              <div className='text-sm sm:text-xl font-bold mr-5 text-gray-700 self-center'>
                {t('profile:Your_Public_URL')}:
              </div>
              <div className='text-sm sm:text-xl text-mainBlue break-all self-center'>
                <a href={`${publicUrl}/call`} target='_blank' rel='noreferrer'>
                  {publicUrl}/call
                </a>
              </div>
            </div>
          </>
        )}
      </div>
      <div>
        <div className='mt-4 text-sm px-2 text-gray-700'>
          {t('common:GO_TO_DASHBOARD_DESCRIPTION')}
        </div>
      </div>
      <div>
        <div className='mt-2 text-sm px-2 py-2 grid sm:grid-cols-4 gap-4'>
          <div className='col-span-1 border border-gray-100 p-3 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
            <Button
              type='button'
              href={'/user/dashboard/'}
              text={t('common:GO_TO_DASHBOARD')}
              className='inline-flex text-xs w-full sm:text-base uppercase justify-center mt-2 mr-3 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
            />
          </div>
          <div className='col-span-1 border border-gray-100 p-3 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
            <Button
              type='button'
              href={'/user/profile/'}
              text={t('common:GO_TO_PROFILE')}
              className='inline-flex text-xs w-full sm:text-base uppercase justify-center mt-2 mr-3 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
            />
          </div>
          <div className='col-span-1 border border-gray-100 p-3 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
            <Button
              type='button'
              href={'/user/meeting-services/all-meeting-services/'}
              text={t('common:GO_TO_SERVICES')}
              className='inline-flex text-xs sm:text-base uppercase w-full justify-center mt-2 mr-3 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
            />
          </div>
          <div className='col-span-1 border border-gray-100 p-3 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
            <Button
              type='button'
              href={'/user/extensions/'}
              text={t('common:GO_TO_EXTENSIONS')}
              className='inline-flex text-xs w-full sm:text-base uppercase justify-center mt-2 mr-3 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
            />
          </div>
        </div>
        <div>
          <div className='mt-4 text-sm px-2 text-gray-700'>
            {t('common:GO_TO_DASHBOARD_HELP')} &nbsp;
            <a
              href='https://30mins.com/sales'
              target='_blank'
              rel='noreferrer'
              className='text-mainBlue'
            >
              https://30mins.com/sales
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export default StepFour;
