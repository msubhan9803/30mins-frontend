import {array, boolean, number, object, string} from 'yup';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const validateHours = hours => {
  let isValid = true;
  hours.forEach(hour => {
    if (hour.start === 0 && hour.end === 0) {
      isValid = false;
    }
  });
  return isValid;
};

export type IStepNames =
  | 'ServiceType'
  | 'ServiceDetails'
  | 'ServicePayment'
  | 'Charity'
  | 'Security'
  | 'Availability'
  | 'Whitelist'
  | 'Blacklist'
  | 'Questions'
  | 'Media'
  | 'Summary';

function availabilityValidation() {
  let tempSchema = {};
  days.forEach(day => {
    tempSchema = {
      ...tempSchema,
      [day]: object({
        isActive: boolean().notRequired(),
        hours: array().of(
          object({
            start: number().notRequired(),
            end: number().positive().notRequired(),
          })
        ),
      }),
    };
  });
  return tempSchema;
}

function availabilityTest(value) {
  let activeDays = 0;
  // eslint-disable-next-line prefer-const
  let daysTest: boolean[] = [];
  days.forEach((day, i) => {
    if (value[day].isActive === true) {
      activeDays++;
    }

    if (
      value[day].isActive === true &&
      (value[day].hours!.length === 0 || validateHours(value[day].hours) !== true)
    ) {
      daysTest[i] = false;
    }
  });
  if (activeDays === 0) {
    return false;
  }
  if (daysTest.length > 0) {
    return false;
  }
  return true;
}

const schema = [
  {
    index: 'ServiceType',
    required: true,
    fields: [
      'serviceType',
      'isOrgService',
      'organizationName',
      'organizationId',
      'orgServiceCategory',
    ],
    schema: object({
      organizationId: string().when('isOrgService', {
        is: value => value === true,
        then: string().required('organization_id_required'),
        otherwise: string().notRequired(),
      }),
      organizationName: string().when('isOrgService', {
        is: value => value === true,
        then: string().required('organization_name_required'),
        otherwise: string().notRequired(),
      }),
      orgServiceCategory: string().when('isOrgService', {
        is: value => value === true,
        then: string().required('organization_service_category_required'),
        otherwise: string().notRequired(),
      }),
      serviceType: string().required('please_select_a_option'),
    }),
  },
  {
    index: 'ServiceDetails',
    required: true,
    fields: [
      'serviceType',
      'serviceTitle',
      'serviceSlug',
      'serviceDescription',
      'meetingDuration',
      'meetingAttendees',
      'meetingType',
    ],
    schema: object({
      serviceType: string().required('please_select_a_option'),
      serviceTitle: string()
        .trim()
        .max(100, 'title_must_be_at_most_100_characters')
        .required('service_title_required'),
      serviceSlug: string()
        .trim()
        .max(100, 'slug_must_be_at_most_100_characters')
        .required('service_slug_required')
        .matches(/^[A-Za-z0-9 -]+(?:-[A-Za-z0-9 -]+)*$/, 'No Special Characters Allowed'),
      meetingDuration: number().when('serviceType', {
        is: value => value === 'MEETING',
        then: number()
          .typeError('meeting_duration_required')
          .min(5, 'meeting_duration_must_be_greater_than_or_equal_to_5')
          // .positive('meeting_duration_positive')
          .required('meeting_duration_required'),
        otherwise: number().notRequired(),
      }),
      meetingAttendees: number().when('serviceType', {
        is: value => value === 'MEETING',
        then: number()
          .typeError('meeting_attendees_number')
          .positive('meeting_attendees_positive')
          .required('meeting_attendeesn_required'),
        otherwise: number().notRequired(),
      }),
      meetingType: array().when('serviceType', {
        is: value => value === 'MEETING',
        then: array().min(1, 'meeting_type_at_least_one').required('meeting_type_required'),
        otherwise: array().notRequired(),
      }),
      serviceDescription: string()
        .max(750, 'description_must_be_at_most_100_characters')
        .required('service_description_required'),
    }),
  },
  {
    index: 'ServicePayment',
    required: true,
    fields: ['servicePaid', 'serviceFee', 'serviceCurrency', 'servicePayMethod'],
    schema: object({
      servicePaid: string().required('service_paid_required'),
      serviceFee: number().when('servicePaid', {
        is: value => value === 'yes',
        then: number()
          .typeError('service_fee_number')
          .positive('service_fee_positive')
          .required('service_fee_required'),
        otherwise: number().notRequired(),
      }),
      serviceCurrency: string().when('servicePaid', {
        is: value => value === 'yes',
        then: string().required('service_currency_required'),
        otherwise: string().notRequired(),
      }),
      servicePayMethod: string().when('servicePaid', {
        is: value => value === 'yes',
        then: string()
          .typeError('service_pay_method_required')
          .oneOf(['escrow', 'direct', 'manual'], 'service_pay_method_required')
          .required('service_pay_method_required'),
        otherwise: string().nullable().notRequired(),
      }),
    }),
  },
  {
    index: 'Charity',
    required: true,
    fields: ['serviceDonate', 'serviceCharity', 'servicePercentage', 'serviceCharityId'],
    schema: object({
      serviceDonate: string().required('service_donate_required'),
      serviceCharity: string()
        .nullable()
        .when('serviceDonate', {
          is: value => value === 'yes',
          then: string().required('service_charity_required'),
          otherwise: string().nullable().notRequired(),
        }),
      serviceCharityId: string().nullable().notRequired(),
      servicePercentage: number()
        .nullable()
        .when('serviceDonate', {
          is: value => value === 'yes',
          then: number().min(1, 'service_currency_required').required('service_currency_required'),
          otherwise: number().nullable().notRequired(),
        }),
    }),
  },
  {
    index: 'Security',
    required: true,
    fields: [],
    schema: object({}),
  },
  {
    index: 'Availability',
    required: true,
    fields: ['serviceAvailability', 'availabilityDays'],
    schema: object({
      serviceAvailability: string().required('service_availability_required'),
      availabilityDays: object().when('serviceAvailability', {
        is: value => value === 'yes',
        then: object(availabilityValidation()).test(
          'at-least-one',
          'service_availability_at_least_one',
          value => availabilityTest(value)
        ),
        otherwise: object().notRequired(),
      }),
    }),
  },
  {
    index: 'Whitelist',
    required: true,
    fields: ['serviceWhitelist', 'serviceWhitelistDomains', 'serviceWhitelistEmails'],
    schema: object().shape(
      {
        serviceWhitelist: string().required('service_whitelist_required'),
        serviceWhitelistDomains: array().test(
          'service_whitelist_validation',
          'domains_at_least_one',
          function (value) {
            const {serviceWhitelist, serviceWhitelistEmails} = this.parent;
            if (serviceWhitelist === 'yes') {
              if (value && value.length === 0) {
                return serviceWhitelistEmails.length > 0;
              }
            }
            return true;
          }
        ),
        serviceWhitelistEmails: array().test(
          'service_whitelist_validation',
          'emails_at_least_one',
          function (value) {
            const {serviceWhitelist, serviceWhitelistDomains} = this.parent;
            if (serviceWhitelist === 'yes') {
              if (value && value.length === 0) {
                return serviceWhitelistDomains.length > 0;
              }
            }
            return true;
          }
        ),
      },
      [['serviceWhitelistDomains', 'serviceWhitelistEmails']]
    ),
  },
  {
    index: 'Blacklist',
    required: true,
    fields: ['serviceBlacklist', 'serviceBlacklistDomains', 'serviceBlacklistEmails'],
    schema: object().shape(
      {
        serviceBlacklist: string().required('service_blacklist_required'),
        serviceBlacklistDomains: array().test(
          'service_blacklist_validation',
          'domains_at_least_one',
          function (value) {
            const {serviceBlacklist, serviceBlacklistEmails} = this.parent;
            if (serviceBlacklist === 'yes') {
              if (value && value.length === 0) {
                return serviceBlacklistEmails.length > 0;
              }
            }
            return true;
          }
        ),
        serviceBlacklistEmails: array().test(
          'service_blacklist_validation',
          'emails_at_least_one',
          function (value) {
            const {serviceBlacklist, serviceBlacklistDomains} = this.parent;
            if (serviceBlacklist === 'yes') {
              if (value && value.length === 0) {
                return serviceBlacklistDomains.length > 0;
              }
            }
            return true;
          }
        ),
      },
      [['serviceBlacklistDomains', 'serviceBlacklistEmails']]
    ),
  },
  {
    index: 'Questions',
    required: true,
    fields: ['serviceQuestions', 'serviceQuestionsList'],
    schema: object({
      serviceQuestions: string().required('service_questions_required'),
      serviceQuestionsList: array().when('serviceQuestions', {
        is: value => value === 'yes',
        then: array().min(1, 'questions_min_one').required('questions_required'),
        otherwise: array().notRequired(),
      }),
    }),
  },
  {
    index: 'Media',
    required: true,
    fields: ['serviceImage'],
    schema: object({
      serviceImage: string().nullable().notRequired(),
    }),
  },
];

