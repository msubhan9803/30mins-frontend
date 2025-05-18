import Button from '@components/button';
import useTranslation from 'next-translate/useTranslation';
import UserCreationForm from './UserCreationForm';
import OrganizationCreationForm from './OrganizationCreationForm';
import LinkUserToOrganizationForm from './LinkUserToOrganizationForm';

const FormDisplay = ({setDisplayingForm, formTypes, displayingForm}) => {
  const {t} = useTranslation('common');

  return (
    <div className={'flex flex-col w-full'}>
      <div className={'flex flex-col lg:flex-row w-full gap-4'}>
        <Button
          onClick={() => {
            setDisplayingForm(formTypes.USER_CREATION);
          }}
          variant={'solid'}
        >
          {t('create_user')}
        </Button>
        <Button
          onClick={() => {
            setDisplayingForm(formTypes.ORGANIZATION_CREATION);
          }}
          variant={'solid'}
        >
          {t('create_organization')}
        </Button>
        <Button
          onClick={() => {
            setDisplayingForm(formTypes.LINK_USER_TO_ORGANIZATION);
          }}
          variant={'solid'}
        >
          {t('link_user_to_organization')}
        </Button>
      </div>

      <div className={'pt-8'}>
        {displayingForm === formTypes.USER_CREATION ? (
          <UserCreationForm setDisplayingForm={setDisplayingForm} />
        ) : null}
        {displayingForm === formTypes.ORGANIZATION_CREATION ? (
          <OrganizationCreationForm setDisplayingForm={setDisplayingForm} />
        ) : null}
        {displayingForm === formTypes.LINK_USER_TO_ORGANIZATION ? (
          <LinkUserToOrganizationForm setDisplayingForm={setDisplayingForm} />
        ) : null}
      </div>
    </div>
  );
};

export default FormDisplay;
