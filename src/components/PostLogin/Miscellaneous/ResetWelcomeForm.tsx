import useTranslation from 'next-translate/useTranslation';
import {Formik} from 'formik';
import Button from '@components/button';
import {useContext, useState} from 'react';
import {object, string} from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import {UserContext} from '@root/context/user';
import Input from '../Marketing/Input';

const MakeUserVerifiedForm = ({setDisplayingForm}) => {
  const {t} = useTranslation('common');
  const {user, refetchUser} = useContext(UserContext);
  const [formLoading, setFormLoading] = useState(false);

  const submitHandler = async (values, {setFieldError, resetForm}) => {
    try {
      setFormLoading(true);
      const {data: response} = await axios.post('/api/admin/resetWelcomeProcess', {
        username: values.username,
      });
      const {message, status} = response.data.data.resetWelcomeProcess;

      if (status === 200) {
        toast.success(t('User Updated Successfully'));
        if (user?.username === values.username) {
          await refetchUser();
        }
        resetForm();
      } else {
        switch (message) {
          case 'User Document Not Found':
            setFieldError('username', t('User Not Found'));
            break;
          default:
            toast.error(message);
            break;
        }
      }
    } catch (e) {
      console.log('Unknown Error');
      setFormLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
      }}
      validationSchema={object().shape({
        username: string().required().label('Username').max(254),
      })}
      onSubmit={(values, {setFieldError, resetForm}) => {
        submitHandler(values, {setFieldError, resetForm}).finally(() => {
          setFormLoading(false);
        });
      }}
    >
      {({handleSubmit, handleChange, handleBlur, values, errors, touched}) => (
        <form onSubmit={handleSubmit} className={'grid grid-cols-1'}>
          <div className={'flex flex-col gap-4 border-2 border-double border-slate-100 p-8'}>
            <div className='col-span-1 sm:col-span-4'>
              <h2 className='text-xl sm:text-2xl font-bold text-mainBlue tracking-tight'>
                {t('reset_the_user_welcome_process')}
              </h2>
            </div>
            <div className='w-full flex flex-col md:flex-row gap-2'>
              <Input
                type='text'
                autoFocus
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.username}
                name='username'
                label={'Username'}
                required
                className='w-full md:w-1/2'
                errors={errors.username}
                touched={touched.username}
              />
            </div>

            <div className='gap-2 grid grid-cols-6 w-full'>
              <Button
                disabled={formLoading}
                type='button'
                variant={'outline'}
                className='col-span-3 md:col-span-1 col-start-1 md:col-start-2'
                onClick={() => {
                  setDisplayingForm('NONE');
                }}
              >
                {t('btn_cancel')}
              </Button>
              <Button
                className='col-span-3 md:col-span-1'
                disabled={formLoading}
                type='submit'
                variant={'solid'}
                onClick={() => {}}
              >
                {formLoading ? t('Submitting') : t('Submit')}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default MakeUserVerifiedForm;
