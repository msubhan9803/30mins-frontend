import {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import duration from 'dayjs/plugin/duration';
import {CalendarIcon, PlusCircleIcon} from '@heroicons/react/24/outline';
import {ExclamationTriangleIcon, XMarkIcon} from '@heroicons/react/20/solid';

import CheckBox from '@root/components/forms/checkbox';
import Select from '@root/components/forms/select';
import StepHeader from '@features/services/service-form/step-header';

// import Error from '@root/components/forms/error';
import {FieldError} from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import {activation, AvailabilityDays, days} from './constants';
import BinaryRadio from '../binary-radio';
import validateChange from './validate-change';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(duration);

type Props = {
  handleChange: any;
  serviceAvailability: string;
  availabilityDays: AvailabilityDays;
  errors: any;
  setFieldError: any;
  move: (action: any, update: any) => Promise<void>;
  meetingDuration: any;
  ValidationAvailabilityDays: any;
  serviceType?: any;
};

type TimeSlot = {
  code: number;
  label: string;
};

export default function ServiceAvailability({
  handleChange,
  serviceAvailability,
  availabilityDays,
  errors,
  move,
  meetingDuration,
  ValidationAvailabilityDays,
  serviceType,
}: Props) {
  const {t} = useTranslation('common');
  const getDay = day => availabilityDays[day];
  const getHours = day => availabilityDays[day].hours;
  const [rangeErrors, setRangeErrors] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  const timeslots = (index, start = 0) => {
    let slots: TimeSlot[] = [];
    for (let i = start; i < 1440; i += 15) {
      const val = dayjs.duration(i, 'minutes').format('HH:mm');
      slots.push({code: i, label: val});
    }
    if (Number(index) > 0) {
      slots = [...slots, {code: 1440, label: '00:00'}];
    }
    return slots;
  };

  // Activate or Deactivate day
  const activateDay = day => {
    let hrs: any;
    handleChange(`availabilityDays[${day}].isActive`, !getDay(day).isActive);
    if (getDay(day).isActive) {
      hrs = [];
    } else {
      hrs = [...getHours(day), {start: 0, end: meetingDuration}];
    }
    handleChange(`availabilityDays[${day}].hours`, hrs);
    handleChange(`ValidationAvailabilityDays`, {...ValidationAvailabilityDays, [day]: undefined});
    setRangeErrors({...rangeErrors, [day]: []});
  };

  // Add range to day
  const addRange = (day, List) => {
    try {
      const val = List[List.length - 1];
      const defVal = {
        start: val?.end ? val.end : 0,
        end: (val?.end ? val.end : 0) + meetingDuration,
      };

      const res = validateChange(day, defVal.end, defVal.start, List.length, availabilityDays);
      if (res === 'no_errors') {
        const hrs = [...getHours(day), defVal];
        handleChange(`availabilityDays[${day}].hours`, hrs);
      } else {
        const errs = rangeErrors;
        errs[day][List.length - 1] = res;
        setRangeErrors(errs);
        handleChange(`ValidationAvailabilityDays`, {
          ...ValidationAvailabilityDays,
          [day]: errs,
        });
        setRangeErrors({...rangeErrors, [day]: []});
        handleChange(`ValidationAvailabilityDays`, {
          ...ValidationAvailabilityDays,
          [day]: undefined,
        });
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  // Selete range from day
  const deleteRange = (day, index, List) => {
    try {
      const dhrs = getHours(day).filter((_item, i) => i !== index);
      if (index === 0 && List.length === 1) {
        let hrs: any;
        handleChange(`availabilityDays[${day}].isActive`, !getDay(day).isActive);
        if (getDay(day).isActive) {
          hrs = [];
        } else {
          hrs = [...getHours(day), {start: 0, end: 0}];
        }
        handleChange(`availabilityDays[${day}].hours`, hrs);
      } else {
        handleChange(`availabilityDays[${day}].hours`, dhrs);
      }
      setRangeErrors({...rangeErrors, [day]: []});
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  // Change range data
  const changeRange = (e, day, index, mode) => {
    try {
      handleChange(`availabilityDays[${day}].hours[${index}].${mode}`, e);
      if (validateChange(e, day, index, mode, availabilityDays) !== 'no_errors') {
        const errs = rangeErrors;
        errs[day][index] = validateChange(e, day, index, mode, availabilityDays);
        setRangeErrors(errs);
        handleChange(`ValidationAvailabilityDays`, {
          ...ValidationAvailabilityDays,
          [day]: validateChange(e, day, index, mode, availabilityDays),
        });
      } else {
        setRangeErrors({...rangeErrors, [day]: []});
        handleChange(`ValidationAvailabilityDays`, {
          ...ValidationAvailabilityDays,
          [day]: undefined,
        });
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  useEffect(() => {
    if (serviceAvailability === 'no') {
      handleChange(`ValidationAvailabilityDays`, []);
      handleChange(`availabilityDays`, {
        monday: {
          isActive: false,
          hours: [],
        },
        tuesday: {
          isActive: false,
          hours: [],
        },
        wednesday: {
          isActive: false,
          hours: [],
        },
        thursday: {
          isActive: false,
          hours: [],
        },
        friday: {
          isActive: false,
          hours: [],
        },
        saturday: {
          isActive: false,
          hours: [],
        },
        sunday: {
          isActive: false,
          hours: [],
        },
      });
    }
  }, [serviceAvailability]);

  const description =
    serviceType === 'EVENT' ? 'event_availability_description' : 'availability_description';

  return (
    <>
      <BinaryRadio
        question={t('availability_question')}
        description={t(description)}
        icon={<CalendarIcon className='w-6 h-6' />}
        errors={errors.serviceAvailability || errors.serviceAvailability}
        collapsed={serviceAvailability === 'yes'}
        value={serviceAvailability}
        field='serviceAvailability'
        handleChange={handleChange}
        options={activation}
        move={move}
      />

      {serviceAvailability === 'yes' && (
        <>
          <StepHeader
            question={t('availability_setup_question')}
            description={t('availability_setup_description')}
            icon={<CalendarIcon className='w-6 h-6' />}
          />

          {errors.availabilityDays === 'service_availability_at_least_one' && (
            <FieldError
              position='center'
              message={t('common:Please_select_one_or_more')}
              className='mb-2'
            />
          )}
          <div className='w-full'>
            <div className='flex flex-col space-y-6'>
              {days.map(day => (
                <div className='flex flex-col md:flex-row gap-x-6 items-start' key={day.code}>
                  <CheckBox
                    code={day.code}
                    label={t(day.code)}
                    handleChange={() => activateDay(day.code)}
                    selected={availabilityDays[day.code].isActive}
                    style='w-full md:w-1/4 border py-3'
                  />

                  {availabilityDays[day.code].isActive ? (
                    <div className='flex flex-col w-full md:w-2/4 flex-grow items-start'>
                      {availabilityDays[day.code].hours.length > 0 &&
                        availabilityDays[day.code].hours.map((_hour, index) => (
                          <div className='flex flex-col w-full mt-2 first:mt-0' key={index}>
                            <div className='flex items-center mt-3 md:mt-0 w-full gap-x-2'>
                              <div className='flex flex-col md:flex-row w-full gap-2'>
                                <Select
                                  length={availabilityDays[day.code].hours.length - 1}
                                  options={
                                    index === availabilityDays[day.code].hours.length - 1
                                      ? timeslots(
                                          index,
                                          index === 0
                                            ? 0
                                            : availabilityDays[day.code].hours[index - 1].end
                                        )
                                      : []
                                  }
                                  label={t('start_time')}
                                  onChange={changeRange}
                                  selectedOption={dayjs
                                    .duration(
                                      availabilityDays[day.code].hours[index].start,
                                      'minutes'
                                    )
                                    .format('HH:mm')}
                                  code={day.code}
                                  index={index}
                                  mode='start'
                                  type='availability'
                                  disabled={availabilityDays[day.code].hours.length - 1 !== index}
                                />
                                <Select
                                  length={availabilityDays[day.code].hours.length - 1}
                                  options={
                                    index === availabilityDays[day.code].hours.length - 1
                                      ? timeslots(
                                          index,
                                          availabilityDays[day.code].hours[index].start
                                        )
                                      : []
                                  }
                                  label={t('stop_time')}
                                  onChange={changeRange}
                                  selectedOption={dayjs
                                    .duration(
                                      availabilityDays[day.code].hours[index].end,
                                      'minutes'
                                    )
                                    .format('HH:mm')}
                                  code={day.code}
                                  index={index}
                                  mode='end'
                                  type='availability'
                                  disabled={availabilityDays[day.code].hours.length - 1 !== index}
                                />
                              </div>
                              <button
                                onClick={() =>
                                  deleteRange(day.code, index, availabilityDays[day.code].hours)
                                }
                                className={classNames(
                                  'border rounded-full border-red-300 hover:bg-red-200 h-6 w-6 flex-shrink-0 flex items-center justify-center'
                                )}
                              >
                                <XMarkIcon className={classNames('w-4 h-4 text-red-600')} />
                              </button>
                            </div>
                            {rangeErrors[day.code].length > 0 &&
                              rangeErrors[day.code][index] !== undefined && (
                                <div className='flex text-red-500 text-sm py-1 border border-red-300 border-t-0 rounded-b-md w-10/12 ml-4 px-4 items-center'>
                                  <ExclamationTriangleIcon className='w-4 h-4 text-red-500 mt-0.5 mr-2' />
                                  {t(rangeErrors[day.code][index])}
                                </div>
                              )}
                          </div>
                        ))}
                      {getHours(day.code)[getHours(day.code).length - 1]?.end !== 0 &&
                      Number(getHours(day.code)[getHours(day.code).length - 1]?.end) <
                        1440 - meetingDuration &&
                      rangeErrors[day.code].length === 0 ? (
                        <button
                          onClick={() => addRange(day.code, availabilityDays[day.code].hours)}
                          className='flex text-gray-500 space-x-2 items-center w-full bg-gray-200 mt-2 px-4 py-2 rounded-md'
                        >
                          <PlusCircleIcon className='w-6 h-6' />
                          <span>{t('add_more')}</span>
                        </button>
                      ) : (
                        ''
                      )}
                    </div>
                  ) : (
                    <div className='py-3 px-4 border text-gray-500 border-gray-300 shadow-md rounded-lg flex-grow'>
                      {day.title} {t('day_deactivated')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
