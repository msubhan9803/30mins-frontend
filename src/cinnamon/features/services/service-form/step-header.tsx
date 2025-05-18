/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import Button from '@components/button';
import {CheckIcon, ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/20/solid';
import useTranslation from 'next-translate/useTranslation';
import Loader from '@root/components/loader';
import classNames from 'classnames';
import {useState} from 'react';

type IProps = {
  question: string;
  description: string;
  className?: string;
  icon?: any;
  keepDecs?: boolean;
  noBack?: boolean;
  move?: (action: any, update: any) => void;
  step?: number;
  stepName?:
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
  mode?: string | string[] | undefined;
  serviceType?: string;
  editOrgServiceLoading?: any;
  editServiceLoading?: any;
  createServiceLoading?: any;
  isLoading?: any;
  submitEditService?: () => void;
};

export default function StepHeader({
  question,
  description,
  editOrgServiceLoading,
  editServiceLoading,
  submitEditService,
  createServiceLoading,
  isLoading,
  icon,
  noBack,
  move,
  step,
  mode,
  serviceType,
  stepName,
  keepDecs,
  className,
}: IProps) {
  const {t} = useTranslation('common');
  const [mouseEnter, setmouseEnter] = useState(false);
  return (
    <div className={classNames('flex flex-col md:flex-row justify-between gap-4 mb-2', className)}>
      <div className='mb-2 flex justify-center items-center space-x-5 '>
        <div className='flex flex-col gap-1 items-start'>
          <h2 className='text-base leading-5 lg:text-xl font-bold text-mainText'>{question}</h2>
          <p
            className={classNames([
              keepDecs ? 'flex' : 'hidden',
              'text-gray-500 pl-1 text-sm leading-snug md:block',
            ])}
          >
            {description}
          </p>
        </div>
      </div>
      <div className='gap-2 grid grid-cols-2 sm:grid-cols-3 mx-auto justify-center md:justify-end md:ml-auto md:mr-0 items-center min-w-max w-full sm:w-6/12 xl:w-4/12'>
        {move && step && mode && (
          <>
            {step <= 3 && (
              <>
                {!noBack && (
                  <Button
                    className={classNames([
                      step === 1 || (step === 2 && mode === 'edit') ? 'hidden' : '',
                      'h-max text-xs sm:text-sm order-1 sm:order-1 flex justify-center items-center',
                      stepName === 'ServicePayment'
                        ? 'col-start-1'
                        : 'order-1 row-start-1 sm:col-start-2',
                    ])}
                    variant='ghost'
                    onClick={() => move('back', false)}
                  >
                    <ChevronLeftIcon className='mr-1 h-5 w-5 text-gray-500' aria-hidden='true' />
                    {t('go_back')}
                  </Button>
                )}
                {stepName === 'ServicePayment' && (
                  <Button
                    variant='outline'
                    onClick={() => {
                      step <= 10 && move('next', false);
                    }}
                    className='h-max text-xs col-span-2 sm:col-span-1 sm:text-sm order-3 sm:order-2 flex justify-center items-center'
                  >
                    {t('more_options')}
                  </Button>
                )}
                {mode === 'create' || (mode === 'edit' && step <= 2) ? (
                  <Button
                    variant='solid'
                    className={classNames([
                      'h-max text-xs sm:text-sm flex justify-center items-center',
                      step <= 2
                        ? 'order-0 col-start-2 sm:order-2 sm:col-start-3'
                        : 'order-2 sm:order-3',
                    ])}
                    onClick={() =>
                      stepName === 'ServicePayment'
                        ? move('preview', false)
                        : !['MEETING', 'FREELANCING_WORK', 'EVENT'].includes(`${serviceType}`) &&
                          step === 2
                        ? mode === 'create'
                          ? move!('save', false)
                          : submitEditService!()
                        : move('next', false)
                    }
                  >
                    {stepName === 'ServicePayment' ? (
                      t('preview')
                    ) : !['MEETING', 'FREELANCING_WORK', 'EVENT'].includes(`${serviceType}`) &&
                      step === 2 ? (
                      mode === 'create' ? (
                        <>
                          {createServiceLoading ? (
                            <Loader color={mouseEnter ? '#00a3fe' : '#fff'} />
                          ) : (
                            <>
                              <CheckIcon
                                className={classNames([
                                  'mr-1 h-5 w-5 ',
                                  mouseEnter ? 'text-mainBlue' : 'text-white',
                                ])}
                              />
                              {t('btn_submit')}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {editServiceLoading || editOrgServiceLoading || isLoading ? (
                            <Loader color={mouseEnter ? '#00a3fe' : '#fff'} />
                          ) : (
                            <>
                              <CheckIcon
                                className={classNames([
                                  'mr-1 h-5 w-5 ',
                                  mouseEnter ? 'text-mainBlue' : 'text-white',
                                ])}
                              />
                              {t('update_service')}
                            </>
                          )}
                        </>
                      )
                    ) : (
                      <>
                        {t('continue')}
                        <ChevronRightIcon className='ml-1 h-5 w-5' aria-hidden='true' />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => submitEditService!()}
                    variant='solid'
                    className='text-xs sm:text-sm px-2 order-2 sm:order-3 flex justify-center items-center'
                    onMouseEnter={() => {
                      setmouseEnter(true);
                    }}
                    onMouseLeave={() => {
                      setmouseEnter(false);
                    }}
                  >
                    {editServiceLoading || editOrgServiceLoading || isLoading ? (
                      <Loader color={mouseEnter ? '#00a3fe' : '#fff'} />
                    ) : (
                      <>
                        <CheckIcon
                          className={classNames([
                            'mr-1 h-5 w-5 ',
                            mouseEnter ? 'text-mainBlue' : 'text-white',
                          ])}
                        />
                        {t('update_service')}
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
