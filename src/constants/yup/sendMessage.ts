import * as Yup from 'yup';

export const SEND_MESSAGE_STATE = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  description: '',
  PhoneValid: false,
};

export const SEND_MESSAGE_YUP = Yup.object().shape({
  name: Yup.string().required().trim().max(50).label('Name'),
  subject: Yup.string().required().trim().max(100).label('Subject'),
  email: Yup.string().email().required().trim().label('Email'),
  phone: Yup.string()
    .max(50)
    .label('Phone')
    .matches(/^[0-9\s)(-._]*$/, 'Please enter valid phone number'),
  description: Yup.string().required().trim().max(750).label('Description'),
});
