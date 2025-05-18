import useTranslation from 'next-translate/useTranslation';
import OrganizationCart from './OrganizationCard';

export default function ViewOrganizations({orgs, userId, refetch}) {
  const {t} = useTranslation('common');
  return (
    <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      {orgs.length > 0 ? (
        orgs?.map((el, idx) => (
          <OrganizationCart {...{refetch, OriginUserId: userId, ...el}} key={idx} />
        ))
      ) : (
        <div className='col-span-2 w-full mt-12 flex justify-center items-center'>
          <span className='font-medium text-black text-lg'>{t('No_results_found')}</span>
        </div>
      )}
    </ul>
  );
}
