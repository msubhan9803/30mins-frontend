import {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import duration from 'dayjs/plugin/duration';
import {PlusCircleIcon} from '@heroicons/react/24/outline';
import {ExclamationTriangleIcon, XMarkIcon} from '@heroicons/react/20/solid';

import CheckBox from '@root/components/forms/checkbox';
import Select from '@root/components/forms/select';

import Error from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import {AvailabilityDays, days} from './constants';
import validateChange from './validate-change';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(duration);

type Props = {
  handleChange: any;
  availabilityDays: AvailabilityDays;
  errors: any;
  setFieldValue: any;
};

type TimeSlot = {
  code: number;
  label: string;
};

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

export default function WorkingHoursForm({
  handleChange,
  availabilityDays,
  setFieldValue,
  errors,
}: Props) {
  const {t} = useTranslation('common');
  const getDay = day => availabilityDays[day];
  const getHours = day => availabilityDays[day].availability;
  const [rangeErrors, setRangeErrors] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  // Activate or Deactivate day
  const activateDay = day => {
    let hrs: any;
    handleChange(`availabilityDays[${day}.isActive`, !getDay(day).isActive);
    if (getDay(day).isActive) {
      hrs = [];
    } else {
      hrs = [...getHours(day), {start: 0, end: 15}];
    }
    handleChange(`availabilityDays[${day}].availability`, hrs);
    setRangeErrors({...rangeErrors, [day]: []});
  };

  // Add range to day
  const addRange = day => {
    const newRangeHrs = getHours(day)[getHours(day).length - 1];
    const hrs = [...getHours(day), {start: newRangeHrs.end, end: newRangeHrs.end + 15}];
    handleChange(`availabilityDays[${day}].availability`, hrs);
  };

  // Select range from day
  const deleteRange = (day, index) => {
    const dhrs = getHours(day).filter((_item, i) => i !== index);
    if (index === 0) {
      let hrs: any;
      handleChange(`availabilityDays[${day}].isActive`, !getDay(day).isActive);
      if (getDay(day).isActive) {
        hrs = [];
      } else {
        hrs = [...getHours(day), {start: 0, end: 0}];
      }
      handleChange(`availabilityDays[${day}].availability`, hrs);
    } else {
      handleChange(`availabilityDays[${day}].availability`, dhrs);
    }
    setRangeErrors({...rangeErrors, [day]: []});
  };

  // Change range data
  const changeRange = (e, day, index, mode) => {
    handleChange(`availabilityDays[${day}].availability[${index}].${mode}`, e);
    if (validateChange(e, day, index, mode, availabilityDays) !== 'no_errors') {
      const errs = rangeErrors;
      errs[day][index] = t(validateChange(e, day, index, mode, availabilityDays));
      setRangeErrors(errs);
      setFieldValue(`isValid`, 'fix_all_errors');
    } else {
      setRangeErrors({...rangeErrors, [day]: []});
      setFieldValue(`isValid`, undefined);
    }
  };

  const CheckValidation = () => {
    let done: any = true;
    Object.values(rangeErrors).forEach(element => {
      if (element.length > 0) {
        done = false;
      }
    });
    return done;
  };

  useEffect(() => {
    if (!CheckValidation()) {
      setFieldValue(`isValid`, 'fix_all_errors');
    } else {
      setFieldValue(`isValid`, undefined);
    }
  }, [rangeErrors]);

  if (!availabilityDays) return <div></div>;
  return (
    <>
      {errors.availabilityDays && <Error message={errors.availabilityDays} styles='mb-4' />}
      <div className='w-full'>
        <div className='flex flex-col space-y-6'>
          {days.map(day => (
            <div className='flex flex-col md:flex-row gap-x-6 items-start gap-2' key={day.code}>
              <CheckBox
                code={day.code}
                label={t(day.code)}
                handleChange={() => activateDay(day.code)}
                selected={availabilityDays[day.code].isActive}
                style='w-full md:w-1/4 border py-3'
              />
              {availabilityDays[day.code].isActive ? (
                <div className='flex flex-col w-full md:w-2/4 flex-grow items-start gap-2 mt-2'>
                  {availabilityDays[day.code].availability.length > 0 &&
                    availabilityDays[day.code].availability.map((_hour, index) => (
                      <div className='flex flex-col w-full mt-2 first:mt-0' key={index}>
                        <div className='flex items-center mt-3 md:mt-0 w-full gap-x-2'>
                          <div className='flex flex-col md:flex-row w-full gap-2'>
                            <Select
                              length={availabilityDays[day.code].availability.length - 1}
                              options={
                                index === availabilityDays[day.code].availability.length - 1
                                  ? timeslots(
                                      index,
                                      index === 0
                                        ? 0
                                        : availabilityDays[day.code].availability[index - 1].end
                                    )
                                  : []
                              }
                              label={t('start_time')}
                              onChange={
                                index === availabilityDays[day.code].availability.length - 1
                                  ? changeRange
                                  : () => {}
                              }
                              selectedOption={dayjs
                                .duration(
                                  availabilityDays[day.code].availability[index].start,
                                  'minutes'
                                )
                                .format('HH:mm')}
                              code={day.code}
                              index={index}
                              mode='start'
                              type='availability'
                            />
                            <Select
                              length={availabilityDays[day.code].availability.length - 1}
                              options={
                                index === availabilityDays[day.code].availability.length - 1
                                  ? timeslots(
                                      index,
                                      availabilityDays[day.code].availability[index].start
                                    )
                                  : []
                              }
                              label={t('stop_time')}
                              onChange={
                                index === availabilityDays[day.code].availability.length - 1
                                  ? changeRange
                                  : () => {}
                              }
                              selectedOption={dayjs
                                .duration(
                                  availabilityDays[day.code].availability[index].end,
                                  'minutes'
                                )
                                .format('HH:mm')}
                              code={day.code}
                              index={index}
                              mode='end'
                              type='availability'
                            />
                          </div>

                          <button
                            onClick={() => deleteRange(day.code, index)}
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
                              {rangeErrors[day.code][index]}
                            </div>
                          )}
                      </div>
                    ))}
                  {getHours(day.code)[getHours(day.code).length - 1]?.end !== 0 &&
                  getHours(day.code)[getHours(day.code).length - 1]?.end !== 1440 &&
                  rangeErrors[day.code].length === 0 ? (
                    <button
                      onClick={() => addRange(day.code)}
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
                <div className='py-3 px-4 border w-full md:w-auto text-gray-500 border-gray-300 mt-2 shadow-md rounded-lg flex-grow'>
                  {day.title} {t('day_deactivated')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
