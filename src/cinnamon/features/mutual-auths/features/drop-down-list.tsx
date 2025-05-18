import useTranslation from 'next-translate/useTranslation';
import cn from 'classnames';
import {Tab} from '@headlessui/react';

export default function Index({setValue, values, clear, loading}) {
  const {t} = useTranslation('common');

  const options = [
    {name: 'Search User', mode: 'searchUnauthorizedUser'},
    {name: 'Authorized Users', mode: 'getAuthorizedUser'},
    {name: 'Pending Invites', mode: 'getPendingInvites'},
    {name: 'Pending Requests', mode: 'getPendingRequest'},
  ];

  return (
    <div className='w-full'>
      <Tab.Group>
        <Tab.List
          className={cn(['flex flex-col sm:flex-row rounded-xl gap-1', {'cursor-wait': loading}])}
        >
          {options.map(category => (
            <div className='w-full py-2.5'>
              <Tab
                key={category.name}
                onClick={async () => {
                  if (!loading) {
                    setValue('mode', category.mode);
                    await clear(values, category.mode);
                  }
                }}
                className={() =>
                  cn(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-mainBlue ring-offset-white text-center sm:text-left',
                    {' focus:outline-none': !loading},
                    {'cursor-wait': loading},
                    category.mode === values.mode
                      ? 'bg-white underline underline-offset-8'
                      : 'text-black hover:bg-white/[0.12] hover:text-mainBlue'
                  )
                }
              >
                {t(`${category.name}`)}
              </Tab>
              <div className={cn('text-xs', category.mode === values.mode ? 'block' : 'hidden')}>
                {t(`${category.name}_help`)}
              </div>
            </div>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
}
