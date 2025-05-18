import {SERVICE_TYPES} from 'constants/enums';

export type IbookingData = {
  captchaToken: any;
  providerUsername: any;
  dateBooked: any;
  serviceID: any;
  bookerName: any;
  bookerEmail: any;
  bookerLanguage: any;
  providerName: any;
  providerEmail: any;
  bookerPhone?: string;
  bookerNumberVerified: string;
  bookerSmsReminders?: boolean;
  bookerSmsVerified?: boolean;
  bookerTimeZone: any;
  ccRecipients?: [];
  additionalNotes?: string;
  meetingCount: any;
  price: any;
  currency: any;
  attachmentPath?: string;
  paymentType: any;
  paymentAccount: any;
  paymentStatus: any;
  meetingDate: any;
  percentDonated: any;
  charity: any;
  title: any;
  subject?: string;
  conferenceType: any;
  startTime: any;
  endTime: any;
  meetingDuration: any;
  reminders: any;
  chargeID: any;
  attachment: any;
  recurring: any;
  answeredQuestions?: Array<{
    questionType?: any;
    question?: any;
    answer?: any;
    required?: boolean;
    selectedOptions?: Array<any>;
  }>;
};
export type Iuser = {
  couponCode;
  accountDetails: {
    username;
    email;
    avatar;
    createdDate;
    isIndividual;
    accountType;
    verifiedAccount;
    verifiedEmail;
    privateAccount;
    acceptedPaymentTypes;
    allowedConferenceTypes;
    activeExtensions;
    paymentAccounts: {
      direct;
      escrow;
    };
    stripeAccountId;
    smsSettings: {
      phone;
      reminders;
    };
  };
  workingHours: {
    startTime;
    endTime;
    isCustomEnabled;
    monday: {
      availability: {
        start;
        end;
      };
      isActive;
    };
    tuesday: {
      availability: {
        start;
        end;
      };
      isActive;
    };
    wednesday: {
      availability: {
        availability: {
          start;
          end;
        };
        isActive;
      };
      thursday: {
        availability: {
          start;
          end;
        };
        isActive;
      };
      friday: {
        availability: {
          start;
          end;
        };
        isActive;
      };
      saturday: {
        availability: {
          start;
          end;
        };
        isActive;
      };
      sunday: {
        availability: {
          start;
          end;
        };
        isActive;
      };
    };
  };
  personalDetails: {
    name;
    description;
    headline;
    phone;
    website;
    socials: {
      twitter;
      instagram;
      linkedin;
      facebook;
      youtube;
    };
    searchTags;
    profileMediaLink;
    profileMediaType;
  };
  publications: {
    headline;
    url;
    type;
    image;
    description;
  };
  jobHistory: {
    position;
    startDate;
    company;
    current;
    endDate;
    roleDescription;
    employmentType;
    location;
  };
  educationHistory: {
    degree;
    school;
    startDate;
    endDate;
    current;
    graduated;
    additionalInfo;
    extracurricular;
    fieldOfStudy;
  };
  locationDetails: {
    timezone;
    country;
  };
  services: {
    _id;
    serviceType;
    title;
    image;
    slug;
    description;
    duration;
    isPrivate;
    price;
    dueDate;
    currency;
    charity;
    percentDonated;
    recurringInterval;
    conferenceType;
    media: {
      type;
      link;
    };
    bookingQuestions: {
      options;
      question;
      questionType;
      required;
    };
    searchTags;
    paymentType;
    isPaid;
    hasReminder;
    isRecurring;
    attendeeLimit;
    whiteList: {
      domains;
      emails;
    };
    blackList: {
      domains;
      emails;
    };
    serviceWorkingHours: {
      isCustomEnabled;
      monday: {
        availability: {
          start;
          end;
        };
        isActive;
      };
      tuesday: {
        availability: {
          start;
          end;
        };
        isActive;
      };
      wednesday: {
        availability: {
          start;
          end;
        };
        isActive;
      };
      thursday: {
        availability: {
          start;
          end;
        };
        isActive;
      };
      friday: {
        availability: {
          start;
          end;
        };
        isActive;
      };
      saturday: {
        availability: {
          start;
          end;
        };
        isActive;
      };
      sunday: {
        availability: {
          start;
          end;
        };
        isActive;
      };
    };
  };
};

