import {CheckIcon, ChevronLeftIcon, ClipboardDocumentListIcon} from '@heroicons/react/24/outline';
import {useContext, useState} from 'react';
import StepHeader from '@features/services/service-form/step-header';
import useTranslation from 'next-translate/useTranslation';
import Button from '@root/components/button';
import Loader from '@root/components/loader';
import classNames from 'classnames';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import sanitizeHtml from 'sanitize-html';
import {UserContext} from '@root/context/user';
import Section, {MiniSection, TimeSection} from './section';
import {IProps} from './constants';

dayjs.extend(duration);

export default function ServiceSummary({
  values,
  submitService,
  createServiceLoading,
  serviceType,
  createOrgServiceLoading,
  moveTo,
  move,
  setmoreOptions,
}: IProps) {
  //
  const {user} = useContext(UserContext);
  const [mouseEnter, setmouseEnter] = useState(false);
  const {t} = useTranslation('common');
  setmoreOptions(false);

  const authenticationTypes = {
    NONE: 'no_authentication_required',
    VERIFIED_ONLY: 'verified_only',
    PRE_APPROVED: 'only_pre-approved_users',
  };

  const title = serviceType === 'EVENT' ? 'event_summary_title' : 'summary_title';
  const description = serviceType === 'EVENT' ? 'event_summary_description' : 'summary_description';
  const btnLabel = serviceType === 'EVENT' ? 'submit_event' : 'submit_service';

  return (
    <>
      <StepHeader
        question={t(title)}
        description={t(description)}
        icon={<ClipboardDocumentListIcon className='w-6 h-6' />}
      />

      <div className='flex gap-4 mb-8'>
        <Button
          size=''
          variant='ghost'
          onClick={() => {
            move('overBack', false);
          }}
        >
          <ChevronLeftIcon className='mr-4 h-5 w-5 text-gray-500' aria-hidden='true' />
          {t('go_back')}
        </Button>
        <Button
          onClick={submitService}
          onMouseEnter={() => {
            setmouseEnter(true);
          }}
          onMouseLeave={() => {
            setmouseEnter(false);
          }}
          variant='solid'
        >
          {createServiceLoading || createOrgServiceLoading ? (
            <Loader color={mouseEnter ? '#00a3fe' : '#fff'} />
          ) : (
            <>
              <CheckIcon
                className={classNames([
                  'mr-2 h-5 w-5',
                  mouseEnter ? 'text-mainBlue' : 'text-white',
                ])}
                aria-hidden='true'
              />
              {t(btnLabel)}
            </>
          )}
        </Button>
      </div>

      {/* <Section
        setStep={() => {
          moveTo!('ServiceType');
        }}
        title={t('service_structure')}
        content={
          <>
            <MiniSection title={t('service_type')} content={t(values.serviceType)} />
            {values.isOrgService && (
              <>
                <MiniSection title={t('organization')} content={values.OrganizationName} />
                <MiniSection
                  title={t('org_service_category')}
                  content={values.orgServiceCategory}
                />
              </>
            )}
          </>
        }
      /> */}

      <Section
        setStep={() => {
          moveTo!('ServiceDetails');
        }}
        title={t('service_details')}
        content={
          <div>
            <MiniSection title={t('service_title')} content={values.serviceTitle} />
            <MiniSection
              title={t('service_url')}
              content={<p>{`https://30mins.com/${user?.username}/${values.serviceSlug}`}</p>}
            />

            {values.serviceType === 'MEETING' && (
              <>
                <MiniSection title={t('meeting_duration')} content={values.meetingDuration} />
                <MiniSection
                  title={t('meeting_type')}
                  content={values.meetingType.map(type => (
                    <span key={type} className='mr-4'>
                      {t(type)}
                    </span>
                  ))}
                />
                <MiniSection title={t('meeting_attendees')} content={values.meetingAttendees} />
              </>
            )}

            {values.serviceType === 'EVENT' && (
              <>
                <MiniSection title={t('meeting_duration')} content={values.serviceDuration} />
                <MiniSection title={t('attendee_limit')} content={values.serviceAttendeeLimit} />
                <MiniSection
                  title={t('message_to_attendees')}
                  content={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(values.serviceAttendeesMessage),
                      }}
                    />
                  }
                />
              </>
            )}

            <MiniSection
              title={t('service_description')}
              content={
                <span dangerouslySetInnerHTML={{__html: sanitizeHtml(values.serviceDescription)}} />
              }
            />

            <MiniSection
              title={t('search_tags')}
              content={
                <span
                  dangerouslySetInnerHTML={{__html: sanitizeHtml(values?.searchTags?.join(', '))}}
                />
              }
            />
          </div>
        }
      />

      {serviceType !== 'EVENT' && (
        <Section
          setStep={() => {
            moveTo!('ServicePayment');
          }}
          title={t('service_payment')}
          content={
            <>
              <MiniSection
                title={t('status')}
                content={values.servicePaid === 'yes' ? t('enabled') : t('disabled')}
              />
              {values.servicePaid === 'yes' && (
                <>
                  <MiniSection
                    title={t('amount')}
                    content={
                      <p className='font-semibold'>{`${values.serviceCurrency}${values.serviceFee}`}</p>
                    }
                  />
                  <MiniSection title={t('payment_method')} content={t(values.servicePayMethod)} />
                </>
              )}
            </>
          }
        />
      )}

      {values.serviceDonate === 'yes' && (
        <Section
          setStep={() => {
            moveTo!('Charity');
          }}
          title={t('service_charity')}
          content={
            <>
              <MiniSection
                title={t('status')}
                content={values.serviceDonate === 'yes' ? t('enabled') : t('disabled')}
              />
              {values.serviceDonate === 'yes' && (
                <>
                  <MiniSection
                    title={t('service_charity_choice')}
                    content={values.serviceCharity}
                  />
                  <MiniSection
                    title={t('service_charity_percentage')}
                    content={`${values.servicePercentage}%`}
                  />
                </>
              )}
            </>
          }
        />
      )}

      {serviceType === 'MEETING' ||
        (serviceType === 'EVENT' && (
          <Section
            setStep={() => {
              moveTo!('Security');
            }}
            title={t('Security')}
            content={
              <>
                <MiniSection
                  title={t('status')}
                  content={t(authenticationTypes[values.authenticationType])}
                />
              </>
            }
          />
        ))}

      {serviceType !== 'FREELANCING_WORK' && serviceType !== 'EVENT' && (
        <Section
          setStep={() => {
            moveTo!('Availability');
          }}
          title={t('service_availability')}
          content={
            <>
              <MiniSection
                title={t('status')}
                content={values.serviceAvailability === 'yes' ? t('enabled') : t('disabled')}
              />
              {values.serviceAvailability === 'yes' && (
                <>
                  <MiniSection
                    title={t('monday')}
                    content={<TimeSection day={values.availabilityDays.monday} />}
                  />
                  <MiniSection
                    title={t('tuesday')}
                    content={<TimeSection day={values.availabilityDays.tuesday} />}
                  />
                  <MiniSection
                    title={t('wednesday')}
                    content={<TimeSection day={values.availabilityDays.wednesday} />}
                  />
                  <MiniSection
                    title={t('thursday')}
                    content={<TimeSection day={values.availabilityDays.thursday} />}
                  />
                  <MiniSection
                    title={t('friday')}
                    content={<TimeSection day={values.availabilityDays.friday} />}
                  />
                  <MiniSection
                    title={t('saturday')}
                    content={<TimeSection day={values.availabilityDays.saturday} />}
                  />
                  <MiniSection
                    title={t('sunday')}
                    content={<TimeSection day={values.availabilityDays.sunday} />}
                  />
                </>
              )}
            </>
          }
        />
      )}
      {/* <Section
        setStep={() => {
          moveTo!('Whitelist');
        }}
        title={t('service_whitelist')}
        content={
          <>
            <MiniSection
              title={t('status')}
              content={values.serviceWhitelist === 'yes' ? t('enabled') : t('disabled')}
            />
            {values.serviceWhitelist === 'yes' && (
              <>
                <MiniSection
                  title={t('whitelist_domains')}
                  content={
                    <div className='flex space-x-2 flex-wrap'>
                      {values.serviceWhitelistDomains.map(domain => (
                        <span
                          key={domain}
                          className='px-4 py-2 border border-gray-200 rounded-full'
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  }
                />
                <MiniSection
                  title={t('whitelist_emails')}
                  content={
                    <div className='flex space-x-2 flex-wrap'>
                      {values.serviceWhitelistEmails.map(email => (
                        <span key={email} className='px-4 py-2 border border-gray-200 rounded-full'>
                          {email}
                        </span>
                      ))}
                    </div>
                  }
                />
              </>
            )}
          </>
        }
      />
      <Section
        setStep={() => {
          moveTo!('Blacklist');
        }}
        title={t('service_blacklist')}
        content={
          <>
            <MiniSection
              title={t('status')}
              content={values.serviceBlacklist === 'yes' ? t('enabled') : t('disabled')}
            />
            {values.serviceBlacklist === 'yes' && (
              <>
                <MiniSection
                  title={t('blacklist_domains')}
                  content={
                    <div className='flex space-x-2 flex-wrap'>
                      {values.serviceBlacklistDomains.map(domain => (
                        <span
                          key={domain}
                          className='px-4 py-2 border border-gray-200 rounded-full'
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  }
                />
                <MiniSection
                  title={t('blacklist_emails')}
                  content={
                    <div className='flex space-x-2 flex-wrap'>
                      {values.serviceBlacklistEmails.map(email => (
                        <span key={email} className='px-4 py-2 border border-gray-200 rounded-full'>
                          {email}
                        </span>
                      ))}
                    </div>
                  }
                />
              </>
            )}
          </>
        }
      /> */}
      <Section
        setStep={() => {
          moveTo!('Questions');
        }}
        title={t('service_questions')}
        content={
          <>
            <MiniSection
              title={t('status')}
              content={values.serviceQuestions === 'yes' ? t('enabled') : t('disabled')}
            />
            <MiniSection
              title={t('questions')}
              wrapperClassName='question-wrapper'
              content={
                <>
                  {values.serviceQuestionsList.map((question, index) => (
                    <div
                      className='flex flex-col p-2 sm:p-6 bg-gray-100 mb-4 last:mb-0 bg-opacity-50'
                      key={index}
                    >
                      <MiniSection
                        title={t('question')}
                        content={question.question}
                        wrapperClassName='question-wrapper'
                      />
                      <MiniSection
                        title={t('question_type')}
                        content={t(question.questionType)}
                        wrapperClassName='question-wrapper'
                      />
                      <MiniSection
                        title={t('required')}
                        content={question.required ? t('yes') : t('no')}
                        wrapperClassName='question-wrapper'
                      />
                      {question.questionType !== 'FREE_TEXT' && (
                        <MiniSection
                          title={t('options')}
                          wrapperClassName='question-wrapper'
                          content={
                            <div className='flex gap-2 flex-wrap'>
                              {question.options.map(option => (
                                <span
                                  key={option}
                                  className='px-4 py-2 border bg-white border-gray-200 rounded-full'
                                >
                                  {option}
                                </span>
                              ))}
                            </div>
                          }
                        />
                      )}
                    </div>
                  ))}
                </>
              }
            />
          </>
        }
      />
      <Section
        setStep={() => {
          moveTo!('Media');
        }}
        title={t('service_image')}
        content={
          values.serviceImage ? (
            <img src={values.serviceImage} alt='' className='w-64 h-64' />
          ) : (
            t('no_image')
          )
        }
      />
    </>
  );
}
