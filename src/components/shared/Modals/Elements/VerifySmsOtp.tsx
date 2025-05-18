import {useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {useSession} from 'next-auth/react';
import {Form, Formik} from 'formik';
import Button from '@components/button';
import Input from '@components/forms/input';
import Field from '@components/forms/field';
import {FieldError} from '@components/forms/error';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import Modal from '../Modal';
import userMutations from '../../../../constants/GraphQL/User/mutations';

const VerifySmsOtp = ({phone}) => {
  const [validateSmsOtp] = useMutation(userMutations.validateSmsOtp);
  const router = useRouter();
  const {t} = useTranslation();
  const {data: session} = useSession();
  const [loading, setloading] = useState(false);

  const submitHandler = async (values, {setFieldError}) => {
    setloading(true);
    const {data: response} = await validateSmsOtp({
      variables: {
        phone: phone,
        otpToken: values.otp,
        forProviderExtension: true,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });
    if (response.validateSmsOtp.status === 200) {
      router.reload();
    } else {
      setFieldError('otp', t('common:Invalid OTP Token'));
    }
    setloading(false);
  };

  return (
    <Modal title={t('common:verify_sms_otp')} medium={true}>
      <Formik initialValues={{otp: ''}} onSubmit={submitHandler}>
        {({errors, values, handleChange}) => (
          <Form className={'flex flex-col gap-2 items-center'}>
            <Field
              label={t('common:otp_sent_msg')}
              error={errors?.otp && <FieldError message={errors?.otp} />}
            >
              <Input
                type={'text'}
                required={true}
                placeholder=''
                minLength={6}
                maxLength={6}
                id='otp'
                value={values.otp}
                handleChange={handleChange}
              />
            </Field>

            <Button type={'submit'} variant={'solid'} disabled={loading} className={'w-full'}>
              {!loading ? t('common:verify_otp') : t('common:loading')}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export default VerifySmsOtp;
