import {ShieldCheckIcon} from '@heroicons/react/24/outline';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import {useContext, useEffect, useState} from 'react';
import {PlusIcon} from '@heroicons/react/20/solid';
import Error, {FieldError} from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import {UserContext} from '@root/context/user';
import {BWError} from '@root/components/error';
import WBItems from '@root/components/w-b-Items';
import {useRouter} from 'next/router';
import {domainSchema, emailSchema} from '../schema';
import StepHeader from '../step-header';

type Props = {
  handleChange: any;
  serviceWhitelist: string;
  serviceWhitelistDomains: string[];
  serviceWhitelistEmails: string[];
  serviceBlacklist: string;
  serviceBlacklistDomains: string[];
  serviceBlacklistEmails: string[];
  errors?: any;
  move?: (action: any, update: any) => Promise<void>;
};
export default function PreApprovedList({
  handleChange,
  serviceWhitelistDomains,
  serviceWhitelistEmails,
  serviceBlacklist,
  serviceBlacklistDomains,
  serviceBlacklistEmails,
  errors,
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
      if (serviceWhitelistEmails.includes(e)) {
        setLocalError({
          ...localError,
          email: 'email_exists',
        });
      } else if (serviceBlacklist === 'yes' && serviceBlacklistEmails.includes(e)) {
        setLocalError({
          ...localError,
          email: 'email_exists_in_blacklist',
        });
      } else {
        handleChange('serviceWhitelistEmails', [...serviceWhitelistEmails, e]);
        setLocalError({
          ...localError,
          email: '',
        });
        setEmail('');
      }
    } catch (err) {
      setLocalError({
        ...localError,
        email: t(err.message),
      });
    }
  };

  const addDomain = async e => {
    try {
      await domainSchema.validate(e);
      if (serviceWhitelistDomains.includes(e)) {
        setLocalError({
          ...localError,
          domain: 'domain_exists',
        });
      } else if (serviceBlacklist === 'yes' && serviceBlacklistDomains.includes(e)) {
        setLocalError({
          ...localError,
          domain: 'domain_exists_in_blacklist',
        });
      } else {
        handleChange('serviceWhitelistDomains', [...serviceWhitelistDomains, e]);
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
      'serviceWhitelistEmails',
      serviceWhitelistEmails.filter(el => el !== e)
    );
  };
  const removeDomain = e => {
    handleChange(
      'serviceWhitelistDomains',
      serviceWhitelistDomains.filter(el => el !== e)
    );
  };

  useEffect(() => {
    if (!hasBWExtention) {
      handleChange('serviceWhitelist', 'no');
    }
  }, [hasBWExtention]);

  if (!hasBWExtention) {
    return <BWError router={router} />;
  }

  return (
    <>
      <StepHeader
        question={t('whitelist_setup_question')}
        description={t('whitelist_setup_description')}
        icon={<ShieldCheckIcon className='w-6 h-6' />}
      />
      {errors?.serviceWhitelistEmails && (
        <Error message={errors.serviceWhitelistEmails} styles='mb-4' />
      )}
      {errors?.serviceWhitelistDomains && (
        <Error message={errors.serviceWhitelistDomains} styles='mb-4' />
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
                styles='pr-10'
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
          <div className='flex-grow w-full flex items-start gap-4 p-4 min-h-[96px] flex-wrap rounded-lg border content-start border-gray-300 mt-4'>
            {serviceWhitelistDomains &&
              serviceWhitelistDomains.map(d => (
                <WBItems key={d} onClick={() => removeDomain(d)} value={d} />
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
                styles='pr-10'
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
          <div className='flex-grow w-full flex items-start gap-4 p-4 flex-wrap min-h-[96px] rounded-lg border border-gray-300 content-start mt-4'>
            {serviceWhitelistEmails &&
              serviceWhitelistEmails.map(m => (
                <WBItems key={m} onClick={() => removeEmail(m)} value={m} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
