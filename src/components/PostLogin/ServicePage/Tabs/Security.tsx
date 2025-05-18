import classNames from 'classnames';
import {RadioGroup} from '@headlessui/react';
import {ComputerDesktopIcon} from '@heroicons/react/24/outline';
import useTranslation from 'next-translate/useTranslation';
import WhiteBlacklist from 'components/PostLogin/ServicePage/Tabs/WhiteBlackList';
import StepHeader from '@features/services/service-form/step-header';

const Security = ({values, setFieldValue}) => {
  const {t} = useTranslation();
  const authenticationTypes = [
    {
      title: 'no_authentication_required',
      desc: 'allow_anyone_to_book_your_meeting_without_authorization',
      value: 'NONE',
    },
    {
      title: 'verified_only',
      desc: 'restrict_your_meetings_to_only_allow_verified_users',
      value: 'VERIFIED_ONLY',
    },
    {
      title: 'only_pre-approved_users',
      desc: 'add_domains_and_emails_that_you_want',
      value: 'PRE_APPROVED',
    },
  ];

  return (
    <div className='px-4 pb-8'>
      <StepHeader
        question={t('common:Do_you_want_your_meetings_to_require_authentication?')}
        description={t('common:add_an_extra_layer_of_security')}
        icon={<ComputerDesktopIcon className='w-6 h-6' />}
        keepDecs={true}
        className='mb-0 mt-1'
      />

      <div className='w-full'>
        <RadioGroup
          value={values.authenticationType}
          onChange={e => {
            setFieldValue('authenticationType', e);
          }}
          name='authenticationType'
        >
          <div className='flex flex-col'>
            {authenticationTypes?.map((type, idx) => (
              <RadioGroup.Option
                key={type.value}
                value={type.value}
                className={({checked}) =>
                  classNames(
                    checked ? 'border-mainBlue' : 'bg-white',
                    'w-full select-none flex-grow flex-shrink-0 flex cursor-pointer rounded-lg p-4',
                    idx === 0 && 'mt-0 pt-0'
                  )
                }
              >
                {({checked}) => (
                  <div className='flex w-full items-center gap-2'>
                    <div className='flex space-x-6 items-center'>
                      <input
                        type={'radio'}
                        checked={checked}
                        className='w-8 h-8 border border-black text-mainBlue'
                      />
                      <div className='text-sm flex flex-col w-full'>
                        <RadioGroup.Label
                          className={classNames(
                            checked ? 'text-mainBlue' : 'text-mainText',
                            'text-lg font-bold '
                          )}
                        >
                          {t(`common:${type.title}`)}
                        </RadioGroup.Label>
                        <RadioGroup.Description as='span' className={`inline text-gray-500`}>
                          <span>{t(`common:${type.desc}`)}</span>
                        </RadioGroup.Description>
                      </div>
                    </div>
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
      {values.authenticationType === 'PRE_APPROVED' && (
        <div>
          <WhiteBlacklist type='white' values={values} setFieldValue={setFieldValue} />
        </div>
      )}
    </div>
  );
};
export default Security;
