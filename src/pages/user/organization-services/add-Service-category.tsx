import {useEffect, useState} from 'react';
import Head from 'next/head';

import useTranslation from 'next-translate/useTranslation';
import {useFormik} from 'formik';
import {useMutation, useQuery} from '@apollo/client';
import {toast} from 'react-hot-toast';
import {array, object, string} from 'yup';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';

import mutations from 'constants/GraphQL/Organizations/mutations';
import query from 'constants/GraphQL/Organizations/queries';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Button from '@root/components/button';
import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';
import TagElement from '@root/components/field-tags/tag-element';
import Loader from 'components/shared/Loader/Loader';
import DropDownComponent from 'components/shared/DropDownComponent';

export default function AddOrganizationServices() {
  const {t} = useTranslation('');

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {
      title: t('page:Add Service Category'),
      href: '/user/organization-services/add-Service-category',
    },
  ];

  const {data: session} = useSession();
  const router = useRouter();

  const [deleteMutation] = useMutation(mutations.removeOrganizationServiceCategory);
  const [createCategory] = useMutation(mutations.addOrganizationServiceCategory);

  const {data: organizations, loading: orgLoading} = useQuery(
    query.getOrganizationManagementDetails,
    {
      variables: {
        token: session?.accessToken,
      },
    }
  );

  const organizationsData = organizations?.getOrganizationManagementDetails?.membershipData;

  const [currentSelectedOrg, setCurrentSelectedOrg] = useState<any>(null);
  const [Submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (organizationsData) {
      setCurrentSelectedOrg(organizationsData[0]?.organizationId || null);
    }
  }, [organizationsData]);

  const selectOrganizations =
    organizationsData
      ?.filter(item => item.role === 'owner' || item.role === 'admin')
      ?.map(item => ({
        value: item.organizationId._id,
        key: item.organizationId.title,
      })) ?? [];

  const handleChangeOrganization = e => {
    const {value} = e.target;

    const currentOrg = organizationsData.find(item => item.organizationId._id === value);

    setCurrentSelectedOrg(currentOrg?.organizationId);
  };

  const submitHandler = async values => {
    await createCategory({
      variables: {
        organizationId: currentSelectedOrg?._id,
        categoryData: values.newTag,
        token: session?.accessToken,
      },
    });
  };

  const {errors, handleChange, setValues, setFieldValue, submitForm, values} = useFormik<{
    value: Array<string>;
    newTag: string;
  }>({
    initialValues: {value: [], newTag: ''},
    validationSchema: object({
      newTag: string().max(50, 'title_must_be_at_most_50_characters').trim(),
      value: array()
        .of(string())
        .max(9, 'no_more_category')
        .default([])
        .test(
          'newTag',
          'category_already_exists',
          (value: Array<string>, {parent}) => !value.includes(parent.newTag)
        ),
    }),
    onSubmit: async ({newTag, value}) => {
      if (newTag !== '' && !Submitting) {
        if (!values.value?.includes(newTag) && value.length < 10) {
          setSubmitting(true);
          const id = toast.loading(
            <p>
              {`${t('common:adding_category')} `}
              <span className='text-green-500'>{`${newTag}`}</span>
            </p>
          );
          await submitHandler({newTag, value});
          toast.success(<p>{t('common:category_added')}</p>);

          toast.dismiss(id);
          setValues({newTag: '', value: [...value, newTag]});
          setSubmitting(false);
          router.reload();
        } else {
          toast.error(<p>{t('common:that_category_already_exist')}</p>);
        }
      }
    },
  });

  const handleDeleteService = async categoryTitle => {
    await deleteMutation({
      variables: {
        organizationId: currentSelectedOrg?._id,
        categoryData: categoryTitle,
        token: session?.accessToken,
      },
    });

    setFieldValue(
      'value',
      currentSelectedOrg?.serviceCategories?.filter(item => item !== categoryTitle)
    );
    router.reload();
  };

  useEffect(() => {
    if (currentSelectedOrg) {
      setFieldValue('value', currentSelectedOrg?.serviceCategories);
    }
  }, [currentSelectedOrg]);

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:Add Service Category')}</title>
      </Head>

      <Header crumbs={crumbs} heading={t('page:Add Service Category')} />

      {orgLoading && !organizationsData && (
        <div className='mt-6'>
          <Loader />
        </div>
      )}

      {!orgLoading && !organizationsData && (
        <div className='mt-6 text-center'>
          <p className='text-gray-500 text-2xl'>{t('common:no_organization_found')}</p>
        </div>
      )}

      <div className='mt-6'>
        {organizationsData && (
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
            <p className='text-lg font-semibold text-mainText'>{t('common:select_organization')}</p>
            <DropDownComponent
              name='currentOrganization'
              options={selectOrganizations}
              className='w-full max-w-[300px]'
              onChange={handleChangeOrganization}
            />
          </div>
        )}

        {currentSelectedOrg && (
          <div className='mt-4'>
            <div className='flex flex-col w-full gap-2'>
              <div className='flex flex-row w-full gap-2'>
                <div className='flex flex-col w-full'>
                  <label className='block text-md font-medium text-gray-700'>
                    {t('common:category_title')}
                  </label>
                  <div className='flex flex-col md:flex-row gap-2 items-start'>
                    <Field
                      label=''
                      className='w-full'
                      error={
                        (errors.newTag && <FieldError message={t(`common:${errors.newTag}`)} />) ||
                        (errors.value && <FieldError message={t(`common:${errors.value}`)} />)
                      }
                    >
                      <input
                        className='px-4 py-2 w-full border text-base shadow-sm focus:ring-mainBlue focus:ring-offset-0 focus:ring-0 focus:border-mainBlue border-gray-300 rounded-lg appearance-none hover:appearance-none'
                        name='newTag'
                        onKeyDown={e => e.key === 'Enter' && submitForm()}
                        autoFocus
                        value={values.newTag}
                        onChange={handleChange}
                      />
                    </Field>
                    <Button
                      type={'submit'}
                      variant='solid'
                      className='mt-1 w-full md:w-auto'
                      style={{height: 40}}
                      onSubmit={submitForm}
                      onClick={async () => {
                        await submitForm();
                      }}
                    >
                      {t('common:add')}
                    </Button>
                  </div>
                </div>
              </div>

              {values.value?.length > 0 && (
                <div className='flex gap-3 flex-wrap p-2 flex-row content-start items-center h-max max-h-max border rounded-md overflow-y-hidden'>
                  {values.value?.map((el, idx) => (
                    <TagElement
                      key={idx}
                      value={el}
                      onRemove={async () => {
                        setFieldValue(
                          'value',
                          values.value.filter(e => e !== el)
                        );
                        const id = toast.loading(
                          <p>
                            {`${t('common:deleting_category')} `}
                            <span className='text-red-500'>{`${el}`}</span>
                          </p>
                        );
                        await handleDeleteService(el);
                        toast.dismiss(id);
                        toast.success(<p>{t('common:category_deleted')}</p>);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PostLoginLayout>
  );
}

AddOrganizationServices.auth = true;
