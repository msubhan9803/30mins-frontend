import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Button from '@root/components/button';
import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';
import {object, string} from 'yup';
import {useFormik} from 'formik';
import Modal from '../Modal';

const RefundProduct = () => {
  const {t} = useTranslation();
  const {store} = ModalContextProvider();

  const {errors, handleChange, submitForm, values} = useFormik({
    initialValues: {reason: ''},
    validationSchema: object({
      reason: string().required().trim().label('Reason'),
    }),
    onSubmit: async ({reason}) => {
      await store?.modalProps?.sendRefund!(reason);
    },
  });

  return (
    <Modal title={t('common:Refund request confirmation')} medium isTrim={false}>
      <div className='flex flex-col flex-wrap sm:flex-nowrap gap-2 mt-2'>
        <Field
          label=''
          className='w-full'
          error={errors.reason && <FieldError message={errors.reason} />}
        >
          <textarea
            className='px-4 py-2 w-full border text-base shadow-sm focus:ring-mainBlue focus:ring-offset-0 focus:ring-0 focus:border-mainBlue border-gray-300 rounded-lg appearance-none hover:appearance-none'
            name='reason'
            onKeyDown={e => e.key === 'Enter' && submitForm()}
            autoFocus
            value={values.reason}
            onChange={handleChange}
          />
        </Field>
        <Button
          type={'submit'}
          variant='solid'
          className='mt-1 w-full md:w-auto'
          style={{height: 40}}
          onSubmit={submitForm}
          onClick={async () => {
            await submitForm();
          }}
        >
          {t('common:submit')}
        </Button>
      </div>
    </Modal>
  );
};
export default RefundProduct;
