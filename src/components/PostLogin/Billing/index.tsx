import {BILLING_INFO_YUP} from 'constants/yup/billingInfo';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import Countries from 'constants/forms/country.json';
import {useSession} from 'next-auth/react';
import mutations from 'constants/GraphQL/User/mutations';
import {useEffect, useState} from 'react';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import {FieldError} from '@root/components/forms/error';
import Button from '@root/components/button';
import {toast} from 'react-hot-toast';

const BilingEdit = ({userData}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();

  const router = useRouter();

  const User = userData?.billingDetails;
  const [updateUser] = useMutation(mutations.updateUser);

  const [initialValues, setInitialValues] = useState({
    fname: '',
    lname: '',
    address: '',
    buildingNumber: '',
    country: '',
    zipCode: '',
    city: '',
  });

  useEffect(() => {
    setInitialValues({
      fname: User?.fname,
      lname: User?.lname,
      address: User?.address,
      buildingNumber: User?.buildingNumber,
      country: User?.country === null ? 'United States' : User?.country,
      zipCode: User?.zipCode,
      city: User?.city,
    });
  }, [
    User?.address,
    User?.buildingNumber,
    User?.city,
    User?.country,
    User?.lname,
    User?.zipCode,
    User?.fname,
  ]);

  const CountriesPicker = Countries.map(countryData => (
    <option key={countryData.label}>{countryData.label}</option>
  ));

  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);
    await updateUser({
      variables: {
        userData: {
          billingDetails: {
            fname: values.fname,
            lname: values.lname,
            address: values.address,
            buildingNumber: values.buildingNumber,
            country: values.country,
            city: values.city,
            zipCode: values.zipCode,
          },
        },
        token: session?.accessToken,
      },
    });
    toast.success(t('common:Billing information Saved'));
    router.reload();
    setSubmitting(false);
  };

  return (
    <>
      <div className='col-span-8 sm:col-span-4 shadow-lg py-5 px-5'>
        <Formik
          initialValues={initialValues}
          validationSchema={BILLING_INFO_YUP}
          onSubmit={(values, {setSubmitting}) => {
            submitHandler(values, setSubmitting);
          }}
          enableReinitialize
        >
          {({isSubmitting, values, handleChange, handleBlur, handleSubmit, touched, errors}) => (
            <Form onSubmit={handleSubmit} className='flex flex-col gap-2'>
              <span className='font-medium text-gray-500 paymentOptionDesc'>
                {t('setting:billing_info')}
              </span>
              <div className='grid grid-cols-6 gap-2'>
                <div className='col-span-6 sm:col-span-3 '>
                  <Field
                    label={t('profile:first_name')}
                    error={touched?.fname && errors?.fname && <FieldError message={errors.fname} />}
                    required
                  >
                    <Input
                      type='text'
                      handleChange={handleChange}
                      onBlur={handleBlur}
                      value={values.fname}
                      maxLength={100}
                      name='fname'
                      id='fname'
                    />
                  </Field>
                </div>
                <div className='col-span-6 sm:col-span-3 '>
                  <Field
                    label={t('profile:last_name')}
                    error={
                      touched?.lname && errors?.lname && <FieldError message={errors?.lname} />
                    }
                    required
                  >
                    <Input
                      type='text'
                      handleChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lname}
                      maxLength={100}
                      name='lname'
                      id='lname'
                    />
                  </Field>
                </div>

                <div className='col-span-6 sm:col-span-3 '>
                  <Field
                    label={t('profile:address')}
                    error={
                      touched?.address &&
                      errors?.address && <FieldError message={errors?.address} />
                    }
                    required
                  >
                    <Input
                      type='text'
                      value={values.address}
                      name='address'
                      handleChange={handleChange}
                      maxLength={100}
                      onBlur={handleBlur}
                      id='address'
                    />
                  </Field>
                </div>
                <div className='col-span-6 sm:col-span-3 '>
                  <Field
                    label={t('profile:building_number')}
                    error={
                      touched?.buildingNumber &&
                      errors?.buildingNumber && <FieldError message={errors?.buildingNumber} />
                    }
                  >
                    <Input
                      handleChange={handleChange}
                      onBlur={handleBlur}
                      type='text'
                      value={values.buildingNumber}
                      name='buildingNumber'
                      maxLength={15}
                      id='buildingNumber'
                    />
                  </Field>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <div className='col-span-2 sm:col-span-1'>
                  <Field
                    label={t('profile:country')}
                    error={
                      touched?.country &&
                      errors?.country && <FieldError message={errors?.country} />
                    }
                    required
                  >
                    <select
                      value={values.country}
                      id='country'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='country'
                      className='block w-full bg-white border border-gray-300 rounded-md shadow-sm h-[50px] py-2 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                    >
                      {CountriesPicker}
                    </select>
                  </Field>
                </div>

                <div className='col-span-2 sm:col-span-1'>
                  <Field
                    label={t('profile:city')}
                    error={touched?.city && errors?.city && <FieldError message={errors?.city} />}
                    required
                  >
                    <Input
                      type='text'
                      handleChange={handleChange}
                      onBlur={handleBlur}
                      value={values.city}
                      maxLength={50}
                      name='city'
                      id='city'
                    />
                  </Field>
                </div>

                <div className='col-span-2 sm:col-span-1'>
                  <Field
                    label={t('profile:zip_code')}
                    error={
                      touched?.zipCode &&
                      errors?.zipCode && <FieldError message={errors?.zipCode} />
                    }
                    required
                  >
                    <Input
                      type='text'
                      value={values.zipCode}
                      name='zipCode'
                      handleChange={handleChange}
                      maxLength={15}
                      onBlur={handleBlur}
                      id='zipCode'
                    />
                  </Field>
                </div>
              </div>
              <div className='flex flex-row-reverse w-full'>
                <Button
                  variant='solid'
                  type='submit'
                  className='w-full sm:w-[150px]'
                  disabled={isSubmitting}
                >
                  {t('common:btn_save')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default BilingEdit;
