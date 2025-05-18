import {LoaderIcon} from 'react-hot-toast';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {useQuery} from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import Input from '@root/components/forms/input';
import queries from 'constants/GraphQL/Organizations/queries';
import OrganizationNavbar from './OrganizationNavbar';
import useOrganizations from './useOrganizations';
import ViewOrganizations from './features/ViewOrganizations';

const Organizations = ({user}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const [Orgs, setOrgs] = useState<any>(undefined);
  const [searchText, setsearchText] = useState('');
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

  const {data: invitedUsers} = useQuery(queries.getPendingInvitesByUserId, {
    variables: {token: session?.accessToken},
  });

  const invitedOrgs = invitedUsers?.getPendingInvitesByUserId?.pendingInvites;
  const User = user?.data?.getUserById?.userData;

  const refetch = () => {
    setOrgs(undefined);
    refetchOrg();
  };

  const {orgModals} = useOrganizations({
    userOrgs: Orgs,
    activeExtensions: User?.accountDetails?.activeExtensions,
    invitedOrgs,
    refetch,
  });

  if (session) {
    return (
      <>
        <div className={'flex flex-col items-center w-full h-full gap-4'}>
          <OrganizationNavbar modals={orgModals} invitedOrgs={invitedOrgs} />
          {Orgs === undefined ? (
            <div className='w-full h-16 flex flex-1 justify-center items-center'>
              <LoaderIcon style={{width: 50, height: 50}} />
            </div>
          ) : Orgs?.length > 0 ? (
            <div className='p-4 pb-8 w-full'>
              {Orgs?.length > 6 && (
                <div className='flex flex-col w-full items-end py-2'>
                  <Input
                    type='text'
                    value={searchText}
                    placeholder={t('page:search_filter')}
                    className='w-full sm:w-1/3'
                    handleChange={({target: {value}}) => setsearchText(value)}
                  />
                </div>
              )}
              <ViewOrganizations
                orgs={Orgs.filter(el =>
                  el.organizationId?.title.toUpperCase().includes(searchText.toUpperCase())
                )}
                userId={User._id}
                refetch={refetch}
              />
            </div>
          ) : (
            <>
              <span className={'text-2xl font-normal text-red-600 text-left w-full'}>
                {t('page:member_no_org')}
              </span>
              <p className={'text-sm font-normal text-left w-full'}>
                {t('page:why_organizations')}
              </p>
            </>
          )}
        </div>
      </>
    );
  }
  return null;
};
export default Organizations;
