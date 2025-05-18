import dayjs from 'dayjs';

const getDate = (_date?: any) => {
  const now = _date ? new Date(_date) : new Date();

  return dayjs(now).format('YYYY-MM-DDTHH:mm');
};

export const stageInitialData = () => ({
  serviceTitle: '',
  serviceSlug: '',
  serviceSlugOld: '',
  serviceDuration: 15,
  serviceAttendeeLimit: 100,
  serviceDateTime: getDate(),
  serviceRecurring: 'NOT_RECURRING',
  serviceDescription: '',
  serviceAttendeesMessage: '',
  isPublic: true,
  authenticationType: 'NONE',
  ValidationAvailabilityDays: {},
  serviceType: 'EVENT',
  serviceCurrency: '$',
  serviceCharity: '',
  serviceCharityId: '',
  serviceDonate: 'no',
  servicePaid: 'no',
  servicePercentage: 0,
  servicePayMethod: 'none',
  serviceWhitelist: 'yes',
  serviceBlacklist: 'no',
  serviceFee: 0,
  searchTags: [],
  serviceWhitelistDomains: [],
  serviceBlacklistDomains: [],
  serviceWhitelistEmails: [],
  serviceBlacklistEmails: [],
  serviceQuestions: 'no',
  serviceQuestionsList: [],
  serviceImage: '',
  serviceAvailability: 'no',
  availabilityDays: {
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
  },
});

export const stageLocalData = values => {
  let obj = {};

  obj = {
    serviceType: values.serviceType,
    serviceTitle: values.serviceTitle,
    serviceSlug: values.serviceSlug,
    serviceDescription: values.serviceDescription,
    serviceDuration: values.serviceDuration,
    serviceAttendeeLimit: values.serviceAttendeeLimit,
    serviceDateTime: new Date(values.serviceDateTime).toISOString(),
    serviceRecurring: values.serviceRecurring,
    serviceAttendeesMessage: values.serviceAttendeesMessage,
    searchTags: values.searchTags,
    isPublic: values.isPublic,
    authenticationType: values.authenticationType,
    serviceQuestions: values.serviceQuestions === 'yes',
    serviceQuestionsList:
      values.serviceQuestions === 'yes' ? values.serviceQuestionsList : values.serviceQuestionsList,
    serviceImage: values.serviceImage,
  };

  return obj;
};

export const stageRemoteData = service => {
  if (service) {
    return {
      serviceType: service.serviceType,
      serviceTitle: service.serviceTitle,
      serviceSlug: service.serviceSlug,
      serviceSlugOld: service.serviceSlug,
      serviceDescription: service.serviceDescription,
      serviceDuration: service.serviceDuration,
      serviceAttendeeLimit: service.serviceAttendeeLimit,
      serviceDateTime: getDate(service.serviceDateTime),
      serviceRecurring: service.serviceRecurring,
      serviceAttendeesMessage: service.serviceAttendeesMessage,
      searchTags: service.searchTags || [],
      isPublic: service.isPublic,
      authenticationType: service.authenticationType || 'NONE',
      servicePaid: 'no',
      serviceFee: 0,
      serviceCurrency: '$',
      serviceCharity: '',
      serviceCharityId: '',
      serviceDonate: 'no',
      servicePercentage: 0,
      servicePayMethod: 'none',
      ValidationAvailabilityDays: {},
      serviceWhitelist: 'no',
      serviceBlacklist: 'no',
      serviceWhitelistDomains: [],
      serviceBlacklistDomains: [],
      serviceWhitelistEmails: [],
      serviceBlacklistEmails: [],
      serviceQuestions:
        service.serviceQuestionsList && service.serviceQuestionsList.length > 0 ? 'yes' : 'no',
      serviceQuestionsList: service.serviceQuestionsList.map(
        ({__typename, ...keepAttrs}) => keepAttrs
      ),
      serviceImage: service.serviceImage,
      serviceAvailability: 'no',
      availabilityDays: {
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
      },
    };
  }
  return null;
};
