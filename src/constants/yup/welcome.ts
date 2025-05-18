import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const WELCOME_STEP_ONE = Yup.object().shape({
  fullname: Yup.string()
    .required()
    .max(50, 'Must be 50 characters or less')
    .matches(/^[a-z\sA-Z0-9\s)(-._]*$/, 'Fullname invalid')
    .label('Fullname'),
  username: Yup.string()
    .matches(/^[a-zA-Z0-9\-._]*$/, 'Username invalid')
    .max(50, 'Must be 50 characters or less')
    .required()
    .label('Username'),
  country: Yup.string().required().default('United States').label('Country'),
  zipCode: Yup.string()
    .required()
    .max(15, 'Must be 15 characters or less')
    .matches(/^[0-9a-zA-Z ]+$/, 'Numbers and letters only')
    .label('ZipCode'),
  timezone: Yup.string().required().default('America/Los_Angeles').label('Timezone'),
});
