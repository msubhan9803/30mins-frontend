import {LoaderIcon} from 'react-hot-toast';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {useQuery} from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import queries from 'constants/GraphQL/Organizations/queries';
import Image from 'next/image';
import Table from './Table';

const RoundRobin = ({user}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const [Orgs, setOrgs] = useState<any>(undefined);
  const {data: organizations, refetch: refetchOrg} = useQuery(
    queries.getOrganizationManagementDetails,
    {
      variables: {
        token: session?.accessToken,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    }
  );

  useEffect(() => {
    const membershipData = organizations?.getOrganizationManagementDetails?.membershipData;
    setOrgs(membershipData);
  }, [organizations]);

  const User = user?.data?.getUserById?.userData;

  const refetch = () => {
    setOrgs(undefined);
    refetchOrg();
  };

  if (session) {
    return (
      <>
        <div className={'flex flex-col w-full h-full gap-4'}>
          <div className='grid grid-cols-1 sm:grid-cols-4'>
            <div className='col-span-1 items-center m-auto'>
              <Image src={`/icons/services/round-robin.svg`} height={256} width={256} alt='' />
            </div>
            <div className='col-span-3'>
              <span className='text-base'>{t('common:RoundRobin_help_1')}</span>
              <ul className='list-disc list-inside py-6'>
                <li className='text-base pl-6'>{t('common:RoundRobin_help_2_1')}</li>
                <li className='text-base pl-6'>{t('common:RoundRobin_help_2_2')}</li>
                <li className='text-base pl-6'>{t('common:RoundRobin_help_2_3')}</li>
                <li className='text-base pl-6'>{t('common:RoundRobin_help_2_4')}</li>
              </ul>
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-4'>
            <div className='col-span-4'>
              <span className='text-base'>{t('common:RoundRobin_help_3')}</span>
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-4 mt-6'>
            <div className='col-span-4'>
              <span className='text-base'>{t('common:RoundRobin_help_4')}</span>
            </div>
          </div>
          {Orgs === undefined ? (
            <div className='w-full h-16 flex flex-1 justify-center items-center'>
              <LoaderIcon style={{width: 50, height: 50}} />
            </div>
          ) : Orgs?.length > 0 ? (
            <Table orgs={Orgs} userId={User._id} refetch={refetch} />
          ) : (
            <>
              <span className={'text-2xl font-normal text-red-600 text-left w-full'}>
                {t('page:member_no_org')}
              </span>
            </>
          )}
        </div>
      </>
    );
  }
  return null;
};
export default RoundRobin;
