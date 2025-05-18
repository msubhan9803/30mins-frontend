import useTranslation from 'next-translate/useTranslation';
import {Form, Formik} from 'formik';
import Recaptcha from 'react-google-recaptcha';
import Button from '@root/components/button';
import Input from '@root/components/forms/input';

const HomeSearchForm = ({onSubmit, recaptchaRef, initialValues}) => {
  const {t} = useTranslation();

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(values, {setSubmitting}) => {
        onSubmit(values, setSubmitting);
      }}
    >
      {({values, handleChange, handleSubmit}) => (
        <Form onSubmit={handleSubmit} className='flex-grow w-full lg:w-2/3'>
          <Recaptcha
            ref={recaptchaRef}
            size='invisible'
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
          />
          <div className='flex h-10 flex-grow w-full'>
            <div className='flex w-full flex-row gap-2'>
              <Input
                type='text'
                name='keywords'
                id='keywords'
                value={values.keywords}
                handleChange={handleChange}
                placeholder={t('common:search_by_name')}
              />
              <Input
                type='text'
                name='location'
                id='location'
                value={values.location}
                handleChange={handleChange}
                placeholder={t('common:search_by_country')}
              />
              <Button variant='solid' className='my-auto' type='submit'>
                <svg
                  aria-hidden='true'
                  focusable='false'
                  data-prefix='fas'
                  data-icon='search'
                  className='w-4'
                  role='img'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                >
                  <path
                    fill='currentColor'
                    d='M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z'
                  ></path>
                </svg>
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default HomeSearchForm;
