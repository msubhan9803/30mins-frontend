import React, {useEffect, useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {PAYMENT_TYPE} from 'constants/enums';

import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import bookingQueries from 'constants/GraphQL/Booking/queries';
import getUserFromTeamsAvailability from 'utils/getUserFromTeamsAvailability';
import RRCalendar from 'components/PreLogin/Booking/RRCalendar';
import sanitizeHtml from 'sanitize-html';

const RoundRobinLayout = ({serviceData}) => {
  const [show, setShow] = useState<boolean>(false);
  const [teamsAvailability, setTeamsAvailability] = useState([]);
  const {t} = useTranslation();

  const handleAvailabilityQuery = async (daySelected, bookerTimezone) => {
    const {data: availabilityResponse} = await graphqlRequestHandler(
      bookingQueries.getRRAvailablities,
      {
        serviceId: serviceData._id,
        daySelected: daySelected,
        bookerTimezone: bookerTimezone,
      },
      ''
    );

    setTeamsAvailability(availabilityResponse.data.getRRAvailability.teamsAvailability);

    return availabilityResponse.data.getRRAvailability.collectiveAvailability;
  };
  useEffect(() => {}, [teamsAvailability]);
  const handleWeekdayQuery = () => [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const getPriorityUser = slot => {
    const data = getUserFromTeamsAvailability(teamsAvailability, slot);
    return data ? data : null;
  };
  return (
    <>
      <div className='xl:w-3/5 lg:w-3/5 '>
        <div className='px-3 py-2 text-sm w-full'>
          <span className='font-bold text-4xl' title={serviceData?.title}>
            {serviceData?.title}
          </span>
          <div className='sm:flex text-left py-1'>
            <div className='flex text-left'>
              {serviceData.price > 0 &&
                (serviceData.isRecurring ? (
                  <span className='text-xl'>
                    {t('meeting:Fees_per_meeting')}
                    {serviceData.currency} {serviceData.price}
                  </span>
                ) : (
                  <span className='text-xl'>
                    {t('meeting:Fees')}: {serviceData.currency}
                    {serviceData.price} &nbsp;&nbsp;
                  </span>
                ))}
            </div>
            <span className='text-xl'>
              {t('common:Meeting_Duration')}: {serviceData.duration}
              {t('common:txt_mins')}
            </span>
          </div>

          <div className={`w-full ${show ? '' : 'line-clamp-3'}`}>
            {serviceData?.description ? (
              <div
                className={`custom break-words text-sm`}
                dangerouslySetInnerHTML={{__html: sanitizeHtml(serviceData?.description)}}
              />
            ) : null}
          </div>
          {serviceData?.description.length > 420 ? (
            <div
              onClick={() => setShow(!show)}
              className='mt-1 text-black font-bold hover:underline cursor-pointer'
            >
              {show ? 'Hide' : 'More'}
            </div>
          ) : null}

          <div>
            {serviceData.percentDonated > 0 &&
            [PAYMENT_TYPE.DIRECT, PAYMENT_TYPE.ESCROW].includes(serviceData.paymentType) ? (
              <span className='text-mainBlue font-bold'>
                {serviceData.percentDonated}% {t('meeting:donating_to_charity')}{' '}
                {serviceData.charity}
              </span>
            ) : null}
          </div>
        </div>
        <RRCalendar
          getPriorityUser={getPriorityUser}
          serviceData={serviceData}
          isAvailability={false}
          availabilityQueryHandler={handleAvailabilityQuery}
          weekdayQueryHandler={handleWeekdayQuery}
        />
      </div>
    </>
  );
};
export default RoundRobinLayout;
