import * as Yup from 'yup';

const ValidateURL =
  /((https?):\/\/)(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

// eslint-disable-next-line import/prefer-default-export
export const MARKETER_ORGANIZATION_YUP = Yup.object().shape({
  title: Yup.string().required('Required').max(254, 'Must be 254 characters or less'),
  slug: Yup.string()
    .required('Required')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, 'No Special Characters Allowed'),
  description: Yup.string().required('Required').max(750, 'Must be 750 characters or less'),
  image: Yup.string(),
  website: Yup.string().max(254).matches(ValidateURL, 'Enter a valid URL'),
});

export const MARKETER_LINK_ORGANIZATION_YUP = Yup.object().shape({
  orgTitle: Yup.string().required().max(254).label('Organization Title'),
  userEmail: Yup.string().email().max(150).required().label('User Email').trim(),
});
