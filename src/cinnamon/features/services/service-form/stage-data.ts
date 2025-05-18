export const stageInitialData = stype => ({
  organizationName: '',
  organizationId: '',
  orgServiceCategory: '',
  isOrgService: stype === 'organization' ? true : false,
  serviceType: stype === 'organization' ? 'MEETING' : '',
  serviceTitle: '',
  serviceSlug: '',
  serviceSlugOld: '',
  serviceDescription: '',
  meetingDuration: 15,
  meetingType: [],
  meetingAttendees: 1,
  meetingRecurring: false,
  servicePaid: 'no',
  serviceFee: 0,
  authenticationType: 'NONE',
  ValidationAvailabilityDays: {},
  dueDate: stype === 'organization' ? undefined : 1,
  serviceCurrency: '$',
  serviceCharity: '',
  serviceCharityId: '',
  serviceDonate: 'no',
  servicePercentage: 0,
  servicePayMethod: 'none',
  serviceWhitelist: 'yes',
  serviceBlacklist: 'no',
  searchTags: [],
  serviceWhitelistDomains: [],
  serviceBlacklistDomains: [],
  serviceWhitelistEmails: [],
  serviceBlacklistEmails: [],
  serviceQuestions: 'no',
  serviceQuestionsList: [],
  serviceImage: '',
  serviceAvailability: 'no',
  isPrivate: false,
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

export const stageLocalData = (values, stype) => {
  let obj = {};
  obj = {
    serviceType: values.serviceType,
    title: values.serviceTitle,
    slug: values.serviceSlug,
    description: values.serviceDescription,
    conferenceType: values.serviceType === 'MEETING' ? values.meetingType : [],
    duration: values.serviceType === 'MEETING' ? values.meetingDuration : 0,
    attendeeLimit: values.serviceType === 'MEETING' ? values.meetingAttendees : 0,
    isPrivate: values.isPrivate,
    isRecurring: values.meetingRecurring,
    recurringInterval: '',
    authenticationType: values.authenticationType,
    dueDate: values.dueDate,
    isPaid: values.servicePaid === 'yes' ? true : false,
    price: values.servicePaid === 'yes' ? values.serviceFee : 0,
    paymentType: values.servicePayMethod,
    currency: values.serviceCurrency,
    searchTags: values.searchTags,
    charity: values.serviceDonate === 'yes' ? values.serviceCharity : '',
    charityId: values.serviceDonate === 'yes' ? values.serviceCharityId : '',
    percentDonated: values.serviceDonate === 'yes' ? values.servicePercentage : 0,
    serviceWorkingHours: {
      isCustomEnabled: values.serviceAvailability === 'yes' ? true : false,
      sunday: {
        isActive: values.availabilityDays.sunday.isActive,
        availability: values.availabilityDays.sunday.isActive
          ? values.availabilityDays.sunday.hours
          : [],
      },
      monday: {
        isActive: values.availabilityDays.monday.isActive,
        availability: values.availabilityDays.monday.isActive
          ? values.availabilityDays.monday.hours
          : [],
      },
      tuesday: {
        isActive: values.availabilityDays.tuesday.isActive,
        availability: values.availabilityDays.tuesday.isActive
          ? values.availabilityDays.tuesday.hours
          : [],
      },
      wednesday: {
        isActive: values.availabilityDays.wednesday.isActive,
        availability: values.availabilityDays.wednesday.isActive
          ? values.availabilityDays.wednesday.hours
          : [],
      },
      thursday: {
        isActive: values.availabilityDays.thursday.isActive,
        availability: values.availabilityDays.thursday.isActive
          ? values.availabilityDays.thursday.hours
          : [],
      },
      friday: {
        isActive: values.availabilityDays.friday.isActive,
        availability: values.availabilityDays.friday.isActive
          ? values.availabilityDays.friday.hours
          : [],
      },
      saturday: {
        isActive: values.availabilityDays.saturday.isActive,
        availability: values.availabilityDays.saturday.isActive
          ? values.availabilityDays.saturday.hours
          : [],
      },
    },
    blackList: {
      emails: values.serviceBlacklistEmails,
      domains: values.serviceBlacklistDomains,
    },
    whiteList: {
      emails: values.serviceWhitelistEmails,
      domains: values.serviceWhitelistDomains,
    },
    bookingQuestions:
      values.serviceQuestions === 'yes' ? values.serviceQuestionsList : values.serviceQuestionsList,
    image: values.serviceImage,
  };
  if (stype) {
    obj = {
      ...obj,
      organizationName: values.organizationName,
      organizationId: values.organizationId,
      orgServiceCategory: values.orgServiceCategory,
      isOrgService: values.isOrgService,
    };
  }
  return obj;
};

export const stageRemoteData = service => {
  if (service) {
    return {
      serviceType: service.serviceType,
      serviceTitle: service.title,
      serviceSlug: service.slug,
      serviceSlugOld: service.slug,
      serviceDescription: service.description,
      meetingDuration: service.duration,
      meetingType: service.conferenceType,
      meetingAttendees: service.attendeeLimit,
      meetingRecurring: service.isRecurring,
      dueDate: service.dueDate,
      authenticationType: service.authenticationType || 'NONE',
      servicePaid: service.isPaid ? 'yes' : 'no',
      serviceFee: service.price,
      serviceCurrency: service.currency,
      serviceCharity: service.charity,
      serviceCharityId: service.charityId,
      serviceDonate: service.charity && service.charity.length > 0 ? 'yes' : 'no',
      servicePercentage: service.percentDonated,
      servicePayMethod: service.paymentType,
      organizationName: service.organizationName,
      organizationId: service.organizationId,
      ValidationAvailabilityDays: {},
      orgServiceCategory: service.orgServiceCategory,
      isOrgService: service.isOrgService,
      searchTags: service.searchTags || [],
      serviceWhitelist:
        (service.whiteList?.domains && service.whiteList.domains.length > 0) ||
        (service.whiteList?.emails && service.whiteList.emails.length > 0)
          ? 'yes'
          : 'no',
      serviceBlacklist:
        (service.blackList?.domains && service.blackList.domains.length > 0) ||
        (service.blackList?.emails && service.blackList.emails.length > 0)
          ? 'yes'
          : 'no',
      serviceWhitelistDomains: service.whiteList.domains,
      serviceBlacklistDomains: service.blackList.domains,
      serviceWhitelistEmails: service.whiteList.emails,
      serviceBlacklistEmails: service.blackList.emails,
      serviceQuestions:
        service.bookingQuestions && service.bookingQuestions.length > 0 ? 'yes' : 'no',
      serviceQuestionsList: service.bookingQuestions.map(({__typename, ...keepAttrs}) => keepAttrs),
      serviceImage: service.image,
      serviceAvailability: service.serviceWorkingHours.isCustomEnabled ? 'yes' : 'no',
      isPrivate: service.isPrivate,
      availabilityDays: {
        monday: {
          isActive: service.serviceWorkingHours.monday.isActive,
          hours: service.serviceWorkingHours.monday.availability.map(
            ({__typename, ...keepAttrs}) => keepAttrs
          ),
        },
        tuesday: {
          isActive: service.serviceWorkingHours.tuesday.isActive,
          hours: service.serviceWorkingHours.tuesday.availability.map(
            ({__typename, ...keepAttrs}) => keepAttrs
          ),
        },
        wednesday: {
          isActive: service.serviceWorkingHours.wednesday.isActive,
          hours: service.serviceWorkingHours.wednesday.availability.map(
            ({__typename, ...keepAttrs}) => keepAttrs
          ),
        },
        thursday: {
          isActive: service.serviceWorkingHours.thursday.isActive,
          hours: service.serviceWorkingHours.thursday.availability.map(
            ({__typename, ...keepAttrs}) => keepAttrs
          ),
        },
        friday: {
          isActive: service.serviceWorkingHours.friday.isActive,
          hours: service.serviceWorkingHours.friday.availability.map(
            ({__typename, ...keepAttrs}) => keepAttrs
          ),
        },
        saturday: {
          isActive: service.serviceWorkingHours.saturday.isActive,
          hours: service.serviceWorkingHours.saturday.availability.map(
            ({__typename, ...keepAttrs}) => keepAttrs
          ),
        },
        sunday: {
          isActive: service.serviceWorkingHours.sunday.isActive,
          hours: service.serviceWorkingHours.sunday.availability.map(
            ({__typename, ...keepAttrs}) => keepAttrs
          ),
        },
      },
    };
  }
  return null;
};
