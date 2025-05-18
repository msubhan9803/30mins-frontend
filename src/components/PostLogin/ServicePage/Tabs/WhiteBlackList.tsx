import {useContext, useState} from 'react';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import {PlusIcon} from '@heroicons/react/20/solid';
import {FieldError} from '@root/components/forms/error';
import {UserContext} from '@root/context/user';
import {BWError} from '@root/components/error';
import {domainSchema, emailSchema} from '@root/features/services/service-form/schema';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import WBItems from '@root/components/w-b-Items';
import StepHeader from '@root/features/services/service-form/step-header';
import {ShieldCheckIcon} from '@heroicons/react/24/outline';

type IProps<T> = {
  setFieldValue: any;
  values: any;
  type: T;
};

const WhiteBlacklist = ({setFieldValue, values, type}: IProps<'white' | 'black'>) => {
  const {hasBWExtention} = useContext(UserContext);
  const {t} = useTranslation();
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
      if (
        type === 'black'
          ? values?.blackList?.emails.includes(e)
          : values?.whiteList?.emails.includes(e)
      ) {
        setLocalError({
          ...localError,
          email: 'email_exists',
        });
      } else if (
        type === 'black'
          ? values?.whiteList?.emails.includes(e)
          : values?.blackList?.emails.includes(e)
      ) {
        setLocalError({
          ...localError,
          email: 'email_exists_in_blacklist',
        });
      } else {
        setFieldValue(
          type === 'black' ? 'blackList.emails' : 'whiteList.emails',
          type === 'black' ? [...values.blackList.emails, e] : [...values.whiteList.emails, e]
        );
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
      if (
        type === 'black'
          ? values?.blackList?.domains.includes(e)
          : values?.whiteList?.domains.includes(e)
      ) {
        setLocalError({
          ...localError,
          domain: 'domain_exists',
        });
      } else if (
        type === 'black'
          ? values?.whiteList?.domains.includes(e)
          : values?.blackList?.domains.includes(e)
      ) {
        setLocalError({
          ...localError,
          domain: 'domain_exists_in_whitelist',
        });
      } else {
        setFieldValue(
          type === 'black' ? 'blackList.domains' : 'whiteList.domains',
          type === 'black' ? [...values.blackList.domains, e] : [...values.whiteList.domains, e]
        );
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

  const removeDomain = e => {
    setFieldValue(
      type === 'black' ? 'blackList.domains' : 'whiteList.domains',
      (type === 'black' ? values?.blackList?.domains : values?.whiteList?.domains).filter(
        el => el !== e
      )!
    );
  };
  const removeEmail = e => {
    setFieldValue(
      type === 'black' ? 'blackList.emails' : 'whiteList.emails',
      (type === 'black' ? values?.blackList?.emails : values?.whiteList?.emails).filter(
        el => el !== e
      )!
    );
  };

  return (
    <>
      <StepHeader
        question={t('common:whitelist_setup_question')}
        description={t('common:whitelist_setup_description')}
        icon={<ShieldCheckIcon className='w-6 h-6' />}
      />
      {!hasBWExtention ? (
        <div className={`flex flex-col w-full`}>
          <BWError router={router} />
        </div>
      ) : (
        <div className='flex flex-col md:flex-row gap-x-6 px-4 mb-4'>
          <div className='flex flex-col w-full md:w-1/3 flex-grow '>
            <Field label={t('common:domains')}>
              <div className='flex flex-col w-full relative'>
                <Input
                  value={domain}
                  handleChange={e => setDomain(e.currentTarget.value)}
                  onKeyPress={e => (e.charCode === 13 ? addDomain(domain) : null)}
                  placeholder={t('common:ex_domain')}
                  styles='pr-10'
                  type='text'
                />
                {localError.domain && <FieldError message={localError.domain} />}
                <button
                  className='border border-mainBlue flex w-6 h-6 items-center justify-center rounded-full absolute top-3.5 right-2 text-mainBlue hover:bg-mainBlue hover:bg-opacity-10'
                  onClick={() => addDomain(domain)}
                  type={'button'}
                >
                  <PlusIcon className='w-5 h-5' />
                </button>
              </div>
            </Field>
            <div className='flex-grow w-full flex items-start gap-4 p-4 min-h-[96px] flex-wrap rounded-lg border border-gray-300 content-start mt-4'>
              {(type === 'black' ? values?.blackList?.domains : values?.whiteList?.domains).map(
                d => (
                  <WBItems key={d} onClick={() => removeDomain(d)} value={d} />
                )
              )}
            </div>
          </div>
          <div className='flex flex-col w-full md:w-1/3 mt-6 md:mt-0 flex-grow'>
            <Field label={t('common:email')}>
              <div className='flex flex-col w-full relative'>
                <Input
                  value={email}
                  handleChange={e => setEmail(e.currentTarget.value)}
                  onKeyDown={e => e.key === 'Enter' && addEmail(email)}
                  placeholder={t('common:ex_email')}
                  styles='pr-10'
                  type='text'
                />
                {localError.email && <FieldError message={localError.email} />}
                <button
                  className='border border-mainBlue flex w-6 h-6 items-center justify-center rounded-full absolute top-3.5 right-2 text-mainBlue hover:bg-mainBlue hover:bg-opacity-10'
                  onClick={() => addEmail(email)}
                  type={'button'}
                >
                  <PlusIcon className='w-5 h-5' />
                </button>
              </div>
            </Field>
            <div className='flex-grow w-full flex items-start gap-4 p-4 flex-wrap min-h-[96px] rounded-lg border border-gray-300 content-start mt-4'>
              {(type === 'black' ? values?.blackList?.emails : values?.whiteList?.emails).map(m => (
                <WBItems key={m} onClick={() => removeEmail(m)} value={m} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhiteBlacklist;
