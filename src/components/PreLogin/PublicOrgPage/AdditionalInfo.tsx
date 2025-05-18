import Button from '@root/components/button';
import useTranslation from 'next-translate/useTranslation';

const AdditionalInfo = ({organization, orgMethods, modals, isManagement}) => {
  const {t} = useTranslation();
  return (
    <div className='container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between  '>
      {isManagement ? (
        <div className='flex flex-col gap-2 p-2 md:flex-row w-full overflow-hidden break-words md:justify-end md:items-end'>
          <Button
            variant='solid'
            onClick={() => {
              orgMethods.editOrg(organization);
            }}
          >
            {t('common:btn_edit')}
          </Button>

          <Button
            variant='solid'
            onClick={() => {
              modals.manageServiceCategories(organization);
            }}
          >
            {t('event:service_category')}
          </Button>

          <Button
            onClick={() => {
              modals.inviteMembers(organization);
            }}
            variant='solid'
          >
            {t('event:org_invite_members')}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
export default AdditionalInfo;
