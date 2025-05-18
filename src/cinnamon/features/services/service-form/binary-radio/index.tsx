import {RadioGroup} from '@headlessui/react';
import RadioButton from '@root/components/forms/radio';
import StepHeader from '@features/services/service-form/step-header';
import Error from '@root/components/forms/error';
import {IProps} from './constants';

export default function BinaryRadio({
  icon,
  errors,
  options,
  handleChange,
  collapsed,
  value,
  field,
  question,
  description,
  form = true,
  move,
  step,
  stepName,
  mode,
  editOrgServiceLoading,
  editServiceLoading,
  submitEditService,
}: IProps) {
  return (
    <>
      <StepHeader
        question={question}
        description={description}
        editOrgServiceLoading={editOrgServiceLoading}
        editServiceLoading={editServiceLoading}
        submitEditService={submitEditService}
        stepName={stepName}
        icon={icon}
        move={move}
        step={step}
        mode={mode}
      />
      <div className={`flex flex-col gap-x-6 w-full md:w-2/3 lg:w-1/2 ${collapsed && 'mb-8'}`}>
        {errors && <Error message={errors} styles='mb-4' />}
        <RadioGroup
          value={value}
          onChange={e => {
            handleChange(field, e);
          }}
          onDoubleClick={() => {
            if (stepName === 'ServicePayment') {
              move!('preview', false);
            } else {
              move!('next', false);
            }
          }}
          className='w-full'
        >
          <div className='flex gap-6'>
            {options.map(option => (
              <RadioButton
                key={option.code}
                value={option.code}
                styles='flex-grow w-1/3'
                image={form ? `/icons/services/${option.code}.svg` : ''}
                title={option.code}
                variant='button'
              />
            ))}
          </div>
        </RadioGroup>
      </div>
    </>
  );
}
