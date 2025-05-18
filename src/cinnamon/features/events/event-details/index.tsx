import useTranslation from 'next-translate/useTranslation';

import {TranslationTexts} from '@root/features/services/service-form/service-details/constants';
import StepHeader from '@features/services/service-form/step-header';
import GetDetailsForm from '@root/features/services/service-form/service-details/getdetails';

import {ClipboardDocumentListIcon} from '@heroicons/react/24/outline';

export default function ServiceDetails({...rest}: any) {
  const {t} = useTranslation();

  return (
    <>
      <StepHeader
        question={t(`common:${TranslationTexts[rest.serviceType]?.step_one_title}`)}
        description={t(`common:${TranslationTexts[rest.serviceType]?.step_one_desc}`)}
        icon={<ClipboardDocumentListIcon className='w-6 h-6' />}
        noBack={rest.noBack}
        serviceType={rest.serviceType}
        move={rest.move}
        step={rest.step}
        mode={rest.mode}
      />

      {GetDetailsForm({...rest})}
    </>
  );
}
