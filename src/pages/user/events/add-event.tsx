/* eslint-disable @typescript-eslint/no-unused-vars */
import {useContext, useEffect, useState} from 'react';
import classNames from 'classnames';
import Head from 'next/head';
import {useFormik} from 'formik';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';

import queries from 'constants/GraphQL/Event/queries';
import mutations from 'constants/GraphQL/Event/mutations';

import {UserContext} from '@root/context/user';

import PostLoginLayout from '@components/layout/post-login';

import EventDetails from '@root/features/events/event-details';
import ServiceSecurity from '@root/features/services/service-form/service-security';
import ServicePayment from '@root/features/services/service-form/service-payment';
import ServiceMedia from '@root/features/services/service-form/service-media';
import ServiceQuestions from '@root/features/services/service-form/service-questions';
import ServiceAvailability from '@root/features/services/service-form/service-availability';
import ServiceSummary from '@root/features/services/service-form/service-summary';

import MoreOptions from '@root/features/services/service-form/more-options';
import Transition from '@features/services/service-form/transition';
import Header from '@components/header';
import Button from '@components/button';
import SecLoader from 'components/shared/Loader/Loader';
import EditBar from '@root/features/services/service-form/edit-bar';

import schema, {IStepNames, steps} from '@features/events/schema';
import {stageInitialData, stageLocalData, stageRemoteData} from '@root/features/events/stage-data';

import {CheckBadgeIcon} from '@heroicons/react/20/solid';

