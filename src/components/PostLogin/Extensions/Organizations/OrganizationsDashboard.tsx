import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {useQuery} from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import queries from 'constants/GraphQL/Organizations/queries';
import useOrganizations from '../../Organizations/useOrganizations';
import InteractionCards from './InteractionCards';

const OrganizationsDashboard = ({user}) => {
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

  const {data: invitedUsers} = useQuery(queries.getPendingInvitesByUserId, {
    variables: {token: session?.accessToken},
  });

  const invitedOrgs = invitedUsers?.getPendingInvitesByUserId?.pendingInvites;

  const refetch = () => {
    setOrgs(undefined);
    refetchOrg();
  };

  const {orgModals} = useOrganizations({
    userOrgs: Orgs,
    activeExtensions: user?.accountDetails?.activeExtensions,
    invitedOrgs,
    refetch,
  });

  if (session) {
    return (
      <>
        <div className={'flex flex-col items-center w-full h-full gap-4'}>
          <InteractionCards modals={orgModals} />
          {!(Orgs?.length > 0) ? (
            <>
              <span className={'text-2xl font-normal text-red-600 text-left w-full'}>
                {t('page:member_no_org')}
              </span>
              <p className={'text-sm font-normal text-left w-full'}>
                {t('page:why_organizations')}
              </p>
            </>
          ) : null}
        </div>
      </>
    );
  }
  return null;
};
export default OrganizationsDashboard;
