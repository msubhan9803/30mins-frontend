import agendaJobsMutations from 'constants/GraphQL/AgendaJobs/mutations';
import dayjs from 'dayjs';
import graphqlRequestHandler from './graphqlRequestHandler';
import {SERVICE_TYPES} from '../constants/enums';
import parseConference from './parseConferenceType';

export default async function scheduleBookingReminders(bookingData: any) {
  const {
    title,
    startTime,
    bookingId,
    bookerName,
    bookerEmail,
    bookerTimeZone,
    bookerLanguage,
    providerTimeZone,
    providerName,
    providerEmail,
    providerLanguage,
    bookerPhone,
    additionalNotes,
    meetingCount,
    price,
    currency,
    paymentType,
    meetingDate,
    percentDonated,
    charity,
    conferenceLink,
    zoomJoinUrl,
    zoomStartUrl,
    zoomPassword,
    endTime,
    meetingDuration,
    ccRecipients,
    providerId,
    serviceType,
    providerAuthCode,
    clientAuthCode,
    smsSettings,
  } = bookingData;
  let {conferenceType} = bookingData;
  conferenceType = parseConference(conferenceType);

  const mutationPayload = {
    title,
    bookingId,
    bookerName,
    bookerEmail,
    bookerTimeZone,
    bookerLanguage,
    providerTimeZone,
    providerName,
    providerEmail,
    providerLanguage,
    bookerPhone,
    additionalNotes,
    meetingCount,
    price,
    currency,
    paymentType,
    meetingDate,
    percentDonated,
    charity,
    conferenceType,
    conferenceLink,
    zoomJoinUrl,
    zoomStartUrl,
    zoomPassword,
    startTime,
    endTime,
    meetingDuration,
    ccRecipients,
    providerId,
    serviceType,
    smsSettings,
  };
  if (serviceType === SERVICE_TYPES.MEETING) {
    const reminder15minTime = dayjs(startTime).subtract(15, 'minute').toDate();
    await graphqlRequestHandler(
      agendaJobsMutations.scheduleAgendaJob,
      {
        agendaJobData: {
          jobName: 'send15MinReminder',
          scheduledDate: reminder15minTime,
          jobData: {...mutationPayload, providerAuthCode, clientAuthCode},
        },
      },
      process.env.BACKEND_API_KEY
    );

    const followUpDateTime = dayjs(endTime).add(15, 'minute').toDate();
    await graphqlRequestHandler(
      agendaJobsMutations.scheduleAgendaJob,
      {
        agendaJobData: {
          jobName: 'sendFollowUpEmail',
          scheduledDate: followUpDateTime,
          jobData: {...mutationPayload, providerAuthCode, clientAuthCode},
        },
      },
      process.env.BACKEND_API_KEY
    );
    if (dayjs(startTime).diff(dayjs(), 'hour') >= 24) {
      const reminder24HrTime = dayjs(startTime).subtract(1, 'day').toDate();
      await graphqlRequestHandler(
        agendaJobsMutations.scheduleAgendaJob,
        {
          agendaJobData: {
            jobName: 'send24HrReminder',
            scheduledDate: reminder24HrTime,
            jobData: {...mutationPayload, providerAuthCode, clientAuthCode},
          },
        },
        process.env.BACKEND_API_KEY
      );
    }
  }

  if (serviceType === SERVICE_TYPES.FREELANCING_WORK) {
    const delay24HrTime = dayjs(endTime).add(1, 'day').toDate();
    await graphqlRequestHandler(
      agendaJobsMutations.scheduleAgendaJob,
      {
        agendaJobData: {
          jobName: 'send24HrDelayedFreelanceReminder',
          scheduledDate: delay24HrTime,
          jobData: mutationPayload,
        },
      },
      process.env.BACKEND_API_KEY
    );

    if (dayjs(startTime).diff(dayjs(), 'hour') >= 24) {
      const reminder24HrTime = dayjs(startTime).subtract(1, 'day').toDate();
      await graphqlRequestHandler(
        agendaJobsMutations.scheduleAgendaJob,
        {
          agendaJobData: {
            jobName: 'send24HrFreelanceReminder',
            scheduledDate: reminder24HrTime,
            jobData: mutationPayload,
          },
        },
        process.env.BACKEND_API_KEY
      );
    }
  }
}
