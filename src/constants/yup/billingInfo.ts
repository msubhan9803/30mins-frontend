import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const BILLING_INFO_YUP = Yup.object().shape({
  fname: Yup.string()
    .required('Required')
    .trim()
    .max(100, 'Must be 100 characters or less')
    .matches(/^[a-z ,.'-]+$/i, 'No special characters allowed')
    .nullable(false),
  lname: Yup.string()
    .required('Required')
    .trim()
    .max(100, 'Must be 100 characters or less')
    .matches(/^[a-z ,.'-]+$/i, 'No special characters allowed'),
  address: Yup.string().required('Required').trim(),
  buildingNumber: Yup.string().trim().nullable().max(15, 'Must be 15 characters or less'),
  city: Yup.string().required('Required').trim().max(50, 'Must be 50 characters or less'),
  zipCode: Yup.string()
    .required('Required')
    .trim()
    .max(15, 'Must be 15 characters or less')
    .matches(/^[0-9a-zA-Z ]+$/, 'Numbers and letters only'),
  country: Yup.string()
    .required('Required')
    .trim()
    .max(50, 'Must be 50 characters or less')
    .default('United States'),
});
