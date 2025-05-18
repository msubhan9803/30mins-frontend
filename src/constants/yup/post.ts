import * as Yup from 'yup';

function charactersCount(str: string | undefined) {
  return (str ?? '').replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/gi, '').length;
}

export const POST_STATE = {
  title: '',
  postImage: null,
  description: '',
  tags: [],
};

export const POST_YUP = Yup.object().shape({
  title: Yup.string()
    .test('isEmpty', 'Title is required', title => title?.trim() !== '')
    .required('Title is required')
    .max(256, 'Must be 256 characters or less'),
  description: Yup.string()
    .test('count', 'Must be 1024 characters or less', val => {
      const count = charactersCount(val);
      if (count >= 0 && count <= 1024) return true;

      return false;
    })
    .required('Description is required'),
  postImage: Yup.mixed().required('Image is required'),
});

export const PRODUCT_YUP = Yup.object().shape({
  title: Yup.string()
    .test('isEmpty', 'Title is required', title => title?.trim() !== '')
    .required('Title is required')
    .max(256, 'Must be 256 characters or less'),
  description: Yup.string()
    .test('count', 'Must be 1024 characters or less', val => {
      const count = charactersCount(val);
      if (count >= 0 && count <= 1024) return true;

      return false;
    })
    .required('Description is required'),
  image: Yup.mixed().required('Image is required'),
  price: Yup.number().min(0).required().label('Price'),
  discount: Yup.number().integer().positive().required().min(0).max(99).label('Discount'),
});
