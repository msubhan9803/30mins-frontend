import React, {useEffect, useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline';
import {DAYS} from 'constants/forms/calendar';
import {Switch} from '@headlessui/react';
import classNames from 'classnames';
import TimezoneSelect from 'react-timezone-select';
import {SERVICE_TYPES} from 'constants/enums';
import getUserFromTeamsAvailability from 'utils/getUserFromTeamsAvailability';
import {LoaderIcon} from 'react-hot-toast';
import {FieldError} from '@root/components/forms/error';
import {FormikErrors} from 'formik';
import {IinitialValues} from '../meeting/constants';

const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isBetween = require('dayjs/plugin/isBetween');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  availabilityQueryHandler;
  weekdayQueryHandler;
  setFieldValue;
  errors?: FormikErrors<IinitialValues>;
  values: IinitialValues;
  disabled: boolean;
};

const Calendar = ({
  availabilityQueryHandler,
  weekdayQueryHandler,
  setFieldValue,
  values,
  errors,
  disabled,
}: IProps) => {
  const {t} = useTranslation();
  const {
    selectedBookerTimezone,
    isAvailability,
    serviceData,
    teamsAvailability,
    selectedDate,
    selectedTime,
    activeTime,
  } = values;
  // usesatates
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
  const [loading, setLoading] = useState(true);
  const [firstLoadinhg, setfirstLoadinhg] = useState(true);
  const [is24h, setIs24h] = useState(false);
  const [emptyDays, setEmptyDays] = useState<number[]>([]);
  const [numOfDays, setNumOfDays] = useState<number[]>([]);
  const [selectedDayAvailabilitySlots, setSelectedDayAvailabilitySlots] = useState<any>([]);
  const getPriorityUser = slot => {
    const data = getUserFromTeamsAvailability(teamsAvailability, slot);
    return data ? data : null;
  };
  const slotSelected = async time => {
    if (serviceData.serviceType === SERVICE_TYPES.ROUND_ROBIN) {
      const data = getPriorityUser(time);
      if (data) {
        setFieldValue('user', data);
      }
    }
  };

  const [workingWeekDays, setWorkingWeekDays] = useState<number[]>([]);

  const selectFisrtDay = _workingWeekDays => {
    if (_workingWeekDays?.length === 0) {
      return;
    }
    const currentDay = dayjs().tz(selectedBookerTimezone).month(selectedMonth).date(); // 20
    const currentIndex = dayjs()
      .tz(selectedBookerTimezone)
      .month(selectedMonth)
      .date(currentDay)
      .day();
    let index = 0;
    let fisrtDayInweek: any = _workingWeekDays[index];
    let stopLoop = true;
    while (fisrtDayInweek < currentIndex && stopLoop) {
      if (fisrtDayInweek < currentIndex && _workingWeekDays?.length > index) {
        fisrtDayInweek = _workingWeekDays[index];
        index += 1;
      } else if (_workingWeekDays?.length === index) {
        // eslint-disable-next-line prefer-destructuring
        fisrtDayInweek = _workingWeekDays[0];
        stopLoop = false;
      }
    }
    const nextSelectedDate = dayjs()
      .tz(selectedBookerTimezone)
      .month(selectedMonth)
      .date(
        currentDay +
          (fisrtDayInweek >= currentIndex
            ? fisrtDayInweek - currentIndex
            : 7 - (currentIndex > fisrtDayInweek ? currentIndex - fisrtDayInweek : 0))
      );
    setSelectedMonth(nextSelectedDate.month());
  };

  useEffect(() => {
    selectFisrtDay(workingWeekDays);
  }, [workingWeekDays]);

  const handleTimezoneChange = ({value}) => {
    setFieldValue('selectedBookerTimezone', value);
    setFieldValue('selectedTime', '');
    setFieldValue('selectedDate');
    if (!workingWeekDays.includes(dayjs(selectedDate).day())) {
      setFieldValue('selectedDate');
    }
  };

  const getNoOfDays = () => {
    let i;
    const daysInMonth = new Date(dayjs().year(), selectedMonth + 1, 0).getDate();

    const dayOfWeek = new Date(dayjs().year(), selectedMonth).getDay();
    const emptyDaysArray: number[] = [];
    for (i = 1; i <= dayOfWeek; i++) {
      emptyDaysArray.push(i);
    }

    const daysArray: number[] = [];
    for (i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    setEmptyDays(emptyDaysArray);
    setNumOfDays(daysArray);
  };

  const handleDaySelect = async e => {
    setFieldValue(
      'selectedDate',
      dayjs().tz(selectedBookerTimezone).month(selectedMonth).date(e.target.dataset.day)
    );
    try {
      setLoading(true);
      setfirstLoadinhg(true);
      setSelectedDayAvailabilitySlots([]);
      const el = await availabilityQueryHandler(
        dayjs()
          .tz(selectedBookerTimezone)
          .month(selectedMonth)
          .date(e.target.dataset.day)
          .format('MM-DD-YYYY'),
        selectedBookerTimezone
      );
      setSelectedDayAvailabilitySlots(el);
      setLoading(false);
      setfirstLoadinhg(false);
      setFieldValue('selectedTime', undefined);
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  const isToday = date => {
    const today = new Date();
    const d = new Date(today.getFullYear(), today.getMonth(), date);
    return today.toDateString() === d.toDateString();
  };

  const handle24Change = () => {
    setIs24h(!is24h);
  };

  const CleanTimeSelected = () => {
    setFieldValue('selectedDate', undefined);
    setFieldValue('selectedTime', undefined);
    setFieldValue('activeTime', undefined);
  };
  const incrementMonth = () => {
    setSelectedMonth(selectedMonth + 1);
    CleanTimeSelected();
  };

  const decrementMonth = () => {
    setSelectedMonth(selectedMonth - 1);
    CleanTimeSelected();
  };

  // const [first, setfirst] = useState(true);
  // const [endFist, setendFist] = useState(false);
  // useEffect(() => {
  //   if (!selectedDate || !first) {
  //     return;
  //   }
  //   try {
  //     // setLoading(true);
  //     // availabilityQueryHandler(
  //     //   dayjs(selectedDate).format('MM-DD-YYYY'),
  //     //   selectedBookerTimezone
  //     // ).then(el => {
  //     //   setSelectedDayAvailabilitySlots(el);
  //     //   setLoading(false);
  //     //   setendFist(true);
  //     //   setfirstLoadinhg(false);
  //     // });
  //     // setfirst(false);
  //     // eslint-disable-next-line no-empty
  //   } catch (err) {}
  // });

  useEffect(() => {
    getNoOfDays();
  }, [selectedMonth]);

  useEffect(() => {}, [selectedTime, selectedDayAvailabilitySlots]);

  useEffect(() => {
    try {
      const getWeekdays = async () => {
        setLoading(true);
        const availableWeekdays = await weekdayQueryHandler(selectedBookerTimezone);
        setWorkingWeekDays(availableWeekdays);
        setLoading(false);
      };
      if (workingWeekDays) {
        getWeekdays();
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }, [selectedBookerTimezone]);

  if (disabled) {
    return <></>;
  }
  return (
    <>
      <div
        className={classNames([
          'flex flex-col sm:flex-row items-center sm:items-start',
          disabled && 'hidden',
        ])}
      >
        <div className='max-w-xs mb-4'>
          <span
            className={`items-center ${
              isAvailability ? 'text-mainBlue text-3xl' : 'text-gray-600'
            } font-bold justify-center`}
          >
            {isAvailability ? t('meeting:my_availability') : t('meeting:select_date')}
          </span>
          <div className='grid grid-cols-4 items-center text-xs sm:grid-cols-4'>
            <div className='col-span-4 text-xs font-light'>
              <TimezoneSelect
                value={values.selectedBookerTimezone}
                onChange={handleTimezoneChange}
                id='selectedBookerTimezone'
                name='selectedBookerTimezone'
                labelStyle='abbrev'
                className='w-full mt-1 text-xs timezone-wrapper booking-wrapper'
              />
            </div>
          </div>
          <div className='flex text-gray-600 font-bold text-xl mt-4 mb-4'>
            <span className='w-1/2'>{dayjs().month(selectedMonth).format('MMMM YYYY')}</span>
            <div className='w-1/2 text-right'>
              <button
                onClick={decrementMonth}
                className={`mr-4 ${selectedMonth < dayjs().format('MM') && 'text-gray-400'}`}
                disabled={selectedMonth < dayjs().format('MM')}
              >
                <ChevronLeftIcon className='w-5 h-5' />
              </button>
              <button onClick={incrementMonth}>
                <ChevronRightIcon className='w-5 h-5' />
              </button>
            </div>
          </div>
          <div className='grid  grid-cols-7 gap-y-4 gap-x-4 sm:gap-x-1 text-center '>
            {DAYS.map((day, index) => (
              <div className='px-1' key={index}>
                <div
                  key={index}
                  className='text-gray-800 font-medium text-center text-xs w-7 font-skylight'
                >
                  {day}
                </div>
              </div>
            ))}
            {emptyDays.map(emptyDay => (
              <div key={emptyDay} className='text-center w-7 h-7 rounded-full mx-auto' />
            ))}
            {numOfDays.map(day => (
              <button
                key={day}
                data-day={day}
                onClick={handleDaySelect}
                disabled={
                  (selectedMonth < dayjs().format('MM') &&
                    dayjs().month(selectedMonth).format('D') > day) ||
                  !workingWeekDays.includes(
                    dayjs().tz(selectedBookerTimezone).month(selectedMonth).date(day).day()
                  ) ||
                  loading ||
                  (firstLoadinhg && selectedDate !== undefined)
                }
                className={classNames([
                  `cursor-pointer text-center text-sm rounded-full leading-loose w-8`,
                  (selectedMonth < dayjs().format('MM') &&
                    dayjs().month(selectedMonth).format('D') > day) ||
                  !workingWeekDays.includes(
                    dayjs().tz(selectedBookerTimezone).month(selectedMonth).date(day).day()
                  )
                    ? 'text-gray-400 bg-none font-light'
                    : loading || (firstLoadinhg && selectedDate !== undefined)
                    ? 'border-2 border-mainBlue cursor-default'
                    : 'border-2 border-mainBlue hover:bg-mainBlue hover:text-white',
                  dayjs().isSameOrBefore(dayjs().date(day).month(selectedMonth))
                    ? ' font-medium '
                    : ' ',
                  selectedDate?.$D === day ? ' bg-mainBlue text-white ' : '',
                  isToday(day) && selectedDate === '' ? ' bg-mainBlue text-white ' : '',
                ])}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        {selectedDate && (
          <div className='sm:pl-4 mt-8 sm:mt-0 text-center w-full md:w-2/5 h-96 max-h-80  overflow-y-auto'>
            <div className='text-mainBlue font-bold text-xl mb-4 text-center'>
              <span className='w-1/2'>{dayjs(selectedDate).format('dddd DD MMM YYYY')}</span>
            </div>
            <div className='text-gray-600 font-light mb-4 text-center'>
              <Switch.Group as='div' className='flex flex-row items-center justify-center gap-4'>
                <span className='text-sm font-medium select-none text-gray-900'>
                  {t('common:txt_am_pm')}
                </span>
                <div className='grid grid-cols-2 justify-around'>
                  <Switch
                    checked={is24h}
                    onChange={handle24Change}
                    className={classNames(
                      is24h ? 'bg-mainBlue' : 'bg-gray-200',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                    )}
                  >
                    <span
                      aria-hidden='true'
                      className={classNames(
                        is24h ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                      )}
                    />
                  </Switch>
                </div>
              </Switch.Group>
            </div>
            {errors?.bookingData?.conferenceType && (
              <FieldError
                message={errors?.bookingData?.conferenceType}
                position='center'
                breakW='words'
              />
            )}
            {loading === false ? (
              <div
                className={`${
                  selectedDayAvailabilitySlots?.length === 0
                    ? ''
                    : 'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 justify-start w-full place-items-center'
                }`}
              >
                {selectedDayAvailabilitySlots?.length === 0 && (
                  <div
                    className={
                      'text-gray-600 font-light mt-5 text-center justify-center items-center'
                    }
                  >
                    {t('common:book_not_available')}
                  </div>
                )}
                {selectedDayAvailabilitySlots?.length > 0 && (
                  <>
                    {selectedDayAvailabilitySlots?.map((time: any) => (
                      <div key={dayjs(time).utc().format()}>
                        <button
                          onClick={async () => {
                            setFieldValue('selectedTime', time);
                            setFieldValue('activeTime', time);
                            setFieldValue('isDateAndTimeSelected', true);
                            serviceData.serviceType === 'ROUND_ROBIN' && slotSelected(time);
                          }}
                          key={time}
                          className={`block px-3 font-medium mb-2 text-mainBlue border border-mainBlue rounded  ${
                            !isAvailability && activeTime === time
                              ? 'bg-mainBlue text-white hover:bg-mainBlue hover:text-white'
                              : ''
                          } py-2  ${isAvailability ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {dayjs(time)
                            .tz(selectedBookerTimezone)
                            .format(is24h ? 'HH:mm' : 'hh:mma')}
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div className='flex loader justify-center items-center align-middle self-center'>
                <LoaderIcon style={{width: 50, height: 50}} className='m-8' />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Calendar;
