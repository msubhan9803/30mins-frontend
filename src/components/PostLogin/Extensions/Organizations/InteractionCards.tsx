import Button from '@root/components/button';
import useTranslation from 'next-translate/useTranslation';

const InteractionCards = ({modals}) => {
  const {t} = useTranslation();

  return (
    <div className='w-full flex justify-left flex-col md:flex-row gap-2 rounded-md py-3'>
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

export default InteractionCards;