const AddEvent = () => {
  //
  const {t} = useTranslation('common');
  const {t: tpage} = useTranslation('page');

  const router = useRouter();

  const {mode, stepType, sid, stype} = router.query;
  const serviceType = 'EVENT';

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Events'), href: '/user/events/organizing-events'},
    {
      title: tpage(mode === 'create' ? 'Add Event' : 'Edit Event'),
      href:
        mode === 'create'
          ? '/user/events/add-event/?mode=create&stepType=EVENT'
          : `/user/events/add-event/?mode=edit&sid=${sid}`,
    },
  ];

  const {data: session} = useSession();
  const {user} = useContext(UserContext);

  // Queries & Mutation
  const [checkSlug] = useLazyQuery(queries.getEventSlug);
  const [createEvent, {loading: createEventLoading}] = useMutation(mutations.createEvent);
  const [editEvent, {loading: editEventLoading}] = useMutation(mutations.editEvent);

  const {data: currentEventData, loading} = useQuery(queries.getEventById, {
    variables: {documentId: sid, token: session?.accessToken},
    skip: sid === undefined,
    fetchPolicy: 'network-only',
  });

  // Local State
  const [step, setStep] = useState(2);
  const [max, setMaxStep] = useState(1);
  const [created, setCreated] = useState(false);
  const [edited, setEdited] = useState(false);
  const [moreOptions, setmoreOptions] = useState(false);
  const [stepName, setStepName] = useState<any>('ServiceDetails');
  const [initialFormValues, setInitialFormValues] = useState(stageInitialData());

  useEffect(() => {
    if (
      ![
        'Charity',
        'Security',
        'Availability',
        'Whitelist',
        'Blacklist',
        'Questions',
        'Media',
      ].includes(stepName)
    ) {
      setmoreOptions(false);
    } else {
      setmoreOptions(true);
    }
  }, [stepName]);

  // Formik Initialization
  const {values, errors, setFieldValue, setFieldError, handleChange} = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: () => {
      null;
    },
  });

  // Set initial values state
  useEffect(() => {
    if (currentEventData && currentEventData.getEventById.eventData && mode === 'edit') {
      setInitialFormValues(stageRemoteData(currentEventData.getEventById.eventData)!);

      const data = currentEventData?.getEventById?.eventData;
      setFieldValue('serviceDescription', data?.serviceDescription ?? '');
      setFieldValue('serviceAttendeesMessage', data?.serviceAttendeesMessage ?? '');
    }
  }, [currentEventData]);

  // Create service submission
  const submitService = async () => {
    const stageData = values && stageLocalData(values);

    const response = await createEvent({
      variables: {
        eventData: stageData,
        token: session?.accessToken,
      },
    });

    if (response.data.createEvent.status === 200) {
      setCreated(true);
    }
  };

  // Move between tabs in edit mode
  const setTab = async tab => {
    const stepDetails: any = schema.find(o => o.index === steps[values.serviceType][step - 1]);

    try {
      if (tab < step) {
        setStep(tab);
        setCreated(false);
        setEdited(false);
      } else {
        await stepDetails?.schema?.validate(
          stepDetails.fields.reduce((obj, key) => ({...obj, [key]: values[key]}), {}),
          {abortEarly: false}
        );
        setStep(tab);
        setCreated(false);
        setEdited(false);
      }
      setStepName(steps[values.serviceType][tab - 1]);
    } catch (err) {
      if (err.message === 'service_slug_exists') {
        setFieldError('serviceSlug', t(err.message));
      } else {
        stepDetails?.fields.forEach(field => {
          const fieldError = err.inner.find(o => o.path === field);
          if (fieldError) setFieldError(field, fieldError.message);
        });
      }
    }
  };

  function moveTo(_stepName: IStepNames) {
    setStepName(_stepName);
    setStep(Object.values(steps[values.serviceType]).indexOf(_stepName) + 1);
  }

  // Move between steps with validation
  const move = async (action, update, setTabStep = 0) => {
    let stepDetails: any;

    try {
      if (values?.serviceType) {
        stepDetails = schema.find(o => o.index === steps[values.serviceType][step - 1]);
      } else {
        stepDetails = schema.find(o => o.index === 'ServiceType');
      }
      if (action === 'back' && step > 1) {
        if (
          steps[values.serviceType][step - (mode === 'create' ? 1 : 2)] === 'Charity' &&
          values.servicePaid === 'no'
        ) {
          setStepName(
            steps[values.serviceType][
              Object.values(steps[values.serviceType]).indexOf('ServicePayment')
            ]
          );
          setStep(Object.values(steps[values.serviceType]).indexOf('ServicePayment'));
        } else {
          setStepName(steps[values.serviceType][step - 2]);
          setStep(step - 1);
        }
      }

      if (stepName === 'Availability') {
        const filter = el => el !== undefined;
        if (Object.values(values.ValidationAvailabilityDays).filter(filter).length > 0) return;
      }

      if (action === 'preview' && mode === 'create') {
        if (stepName === 'ServicePayment') {
          stepDetails = schema.find(o => o.index === 'ServicePayment');
        }

        if (values.servicePaid === 'yes') {
          if (step === 3) {
            if (values.servicePayMethod === 'escrow' && values.serviceCurrency !== '$') {
              throw new Error('service_escrow_dollar');
            }

            if (values.servicePayMethod === 'escrow') {
              if (!user?.escrowAccount) {
                throw new Error('no_escrow_account');
              }
            }
            if (values.servicePayMethod === 'direct') {
              if (!user?.directAccount) {
                throw new Error('no_direct_account');
              }
            }
          }
        }

        await stepDetails?.schema?.validate(
          stepDetails.fields.reduce((obj, key) => ({...obj, [key]: values[key]}), {}),
          {abortEarly: false}
        );

        setTab(
          Object.values(steps[values.serviceType]).indexOf('Summary') + (mode === 'create' ? 1 : 0)
        );
        setStepName('Summary');
        setmoreOptions(false);
      }

      if (action === 'setTabStep') {
        await stepDetails?.schema?.validate(
          stepDetails.fields.reduce((obj, key) => ({...obj, [key]: values[key]}), {}),
          {abortEarly: false}
        );

        setStepName(steps[values.serviceType][setTabStep - (mode === 'create' ? 0 : 1)]);
        setTab(setTabStep);
      }

      if (action === 'overBack') {
        await stepDetails?.schema?.validate(
          stepDetails.fields.reduce((obj, key) => ({...obj, [key]: values[key]}), {}),
          {abortEarly: false}
        );
        setStepName('ServicePayment');
        setStep(Object.values(steps[values.serviceType]).indexOf('ServicePayment') + 1);
      }
      if (action === 'moreOption') {
        setTab(Object.values(steps[values.serviceType]).indexOf('Charity'));
      }

      if (action === 'next') {
        await stepDetails?.schema?.validate(
          stepDetails.fields.reduce((obj, key) => ({...obj, [key]: values[key]}), {}),
          {abortEarly: false}
        );

        if (stepName === 'ServiceDetails') {
          if (values.serviceSlug !== values.serviceSlugOld) {
            const response = await checkSlug({
              variables: {slug: values.serviceSlug, token: session?.accessToken},
              fetchPolicy: 'network-only',
            });

            console.log(response);
            if (response.data.getEventSlug.eventSlugCheck === true && !update) {
              throw new Error('service_slug_exists');
            }
            setFieldValue('serviceSlugOld', values.serviceSlug);
          }
        }
        if (stepName === 'ServicePayment') {
          if (values.servicePayMethod === 'escrow' && values.serviceCurrency !== '$') {
            throw new Error('service_escrow_dollar');
          }

          if (values.servicePayMethod === 'escrow') {
            if (!user?.escrowAccount) {
              throw new Error('no_escrow_account');
            }
          }
          if (values.servicePayMethod === 'direct') {
            if (!user?.directAccount) {
              throw new Error('no_direct_account');
            }
          }
        }
        await stepDetails?.schema?.validate(
          stepDetails.fields.reduce((obj, key) => ({...obj, [key]: values[key]}), {}),
          {abortEarly: false}
        );
        if (!update) {
          setStepName(steps[values.serviceType][step]);
          setStep(step + 1);
          step >= 3 && setmoreOptions(true);
          if (step + 1 > max) setMaxStep(step + 1);
        } else {
          // edit event service
          const stageData = values && stageLocalData(values);

          const response = await editEvent({
            variables: {
              documentId: sid,
              eventData: stageData,
              token: session?.accessToken,
            },
          });

          if (response.data.editEvent.status === 200) {
            setEdited(true);
            setStep(Object.values(steps[values.serviceType]).indexOf('Summary'));
            setStepName('Summary');
            setmoreOptions(false);
          }
        }
        if (step === 3 && values.servicePaid === 'no' && !update) {
          setFieldValue('serviceDonate', 'no');
          if (step === 3) setmoreOptions(true);
          setStepName(steps[values.serviceType][step + 1]);
          setStep(step + 2);

          if (step + 2 > max) setMaxStep(step + 2);
        } else if (step === 3 && values.servicePaid === 'no' && update) {
          setFieldValue('serviceDonate', 'no');
        }
      }
    } catch (err) {
      if (err.message === 'service_slug_exists') {
        setFieldError('serviceSlug', t(`common:${err.message}`));
      } else if (err.message === 'service_escrow_dollar') {
        setFieldError('servicePayMethod', t(`common:${err.message}`));
      } else if (err.message === 'no_escrow_account') {
        setFieldError('servicePayMethod', t(`common:${err.message}`));
      } else if (err.message === 'no_direct_account') {
        setFieldError('servicePayMethod', t(`common:${err.message}`));
      } else {
        stepDetails?.fields.forEach(field => {
          const fieldError = err.inner.find(o => o.path === field);
          if (fieldError) setFieldError(field, fieldError.message);
        });
      }
    }
  };

  const submitEditService = async () => {
    move('next', true);
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', async () => {
      router.reload();
    });
  }, [router.events]);

  if (loading) {
    return (
      <PostLoginLayout>
        <Header
          crumbs={crumbs}
          heading={`${mode === 'create' ? tpage('Add Event') : tpage('Edit Event')}`}
        />
        <SecLoader />
      </PostLoginLayout>
    );
  }

  return (
    <PostLoginLayout className='pb-28 mb-10'>
      <Head>
        <title>
          {mode === 'create' ? 'Create' : 'Edit'} {tpage('Events')}
        </title>
      </Head>

      <Header
        crumbs={crumbs}
        heading={`${mode === 'create' ? tpage('Add Event') : tpage('Edit Event')}`}
      />

      {moreOptions && (
        <MoreOptions
          editServiceLoading={editEventLoading}
          submitEditService={submitEditService}
          edited={edited}
          mode={mode}
          move={move}
        />
      )}

      {moreOptions && (
        <EditBar
          disabled={['Charity', 'Availability']}
          serviceType={serviceType}
          step={step}
          move={move}
          setStep={setTab}
          mode={mode}
          max={max}
        />
      )}

      <div className={classNames(['relative border-gray-200 duration-800'])}>
        {values && (
          <>
            <Transition step={step} show={stepName === 'ServiceDetails'}>
              <EventDetails
                values={values}
                serviceType={serviceType}
                noBack={['MEETING', 'FREELANCING_WORK', 'EVENT'].includes(`${stepType}`)}
                handleChange={handleChange}
                editServiceLoading={editEventLoading}
                submitEditService={submitEditService}
                setValue={setFieldValue}
                errors={errors}
                move={move}
                step={step}
                mode={mode}
              />
            </Transition>

            <Transition step={step} show={stepName === 'ServicePayment'}>
              <ServicePayment
                servicePayMethod={values.servicePayMethod}
                serviceCurrency={values.serviceCurrency}
                editServiceLoading={editEventLoading}
                submitEditService={submitEditService}
                serviceType={values.serviceType}
                servicePaid={values.servicePaid}
                serviceFee={values.serviceFee}
                isOrg={false}
                handleChange={handleChange}
                setValue={setFieldValue}
                stepName={stepName}
                errors={errors}
                move={move}
                step={step}
                mode={mode}
              />
            </Transition>

            <Transition step={step} show={stepName === 'Security'}>
              <ServiceSecurity
                editServiceLoading={editEventLoading}
                submitEditService={submitEditService}
                authenticationType={values.authenticationType}
                serviceType={values.serviceType}
                handleChange={setFieldValue}
                values={values}
                errors={errors}
                stype={stype}
                move={move}
                step={step}
                mode={mode}
              />
            </Transition>

            <Transition step={step} show={stepName === 'Availability'}>
              <ServiceAvailability
                serviceType={serviceType}
                serviceAvailability={values.serviceAvailability}
                availabilityDays={values.availabilityDays}
                meetingDuration={values.serviceDuration}
                ValidationAvailabilityDays={values.ValidationAvailabilityDays}
                handleChange={setFieldValue}
                setFieldError={setFieldError}
                errors={errors}
                move={move}
              />
            </Transition>

            <Transition step={step} show={stepName === 'Questions'}>
              <ServiceQuestions
                serviceType={serviceType}
                serviceQuestions={values.serviceQuestions}
                serviceQuestionsList={values.serviceQuestionsList}
                errors={errors}
                handleChange={setFieldValue}
                setErrors={setFieldError}
                move={move}
              />
            </Transition>

            <Transition step={step} show={stepName === 'Media'}>
              <ServiceMedia
                serviceType={serviceType}
                setErrors={setFieldError}
                serviceImage={values.serviceImage}
                handleChange={setFieldValue}
              />
            </Transition>

            <Transition step={step} show={stepName === 'Summary' && !created && !edited}>
              <ServiceSummary
                values={values}
                submitService={() => submitService()}
                createServiceLoading={createEventLoading}
                createOrgServiceLoading={false}
                serviceType={serviceType}
                moveTo={moveTo}
                move={move}
                setmoreOptions={setmoreOptions}
              />
            </Transition>

            <Transition step={step} show={created}>
              <div className='flex flex-col items-center justify-center'>
                <CheckBadgeIcon className='w-12 h-12 text-lime-600' />
                <h3 className='text-xl font-medium mt-4 text-gray-600'>
                  {t('service_added_title')}
                </h3>
                <p className='w-1/2 mt-2 text-center text-lg text-gray-500'>
                  {t('service_added_description')}
                </p>
                <div className='flex gap-4 mt-4'>
                  <Button
                    onClick={() => router.push(`/${user?.username}/events/${values.serviceSlug}`)}
                    variant='solid'
                  >
                    {t('event_preview')}
                  </Button>
                  <Button
                    onClick={() => router.push('/user/events/organizing-events')}
                    variant='outline'
                  >
                    {t('go_to_events')}
                  </Button>
                </div>
              </div>
            </Transition>

            <Transition step={step} show={edited}>
              <div className='flex flex-col items-center justify-center'>
                <CheckBadgeIcon className='w-12 h-12 text-lime-600' />
                <h3 className='text-xl font-medium mt-4 text-gray-600'>
                  {t('event_updated_title')}
                </h3>
                <p className='w-1/2 mt-2 text-center text-lg text-gray-500'>
                  {t('event_updated_description')}
                </p>
                <div className='flex gap-4 mt-4'>
                  <Button
                    onClick={() => router.push(`/${user?.username}/events/${values.serviceSlug}`)}
                    variant='solid'
                  >
                    {t('event_preview')}
                  </Button>
                  <Button
                    onClick={() => router.push('/user/events/organizing-events')}
                    variant='outline'
                  >
                    {t('go_to_events')}
                  </Button>
                </div>
              </div>
            </Transition>
          </>
        )}
      </div>
    </PostLoginLayout>
  );
};

export default AddEvent;
AddEvent.auth = true;
