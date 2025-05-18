import {BanknotesIcon, CreditCardIcon, TagIcon} from '@heroicons/react/24/outline';
import {RadioGroup} from '@headlessui/react';
import Input from '@root/components/forms/input';
import RadioButton from '@root/components/forms/radio';
import Select from '@root/components/forms/select';
import Error, {FieldError} from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import {useContext, useEffect} from 'react';
import {number} from 'yup';
import classNames from 'classnames';
import {UserContext} from '@root/context/user';
// import {useRouter} from 'next/router';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {GenericExtensionError} from '@components/error';
import {useRouter} from 'next/router';
import StepHeader from '../step-header';
import {activation, currencies, methods} from './constants';
import BinaryRadio from '../binary-radio';

type Props = {
  serviceType: any;
  handleChange: any;
  servicePaid: string;
  serviceCurrency: string;
  serviceFee: number;
  servicePayMethod: string;
  setValue: any;
  errors: any;
  userStripeAccount?: any;
  stepName:
    | 'ServiceType'
    | 'ServiceDetails'
    | 'ServicePayment'
    | 'Charity'
    | 'Security'
    | 'Availability'
    | 'Whitelist'
    | 'Blacklist'
    | 'Questions'
    | 'Media'
    | 'Summary';
  isOrg: boolean;
  move: (action: any, update: any) => Promise<void>;
  step: number;
  mode: string | string[] | undefined;
  editOrgServiceLoading?: any;
  editServiceLoading?: any;
  submitEditService: () => void;
  hasPaidMeetingExtension?: boolean | undefined;
};

