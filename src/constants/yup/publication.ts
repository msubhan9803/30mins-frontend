import * as Yup from 'yup';

const ValidateURL =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$/;

export const PUBLICATION_STATE = {
  headline: '',
  type: 'Book',
  description: '',
  image: '',
  url: '',
};

export const PUBLICATION_YUP = Yup.object().shape({
  headline: Yup.string().trim().required('Required').max(160, 'Must be 160 characters or less'),
  type: Yup.string().trim().required('Required'),
  description: Yup.string().trim().required('Required').max(750, 'Must be 750 characters or less'),
  url: Yup.string().trim().required('Required').max(254).matches(ValidateURL, 'Enter a valid URL'),
});
