import * as Yup from 'yup';
import dayjs from 'dayjs';
import {FormikErrors} from 'formik';
import {Duser, IbookingData, Iuser} from './stage-data';

const timezone = require('dayjs/plugin/timezone');

dayjs.extend(timezone);

export type Iaction = 'next' | 'back' | 'submit';

const initialValues: IinitialValues = {
  confirmBooking: false,
  selectedTime: '',
  countryCode: 'us',
  selectedBookerTimezone: dayjs.tz.guess(),
  selectedDate: undefined,
  isAvailability: false,
  bookerEmailValid: true,
  buyNow: false,
  PhoneValid: false,
  step: 0,
  user: Duser,
  showCheckoutForm: false,
  recaptchaRef: undefined,
  STEPS: [],
  TYPESERVICE: 'FREE_MEETING_SERVICES',
  clientSecret: undefined,
  questionsSchema: undefined,
  activeTime: false,
  isDateAndTimeSelected: false,
  teamsAvailability: [],
  otpProtected: false,
  authenticationType: '',
  serviceData: {
    _id: '',
    serviceType: '',
    title: '',
    image: '',
    slug: '',
    dueDate: 1,
    description: '',
    duration: 0,
    isPrivate: false,
    otpProtected: false,
    authenticationType: '',
    price: 0,
    currency: '$',
    charity: null,
    percentDonated: null,
    recurringInterval: '',
    conferenceType: [],
    media: {
      type: null,
      link: null,
    },
    bookingQuestions: [],
    searchTags: [],
    paymentType: '',
    isPaid: true,
    hasReminder: false,
    isRecurring: false,
    attendeeLimit: 5,
    whiteList: {
      domains: [],
      emails: [],
    },
    blackList: {
      domains: [],
      emails: [],
    },
    serviceWorkingHours: {
      isCustomEnabled: true,
      monday: {
        availability: [],
        isActive: false,
      },
      tuesday: {
        availability: [],
        isActive: false,
      },
      wednesday: {
        availability: [],
        isActive: false,
      },
      thursday: {
        availability: [],
        isActive: false,
      },
      friday: {
        availability: [],
        isActive: false,
      },
      saturday: {
        availability: [],
        isActive: false,
      },
      sunday: {
        availability: [],
        isActive: false,
      },
    },
  },

  bookingData: {
    captchaToken: null,
    dateBooked: null,
    providerUsername: '',
    serviceID: '',
    bookerName: '',
    bookerEmail: '',
    bookerPhone: undefined,
    bookerSmsReminders: false,
    bookerSmsVerified: false,
    bookerNumberVerified: '',
    bookerLanguage: null,
    providerName: '',
    providerEmail: '',
    bookerTimeZone: null,
    ccRecipients: [],
    additionalNotes: undefined,
    recurring: 0,
    attachmentPath: undefined,
    meetingCount: null,
    price: 0,
    currency: null,
    paymentType: null,
    paymentAccount: null,
    paymentStatus: null,
    meetingDate: null,
    percentDonated: null,
    charity: null,
    title: null,
    subject: undefined,
    conferenceType: '',
    startTime: null,
    endTime: null,
    meetingDuration: null,
    reminders: null,
    chargeID: null,
    answeredQuestions: [],
    attachment: null,
  },
};

export type IServiceData = {
  _id: string;
  serviceType:
    | 'FULL_TIME_JOB'
    | 'PART_TIME_JOB'
    | 'FREELANCING_WORK'
    | 'MEETING'
    | 'ROUND_ROBIN'
    | 'EVENT'
    | '';
  dueDate: number;
  title: string;
  image: string;
  slug: string;
  description: string;
  duration: number;
  otpProtected: boolean;
  authenticationType: string;
  isPrivate: boolean;
  price: number;
  currency: string;
  charity: null;
  percentDonated: null;
  recurringInterval: string;
  conferenceType: Array<string>;
  media: {
    type: null;
    link: null;
  };
  bookingQuestions: Array<{
    options: Array<string>;
    question: string;
    questionType: 'RADIO' | 'CHECKBOX' | 'DROPDOWN' | 'FREE_TEXT';
    required: boolean;
  }>;
  serviceQuestionsList?: Array<{
    options: Array<string>;
    question: string;
    questionType: 'RADIO' | 'CHECKBOX' | 'DROPDOWN' | 'FREE_TEXT';
    required: boolean;
  }>;
  searchTags: [];
  paymentType: string;
  isPaid: boolean;
  hasReminder: boolean;
  isRecurring: boolean;
  attendeeLimit: number;
  whiteList: {
    domains: Array<string>;
    emails: Array<string>;
  };
  blackList: {
    domains: Array<string>;
    emails: Array<string>;
  };
  serviceWorkingHours: {
    isCustomEnabled: boolean;
    monday: {
      availability: Array<{start; end}>;
      isActive: boolean;
    };
    tuesday: {
      availability: Array<{start; end}>;
      isActive: boolean;
    };
    wednesday: {
      availability: Array<{start; end}>;
      isActive: boolean;
    };
    thursday: {
      availability: Array<{start; end}>;
      isActive: boolean;
    };
    friday: {
      availability: Array<{start; end}>;
      isActive: boolean;
    };
    saturday: {
      availability: Array<{start; end}>;
      isActive: boolean;
    };
    sunday: {
      availability: Array<{start; end}>;
      isActive: boolean;
    };
  };
};

