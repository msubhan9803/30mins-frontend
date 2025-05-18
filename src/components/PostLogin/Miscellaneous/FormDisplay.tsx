import Button from '@components/button';
import useTranslation from 'next-translate/useTranslation';
import AddAffiliateForm from './AddAffiliateForm';
import MakeUserVerifiedForm from './MakeUserVerifiedForm';
import LinkUserToOrganizationForm from './LinkUserToOrganizationForm';
import ResetWelcomeForm from './ResetWelcomeForm';

const FormDisplay = ({setDisplayingForm, formTypes, displayingForm}) => {
  const {t} = useTranslation('common');

  return (
    <div className={'flex flex-col w-full'}>
      <div className={'grid grid-cols-12 w-full justify-start gap-2 px-4'}>
        <Button
          onClick={() => {
            setDisplayingForm(formTypes.RESET_WELCOME);
          }}
          className='col-span-6 md:col-span-3'
          variant={'solid'}
        >
          {t('reset_welcome')}
        </Button>
        <Button
          onClick={() => {
            setDisplayingForm(formTypes.LINK_USER_TO_ORGANIZATION);
          }}
          className='col-span-6 md:col-span-3'
          variant={'solid'}
        >
          {t('link_user_to_organization')}
        </Button>
        <Button
          className='col-span-6 md:col-span-3'
          onClick={() => {
            setDisplayingForm(formTypes.ADD_AFFILIATE);
          }}
          variant={'solid'}
        >
          {t('make_user_affiliate')}
        </Button>
        <Button
          className='col-span-6 md:col-span-3'
          onClick={() => {
            setDisplayingForm(formTypes.MAKE_USER_VERIFIED);
          }}
          variant={'solid'}
        >
          {t('make_user_verified')}
        </Button>
      </div>

      <div className={'pt-8'}>
        {displayingForm === formTypes.RESET_WELCOME && (
          <ResetWelcomeForm setDisplayingForm={setDisplayingForm} />
        )}
        {displayingForm === formTypes.ADD_AFFILIATE && (
          <AddAffiliateForm setDisplayingForm={setDisplayingForm} />
        )}
        {displayingForm === formTypes.LINK_USER_TO_ORGANIZATION && (
          <LinkUserToOrganizationForm setDisplayingForm={setDisplayingForm} />
        )}
        {displayingForm === formTypes.MAKE_USER_VERIFIED && (
          <MakeUserVerifiedForm setDisplayingForm={setDisplayingForm} />
        )}
      </div>
    </div>
  );
};

export default FormDisplay;
