import useTranslation from 'next-translate/useTranslation';
import {Formik} from 'formik';
import Button from '@components/button';
import {useState} from 'react';
// import {useMutation} from '@apollo/client';
// import {useSession} from 'next-auth/react';
// import Input from './Input';
import {toast} from 'react-hot-toast';
import {object, string} from 'yup';
import axios from 'axios';
// import userMutations from '../../../constants/GraphQL/User/mutations';
import Input from '../Marketing/Input';

const AddAffiliateForm = ({setDisplayingForm}) => {
  const {t} = useTranslation('common');
  const [formLoading, setFormLoading] = useState(false);

  const submitHandler = async (values, {setFieldError, resetForm}) => {
    try {
      setFormLoading(true);
      const {data: response} = await axios.post('/api/admin/makeAffiliateUser', {
        affiliateTeam: values.affiliateTeam,
        username: values.username,
      });
      const {message, status} = response.data.data.makeAffiliateUser;
      if (status === 200) {
        toast.success(t('User Updated Successfully'));
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
      console.log('Error!');
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        affiliateTeam: '',
      }}
      validationSchema={object().shape({
        username: string().required().label('Username').max(254),
        affiliateTeam: string().required().label('Affiliate Team').max(254),
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
                {t('make_user_affiliate')}
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
                errors={errors.username}
                touched={touched.username}
                className='w-full'
              />
              <Input
                type='text'
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.affiliateTeam}
                name='affiliateTeam'
                label={'Affiliate Team'}
                required
                errors={errors.affiliateTeam}
                touched={touched.affiliateTeam}
                className='w-full'
              />
            </div>
            <div className={'gap-2 grid grid-cols-6 w-full'}>
              <Button
                disabled={formLoading}
                type='button'
                className='col-span-3 sm:col-span-1 col-start-1 sm:col-start-5'
                variant={'outline'}
                onClick={() => {
                  setDisplayingForm('NONE');
                }}
              >
                {t('btn_cancel')}
              </Button>
              <Button
                disabled={formLoading}
                className='col-span-3 sm:col-span-1'
                type='submit'
                variant={'solid'}
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

export default AddAffiliateForm;
