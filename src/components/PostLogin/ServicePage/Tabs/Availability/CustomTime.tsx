import {useState} from 'react';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import classNames from 'classnames';
import {ExclamationTriangleIcon, PlusCircleIcon, XMarkIcon} from '@heroicons/react/20/solid';
import CheckBox from '@root/components/forms/checkbox';
import Select from '@root/components/forms/select';
import {days} from 'cinnamon/features/services/service-form/service-availability/constants';
import validateChange from 'cinnamon/features/users/working-hours-form/validate-change';

type TimeSlot = {
  code: number;
  label: string;
};

const CustomTime = ({values, setFieldValue: handleChange, setFieldError}) => {
  const {t} = useTranslation('common');
  const [rangeErrors, setRangeErrors] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  const availabilityDays = values?.serviceWorkingHours;

  const getHours = day => availabilityDays[day].availability;

  const getDay = day => availabilityDays[day];

  const activateDay = day => {
    let hrs: any;
    handleChange(`serviceWorkingHours[${day}].isActive`, !getDay(day).isActive);
    if (getDay(day).isActive) {
      hrs = [];
    } else {
      hrs = [...(getHours(day) || []), {start: 0, end: 0}];
    }
    handleChange(`serviceWorkingHours[${day}].availability`, hrs);
    setRangeErrors({...rangeErrors, [day]: []});
  };

  const timeslots = () => {
    const slots: TimeSlot[] = [];
    for (let i = 0; i <= 1440; i += values.duration) {
      const val = dayjs.duration(i, 'minutes').format('HH:mm');
      if (!slots.map(el => el.label).includes(val)) {
        slots.push({code: i, label: val});
      }
    }

    return slots;
  };

  const changeRange = (e, day, index, mode) => {
    handleChange(`serviceWorkingHours[${day}].availability[${index}].${mode}`, e);
    if (validateChange(e, day, index, mode, availabilityDays) !== 'no_errors') {
      const errs = rangeErrors;
      errs[day][index] = validateChange(e, day, index, mode, availabilityDays);
      setRangeErrors(errs);
      setFieldError(`serviceWorkingHours`, 'fix_all_errors');
    } else {
      setRangeErrors({...rangeErrors, [day]: []});
      setFieldError(`serviceWorkingHours`, undefined);
    }
  };

  const deleteRange = (day, index) => {
    const dhrs = getHours(day).filter((_item, i) => i !== index);
    if (index === 0) {
      let hrs: any;
      handleChange(`serviceWorkingHours[${day}].isActive`, !getDay(day).isActive);
      if (getDay(day).isActive) {
        hrs = [];
      } else {
        hrs = [...getHours(day), {start: 0, end: 0}];
      }
      handleChange(`serviceWorkingHours[${day}].availability`, hrs);
    } else {
      handleChange(`serviceWorkingHours[${day}].availability`, dhrs);
    }
    setRangeErrors({...rangeErrors, [day]: []});
  };

  const addRange = day => {
    const hrs = [...getHours(day), {start: 0, end: 0}];
    handleChange(`serviceWorkingHours[${day}].availability`, hrs);
  };

  return (
    <div className='w-full flex flex-col space-y-6'>
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
              {availabilityDays[day.code].availability.length > 0 &&
                availabilityDays[day.code].availability.map((_hour, index) => (
                  <div className='flex flex-col w-full mt-2 first:mt-0' key={index}>
                    <div className='flex items-center mt-3 md:mt-0 w-full gap-x-2'>
                      <div className='flex flex-col md:flex-row w-full gap-x-2'>
                        <Select
                          options={timeslots()}
                          label={t('start_time')}
                          onChange={changeRange}
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
                          disabled={availabilityDays[day.code].availability.length - 1 !== index}
                        />
                        <Select
                          options={timeslots()}
                          label={t('stop_time')}
                          onChange={changeRange}
                          selectedOption={dayjs
                            .duration(availabilityDays[day.code].availability[index].end, 'minutes')
                            .format('HH:mm')}
                          code={day.code}
                          index={index}
                          mode='end'
                          type='availability'
                          disabled={availabilityDays[day.code].availability.length - 1 !== index}
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
            <div className='py-3 px-4 border text-gray-500 border-gray-300 shadow-md rounded-lg flex-grow'>
              {day.title} {t('day_deactivated')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
export default CustomTime;
