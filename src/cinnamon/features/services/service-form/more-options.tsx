import useTranslation from 'next-translate/useTranslation';
import Button from '@components/button';
import {CheckIcon, ChevronLeftIcon} from '@heroicons/react/20/solid';
import Loader from '@root/components/loader';
import classNames from 'classnames';
import {useState} from 'react';

type IProps = {
  move: (action: any, update: any) => Promise<void>;
  mode: any;
  edited: any;
  editServiceLoading?: any;
  editOrgServiceLoading?: any;
  isLoading?: any;
  submitEditService: () => void;
};

export default function MoreOptions({
  move,
  edited,
  mode,
  editServiceLoading,
  editOrgServiceLoading,
  isLoading,
  submitEditService,
}: IProps) {
  const {t} = useTranslation('common');
  const [mouseEnter, setmouseEnter] = useState(false);
  return (
    <div
      className='overflow-x-scroll lg:overflow-x-visible scrollable flex flex-col sm:flex-row justify-start sm:justify-between
                items-center border border-transparent md:border-gray-200 border-b-0 rounded-t-lg
                w-full px-4 py-3 gap-2'
    >
      <span className='text-lg font-medium w-full'>{t('more_options')}</span>
      {mode === 'create' && (
        <div className='grid grid-cols-2 gap-4 w-full sm:w-8/12'>
          <Button
            variant='ghost'
            onClick={() => move('overBack', false)}
            className='h-max col-span-1'
          >
            <ChevronLeftIcon className='mr-1 h-5 w-5 text-gray-500' aria-hidden='true' />
            {t('go_back')}
          </Button>
          <Button
            variant='solid'
            className='h-max col-span-1'
            onClick={() => move('preview', false)}
          >
            {t('preview')}
          </Button>
        </div>
      )}
      {mode === 'edit' && !edited && (
        <div className='grid grid-cols-2 gap-4 w-full sm:w-8/12'>
          <Button
            variant='ghost'
            onClick={() => move('overBack', false)}
            className='h-max col-span-1'
          >
            <ChevronLeftIcon className='mr-1 h-5 w-5 text-gray-500' aria-hidden='true' />
            {t('go_back')}
          </Button>
          <Button
            onClick={() => submitEditService()}
            onMouseEnter={() => {
              setmouseEnter(true);
            }}
            onMouseLeave={() => {
              setmouseEnter(false);
            }}
            variant='solid'
          >
            {editServiceLoading || editOrgServiceLoading || isLoading ? (
              <Loader />
            ) : (
              <>
                <CheckIcon
                  className={classNames([
                    'mr-1 h-5 w-5 ',
                    mouseEnter ? 'text-mainBlue' : 'text-white',
                  ])}
                  aria-hidden='true'
                />
                {t('update_service')}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
