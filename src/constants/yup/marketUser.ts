import * as Yup from 'yup';

const ValidateURLFacebook = /^(http(s)?:\/\/)?([\w]+\.)?facebook\.com\//i;
const ValidateURLInstagram = /^(http(s)?:\/\/)?([\w]+\.)?instagram\.com\//i;
const ValidateURLTwitter = /^(http(s)?:\/\/)?([\w]+\.)?twitter\.com\//i;
const ValidateURLLinkedin = /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\//i;
const ValidateURLYoutube = /^(http(s)?:\/\/)?([\w]+\.)?youtube\.com\//i;

// eslint-disable-next-line import/prefer-default-export
export const MARKET_USER_YUP = Yup.object().shape({
  username: Yup.string()
    .required('Required')
    .label('Username')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[a-zA-Z0-9\-._]*$/, 'Letters and numbers only'),
  fullName: Yup.string()
    .required('Required')
    .label('Full Name')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[a-zA-Z0-9 ]+$/, 'Letters and numbers only'),
  description: Yup.string().max(750, 'Must be 750 characters or less'),
  country: Yup.string(),
  zipCode: Yup.string()
    .max(15, 'Must be 15 characters or less')
    .matches(/^[0-9a-zA-Z ]+$/, 'Numbers and letters only'),
  email: Yup.string().email().max(150).required().label('Email'),
  headline: Yup.string().max(150).required().label('Headline'),
  timezone: Yup.string().required('Required'),
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
});
