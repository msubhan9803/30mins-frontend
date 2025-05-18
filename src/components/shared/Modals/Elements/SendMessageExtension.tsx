import {useRef, useState} from 'react';
import {PlusIcon} from '@heroicons/react/20/solid';
import {SEND_MESSAGE_STATE, SEND_MESSAGE_YUP} from 'constants/yup/sendMessage';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Recaptcha from 'react-google-recaptcha';
import axios from 'axios';
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';

import {isValidPhoneNumber} from 'react-phone-number-input';
import PhoneInput from 'react-phone-input-2';
import Button from '@root/components/button';
import 'react-phone-input-2/lib/style.css';
import {useSession} from 'next-auth/react';
import {useQuery} from '@apollo/client';
import Modal from '../Modal';
import queries from '../../../../constants/GraphQL/User/queries';

const SendMessageExtension = () => {
  const {t} = useTranslation();
  const {store, hideModal} = ModalContextProvider();
  const {modalProps} = store || {};
  const {providerName, providerEmail} = modalProps || {};
  const [Country, setCountry] = useState('us');
  const recaptchaRef = useRef<Recaptcha>();
  const {data: session} = useSession<any>();

  const {data} = useQuery(queries.getUserById, {
    variables: {token: session?.accessToken},
    skip: !session,
  });

  const SendMessage = async (values, setSubmitting) => {
    setSubmitting(true);

    const captchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    await axios.post('/api/sendMessageExtension/sendMessageExtension', {
      name: values.name,
      subject: values.subject,
      description: values.description,
      email: values.email,
      phone: values.phone,
      providerName,
      providerEmail,
      captcha: captchaToken,
    });
    setSubmitting(false);
    hideModal();
  };

  const submitHandler = async (values, setSubmitting) => {
    SendMessage(values, setSubmitting);
  };

  return (
    <Modal
      title={`${`${t('page:contact')} ${
        providerName?.length > 15 ? `${providerName?.substring(0, 15).trim()}...` : providerName
      }
      `}`}
      icon={<PlusIcon className='h-6 w-6 text-blue-600' aria-hidden='true' />}
    >
      <Formik
        initialValues={{
          ...SEND_MESSAGE_STATE,
          email: data?.getUserById?.userData?.accountDetails?.email || '',
          phone: data?.getUserById?.userData?.personalDetails?.phone || '',
          name: data?.getUserById?.userData?.personalDetails?.name || '',
          PhoneValid: !!data?.getUserById?.userData?.personalDetails?.phone,
        }}
        validationSchema={SEND_MESSAGE_YUP}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values, {setSubmitting}) => {
          submitHandler(values, setSubmitting);
        }}
      >
        {({
          isSubmitting,
          values,
          handleChange,
          setFieldValue,
          setFieldError,
          handleSubmit,
          handleBlur,
          errors,
        }) => (
          <Form onSubmit={handleSubmit} className='md:px-2 py-4'>
            <>
              <div className='mt-10 sm:mt-0'>
                <div className='md:grid md:grid-cols-1 md:gap-6'>
                  <div className='mt-5 md:mt-0 md:col-span-2'>
                    <div className='overflow-hidden sm:rounded-md'>
                      <div className='grid grid-cols-6 gap-6'>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('profile:Full_Name')}
                            classes='flex-grow'
                            error={errors.name && <FieldError message={errors.name} />}
                            required
                          >
                            <div className='flex flex-grow'>
                              <Input
                                type='text'
                                handleChange={handleChange('name')}
                                placeholder=''
                                // maxLength={50}
                                onBlur={handleBlur}
                                value={values.name}
                              />
                            </div>
                          </Field>
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('page:Subject')}
                            classes='flex-grow'
                            error={errors.subject && <FieldError message={errors.subject} />}
                            required
                          >
                            <div className='flex flex-grow'>
                              <Input
                                type='text'
                                handleChange={handleChange('subject')}
                                placeholder=''
                                // maxLength={50}
                                onBlur={handleBlur}
                                value={values.subject}
                              />
                            </div>
                          </Field>
                        </div>

                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('profile:Email')}
                            classes='flex-grow'
                            error={errors.email && <FieldError message={errors.email} />}
                            required
                          >
                            <div className='flex flex-grow'>
                              <Input
                                type='text'
                                handleChange={handleChange('email')}
                                placeholder=''
                                // maxLength={50}
                                value={values.email}
                                onBlur={handleBlur}
                                onKeyDown={el => {
                                  if ([' '].includes(el.key)) el.preventDefault();
                                }}
                              />
                            </div>
                          </Field>
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <Field
                            label={t('common:txt_phone')}
                            classes='flex-grow'
                            error={errors.phone && <FieldError message={errors.phone} />}
                          >
                            <PhoneInput
                              inputStyle={{
                                width: '100%',
                                padding: '22px 50px',
                              }}
                              value={`${values.phone}`}
                              country={Country}
                              countryCodeEditable={false}
                              onChange={(_, country: any, {target: {value}}) => {
                                const {countryCode} = country;
                                setCountry(countryCode);
                                if (isValidPhoneNumber(value ? value : '', countryCode)) {
                                  setFieldValue('PhoneValid', true);
                                  setFieldError('phone', undefined);
                                } else {
                                  setFieldValue('PhoneValid', false);
                                  setFieldError('phone', t('phone_number_invalid'));
                                }
                                setFieldValue('phone', value);
                              }}
                              isValid={values.PhoneValid}
                              inputProps={{
                                id: 'phone',
                              }}
                            />
                          </Field>
                        </div>
                        <div className=' col-span-6'>
                          <Field
                            label={t('common:Description')}
                            classes='flex-grow'
                            error={
                              errors.description && <FieldError message={errors.description} />
                            }
                            required
                          >
                            <textarea
                              rows={4}
                              name='description'
                              onChange={handleChange}
                              id='description'
                              onBlur={handleBlur}
                              value={values.description}
                              className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-5 text-right flex flex-col sm:flex-row justify-end gap-2'>
                <Button
                  variant='solid'
                  type='submit'
                  className='w-full md:w-32'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('common:txt_loading1') : t('common:btn_submit')}
                </Button>
              </div>
            </>
          </Form>
        )}
      </Formik>
      <Recaptcha
        ref={recaptchaRef}
        size='invisible'
        className='hidden'
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
      />
    </Modal>
  );
};
export default SendMessageExtension;
