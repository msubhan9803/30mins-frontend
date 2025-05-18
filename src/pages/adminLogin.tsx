import {useRef, useState} from 'react';
import {Field, Formik} from 'formik';
import {signIn} from 'next-auth/react';
import Recaptcha from 'react-google-recaptcha';

function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<Recaptcha>();

  const signInSubmitHandler = async values => {
    try {
      setLoading(true);
      const captchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      await signIn('credentials', {
        email: values.email,
        password: values.password,
        captchaToken,
        callbackUrl: 'https://30mins.com/user/dashboard',
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto grid grid-cols-1 px-6 pt-6 sm:w-96 sm:h-screen'>
      <Formik initialValues={{email: '', password: ''}} onSubmit={signInSubmitHandler}>
        {({handleSubmit}) => (
          <>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <Recaptcha
                ref={recaptchaRef}
                size='invisible'
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
              />
              <Field
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                type='email'
                name='email'
                required
                placeholder='Email'
              />
              <Field
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                type='password'
                name='password'
                required
                placeholder='Password'
              />

              <button
                className='buttonBase block text-center w-full rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                type='submit'
              >
                {loading ? 'Loading' : 'Sign In'}
              </button>
            </form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default AdminLogin;
