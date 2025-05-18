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
      {({handleSubmit, handleChange, handleBlur, values, errors, touched}) => (
        <form onSubmit={handleSubmit} className={'grid grid-cols-4 gap-4'}>
          <Input
            type='text'
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.orgTitle}
            name='orgTitle'
            label={'Organization Title'}
            required
            colSpan={1}
            errors={errors.orgTitle}
            touched={touched.orgTitle}
          />
          <Input
            type='text'
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.userEmail}
            name='userEmail'
            label={'User Email'}
            required
            colSpan={1}
            errors={errors.userEmail}
            touched={touched.userEmail}
          />

          <div className={'col-span-4 gap-4 w-full flex justify-end items-center'}>
            {formError ? (
              <span className={'text-red-500 font-bold'}>
                {t('Error')}: {formError}
              </span>
            ) : null}

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
            <Button disabled={formLoading} type='submit' variant={'outline'} onClick={() => {}}>
              {formLoading ? t('Submitting') : t('Submit')}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default LinkUserToOrganizationForm;
