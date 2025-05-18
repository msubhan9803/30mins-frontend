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
    index: 'ServiceDetails',
    required: true,
    fields: [
      'serviceTitle',
      'serviceSlug',
      'serviceDescription',
      'serviceDuration',
      'serviceAttendeeLimit',
      'serviceAttendeesMessage',
    ],
    schema: object({
      serviceTitle: string()
        .trim()
        .max(100, 'title_must_be_at_most_100_characters')
        .required('service_title_required'),
      serviceSlug: string()
        .trim()
        .max(100, 'slug_must_be_at_most_100_characters')
        .required('service_slug_required')
        .matches(/^[A-Za-z0-9 -]+(?:-[A-Za-z0-9 -]+)*$/, 'No Special Characters Allowed'),
      serviceDuration: number()
        .typeError('meeting_duration_required')
        .min(5, 'meeting_duration_must_be_greater_than_or_equal_to_5')
        .required('meeting_duration_required'),
      serviceAttendeeLimit: number()
        .typeError('meeting_attendees_number')
        .positive('meeting_attendees_positive')
        .required('meeting_attendeesn_required'),
      serviceDescription: string()
        .max(750, 'description_must_be_at_most_100_characters')
        .required('service_description_required'),
      serviceAttendeesMessage: string().required('service_serviceAttendeesMessage_required'),
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
  EVENT: [
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
};

export default schema;