const questionTypes = ['FREE_TEXT', 'DROPDOWN', 'CHECKBOX', 'RADIO'];
export const questionSchema = object({
  question: string().required('question_required'),
  questionType: string()
    .oneOf(questionTypes, 'wrong_question_type')
    .required('question_type_required'),
  required: boolean().required('required_required'),
  options: array()
    .when('questionType', {
      is: value => value === 'DROPDOWN' || value === 'CHECKBOX' || value === 'RADIO',
      then: array()
        .of(string().required('option_required'))
        .min(2, 'add_two_or_more_options')
        .required(),
      otherwise: array().notRequired(),
    })
    .test('unique', 'unique', function (list) {
      const mapper = x => x;
      const set = [...new Set(list?.map(mapper))];
      const isUnique = list?.length === set.length;
      if (isUnique) {
        return true;
      }

      const idx = list?.findIndex((l, i) => mapper(l) !== set[i]);
      return this.createError({
        path: `options[${idx}]`,
        message: 'This choice exists!',
      });
    }),
});

const re = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
export const emailSchema = string().email('invalid_email').required('email_required');
export const domainSchema = string().matches(re, 'invalid_domain').required('domain_required');

export enum AuthenticationTypes {
  VERIFIED_ONLY,
  PRE_APPROVED,
  NONE,
}

export const steps = {
  MEETING: [
    'ServiceType',
    'ServiceDetails',
    'ServicePayment',
    'Charity',
    'Security',
    'Availability',
    // 'Whitelist',
    // 'Blacklist',
    'Questions',
    'Media',
    'Summary',
  ],
  FREELANCING_WORK: [
    'ServiceType',
    'ServiceDetails',
    'ServicePayment',
    'Charity',
    // 'Whitelist',
    // 'Blacklist',
    'Questions',
    'Media',
    'Summary',
  ],
  FULL_TIME_JOB: [
    'ServiceType',
    'ServiceDetails',
    'ServicePayment',
    'Charity',
    'Availability',
    // 'Whitelist',
    // 'Blacklist',
    'Questions',
    'Media',
    'Summary',
  ],
  PART_TIME_JOB: [
    'ServiceType',
    'ServiceDetails',
    'ServicePayment',
    'Charity',
    'Availability',
    // 'Whitelist',
    // 'Blacklist',
    'Questions',
    'Media',
    'Summary',
  ],
};

export default schema;
