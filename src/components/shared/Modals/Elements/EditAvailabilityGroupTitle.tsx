/* eslint-disable no-lone-blocks */
import {useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useFormik} from 'formik';
import {FieldError} from '@root/components/forms/error';
import Field from '@components/forms/field';
import {AVAILABILITYGROUP_YUP} from 'constants/yup/availabilityGroup';
import Modal from '../Modal';

const UpdateAvailabilityGroup = () => {
  const {t} = useTranslation();
  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {handleConfirm, title, values, id, setFieldValue} = modalProps || {};
  const [loading, setLoading] = useState(false);

  const {
    values: formikValues,
    errors,
    handleChange,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {nameGroup: values.groups.filter(s => s._id === id)[0].name},
    onSubmit: async ({nameGroup}) => {
      setLoading(true);
      await handleConfirm(nameGroup, id, setFieldValue);
    },
    validationSchema: AVAILABILITYGROUP_YUP,
  });

  return (
    <Modal title={title} small>
      <form onSubmit={handleSubmit} className='flex justify-end flex-col sm:flex-nowrap gap-2 mt-2'>
        <div className='w-full flex flex-col'>
          <span className='font-bold text-xs'>{t('common:title')} :</span>
          <Field
            label={''}
            error={errors.nameGroup && <FieldError message={errors.nameGroup} />}
            className='w-full h-full'
          >
            <input
              type={'text'}
              name='nameGroup'
              onChange={handleChange}
              value={formikValues.nameGroup}
              className='focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
            />
          </Field>
        </div>
        <div className='flex justify-end'>
          <button
            type={'submit'}
            className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-mainBlue hover:bg-mainBlue hover:text-white duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
          >
            {loading ? 'Confirming...' : 'Confirm'}
          </button>
          <button
            type='button'
            disabled={loading}
            onClick={hideModal}
            className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600'
          >
            {t('common:btn_cancel')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default UpdateAvailabilityGroup;
