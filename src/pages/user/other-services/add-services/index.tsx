import {useFormik} from 'formik';
import {useContext, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {SERVICE_TYPES} from 'constants/enums';

import Header from '@components/header';
import Button from '@components/button';
import PostLoginLayout from '@components/layout/post-login';

import ServiceType from '@features/services/service-form/service-type';
import ServiceDetails from '@features/services/service-form/service-details';
import ServiceSecurity from '@root/features/services/service-form/service-security';
import ServicePayment from '@root/features/services/service-form/service-payment';
import ServiceCharity from '@root/features/services/service-form/service-charity';
// import ServiceBlacklist from '@root/features/services/service-form/service-blacklist';
// import ServiceWhitelist from '@root/features/services/service-form/service-whitelist';
import ServiceQuestions from '@root/features/services/service-form/service-questions';
import ServiceAvailability from '@root/features/services/service-form/service-availability';
import MoreOptions from '@root/features/services/service-form/more-options';

import Transition from '@features/services/service-form/transition';
import schema, {IStepNames, steps} from '@features/services/service-form/schema';
import ServiceMedia from '@root/features/services/service-form/service-media';
import {
  stageInitialData,
  stageLocalData,
  stageRemoteData,
} from '@root/features/services/service-form/stage-data';
import {CheckBadgeIcon} from '@heroicons/react/20/solid';
import SecLoader from 'components/shared/Loader/Loader';
import EditBar from '@root/features/services/service-form/edit-bar';
import useTranslation from 'next-translate/useTranslation';
import ServiceSummary from '@root/features/services/service-form/service-summary';
import {UserContext} from '@root/context/user';

import mutations from 'constants/GraphQL/Service/mutations';
import orgMutations from 'constants/GraphQL/Organizations/mutations';
import queries from 'constants/GraphQL/Service/queries';
import {OrgError, OrgExtentionError} from '@root/components/error';
import classNames from 'classnames';
import Head from 'next/head';

import stripeQueries from 'constants/GraphQL/StripeAccount/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import Stripe from 'stripe';
import {GetServerSideProps} from 'next';

const AddService = ({userStripeAccount}) => {
  //
  const {t} = useTranslation('common');
  const {t: tpage} = useTranslation('page');

  const router = useRouter();
  const {mode, stepType, sid, stype} = router.query;
  const {data: session} = useSession();
  const {user, hasOrgExtention, hasOrgServiceCats, hasOrgs} = useContext(UserContext);
  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Other Services'), href: '#'},
    {
      title: tpage(mode === 'create' ? t('add_new_job_post') : t('edit_job_post')),
      href:
        mode === 'create'
          ? `/user/other-services/add-services/?mode=${mode}`
          : `/user/other-services/add-services/?mode=${mode}&sid=${sid}`,
    },
  ];

  // Queries & Mutation
  const [checkSlug] = useLazyQuery(queries.getServiceSlug);
  const [createService, {loading: createServiceLoading}] = useMutation(mutations.createService);
  const [createOrgService, {loading: createOrgServiceLoading}] = useMutation(
    orgMutations.createOrganizationService
  );
  const [editService, {loading: editServiceLoading}] = useMutation(mutations.editService);
  const [editOrgService, {loading: editOrgServiceLoading}] = useMutation(
    orgMutations.EditOrganizationService
  );
  const {data: currentServiceData, loading} = useQuery(queries.getServiceById, {
    variables: {documentId: sid, token: session?.accessToken},
    skip: sid === undefined,
    fetchPolicy: 'network-only',
  });

  // Local State
  const [step, setStep] = useState(mode === 'create' ? 1 : 2);
  const [max, setMaxStep] = useState(1);
  const [created, setCreated] = useState(false);
  const [edited, setEdited] = useState(false);
  const [moreOptions, setmoreOptions] = useState(false);
  const [stepName, setStepName] = useState<IStepNames>(
    mode === 'create' ? 'ServiceType' : 'ServiceDetails'
  );
  const [initialFormValues, setInitialFormValues] = useState(stageInitialData(stype));

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

  useEffect(() => {
    if (stype === 'organization') {
      setInitialFormValues(stageInitialData(stype));
    }
  }, [stype, values.serviceType]);

  // Set initial values state
  useEffect(() => {
    if (currentServiceData && currentServiceData.getServiceById.serviceData && mode === 'edit') {
      setInitialFormValues(stageRemoteData(currentServiceData.getServiceById.serviceData)!);
    }
  }, [currentServiceData]);

  // Create service submission
  const submitService = async () => {
    const stageData = values && stageLocalData(values, stype);
    let response;
    if (stype === 'organization') {
      response = await createOrgService({
        variables: {
          organizationServiceData: stageData,
          token: session?.accessToken,
        },
      });
      if (response.data.createOrganizationService.status === 200) {
        setCreated(true);
      }
    } else {
      response = await createService({
        variables: {
          serviceData: stageData,
          token: session?.accessToken,
        },
      });
      if (response.data.createService.status === 200) {
        setCreated(true);
      }
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

            if (response.data.getServiceSlug.serviceSlugCheck === true && !update) {
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
          const stageData = values && stageLocalData(values, stype);
          let response;
          if (stype === 'organization') {
            response = await editOrgService({
              variables: {
                documentId: sid,
                serviceData: stageData,
                token: session?.accessToken,
              },
            });
            if (response.data.editOrgService.status === 200) {
              setEdited(true);
              setStep(Object.values(steps[values.serviceType]).indexOf('Summary'));
              setStepName('Summary');
              setmoreOptions(false);
            }
          } else {
            response = await editService({
              variables: {
                documentId: sid,
                serviceData: stageData,
                token: session?.accessToken,
              },
            });
            if (response.data.editService.status === 200) {
              setEdited(true);
              setStep(Object.values(steps[values.serviceType]).indexOf('Summary'));
              setStepName('Summary');
              setmoreOptions(false);
            }
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

      if (action === 'save') {
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

            if (response.data.getServiceSlug.serviceSlugCheck === true && !update) {
              throw new Error('service_slug_exists');
            }
            setFieldValue('serviceSlugOld', values.serviceSlug);
          }
        }
        await stepDetails?.schema?.validate(
          stepDetails.fields.reduce((obj, key) => ({...obj, [key]: values[key]}), {}),
          {abortEarly: false}
        );
        await submitService();
        setStep(Object.values(steps[values.serviceType]).indexOf('Summary'));
        setmoreOptions(false);
        setStepName('Summary');
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
    if (['MEETING', 'FREELANCING_WORK'].includes(`${stepType}`)) {
      setFieldValue('serviceType', stepType);
      move('next', false);
    }
  }, [loading, !values.serviceType && sid]);

  useEffect(() => {
    router.events.on('routeChangeComplete', async () => {
      router.reload();
    });
  }, [router.events]);

  if (loading || (!values.serviceType && sid)) {
    return (
      <PostLoginLayout>
        <Header
          crumbs={crumbs}
          heading={`${mode === 'create' ? t('add_new_job_post') : t('edit_job_post')}`}
        />
        <SecLoader />
      </PostLoginLayout>
    );
  }

  if (!hasOrgExtention && stype === 'organization') {
    return (
      <PostLoginLayout>
        <Header
          crumbs={crumbs}
          heading={`${mode === 'create' ? t('add_new_job_post') : t('edit_job_post')}`}
        />
        <OrgExtentionError router={router} />
      </PostLoginLayout>
    );
  }

  if ((!hasOrgServiceCats && stype === 'organization') || (!hasOrgs && stype === 'organization')) {
    return (
      <PostLoginLayout>
        <Header
          crumbs={crumbs}
          heading={`${mode === 'create' ? t('add_new_job_post') : t('edit_job_post')}`}
        />
        <OrgError router={router} />
      </PostLoginLayout>
    );
  }

  const serviceType = (function (serviceTypeArg: string) {
    switch (serviceTypeArg) {
      case SERVICE_TYPES.MEETING:
        return t(SERVICE_TYPES.MEETING);
      case SERVICE_TYPES.FREELANCING_WORK:
        return t(SERVICE_TYPES.FREELANCING_WORK);
      case SERVICE_TYPES.FULL_TIME_JOB:
        return t(SERVICE_TYPES.FULL_TIME_JOB);
      case SERVICE_TYPES.PART_TIME_JOB:
        return t(SERVICE_TYPES.PART_TIME_JOB);
      default:
        return serviceTypeArg;
    }
  })(values?.serviceType);

  return (
    <PostLoginLayout className='pb-28 mb-10'>
      <Head>
        <title>
          {mode === 'create' ? 'Create' : 'Edit'} {t('Services')}
        </title>
      </Head>
      <Header
        crumbs={crumbs}
        heading={`${mode === 'create' ? t('add_new_job_post') : t('edit_job_post')} ${serviceType}`}
      />
      {moreOptions && (
        <MoreOptions
          editOrgServiceLoading={editOrgServiceLoading}
          editServiceLoading={editServiceLoading}
          submitEditService={submitEditService}
          edited={edited}
          mode={mode}
          move={move}
        />
      )}
      {moreOptions && (
        <EditBar
          disabled={values.servicePaid === 'yes' ? [] : ['Charity']}
          serviceType={values.serviceType}
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
            <Transition step={step} show={stepName === 'ServiceType'}>
              <ServiceType
                orgServiceCategory={values.orgServiceCategory}
                editOrgServiceLoading={editOrgServiceLoading}
                organizationName={values.organizationName}
                editServiceLoading={editServiceLoading}
                organizationId={values.organizationId}
                submitEditService={submitEditService}
                serviceType={values.serviceType}
                handleChange={setFieldValue}
                otherServices={true}
                errors={errors}
                stype={stype}
                move={move}
                step={step}
                mode={mode}
              />
            </Transition>
            <Transition step={step} show={stepName === 'ServiceDetails'}>
              <ServiceDetails
                createServiceLoading={createServiceLoading}
                serviceDescription={values.serviceDescription}
                editOrgServiceLoading={editOrgServiceLoading}
                meetingAttendees={values.meetingAttendees}
                meetingDuration={values.meetingDuration}
                meetingRecurring={values.meetingRecurring}
                editServiceLoading={editServiceLoading}
                submitEditService={submitEditService}
                serviceTitle={values.serviceTitle}
                serviceSlug={values.serviceSlug}
                meetingType={values.meetingType}
                serviceType={values.serviceType}
                isPrivate={values.isPrivate}
                noBack={['MEETING', 'FREELANCING_WORK'].includes(`${stepType}`)}
                dueDate={values.dueDate}
                searchTags={values.searchTags}
                handleChange={handleChange}
                setValue={setFieldValue}
                errors={errors}
                move={move}
                step={step}
                mode={mode}
              />
            </Transition>
            <Transition step={step} show={stepName === 'ServicePayment'}>
              <ServicePayment
                editOrgServiceLoading={editOrgServiceLoading}
                servicePayMethod={values.servicePayMethod}
                serviceCurrency={values.serviceCurrency}
                editServiceLoading={editServiceLoading}
                submitEditService={submitEditService}
                userStripeAccount={userStripeAccount}
                serviceType={values.serviceType}
                servicePaid={values.servicePaid}
                serviceFee={values.serviceFee}
                isOrg={values.isOrgService}
                handleChange={handleChange}
                setValue={setFieldValue}
                stepName={stepName}
                errors={errors}
                move={move}
                step={step}
                mode={mode}
                hasPaidMeetingExtension={undefined}
              />
            </Transition>

            <Transition step={step} show={stepName === 'Charity'}>
              <ServiceCharity
                serviceCharity={values.serviceCharity}
                servicePercentage={values.servicePercentage}
                serviceDonate={values.serviceDonate}
                handleChange={setFieldValue}
                errors={errors}
                move={move}
                step={step}
                mode={mode}
              />
            </Transition>

            <Transition step={step} show={stepName === 'Security'}>
              <ServiceSecurity
                editOrgServiceLoading={editOrgServiceLoading}
                editServiceLoading={editServiceLoading}
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
                serviceAvailability={values.serviceAvailability}
                availabilityDays={values.availabilityDays}
                handleChange={setFieldValue}
                setFieldError={setFieldError}
                errors={errors}
                ValidationAvailabilityDays={values.ValidationAvailabilityDays}
                move={move}
                meetingDuration={values.meetingDuration}
              />
            </Transition>

            {/* <Transition step={step} show={stepName === 'Whitelist'}>
              <ServiceWhitelist
                serviceBlacklist={values.serviceBlacklist}
                serviceBlacklistDomains={values.serviceBlacklistDomains}
                serviceBlacklistEmails={values.serviceBlacklistEmails}
                serviceWhitelist={values.serviceWhitelist}
                serviceWhitelistDomains={values.serviceWhitelistDomains}
                serviceWhitelistEmails={values.serviceWhitelistEmails}
                handleChange={setFieldValue}
                errors={errors}
                move={move}
              />
            </Transition> */}
            {/* <Transition step={step} show={stepName === 'Blacklist'}>
              <ServiceBlacklist
                serviceBlacklist={values.serviceBlacklist}
                serviceBlacklistDomains={values.serviceBlacklistDomains}
                serviceBlacklistEmails={values.serviceBlacklistEmails}
                serviceWhitelist={values.serviceWhitelist}
                serviceWhitelistDomains={values.serviceWhitelistDomains}
                serviceWhitelistEmails={values.serviceWhitelistEmails}
                handleChange={setFieldValue}
                errors={errors}
                move={move}
              />
            </Transition> */}

            <Transition step={step} show={stepName === 'Questions'}>
              <ServiceQuestions
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
                setErrors={setFieldError}
                serviceImage={values.serviceImage}
                handleChange={setFieldValue}
              />
            </Transition>

            <Transition step={step} show={stepName === 'Summary' && !created && !edited}>
              <ServiceSummary
                values={values}
                submitService={() => submitService()}
                createServiceLoading={createServiceLoading}
                createOrgServiceLoading={createOrgServiceLoading}
                serviceType={values.serviceType}
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
                    onClick={() => router.push(`/${user?.username}/${values.serviceSlug}`)}
                    variant='solid'
                  >
                    {t('service_preview')}
                  </Button>
                  <Button
                    onClick={() => router.push('/user/other-services/all-services')}
                    variant='outline'
                  >
                    {t('go_to_services')}
                  </Button>
                </div>
              </div>
            </Transition>

            <Transition step={step} show={edited}>
              <div className='flex flex-col items-center justify-center'>
                <CheckBadgeIcon className='w-12 h-12 text-lime-600' />
                <h3 className='text-xl font-medium mt-4 text-gray-600'>
                  {t('service_updated_title')}
                </h3>
                <p className='w-1/2 mt-2 text-center text-lg text-gray-500'>
                  {t('service_updated_description')}
                </p>
                <div className='flex gap-4 mt-4'>
                  <Button
                    onClick={() => router.push(`/${user?.username}/${values.serviceSlug}`)}
                    variant='solid'
                  >
                    {t('service_preview')}
                  </Button>
                  <Button
                    onClick={() => router.push('/user/other-services/all-services')}
                    variant='outline'
                  >
                    {t('go_to_services')}
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

export default AddService;
AddService.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    const router = context.resolvedUrl;

    const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
      apiVersion: '2020-08-27',
    });

    if (!session) {
      return {
        redirect: {
          destination: `/auth/login?url=${router}`,
          permanent: false,
        },
      };
    }

    const {data: stripeAccountRes} = await graphqlRequestHandler(
      stripeQueries.getStripeAccount,
      {},
      session?.accessToken
    );

    const stripeAccountId = stripeAccountRes?.data?.getStripeAccount?.stripeAccountData?.accountId;

    let userStripeAccount: Stripe.Response<Stripe.Account> | undefined;
    if (stripeAccountId) {
      userStripeAccount = await stripe.accounts.retrieve(stripeAccountId);
    }

    return {
      props: {
        userStripeAccount: userStripeAccount || null,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
