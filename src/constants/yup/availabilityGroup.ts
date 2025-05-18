import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const AVAILABILITYGROUP_YUP = Yup.object().shape({
  nameGroup: Yup.string()
    .test('isEmpty', 'Group name is required', nameGroup => nameGroup?.trim() !== '')
    .required('Group name is required'),
});