export interface IinitialValues {
  selectedDate: any;
  confirmBooking: boolean;
  PhoneValid: boolean;
  bookerEmailValid: boolean;
  countryCode: string;
  otpProtected: boolean;
  authenticationType: string;
  selectedTime: string;
  selectedBookerTimezone: string;
  isAvailability: boolean;
  buyNow: boolean;
  showCheckoutForm: boolean;
  teamsAvailability: Array<{
    availability: any;
    user: any;
    priority: any;
  }>;
  step: number;
  recaptchaRef?: any;
  user: Iuser;
  clientSecret: any;
  STEPS: Array<string>;
  questionsSchema: any;
  TYPESERVICE: ItypeService;
  activeTime: boolean;
  serviceData: IServiceData;
  bookingData: IbookingData;
  isDateAndTimeSelected: boolean;
  [x: string]: any;
}

export type IFormProps = {
  setFieldValue;
  handleChange(e: React.ChangeEvent<any>): void;
  setFieldError: (field: string, value: string | undefined) => void;
  errors: FormikErrors<IinitialValues>;
  values: IinitialValues;
  providerUser: any;
};

export const TabSteps = {
  'contact-info': {title: 'contact-info', status: 'upcoming'},
  'conference-type': {title: 'conference-type', status: 'upcoming'},
  'pre-booking-questions': {title: 'pre-booking-questions', status: 'upcoming'},
  'any-additional-information': {title: 'any-additional-information', status: 'upcoming'},
  payment: {title: 'payment', status: 'upcoming'},
};

const validate = Yup.object({});

export {initialValues, validate};

export type ItypeService =
  | 'FREE_MEETING_SERVICES'
  | 'PAID_MEETING_SERVICES'
  | 'FREELANCER_WORK'
  | 'ROUND_ROBIN'
  | 'EVENT';
export const getCurrentSteps = (
  serviceData: IServiceData
): {STEPS: Array<string>; TYPESERVICE: ItypeService} => {
  const stepsId = {
    FREE_MEETING_SERVICES: [
      'contact-info',
      'conference-type',
      'pre-booking-questions',
      'any-additional-information',
      'payment',
    ],
    PAID_MEETING_SERVICES: [
      'contact-info',
      'conference-type',
      'pre-booking-questions',
      'any-additional-information',
      'payment',
    ],
    FREELANCER_WORK: ['contact-info', 'pre-booking-questions', 'payment'],
    ROUND_ROBIN: ['contact-info', 'any-additional-information', 'payment'],
    EVENT: ['contact-info', 'pre-booking-questions', 'payment'],
  };
  if (serviceData.serviceType === 'MEETING') {
    if (serviceData.isPaid) {
      return {
        STEPS: stepsId['PAID_MEETING_SERVICES'].filter(
          el => !(serviceData.bookingQuestions.length === 0 && el === 'pre-booking-questions')
        ),
        TYPESERVICE: 'PAID_MEETING_SERVICES',
      };
    }
    return {
      STEPS: stepsId['FREE_MEETING_SERVICES'].filter(
        el => !(serviceData.bookingQuestions.length === 0 && el === 'pre-booking-questions')
      ),
      TYPESERVICE: 'FREE_MEETING_SERVICES',
    };
  }

  if (serviceData.serviceType === 'ROUND_ROBIN') {
    return {
      STEPS: stepsId['ROUND_ROBIN'],
      TYPESERVICE: 'ROUND_ROBIN',
    };
  }

  if (serviceData.serviceType === 'EVENT') {
    return {
      STEPS: stepsId['EVENT'].filter(
        el => !(serviceData?.serviceQuestionsList?.length === 0 && el === 'pre-booking-questions')
      ),
      TYPESERVICE: 'EVENT',
    };
  }

  return {
    STEPS: stepsId['FREELANCER_WORK'].filter(
      el => !(serviceData.bookingQuestions.length === 0 && el === 'pre-booking-questions')
    ),
    TYPESERVICE: 'FREELANCER_WORK',
  };
};
