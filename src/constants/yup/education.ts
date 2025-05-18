import dayjs from 'dayjs';
import * as Yup from 'yup';

export const EDUCATION_HISTORY_STATE = {
  school: '',
  degree: '',
  fieldOfStudy: '',
  startDate: dayjs(Date()).format('YYYY-MM-DD'),
  endDate: dayjs(Date()).add(1, 'month').format('YYYY-MM-DD'),
  extracurricular: '',
  current: false,
  graduated: false,
};

export const EDUCATION_HISTORY_YUP = Yup.object().shape({
  school: Yup.string().trim().required('Required').max(254, 'Must be 254 characters or less'),
  degree: Yup.string().trim().required('Required').max(50, 'Must be 50 characters or less'),
  fieldOfStudy: Yup.string().trim().required('Required').max(50, 'Must be 50 characters or less'),
  current: Yup.bool().required('Required'),
  startDate: Yup.date().max(new Date()).required('Required'),
  // endDate: Yup.date().min(Yup.ref('startDate')).required('Required'),
  endDate: Yup.date()
    .nullable()
    .when('current', {
      is: 'false',
      then: Yup.date().required('Required'),
    }),
  extracurricular: Yup.string().trim().max(757, 'Must be 750 characters or less'),
  graduated: Yup.bool().required('Required'),
});
