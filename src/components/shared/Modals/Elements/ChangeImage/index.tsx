import {useEffect} from 'react';
import {useFormik} from 'formik';
import Modal from '../../Modal';
import StepOne from './Steps/step-one';
import {IValues} from './feutures/constants';

export default function App({upLoadImage, defSize, maxSize}) {
  const {values, setFieldValue: setValue} = useFormik<IValues>({
    enableReinitialize: true,
    initialValues: {
      imgSrc: '',
      aspect: defSize,
      upLoadImage: upLoadImage,
      maxSize: maxSize ?? 2000000,
    },
    onSubmit: () => {},
  });
  useEffect(() => {}, [{...values}]);
  return (
    <Modal title={'Image'}>
      <StepOne values={values} setValue={setValue} />
    </Modal>
  );
}
