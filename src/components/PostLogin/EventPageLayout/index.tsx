/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {useFormik} from 'formik';
import {toast} from 'react-hot-toast';
import {useMutation} from '@apollo/client';

import mutations from 'constants/GraphQL/Event/mutations';

import {AUTHENTICATION_TYPE} from 'constants/enums';
import {UserContext} from '@root/context/user';

import EventCard from 'components/PreLogin/Event/EventCard';
import ProfileLayout from '../ServicePageLayout/InternalLayout/ProfileLayout';
import Form from '../ServicePageLayout/InternalLayout/feature/shared/Form';
import EventInfo from './EventInfo';
import AttendEvent from './AttendEvent';
import Confirmation from './Confirmation';
import ProfileLayoutFull from './ProfileLayoutFull';

import {initialValues, setInitBookingData, getCurrentSteps} from './constants';
import {schema} from './schema';

const ServiceLayout = ({serviceData, providerUser, bookerUser, eventUpcomingDates}) => {
  const {t} = useTranslation();

  const [addAttendeeMutation] = useMutation(mutations.addAttendee);

  const {user} = useContext(UserContext);

  const [apiLoading, setApiLoading] = useState(false);
  const [err, setErr] = useState('');

  const {values, errors, setFieldValue, setFieldError, setErrors, handleChange} = useFormik({
    initialValues: {
      ...initialValues,
      PhoneValid: !!bookerUser?.personalDetails?.phone,
      bookingData: {
        ...initialValues.bookingData,
        bookerEmail: bookerUser?.accountDetails?.email || '',
        bookerName: bookerUser?.personalDetails?.name || '',
        bookerPhone: bookerUser?.personalDetails?.phone || '',
      },
    },
    validateOnChange: false,
    onSubmit: () => {},
  });

  // useEffects
  useEffect(() => {
    setFieldValue('serviceData', serviceData);
    setFieldValue('user', providerUser);
    setFieldValue('bookingData', {
      ...values.bookingData,
      ...setInitBookingData({user: providerUser, serviceData}),
    });

    const {STEPS, TYPESERVICE} = getCurrentSteps(serviceData);

    setFieldValue('otpProtected', serviceData?.otpProtected);
    setFieldValue('authenticationType', serviceData?.authenticationType);
    setFieldValue('STEPS', STEPS);
    setFieldValue('TYPESERVICE', TYPESERVICE);
  }, []);

  const move = async (action: any, step) => {
    const stepDetails = Object(schema[values.TYPESERVICE]).find(
      o => o.index === values.STEPS[step]
    );

    try {
      if (action === 'back' && step !== 0) {
        await setFieldValue('step', step - 1);
        setErr('');
        return;
      } else if (action === 'back') {
        setErr('');
        setFieldValue('attendingDateTime', undefined);
        return;
      }

      if (action === 'next' && step !== values.STEPS.length - 1) {
        await stepDetails?.schema?.validate(values, {abortEarly: false});
        if (step === 0) {
          const val = values.bookerEmailValid;

          if (!val) {
            setFieldError('bookingData.bookerEmail', t('common:you_cant_book_your_service'));
            return;
          }

          const phoneVal = values.PhoneValid;

          if (!phoneVal && values.bookingData.bookerSmsReminders) {
            setFieldError('bookingData.bookerPhone', t('phone_number_invalid'));
            return;
          }
        }

        setErrors({});
        await setFieldValue('step', step + 1);
      }

      if (action === 'submit') {
        await stepDetails?.schema?.validate(values, {abortEarly: false});

        try {
          await handleSubmit();
        } catch (er) {
          setApiLoading(false);

          if (er.message === 'The Slot Is Already Booked!') {
            setErr('');

            toast.error(t('common:The Slot Is Already Booked!'));
          }
        }
      }
    } catch (error) {
      setApiLoading(false);

      if (error.message === 'email_blocked') {
        setErr(error.message);
      } else {
        error.inner.map(o => setFieldError(o.path, o.message));
      }
    }
  };

  const handleSubmit = async () => {
    setApiLoading(true);

    const answeredQuestions =
      values.bookingData.answeredQuestions.map(item => ({
        answer: item.answer,
        question: item.question,
        questionType: item.questionType,
        selectedOptions: item.selectedOptions,
      })) || [];

    const response = await addAttendeeMutation({
      variables: {
        attendeeData: {
          attendeeId: user?.userID ?? bookerUser._id,
          attendingDateTime: values.attendingDateTime,
          eventId: serviceData._id,
          answeredQuestions: answeredQuestions,
        },
      },
    });

    if (response.data.addAttendee.status === 200) {
      setFieldValue('confirmBooking', true);
      setApiLoading(false);
    }

    if (
      response.data.addAttendee.status === 400 &&
      response.data.addAttendee.message === 'Already registered for this event'
    ) {
      toast.error(t('common:event_already_booked'));
      setApiLoading(false);
    }
  };

  return (
    <>
      <div className='w-full h-full'>
        {serviceData.eventStatus === 'UPCOMING' && (
          <div className='container p-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between h-full'>
            <div className='bg-white h-max self-start shadow rounded w-full'>
              <div className='lg:flex'>
                <ProfileLayout user={providerUser} />

                <div className='lg:w-3/5 flex flex-col min-h-full divide-y space-y-2'>
                  <EventInfo serviceData={serviceData} />

                  <div className='flex flex-col h-full p-4'>
                    {serviceData?.authenticationType === AUTHENTICATION_TYPE.PRE_APPROVED && (
                      <p className='text-red-500'>{t('common:event_pre-approved_disclaimer')}</p>
                    )}

                    {serviceData?.authenticationType === AUTHENTICATION_TYPE.VERIFIED_ONLY && (
                      <p className='text-red-500'>{t('common:event_verified-only_disclaimer')}</p>
                    )}

                    {!values.attendingDateTime && (
                      <AttendEvent
                        serviceData={serviceData}
                        setFieldValue={setFieldValue}
                        eventUpcomingDates={eventUpcomingDates}
                      />
                    )}

                    {values.attendingDateTime && !values.confirmBooking && (
                      <Form
                        setFieldValue={setFieldValue}
                        setFieldError={setFieldError}
                        handleChange={handleChange}
                        loading={apiLoading}
                        errors={errors}
                        values={values}
                        errMsg={err}
                        move={move}
                        providerUser={providerUser}
                      />
                    )}

                    {values.confirmBooking && <Confirmation values={values} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(serviceData.eventStatus === 'CANCELLED' || serviceData.eventStatus === 'CONCLUDED') && (
          <div>
            <ProfileLayoutFull user={providerUser} />

            <div className='mt-8 max-w-3xl mx-auto'>
              <EventCard
                eventData={serviceData}
                username={providerUser?.accountDetails?.username}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ServiceLayout;
