import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Header from '@root/components/header';
import orgQuery from 'constants/GraphQL/Organizations/queries';
import {useQuery} from '@apollo/client';
import {useContext, useEffect} from 'react';
import {UserContext} from '@root/context/user';
import {LoaderIcon} from 'react-hot-toast';
import InvitedOrganizationDisplayItem from './InvitedOrganizationDisplayItem';

const PendingOrganizationInvitePage = () => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {pendingInvites, setpendingInvites} = useContext(UserContext);

  const {data: invitedUsers, loading} = useQuery(orgQuery.getPendingInvitesByUserId, {
    variables: {token: session?.accessToken},
  });

  const crumbs = [{title: t('page:Home'), href: '/'}];

  useEffect(() => {
    if (!loading) {
      setpendingInvites(invitedUsers?.getPendingInvitesByUserId?.pendingInvites);
    }
  }, [loading]);

  return (
    <>
      <Header crumbs={crumbs} heading={t('page:Pending Invites')} />
      <div className={'flex flex-col items-center py-4  w-full h-full gap-4'}>
        {loading ? (
          <div className='w-full flex flex-col justify-center items-center'>
            <LoaderIcon style={{width: 50, height: 50}} />
          </div>
        ) : pendingInvites && pendingInvites?.length > 0 ? (
          <div className='bg-white w-full shadow-md rounded-md flex flex-col gap-2'>
            {pendingInvites.map((invites, i) => (
              <InvitedOrganizationDisplayItem
                key={invites}
                onEvent={() => {
                  setpendingInvites(pendingInvites.filter((...item) => item[1] !== i));
                }}
                pendingInvites={invites}
              />
            ))}
          </div>
        ) : (
          <div>
            <p className='text-2xl text-red-600 font-normal text-left'>
              {t('common:no_pending_invites')}
            </p>
            <br />
            <p className='text-sm font-normal'>{t('common:txt_expired_pending_invite')}</p>
          </div>
        )}
      </div>
    </>
  );
};
export default PendingOrganizationInvitePage;
