import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const LOGIN_YUP = Yup.object().shape({
  email: Yup.string().trim().email().max(150).required().label('Email'),
});
