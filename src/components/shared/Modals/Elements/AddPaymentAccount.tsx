import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {useState} from 'react';
import {FieldError} from '@components/forms/error';
import Field from '@components/forms/field';
import Button from '@components/button';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {object, string} from 'yup';
import Modal from '../Modal';
import mutations from '../../../../constants/GraphQL/User/mutations';

const AddPaymentAccount = ({paymentType, paymentTypeId, userPaymentAccount}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateUser] = useMutation(mutations.updateUser);

  return (
    <Modal title={`${t('common:btn_update')} ${t(`common:${paymentType}`)}`}>
      <div>
        <Formik
          initialValues={{
            accountDetails: userPaymentAccount ? userPaymentAccount : '',
            verifyAccountDetails: '',
          }}
          validationSchema={object({
            accountDetails: string().required('Required').trim(),
            verifyAccountDetails: string().required('Required').trim(),
          })}
          onSubmit={async (values, {setFieldError}) => {
            try {
              setIsSubmitting(true);
              if (values.accountDetails !== values.verifyAccountDetails) {
                setFieldError('verifyAccountDetails', t('common:values_do_not_match'));
                setIsSubmitting(false);
                return;
              }

              await updateUser({
                variables: {
                  userData: {
                    accountDetails: {
                      [paymentTypeId]: values.accountDetails,
                    },
                  },
                  token: session?.accessToken,
                },
              });

              router.reload();
            } catch {
              setFieldError('verifyAccountDetails', t('common:general_api_error'));
              setIsSubmitting(false);
            }
          }}
        >
          {({touched, errors, values, handleChange, handleBlur}) => (
            <Form>
              <Field
                className='mb-4'
                label={t(`common:${paymentType}_Details`)}
                required
                error={
                  touched?.accountDetails &&
                  errors?.accountDetails && (
                    <FieldError breakW='words' message={errors.accountDetails} />
                  )
                }
              >
                <input
                  value={values.accountDetails}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type='text'
                  name='accountDetails'
                  id='accountDetails'
                  autoFocus
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                />
              </Field>

              <Field
                label={`${t('common:ReEnter')} ${t(`common:${paymentType}_Details`)}`}
                required
                error={
                  touched?.verifyAccountDetails &&
                  errors?.verifyAccountDetails && (
                    <FieldError breakW='words' message={errors.verifyAccountDetails} />
                  )
                }
              >
                <input
                  value={values.verifyAccountDetails}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type='text'
                  name='verifyAccountDetails'
                  id='verifyAccountDetails'
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                />
              </Field>
              <div className='w-full flex justify-center sm:justify-end pt-4'>
                <Button
                  variant='solid'
                  type='submit'
                  disabled={isSubmitting}
                  className='w-1/2 sm:w-32'
                >
                  {!isSubmitting ? t('common:btn_save') : t('common:loading')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default AddPaymentAccount;
