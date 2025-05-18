import {useEffect, useState} from 'react';
import {getIn, useFormik} from 'formik';
import {PencilSquareIcon} from '@heroicons/react/20/solid';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useMutation, useQuery} from '@apollo/client';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {useSession} from 'next-auth/react';
import Button from '@root/components/button';
import Field from '@root/components/forms/field';
import {FieldError} from '@root/components/forms/error';
import {toast} from 'react-hot-toast';
import query from 'constants/GraphQL/Organizations/queries';
import TagElement from '@root/components/field-tags/tag-element';
import {array, object, string} from 'yup';
import Modal from '../Modal';

const OrganizationInviteModal = () => {
  const {store} = ModalContextProvider();
  const {data: session} = useSession();
  const {modalProps} = store || {};
  const {initData} = modalProps || {};
  const [Submitting, setSubmitting] = useState(false);

  const {data, loading, refetch} = useQuery(query.getOrganizationBySlug, {
    variables: {slug: initData.slug},
  });

  const {t} = useTranslation();
  const [deleteMutation] = useMutation(mutations.removeOrganizationServiceCategory);
  const [createCategory] = useMutation(mutations.addOrganizationServiceCategory);

  const handleDeleteService = async categoryTitle => {
    await deleteMutation({
      variables: {
        organizationId: initData._id,
        categoryData: categoryTitle,
        token: session?.accessToken,
      },
    });
    await refetch();
  };

  const submitHandler = async values => {
    await createCategory({
      variables: {
        organizationId: initData._id,
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
          await refetch();
          setFieldValue(
            'value',
            getIn(data, 'getOrganizationBySlug.organizationData.serviceCategories')
          );
          toast.dismiss(id);
          setValues({newTag: '', value: [...value, newTag]});
          setSubmitting(false);
        } else {
          toast.error(<p>{t('common:that_category_already_exist')}</p>);
        }
      }
    },
  });
  useEffect(() => {
    if (!loading) {
      setFieldValue(
        'value',
        getIn(data, 'getOrganizationBySlug.organizationData.serviceCategories')
      );
    }
  }, [loading]);

  return (
    <Modal icon={PencilSquareIcon} title={`Manage Service Categories for ${initData.title}`}>
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
    </Modal>
  );
};
export default OrganizationInviteModal;
