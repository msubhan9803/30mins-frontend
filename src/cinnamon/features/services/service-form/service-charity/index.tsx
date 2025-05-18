import {GiftIcon, GlobeAmericasIcon, ReceiptPercentIcon} from '@heroicons/react/24/outline';
import {RadioGroup} from '@headlessui/react';
import RadioButton from '@root/components/forms/radio';
import ComboBox from '@root/components/forms/combobox';
import Error from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import StepHeader from '../step-header';
import BinaryRadio from '../binary-radio';
import {activation} from './constants';

type Props = {
  handleChange: any;
  serviceCharity: string;
  servicePercentage: number;
  serviceDonate: string;
  errors: any;
  move: (action: any, update: any) => Promise<void>;
  step: number;
  mode: string | string[] | undefined;
};

export default function ServiceCharity({
  handleChange,
  serviceDonate,
  serviceCharity,
  servicePercentage,
  errors,
  move,
}: Props) {
  //

  const {t} = useTranslation('common');

  return (
    <>
      <BinaryRadio
        question={t('service_donate_question')}
        description={t('service_donate_description')}
        icon={<GiftIcon className='w-6 h-6' />}
        errors={errors.serviceDonate}
        collapsed={serviceDonate === 'yes'}
        value={serviceDonate}
        field='serviceDonate'
        handleChange={handleChange}
        options={activation}
        move={move}
      />

      {serviceDonate === 'yes' && (
        <>
          <StepHeader
            question={t('service_charity_question')}
            description={t('service_charity_description')}
            icon={<GlobeAmericasIcon className='w-6 h-6' />}
          />
          <div className='flex flex-col mb-8 w-full lg:w-1/2'>
            <span className='p-1 text-sm text-gray-500'>
              {t('service_charity_list_1')}{' '}
              <a href='https://30mins.com/charity/' target='_blank' className='underline'>
                https://30mins.com/charity/
              </a>{' '}
              {t('service_charity_list_2')}
            </span>
            {errors.serviceCharity && <Error message={errors.serviceCharity} styles='mb-4' />}
            <ComboBox handleChange={handleChange} serviceCharity={serviceCharity} />
          </div>

          <StepHeader
            question={t('service_percentage_question')}
            description={t('service_percentage_description')}
            icon={<ReceiptPercentIcon className='w-6 h-6' />}
          />
          {errors.servicePercentage && <Error message={errors.servicePercentage} styles='mb-4' />}
          <div className='w-full space-x-6'>
            <RadioGroup
              value={servicePercentage}
              onChange={e => handleChange('servicePercentage', e)}
            >
              <div className='flex flex-wrap gap-6'>
                {[25, 50, 75, 100].map(c => (
                  <RadioButton
                    key={c}
                    value={c}
                    styles='w-1/3 md:w-1/5'
                    variant='button'
                    title={`${c}%`}
                  />
                ))}
              </div>
            </RadioGroup>
          </div>
        </>
      )}
    </>
  );
}
