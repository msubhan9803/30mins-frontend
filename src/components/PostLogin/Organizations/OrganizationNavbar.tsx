import Button from '@root/components/button';
import useTranslation from 'next-translate/useTranslation';

const OrganizationNavbar = ({modals, invitedOrgs}) => {
  const {t} = useTranslation();

  return (
    <div className='w-full flex justify-left flex-col md:flex-row gap-2 rounded-md py-3'>
      {invitedOrgs && invitedOrgs?.length > -1 && (
        <a href='/user/pendingOrganizationInvites' className='w-full md:w-max'>
          <Button variant='solid' className='w-full'>
            {t('page:pending_org_invites')}
          </Button>
        </a>
      )}
      <Button
        variant='solid'
        onClick={() => {
          modals.showJoinModal();
        }}
      >
        {t('page:Join Organization')}
      </Button>

      <Button
        onClick={() => {
          modals.showCreateModal();
        }}
        variant='solid'
      >
        {t('page:Create Organization')}
      </Button>
    </div>
  );
};

export default OrganizationNavbar;
