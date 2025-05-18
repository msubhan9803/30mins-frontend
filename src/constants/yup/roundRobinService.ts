import * as Yup from 'yup';

// const ValidateURL =
//   /((https?):\/\/)(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

export const ROUND_ROBIN_SERVICE_STATE = {
  title: '',
  slug: '',
  duration: 15,
  price: 0,
  currency: '$',
  charity: '',
  percentDonated: null,
  paymentType: 'escrow',
  description: '',
  authenticationType: 'NONE',
  recurringInterval: 'weekly',
  conferenceType: [],
  media: {
    type: '',
    link: '',
  },
  serviceWorkingHours: {
    isCustomEnabled: false,
    monday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
    tuesday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
    wednesday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
    thursday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
    friday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
    saturday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
    sunday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
  },
  isPrivate: false,
  isPaid: false,
  hasReminder: false,
  isRecurring: false,
  isOrgService: false,
  organizationId: '',
  organizationName: '',
  orgServiceCategory: '',
  bookingQuestions: [],
  whiteList: {
    emails: [],
    domains: [],
  },
  blackList: {
    domains: [],
    emails: [],
  },
  // emailFilter: {
  //   type: 'BLACK_LIST',
  //   emails: [],
  //   domains: [],
  // },
  roundRobinTeam: {
    _id: '',
  },
};
const ValidateURLYoutube = /^(http(s)?:\/\/)?([\w]+\.)?youtube\.com\//i;

export const ROUND_ROBIN_SERVICE_YUP = Yup.object().shape({
  roundRobinTeam: Yup.object().shape({_id: Yup.string().required().label('Assigned Team')}),
  title: Yup.string().required('Required').max(160, 'Must be 160 characters or less'),
  slug: Yup.string()
    .required('Required')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[a-zA-Z0-9\-._]*$/, 'No Special Characters Allowed'),
  duration: Yup.number().min(5).max(300).required('Required'),
  conferenceType: Yup.array().min(1, 'At least one element is required').required('Required'),
  description: Yup.string().required().max(757).label('Description'),
  percentDonated: Yup.string().when('charity', {
    is: value => value && value.length > 0 && value !== '',
    then: Yup.string().required('Required'),
    otherwise: Yup.string().nullable(),
  }),
  paymentType: Yup.string().when('isPaid', {
    is: value => value === true,
    then: Yup.string().required('Required'),
    otherwise: Yup.string().nullable(),
  }),
  media: Yup.object().shape({
    link: Yup.string()
      .max(254)
      .when('type', {
        is: 'Google Slides',
        then: Yup.string()
          .max(254)
          .matches(
            /https:\/\/docs\.google\.com\/presentation\/d\/(.*?)\/.*?\?usp=sharing/g,
            'Expected Google Link: https://docs.google.com/presentation/d/1OhnJeSLgBS7sT84cu5XnplUZ4HHquKCUgYLvym30aZQ/edit?usp=sharing'
          )
          .required()
          .label('Google Slides Link'),
      })
      .when('type', {
        is: 'Youtube Embed',
        then: Yup.string()
          .max(254)
          .matches(
            ValidateURLYoutube,
            'Expected YouTube Link: https://www.youtube.com/watch?v=30mins'
          )
          .required()
          .label('YouTube Link'),
      })
      .nullable(),
    type: Yup.string().nullable(),
  }),
});
