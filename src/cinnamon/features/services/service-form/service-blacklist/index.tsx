import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import {useContext, useEffect, useState} from 'react';
import {PlusIcon, XCircleIcon} from '@heroicons/react/20/solid';
import Error, {FieldError} from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import {UserContext} from '@root/context/user';
import {useRouter} from 'next/router';
import {BWError} from '@root/components/error';
import StepHeader from '../step-header';
import BinaryRadio from '../binary-radio';
import {activation} from './constants';
import {domainSchema, emailSchema} from '../schema';

type Props = {
  handleChange: any;
  serviceBlacklist: string;
  serviceBlacklistDomains: string[];
  serviceBlacklistEmails: string[];
  serviceWhitelist: string;
  serviceWhitelistDomains: string[];
  serviceWhitelistEmails: string[];
  errors: any;
  move?: (action: any, update: any) => Promise<void>;
  step?: number;
  mode?: string | string[] | undefined;
};
export default function ServiceBlacklist({
  handleChange,
  serviceBlacklist,
  serviceBlacklistDomains,
  serviceBlacklistEmails,
  serviceWhitelist,
  serviceWhitelistDomains,
  serviceWhitelistEmails,
  errors,
  move,
}: Props) {
  //

  const {t} = useTranslation('common');
  const {hasBWExtention} = useContext(UserContext);
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState({
    email: '',
    domain: '',
  });

  const addEmail = async e => {
    try {
      await emailSchema.validate(e);
      if (serviceBlacklistEmails.includes(e)) {
        setLocalError({
          ...localError,
          email: 'email_exists',
        });
      } else if (serviceWhitelist === 'yes' && serviceWhitelistEmails.includes(e)) {
        setLocalError({
          ...localError,
          email: 'email_exists_in_whitelist',
        });
      } else {
        handleChange('serviceBlacklistEmails', [...serviceBlacklistEmails, e]);
        setLocalError({
          ...localError,
          email: '',
        });
        setEmail('');
      }
    } catch (err) {
      setLocalError({
        ...localError,
        email: err.message,
      });
    }
  };

  const addDomain = async e => {
    try {
      await domainSchema.validate(e);
      if (serviceBlacklistDomains.includes(e)) {
        setLocalError({
          ...localError,
          domain: 'domain_exists',
        });
      } else if (serviceWhitelist === 'yes' && serviceWhitelistDomains.includes(e)) {
        setLocalError({
          ...localError,
          domain: 'domain_exists_in_whitelist',
        });
      } else {
        handleChange('serviceBlacklistDomains', [...serviceBlacklistDomains, e]);
        setLocalError({
          ...localError,
          domain: '',
        });
        setDomain('');
      }
    } catch (err) {
      setLocalError({
        ...localError,
        domain: err.message,
      });
    }
  };

  const removeEmail = e => {
    handleChange(
      'serviceBlacklistEmails',
      serviceBlacklistEmails.filter(el => el !== e)
    );
  };
  const removeDomain = e => {
    handleChange(
      'serviceBlacklistDomains',
      serviceBlacklistDomains.filter(el => el !== e)
    );
  };

  useEffect(() => {
    if (!hasBWExtention) {
      handleChange('serviceBlacklist', 'no');
    }
  }, [hasBWExtention]);

  if (!hasBWExtention) {
    return <BWError router={router} />;
  }

  return (
    <>
      <BinaryRadio
        question={t('blacklist_question')}
        description={t('blacklist_description')}
        icon={<ExclamationTriangleIcon className='w-6 h-6' />}
        errors={errors.serviceBlacklist}
        collapsed={serviceBlacklist === 'yes'}
        value={serviceBlacklist}
        field='serviceBlacklist'
        handleChange={handleChange}
        options={activation}
        move={move}
      />
      {serviceBlacklist === 'yes' && (
        <>
          <StepHeader
            question={t('blacklist_setup_question')}
            description={t('blacklist_setup_description')}
            icon={<ExclamationTriangleIcon className='w-6 h-6' />}
          />
          {errors.serviceBlacklistEmails && (
            <Error message={errors.serviceBlacklistEmails} styles='mb-4' />
          )}
          {errors.serviceBlacklistDomains && (
            <Error message={errors.serviceBlacklistDomains} styles='mb-4' />
          )}
          <div className='flex flex-col md:flex-row gap-x-6'>
            <div className='flex flex-col w-full md:w-1/3 flex-grow'>
              <Field label='Domains'>
                <div className='flex flex-col w-full relative'>
                  <Input
                    value={domain}
                    handleChange={e => setDomain(e.currentTarget.value)}
                    onKeyPress={e => (e.charCode === 13 ? addDomain(domain) : null)}
                    placeholder='Ex: domain.com'
                    type='text'
                  />
                  {localError.domain && <FieldError message={localError.domain} />}
                  <button
                    className='border border-mainBlue flex w-6 h-6 items-center justify-center rounded-full absolute top-3.5 right-2 text-mainBlue hover:bg-mainBlue hover:bg-opacity-10'
                    onClick={() => addDomain(domain)}
                  >
                    <PlusIcon className='w-5 h-5' />
                  </button>
                </div>
              </Field>
              <div className='flex-grow w-full flex items-start gap-4 p-4 min-h-[96px] flex-wrap rounded-lg border border-gray-300 mt-4'>
                {serviceBlacklistDomains &&
                  serviceBlacklistDomains.map((d, i) => (
                    <div
                      key={i}
                      className='px-3 py-1 flex border border-gray-300 rounded-full items-center'
                    >
                      {d}
                      <button
                        onClick={() => removeDomain(d)}
                        className='text-gray-500 hover:text-red-500 ml-2'
                      >
                        <XCircleIcon className='w-5 h-5 mt-0.5' />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            <div className='flex flex-col w-full md:w-1/3 mt-6 md:mt-0 flex-grow'>
              <Field label='Emails'>
                <div className='flex flex-col w-full relative'>
                  <Input
                    value={email}
                    handleChange={e => setEmail(e.currentTarget.value)}
                    onKeyPress={e => (e.charCode === 13 ? addEmail(email) : null)}
                    placeholder='Ex: example@email.com'
                    type='text'
                  />
                  {localError.email && <FieldError message={localError.email} />}
                  <button
                    className='border border-mainBlue flex w-6 h-6 items-center justify-center rounded-full absolute top-3.5 right-2 text-mainBlue hover:bg-mainBlue hover:bg-opacity-10'
                    onClick={() => addEmail(email)}
                  >
                    <PlusIcon className='w-5 h-5' />
                  </button>
                </div>
              </Field>
              <div className='flex-grow w-full flex items-start gap-4 p-4  min-h-[96px] flex-wrap rounded-lg border border-gray-300 mt-4'>
                {serviceBlacklistEmails &&
                  serviceBlacklistEmails.map((m, i) => (
                    <div
                      key={i}
                      className='flex px-3 py-1 border items-center border-gray-300 rounded-full'
                    >
                      {m}
                      <button
                        onClick={() => removeEmail(m)}
                        className='text-gray-500 hover:text-red-500 ml-2'
                      >
                        <XCircleIcon className='w-5 h-5 mt-0.5' />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
