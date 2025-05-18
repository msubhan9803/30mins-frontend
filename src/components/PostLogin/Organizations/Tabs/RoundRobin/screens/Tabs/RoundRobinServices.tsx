import {useSession} from 'next-auth/react';
import {useEffect} from 'react';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import RoundRobinQuery from 'constants/GraphQL/RoundRobin/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import Button from '@root/components/button';
import ServiceCard from '../components/ServiceCard';

const RoundRobinServices = ({values, setFieldValue, organization}) => {
  const {data: session} = useSession();
  const {t} = useTranslation();

  const getServiceData = async () => {
    const {data} = await graphqlRequestHandler(
      RoundRobinQuery.GetOrgRoundRobinServices,
      {organizationId: organization._id},
      session?.accessToken
    );
    setFieldValue('ServicesData', data?.data?.getOrgRoundRobinServices?.roundRobinServices);
  };

  useEffect(() => {
    getServiceData();
  }, []);

  useEffect(() => {}, [values?.ServicesData]);

  const SwitchTab = () => console.log('switching tabs...');

  return (
    <div className='flex flex-col w-full h-full md:flex-row duration divide-y md:divide-y-0 md:divide-x '>
      <div className='w-full h-max md:ml-2'>
        <div className='flex p-2 justify-end items-center'>
          <Button variant='solid' className='w-full sm:w-max'>
            {t('common:Create_New_Service')}
          </Button>
        </div>
        <div
          className={classNames([
            values?.ServicesData
              ? 'flex flex-wrap h-[650px] w-full content-start items-start gap-2 p-2 overflow-x-hidden overflow-y-auto'
              : 'flex w-full h-full justify-center items-center',
          ])}
        >
          {values?.ServicesData === undefined ? (
            <div className='flex m-auto'>
              <svg
                className='custom_loader m-auto animate-spin -ml-1 mr-3 h-10 w-10 text-mainBlue'
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
          ) : (
            values?.ServicesData?.map((service, index) => (
              <ServiceCard
                key={index}
                SwitchTab={SwitchTab}
                getServiceData={getServiceData}
                setFieldValue={setFieldValue}
                organization={organization}
                service={service}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoundRobinServices;
