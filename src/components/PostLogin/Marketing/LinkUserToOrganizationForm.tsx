import useTranslation from 'next-translate/useTranslation';
import {Formik} from 'formik';
import Button from '@components/button';
import {useMutation} from '@apollo/client';
import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import Input from './Input';
import {MARKETER_LINK_ORGANIZATION_YUP} from '../../../constants/yup/marketOrg';
import organizationMutations from '../../../constants/GraphQL/Organizations/mutations';

const LinkUserToOrganizationForm = ({setDisplayingForm}) => {
  const {t} = useTranslation('common');
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const {data: session} = useSession();

  const [linkMutation] = useMutation(organizationMutations.linkUserToOrganization);

  const submitHandler = async values => {
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
        setFormError(response.linkUserToOrganization.message);
        setFormLoading(false);
        return;
      }

      router.reload();
    } catch (e) {
      console.log('Unknown Error');
      setFormError('Unknown Error');
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
      onSubmit={values => {
        submitHandler(values);
      }}
    >
      {({handleSubmit, setFieldValue, handleChange, handleBlur, values, errors, touched}) => (
        <form onSubmit={handleSubmit} className={'grid grid-cols-1 gap-4'}>
          <div
            className={
              'grid grid-cols-2 mb-4 lg:grid-cols-4 gap-4 border-2 border-double border-slate-100 p-8'
            }
          >
            <div className='col-span-4'>
              <h2 className='text-xl sm:text-2xl font-bold text-mainBlue tracking-tight'>
                {t('link_user_to_organization')}
              </h2>
            </div>
            <div className='col-span-4 md:col-span-2'>
              <Input
                type='text'
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.orgTitle}
                name='orgTitle'
                label={'Organization Title'}
                required
                errors={errors.orgTitle}
                touched={touched.orgTitle}
              />
            </div>
            <div className='col-span-4 md:col-span-2'>
              <Input
                type='text'
                // handleChange={handleChange}
                handleChange={e => {
                  setFieldValue('userEmail', e.target.value.trim());
                }}
                handleBlur={handleBlur}
                value={values.userEmail}
                name='userEmail'
                label={'User Email'}
                required
                errors={errors.userEmail}
                touched={touched.userEmail}
              />
            </div>
            <div className={'mb-4 sm:mb-0 gap-2 w-full  items-center'}>
              {formError ? (
                <span className={'text-red-500 font-bold'}>
                  {t('Error')}: {formError}
                </span>
              ) : null}
              <div className='flex justify-around gap-2 mt-5'>
                <Button
                  disabled={formLoading}
                  type='button'
                  variant={'outline'}
                  onClick={() => {
                    setDisplayingForm('NONE');
                  }}
                >
                  {t('btn_cancel')}
                </Button>
                <Button disabled={formLoading} type='submit' variant={'solid'} onClick={() => {}}>
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
