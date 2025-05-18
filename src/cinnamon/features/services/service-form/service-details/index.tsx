import {ClipboardDocumentListIcon} from '@heroicons/react/24/outline';
import StepHeader from '@features/services/service-form/step-header';
import {
  Props,
  TranslationTexts,
} from '@root/features/services/service-form/service-details/constants';
import useTranslation from 'next-translate/useTranslation';
import FieldTags from '@root/components/field-tags';
import CheckBox from '@root/components/forms/checkbox';
import GetDetailsForm from './getdetails';

export default function ServiceDetails({...rest}: Props) {
  const {t} = useTranslation();

  return (
    <>
      <StepHeader
        question={t(`common:${TranslationTexts[rest.serviceType]?.step_one_title}`)}
        description={t(`common:${TranslationTexts[rest.serviceType]?.step_one_desc}`)}
        icon={<ClipboardDocumentListIcon className='w-6 h-6' />}
        editOrgServiceLoading={rest.editOrgServiceLoading}
        editServiceLoading={rest.editServiceLoading}
        createServiceLoading={rest.createServiceLoading}
        submitEditService={rest.submitEditService}
        noBack={rest.noBack}
        serviceType={rest.serviceType}
        move={rest.move}
        step={rest.step}
        mode={rest.mode}
      />

      {GetDetailsForm({...rest})}

      <div className='col-span-4 grid grid-cols-1 space-y-2 md:grid-cols-2 items-start mt-4 w-full'>
        <CheckBox
          code='isPrivate'
          label='Show this Service on the Public Search Page'
          style='items-center h-auto mt-[10px]'
          handleChange={e => rest.setValue('isPrivate', !e.target.checked)}
          selected={!rest.isPrivate}
        />

        <FieldTags value={rest.searchTags} onChange={e => rest.setValue('searchTags', e)} />
      </div>
    </>
  );
}
