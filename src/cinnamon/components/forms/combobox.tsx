import {Fragment, useState} from 'react';
import {Combobox, Transition} from '@headlessui/react';
import {CheckIcon} from '@heroicons/react/20/solid';
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import {useQuery} from '@apollo/client';
import queries from 'constants/GraphQL/Service/queries';
import useTranslation from 'next-translate/useTranslation';

export default function ComboBox({handleChange, serviceCharity}) {
  //

  const {t} = useTranslation('common');
  const [query, setQuery] = useState('');
  const {data, loading} = useQuery(queries.getServiceCharity, {
    variables: {
      charityQuery: query,
    },
    fetchPolicy: 'network-only',
    skip: query.length < 3,
  });
  return (
    <div className='w-full'>
      <Combobox
        value={serviceCharity}
        onChange={e => {
          handleChange('serviceCharity', e.name);
          handleChange('serviceCharityId', e._id);
        }}
      >
        <div className='relative mt-1'>
          <div className='px-4 relative flex w-full border border-gray-300 py-2 cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
            <Combobox.Button className='inset-y-0 right-0 flex items-center'>
              <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' aria-hidden='true' />
            </Combobox.Button>
            <Combobox.Input
              className='w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0'
              displayValue={() => serviceCharity}
              onChange={event => setQuery(event.target.value)}
              placeholder={t('charity_placeholder')}
            />
          </div>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {query.length < 3 && !data && !loading && (
                <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
                  {t('type_at_least')}
                </div>
              )}
              {!data && loading && (
                <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
                  {t('loading')}
                </div>
              )}
              {data?.getServiceCharity.charities.length === 0 ? (
                <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
                  {t('nothing_found')}
                </div>
              ) : (
                data?.getServiceCharity.charities.map(charity => (
                  <Combobox.Option
                    key={charity._id}
                    className={({active}) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={charity}
                  >
                    {({selected, active}) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                        >
                          {charity.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
