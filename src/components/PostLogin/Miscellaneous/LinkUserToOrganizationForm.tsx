import useTranslation from 'next-translate/useTranslation';
import {Formik} from 'formik';
import Button from '@components/button';
import {useMutation} from '@apollo/client';
import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {toast} from 'react-hot-toast';
import Input from '../Marketing/Input';
import {MARKETER_LINK_ORGANIZATION_YUP} from '../../../constants/yup/marketOrg';
import organizationMutations from '../../../constants/GraphQL/Organizations/mutations';

const LinkUserToOrganizationForm = ({setDisplayingForm}) => {
  const {t} = useTranslation('common');
  const [formLoading, setFormLoading] = useState(false);
  const {data: session} = useSession();

  const [linkMutation] = useMutation(organizationMutations.linkUserToOrganization);

  const submitHandler = async (values, {setFieldError, resetForm}) => {
    try {
      setFormLoading(true);
      const {data: response} = await linkMutation({
        variables: {
          organizationTitle: values.orgTitle,
          userEmail: values.userEmail,
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
      if (response.linkUserToOrganization.status !== 200) {
        switch (response.linkUserToOrganization.message) {
          case 'User is Already a Member of this Organization':
            setFieldError('orgTitle', t('User is Already a Member of this Organization'));
            break;
          case 'Organization Document Not Found':
            setFieldError('orgTitle', t('Organization Not Found'));

            break;
          case 'User Document Not Found':
            setFieldError('userEmail', t('User Not Found'));
            break;
          default:
            break;
        }
        setFormLoading(false);
        return;
      }
      if (response.linkUserToOrganization.status === 200) {
        switch (response.linkUserToOrganization.message) {
          case 'User Linked Successfully':
            toast.success(t('User Linked Successfully'));
            resetForm();
            break;
          default:
            break;
        }
        setFormLoading(false);
        return;
      }
    } catch (e) {
      setFormLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        userEmail: '',
        orgTitle: '',
      }}
      validationSchema={MARKETER_LINK_ORGANIZATION_YUP}
      onSubmit={(values, {setFieldError, resetForm}) => {
        submitHandler(values, {setFieldError, resetForm});
      }}
    >
      {({handleSubmit, handleChange, handleBlur, values, errors, touched}) => (
        <form onSubmit={handleSubmit} className={'grid grid-cols-1'}>
          <div className={'flex flex-col gap-4 border-2 border-double border-slate-100 p-8'}>
            <div className='col-span-1 sm:col-span-4'>
              <h2 className='text-xl sm:text-2xl font-bold text-mainBlue tracking-tight'>
                {t('link_user_to_organization')}
              </h2>
            </div>
            <div className='w-full flex flex-col md:flex-row gap-2'>
              <Input
                type='text'
                autoFocus
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.orgTitle}
                name='orgTitle'
                label={'Organization Title'}
                required
                errors={errors.orgTitle}
                touched={touched.orgTitle}
                className='w-full'
              />
              <Input
                type='text'
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.userEmail}
                name='userEmail'
                label={'User Email'}
                required
                className='w-full'
                errors={errors.userEmail}
                touched={touched.userEmail}
              />
            </div>

            <div
              className={
                'col-span-1 mb-4 sm:mb-0 sm:col-span-4 gap-4 w-full flex justify-end items-center'
              }
            >
              <div className='gap-2 grid grid-cols-6 w-full'>
                <Button
                  disabled={formLoading}
                  type='button'
                  variant={'outline'}
                  className='col-span-3 sm:col-span-1 col-start-1 sm:col-start-5'
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
                  onClick={() => {}}
                >
                  {formLoading ? t('Submitting') : t('Submit')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default LinkUserToOrganizationForm;
