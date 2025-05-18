import * as Yup from 'yup';

const ValidateURL =
  /((https?):\/\/)(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

const ValidateURLFacebook = /^(http(s)?:\/\/)?([\w]+\.)?facebook\.com\//i;
const ValidateURLInstagram = /^(http(s)?:\/\/)?([\w]+\.)?instagram\.com\//i;
const ValidateURLTwitter = /^(http(s)?:\/\/)?([\w]+\.)?twitter\.com\//i;
const ValidateURLLinkedin = /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\//i;
const ValidateURLYoutube = /^(http(s)?:\/\/)?([\w]+\.)?youtube\.com\//i;

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

export const ORGANIZATION_STATE = {
  title: '',
  headline: '',
  slug: '',
  description: '',
  image: '',
  website: '',
  supportEmail: '',
  supportPhone: '',
  restrictionLevel: 'RESTRICTED',
  location: '',
  socials: {
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: '',
    youtube: '',
  },
  media: {
    link: '',
    type: '',
  },
  isPrivate: false,
  searchTags: [],
  publicFeatures: [],
};

export const ORGANIZATION_YUP = Yup.object().shape({
  title: Yup.string().required('Required').max(254, 'Must be 254 characters or less'),
  slug: Yup.string()
    .required('Required')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[A-Za-z0-9 -]+(?:-[A-Za-z0-9 -]+)*$/, 'No Special Characters Allowed'),
  headline: Yup.string().max(160, 'Must be 160 characters or less').nullable(),
  description: Yup.string().required('Required').max(757, 'Must be 750 characters or less'),
  image: Yup.string().nullable(),
  website: Yup.string().max(254).matches(ValidateURL, 'Enter a valid URL'),
  socials: Yup.object().shape({
    twitter: Yup.string()
      .max(254)
      .matches(ValidateURLTwitter, 'Enter a valid Twitter URL')
      .nullable(),
    facebook: Yup.string()
      .max(254)
      .matches(ValidateURLFacebook, 'Enter a valid Facebook URL')
      .nullable(),
    instagram: Yup.string()
      .max(254)
      .matches(ValidateURLInstagram, 'Enter a valid Instagram URL')
      .nullable(),
    linkedin: Yup.string()
      .max(254)
      .matches(ValidateURLLinkedin, 'Enter a valid LinkedIn URL')
      .nullable(),
    youtube: Yup.string()
      .max(254)
      .matches(ValidateURLYoutube, 'Enter a valid YouTube URL')
      .nullable(),
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
  restrictionLevel: Yup.string(),
  supportEmail: Yup.string().max(254).email('Must be a valid email').nullable(),
  supportPhone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').nullable(),
  location: Yup.string().max(150, 'Must be 150 characters or less').nullable(),
});

export const ADMIN_EDIT_ORGANIZATION_YUP = Yup.object().shape({
  title: Yup.string().required('Required').max(254, 'Must be 254 characters or less'),
  slug: Yup.string()
    .required('Required')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, 'No Special Characters Allowed'),
  headline: Yup.string().max(160, 'Must be 160 characters or less'),
  description: Yup.string().max(750, 'Must be 750 characters or less'),
  image: Yup.string(),
  website: Yup.string().max(254).matches(ValidateURL, 'Enter a valid URL'),
  socials: Yup.object().shape({
    twitter: Yup.string().max(254).matches(ValidateURLTwitter, 'Enter a valid Twitter URL'),
    facebook: Yup.string().max(254).matches(ValidateURLFacebook, 'Enter a valid Facebook URL'),
    instagram: Yup.string().max(254).matches(ValidateURLInstagram, 'Enter a valid Instagram URL'),
    linkedin: Yup.string().max(254).matches(ValidateURLLinkedin, 'Enter a valid LinkedIn URL'),
    youtube: Yup.string().max(254).matches(ValidateURLYoutube, 'Enter a valid YouTube URL'),
  }),
  media: Yup.object().shape({
    link: Yup.string().max(254).matches(ValidateURL, 'Enter a valid URL'),
    type: Yup.string(),
  }),
  restrictionLevel: Yup.string(),
  supportEmail: Yup.string().max(254).email('Must be a valid email'),
  supportPhone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  location: Yup.string().max(150, 'Must be 150 characters or less'),
});

export const ORG_SERVICE_CATEGORY_STATE = {
  title: '',
};

export const ORG_INVITE_MEMBERS = {
  email: '',
};

export const ORG_INVITE_MEMBERS_YUP = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required')
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter valid email'
    ),
});

export const ORG_SERVICE_CATEGORY_YUP = Yup.object().shape({
  title: Yup.string().required().max(254).label('Title'),
});

export const JOIN_ORGANIZATION_YUP = Yup.object().shape({
  title: Yup.string().required('Required'),
});

export const JOIN_ORGANIZATION_STATE = {
  title: '',
};

export const ORG_SERVICE_STATE = {
  title: '',
  slug: '',
  duration: 15,
  price: 0,
  currency: '$',
  charity: '',
  percentDonated: '0',
  paymentType: 'escrow',
  description: '',
  serviceType: 'MEETING',
  b15mins: false,
  b24hours: false,
  recurringInterval: 'weekly',
  conferenceType: [],
  mediaLink: '',
  mediaType: '',
  isPrivate: false,
  isPaid: false,
  hasReminder: false,
  isRecurring: false,
  organizationId: '',
  isOrgService: true,
  organizationName: '',
  orgServiceCategory: '',
  serviceWorkingHours: {
    isCustomEnabled: false,
    monday: {
      isActive: false,
      start: null,
      end: null,
    },
    tuesday: {
      isActive: false,
      start: null,
      end: null,
    },
    wednesday: {
      isActive: false,
      start: null,
      end: null,
    },
    thursday: {
      isActive: false,
      start: null,
      end: null,
    },
    friday: {
      isActive: false,
      start: null,
      end: null,
    },
    saturday: {
      isActive: false,
      start: null,
      end: null,
    },
    sunday: {
      isActive: false,
      start: null,
      end: null,
    },
  },
};

export const ORG_SERVICE_YUP = Yup.object().shape({
  title: Yup.string().required('Required').max(160, 'Must be 160 characters or less'),
  slug: Yup.string()
    .required('Required')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[a-zA-Z0-9\-._]*$/, 'No Special Characters Allowed'),
  duration: Yup.number().min(5).max(300).required('Required'),
  conferenceType: Yup.array().min(1, 'At least one element is required').required('Required'),
  description: Yup.string().required('Required').max(750, 'Must be 750 characters or less'),
  organizationName: Yup.string().required('Required'),
  orgServiceCategory: Yup.string().required('Required'),
  percentDonated: Yup.string().when('charity', {
    is: charity => charity,
    then: Yup.string().required('Required'),
    otherwise: Yup.string().nullable(),
  }),
});

export const ORG_MEMBER_SEARCH_STATE = {
  keywords: '',
};

export const ORG_SERVICE_SEARCH_STATE = {
  keywords: '',
  serviceCategory: '',
  isPaid: '',
  isFree: '',
};

export const ORG_KICK_MEMBER_STATE = {
  reason: '',
};