export default function ServicePayment({
  handleChange,
  servicePaid,
  serviceCurrency,
  servicePayMethod,
  serviceFee,
  userStripeAccount,
  errors,
  setValue,
  move,
  step,
  mode,
  isOrg,
  stepName,
  serviceType,
  editOrgServiceLoading,
  editServiceLoading,
  submitEditService,
  hasPaidMeetingExtension,
}: Props) {
  const {user} = useContext(UserContext);
  const router = useRouter();
  const {showModal} = ModalContextProvider();
  const {t} = useTranslation('common');
  useEffect(() => {
    if (serviceType === 'FREELANCING_WORK') {
      setValue('servicePaid', 'yes');
    }
  }, []);

  return (
    <>
      {serviceType !== 'FREELANCING_WORK' && serviceType !== 'EVENT' && (
        <BinaryRadio
          question={t('service_paid_question')}
          description={t('service_paid_description')}
          icon={<BanknotesIcon className='w-6 h-6' />}
          errors={errors.servicePaid && errors.servicePaid}
          collapsed={servicePaid === 'yes'}
          stepName={stepName}
          value={serviceType !== 'FREELANCING_WORK' ? servicePaid : 'yes'}
          field='servicePaid'
          handleChange={(field, event) => {
            if (event === activation[1].code) {
              setValue('serviceFee', 0);
              setValue('servicePayMethod', 'none');
            }
            setValue(field, event);
          }}
          options={activation}
          editOrgServiceLoading={editOrgServiceLoading}
          editServiceLoading={editServiceLoading}
          submitEditService={submitEditService}
          {...(serviceType !== 'FREELANCING_WORK' && {move, step, mode})}
        />
      )}

      {serviceType === 'EVENT' && (
        <>
          <StepHeader
            question={t('common:event_more_question')}
            description={t('common:event_more_description')}
            stepName={stepName}
            submitEditService={submitEditService}
            icon={<TagIcon className='w-6 h-6' />}
            {...(serviceType !== 'FREELANCING_WORK' && {move, step, mode})}
          />
        </>
      )}

      {servicePaid === 'yes' &&
      (hasPaidMeetingExtension || !(serviceType === 'MEETING') || isOrg) ? (
        <>
          <StepHeader
            question={t('common:service_amount_question')}
            description={t('common:service_amount_description')}
            stepName={stepName}
            submitEditService={submitEditService}
            icon={<TagIcon className='w-6 h-6' />}
            {...(serviceType === 'FREELANCING_WORK' && {
              move,
              step,
              mode,
            })}
          />

          <div className='flex flex-col w-full md:w-2/3 lg:w-1/2 mb-8'>
            <div className='flex'>
              <div className='border flex-shrink-0 border-gray-300 border-r-0 rounded-l-lg justify-start px-4 items-center flex bg-gray-200 bg-opacity-40'>
                {t('common:amount')}
              </div>
              <Input
                type='number'
                handleChange={async ({target: {value}}) => {
                  try {
                    const num = await number().positive().validate(value);
                    if (Number(num) <= 100000) {
                      setValue('serviceFee', parseInt(Number(num).toString(), 10));
                    }
                    // eslint-disable-next-line no-empty
                  } catch (err) {}
                }}
                styles='rounded-none border-gray-300 py-8'
                placeholder=''
                value={serviceFee}
                maxLength={6}
                max={'100000'}
                onKeyDown={e =>
                  ['e', 'E', '+', '-', ',', '.'].includes(e.key) && e.preventDefault()
                }
              />
              <div className='flex w-1/3'>
                <Select
                  onChange={handleChange('serviceCurrency')}
                  selectedOption={currencies.find(o => o.code === serviceCurrency)?.label}
                  options={currencies}
                />
              </div>
            </div>
            {errors.serviceFee && <FieldError message={errors.serviceFee} />}
          </div>

          <StepHeader
            question={t('common:service_payment_method_question')}
            description={t('common:service_payment_description')}
            icon={<CreditCardIcon className='w-6 h-6' />}
          />
          {errors.servicePayMethod && <Error message={errors.servicePayMethod} styles='mb-4' />}
          <div className='flex space-x-6 select-none'>
            <RadioGroup
              value={servicePayMethod}
              onChange={handleChange('servicePayMethod')}
              onDoubleClick={() => {
                move('preview', false);
              }}
              className='flex-grow'
            >
              <div className={classNames(['flex flex-wrap gap-6', isOrg && 'w-full md:w-96 '])}>
                {methods
                  .filter(el => (isOrg ? el.code === 'escrow' : el))
                  .map(c => (
                    <div
                      key={c.code}
                      className={
                        'relative flex-grow flex-shrink-0 flex flex-col min-h-full w-full lg:w-1/4'
                      }
                      onClick={() => {
                        if (c.code === 'escrow' && !user?.escrowAccount) {
                          showModal(MODAL_TYPES.SETUP_PAYMENT_ESCROW, {
                            SetupType: 'ESCROW',
                            userStripeAccount: userStripeAccount,
                          });
                        }
                        if (c.code === 'direct' && !user?.directAccount) {
                          showModal(MODAL_TYPES.SETUP_PAYMENT_DIRECT, {
                            SetupType: 'DIRECT',
                            userStripeAccount: userStripeAccount,
                          });
                        }
                      }}
                    >
                      {c.code === 'escrow' && !user?.escrowAccount ? (
                        <div className={'absolute top-0 left-0 right-0 bottom-0 cursor-pointer'}>
                          <div
                            className={
                              'px-4 py-0.5 text-center w-full bg-red-50 rounded-t-lg text-sm text-red-500 font-medium items-center border-red-200'
                            }
                          >
                            {t('common:connect_escrow_click')}
                          </div>
                        </div>
                      ) : null}
                      {c.code === 'direct' && !user?.directAccount ? (
                        <div className={'absolute top-0 left-0 right-0 bottom-0 cursor-pointer'}>
                          <div
                            className={
                              'px-4 py-0.5 text-center w-full bg-red-50 rounded-t-lg text-sm text-red-500 font-medium items-center border-red-200'
                            }
                          >
                            {t('common:connect_direct_click')}
                          </div>
                        </div>
                      ) : null}
                      <RadioButton
                        key={c.code}
                        value={c.code}
                        styles=''
                        image={`/icons/services/${c.code}.svg`}
                        description={t(`${c.code}_description`)}
                        title={t(`${c.code}`)}
                        variant='card'
                      />
                    </div>
                  ))}
              </div>
            </RadioGroup>
          </div>
        </>
      ) : null}

      {servicePaid === 'yes' && !hasPaidMeetingExtension && serviceType === 'MEETING' && !isOrg ? (
        <GenericExtensionError
          router={router}
          extensionLink={'/user/extensions/paidmeetings/'}
          errorDescription={t('common:missing_paid_meeting_extension_description')}
          errorTitle={t('common:missing_paid_meeting_extension_title')}
          buttonText={t('common:missing_paid_meeting_extension_button')}
        />
      ) : null}
    </>
  );
}
