import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {SERVICE_TYPES} from 'constants/enums';
import useTranslation from 'next-translate/useTranslation';
import dayjs from 'dayjs';
import sanitizeHtml from 'sanitize-html';
import {useSession} from 'next-auth/react';
import {ExclamationCircleIcon} from '@heroicons/react/24/outline';
import Button from '@root/components/button';
import {toast} from 'react-hot-toast';
import axios from 'axios';

export default function ServiceInfo({serviceData, user, setFieldValue, hidden}) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  type charityObject = {
    website: string | null;
    _id: string | null;
  };
  const {data: session} = useSession();
  const [show, setShow] = useState<boolean>(false);
  const [charity, setCharity] = useState<charityObject>();
  const {t} = useTranslation();
  const {paymentType} = serviceData;
  const getCharityById = async charityId => {
    try {
      const response = await axios.get(`/api/charity/${charityId}`);
      if (response.status === 200) {
        setCharity(response.data.charityData);
      }
    } catch (err) {
      setCharity({
        website: null,
        _id: null,
      });
    }
  };
  useEffect(() => {
    if (serviceData.charityId) {
      getCharityById(serviceData.charityId);
    }
  }, [serviceData.charityId, session]);
  return (
    <div className='flex flex-col gap-1 p-4'>
      {[SERVICE_TYPES.MEETING, SERVICE_TYPES.ROUND_ROBIN].includes(serviceData.serviceType) && (
        <>
          <div className='flex w-full flex-col md:flex-row-reverse gap-2'>
            {serviceData.isPaid && (
              <div className='flex flex-col items-end w-full'>
                <div className='mr-4'>
                  {' '}
                  <img
                    src={`/icons/services/badge${paymentType}.svg`}
                    alt='Payment Badge'
                    width={32}
                    height={32}
                  />
                </div>
                {t('common:payment')}: {t(`common:${paymentType}`)}
                <Link href={`/howpaymentswork#${paymentType}`}>
                  <a className='text-xs'>{t('page:what_does_it_mean')}</a>
                </Link>
              </div>
            )}

            <div className='flex flex-col text-left gap-1 w-full'>
              <span
                title={serviceData?.title}
                className='font-bold text-3xl h-max pb-2 break-all line-clamp-1'
              >
                {serviceData?.title}
              </span>
              <span className='text-xl text-gray-600 font-bold'>
                {t('common:Meeting_Duration')}: {serviceData.duration} {t('common:txt_mins')}
              </span>
              <div className='flex text-left'>
                {serviceData.price > 0 &&
                  (serviceData.isRecurring ? (
                    <span className='text-xl'>
                      {t('meeting:Fees_per_meeting')}
                      {` ${serviceData.price}`}
                      {`${serviceData.currency}`}
                    </span>
                  ) : (
                    <span className='text-xl'>
                      {t('meeting:Fees')}: {serviceData.currency}
                      {serviceData.price}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div className={`w-full ${show ? '' : 'line-clamp-3'}`}>
            {serviceData?.description && (
              <div
                className={`custom break-words text-sm`}
                dangerouslySetInnerHTML={{__html: sanitizeHtml(serviceData?.description)}}
              />
            )}
          </div>
          {serviceData?.description.length > 420 && (
            <div
              onClick={() => setShow(!show)}
              className='mt-1 text-black font-bold hover:underline cursor-pointer'
            >
              {show ? 'Hide' : 'More'}
            </div>
          )}
          <div>
            {serviceData?.percentDonated > 0 && serviceData?.price > 0 ? (
              <span className='text-mainBlue font-bold'>
                {serviceData.percentDonated}% {t('meeting:donating_to_charity')}{' '}
                {charity?.website ? (
                  <a href={charity?.website} target='_blank' rel='noreferrer'>
                    {serviceData.charity}
                  </a>
                ) : (
                  serviceData.charity
                )}
              </span>
            ) : null}
          </div>
        </>
      )}
      {serviceData.serviceType === SERVICE_TYPES.FREELANCING_WORK && (
        <>
          <div className='flex w-full flex-col md:flex-row-reverse gap-2'>
            {serviceData.isPaid && (
              <div className='flex flex-col items-end w-full'>
                <div className='mr-4'>
                  {' '}
                  <img
                    src={`/icons/services/badge${paymentType}.svg`}
                    alt='Payment Badge'
                    width={32}
                    height={32}
                  />
                </div>
                {t('common:payment')}: {t(`common:${paymentType}`)}
                <Link href={`/howpaymentswork#${paymentType}`}>
                  <a className='text-xs'>{t('page:what_does_it_mean')}</a>
                </Link>
              </div>
            )}
            <div className='w-full '>
              <span className='font-bold text-3xl break-all' title={serviceData?.title}>
                {serviceData?.title}
              </span>
            </div>
          </div>

          <div className='flex flex-col justify-end mt-auto bottom-0 items-start'>
            <div className='flex flex-col justify-end mt-auto bottom-0 items-start'>
              <div className={`w-full ${show ? '' : 'line-clamp-3'} mt-10 min-h-[100px]`}>
                {serviceData?.description && (
                  <div
                    className={`custom break-words text-sm m-0`}
                    dangerouslySetInnerHTML={{__html: serviceData?.description}}
                  ></div>
                )}
              </div>
              {serviceData?.description.length > 420 && (
                <div
                  onClick={() => setShow(!show)}
                  className='mt-1 text-black font-bold hover:underline cursor-pointer'
                >
                  {show ? 'Hide' : 'More'}
                </div>
              )}
            </div>
            <div className='flex flex-col justify-end mt-auto bottom-0 items-start pt-4'>
              <div className='col-span-4 place-items-center flex justify-start items-center mt-auto h-3/4 gap-1'>
                <span className='font-medium text-xs md:text-base'>{t('common:deliver_in')}</span>
                <span className='font-bold text-sm md:text-lg text-mainBlue'>
                  {serviceData.dueDate} {t('common:deliver_in_days')}
                </span>
              </div>
              <div className='col-span-4 place-items-center flex justify-start items-center mt-auto h-3/4 gap-1'>
                <span className='font-normal text-xs text-gray-500 md:text-xs'>
                  {t('common:deliver_in_by')}{' '}
                  {dayjs(new Date()).add(serviceData.dueDate, 'day').format('MMM D, YYYY')}{' '}
                  {t('common:deliver_in_approximately')}
                </span>
              </div>
            </div>
          </div>
          <div className='flex flex-row justify-end mt-auto bottom-0 items-end pt-4'>
            <div className='flex text-2xl text-left font-bold mr-auto text-mainBlue'>
              {serviceData.price > 0 ? (
                <div className='flex flex-col'>
                  <div className='flex flex-row items-start items-center mt-auto bottom-0'>
                    <div className='font-medium text-xs text-black md:text-base'></div>
                    <div className='mt-auto bottom-0'>
                      {serviceData.currency}
                      {serviceData.price}
                    </div>
                  </div>
                  <div>
                    {serviceData.percentDonated > 0 ? (
                      <span className='text-black text-xs md:text-base font-normal'>
                        {serviceData.percentDonated}% {t('meeting:donating_to_charity')}{' '}
                        {charity?.website ? (
                          <a href={charity?.website} target='_blank' rel='noreferrer'>
                            {serviceData.charity}
                          </a>
                        ) : (
                          serviceData.charity
                        )}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : (
                <span>Free</span>
              )}
            </div>
            <div className='flex flex-row gap-2 font-medium'>
              {session?.user?.email && session?.user?.email !== user?.accountDetails?.email ? (
                <Link
                  href={{
                    pathname: '/user/chat',
                    query: {membersEmail: [session?.user?.email, user?.accountDetails?.email]},
                  }}
                  as='/user/chat'
                  className='flex flex-col justify-center items-center w-full'
                  title={t('common:live_chat')}
                  passHref
                >
                  <Button variant='solid' className='m-auto' onClick={() => {}}>
                    {t('common:live_chat')}
                  </Button>
                </Link>
              ) : (
                session?.user?.email !== user?.accountDetails?.email && (
                  <Button
                    variant='ghost'
                    className='m-auto cursor-pointer'
                    onClick={() => {
                      toast(t('common:please_Sign_In_send_message'), {
                        icon: <ExclamationCircleIcon width={25} height={25} />,
                        duration: 1000,
                      });
                    }}
                  >
                    {t('common:live_chat')}
                  </Button>
                )
              )}
              {!hidden && (
                <Button
                  variant='solid'
                  onClick={() => {
                    setFieldValue('buyNow', true);
                  }}
                >
                  {t('common:buy_now')}
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
