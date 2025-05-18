import * as Yup from 'yup';

export const SIGNUP_STATE = {
  email: '',
  name: '',
  username: '',
  termsOfService: false,
};

export const SINGUP_YUP = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .matches(/^(\w+\s?)*\s*$/, 'only_one_space_allowed_and_no_special_characters_are_allowed')
    .required('full_name_required')
    .label('Name'),
  email: Yup.string().trim().email().max(150).required().label('Email'),
  termsOfService: Yup.boolean()
    .required('The terms and conditions must be accepted.')
    .oneOf([true], 'The terms and conditions must be accepted.'),
});