export const Duser = {
  couponCode: null,
  accountDetails: {
    username: null,
    email: null,
    avatar: null,
    createdDate: null,
    isIndividual: null,
    accountType: null,
    verifiedAccount: null,
    verifiedEmail: null,
    privateAccount: null,
    acceptedPaymentTypes: null,
    allowedConferenceTypes: null,
    activeExtensions: null,
    paymentAccounts: {
      direct: null,
      escrow: null,
    },
    stripeAccountId: null,
    smsSettings: {
      phone: '',
      reminders: false,
    },
  },
  workingHours: {
    startTime: null,
    endTime: null,
    isCustomEnabled: null,
    monday: {
      availability: {
        start: null,
        end: null,
      },
      isActive: null,
    },
    tuesday: {
      availability: {
        start: null,
        end: null,
      },
      isActive: null,
    },
    wednesday: {
      availability: {
        availability: {
          start: null,
          end: null,
        },
        isActive: null,
      },
      thursday: {
        availability: {
          start: null,
          end: null,
        },
        isActive: null,
      },
      friday: {
        availability: {
          start: null,
          end: null,
        },
        isActive: null,
      },
      saturday: {
        availability: {
          start: null,
          end: null,
        },
        isActive: null,
      },
      sunday: {
        availability: {
          start: null,
          end: null,
        },
        isActive: null,
      },
    },
  },
  personalDetails: {
    name: null,
    description: null,
    headline: null,
    phone: null,
    website: null,
    socials: {
      twitter: null,
      instagram: null,
      linkedin: null,
      facebook: null,
      youtube: null,
    },
    searchTags: null,
    profileMediaLink: null,
    profileMediaType: null,
  },
  publications: {
    headline: null,
    url: null,
    type: null,
    image: null,
    description: null,
  },
  jobHistory: {
    position: null,
    startDate: null,
    company: null,
    current: null,
    endDate: null,
    roleDescription: null,
    employmentType: null,
    location: null,
  },
  educationHistory: {
    degree: null,
    school: null,
    startDate: null,
    endDate: null,
    current: null,
    graduated: null,
    additionalInfo: null,
    extracurricular: null,
    fieldOfStudy: null,
  },
  locationDetails: {
    timezone: null,
    country: null,
  },
  services: {
    _id: null,
    serviceType: null,
    title: null,
    image: null,
    slug: null,
    description: null,
    duration: null,
    isPrivate: null,
    price: null,
    dueDate: null,
    currency: null,
    charity: null,
    percentDonated: null,
    recurringInterval: null,
    conferenceType: null,
    media: {
      type: null,
      link: null,
    },
    bookingQuestions: {
      options: null,
      question: null,
      questionType: null,
      required: null,
    },
    searchTags: null,
    paymentType: null,
    isPaid: null,
    hasReminder: null,
    isRecurring: null,
    attendeeLimit: null,
    whiteList: {
      domains: null,
      emails: null,
    },
    blackList: {
      domains: null,
      emails: null,
    },
    serviceWorkingHours: {
      isCustomEnabled: null,
      monday: {
        availability: {
          start: null,
          end: null,
        },
        isActive: null,
      },
      tuesday: {
        availability: {
          start: null,
          end: null,
        },
        isActive: null,
      },
      wednesday: {
        availability: {
          start: null,
          end: null,
        },
        isActive: null,
      },
      thursday: {
        availability: {
          start: null,
          end: null,
        },
        isActive: null,
      },
      friday: {
        availability: {
          start: null,
          end: null,
        },
        isActive: null,
      },
      saturday: {
        availability: {
          start: null,
          end: null,
        },
        isActive: null,
      },
      sunday: {
        availability: {
          start: null,
          end: null,
        },
        isActive: null,
      },
    },
  },
};

export const setInitBookingData = (values: {user; serviceData}) => {
  if (values.serviceData.serviceType !== SERVICE_TYPES.ROUND_ROBIN) {
    return {
      providerUsername: values.user.accountDetails.username,
      providerEmail: values.user.accountDetails.email,
      providerName: values.user.personalDetails.name,
      serviceID: values.serviceData._id,
      meetingCount: 0,
      price: values.serviceData.price,
      currency: values.serviceData.currency,
      paymentType: values.serviceData.paymentType,
      charity: values.serviceData.charity,
      conferenceType: values.serviceData.conferenceType[0],
      meetingDuration: values.serviceData.duration,
      reminders: values.serviceData.hasReminder,
      subject: values.serviceData.title,
      answeredQuestions: [{}],
    };
  }
  return {
    serviceID: values.serviceData._id,
    meetingCount: 0,
    price: values.serviceData.price,
    currency: values.serviceData.currency,
    paymentType: values.serviceData.paymentType,
    charity: values.serviceData.charity,
    conferenceType: values.serviceData.conferenceType[0],
    meetingDuration: values.serviceData.duration,
    subject: values.serviceData.title,
    reminders: values.serviceData.hasReminder,
  };
};
