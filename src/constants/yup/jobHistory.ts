import * as Yup from 'yup';

export const JOB_HISTORY_STATE = {
  position: '',
  roleDescription: '',
  employmentType: 'Full-Time',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: 'false',
};

export const JOB_HISTORY_YUP = Yup.object().shape({
  position: Yup.string().trim().required('Required').max(50, 'Must be 50 characters or less'),
  roleDescription: Yup.string()
    .trim()
    .required('Required')
    .max(750, 'Must be 750 characters or less'),
  employmentType: Yup.string().trim().required('Required'),
  company: Yup.string().trim().required('Required').max(254, 'Must be 254 characters or less'),
  location: Yup.string().trim().required('Required').max(150, 'Must be 150 characters or less'),
  startDate: Yup.date().max(new Date()).required('Required'),
  endDate: Yup.date()
    .nullable()
    .when('current', {
      is: 'false',
      then: Yup.date().required('Required'),
    }),
  current: Yup.string().trim().required('Required'),
});
