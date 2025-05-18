import {Field, Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';

const SearchForm = ({setSearchFilter, isLoading}) => {
  const handleQuery = values => {
    const {keywords, isOrgService} = values;
    setSearchFilter({
      keywords,
      isOrgService,
      newSearch: true,
    });
  };

  const {t} = useTranslation();
  return (
    <Formik
      initialValues={{keywords: '', isOrgService: false}}
      onSubmit={values => {
        handleQuery(values);
      }}
    >
      {({values, handleChange}) => (
        <Form className='flex flex-col'>
          <div className='flex flex-row items-center py-1'>
            <input
              id='isOrgService'
              name='isOrgService'
              onChange={handleChange}
              type='checkbox'
              className='mr-2 focus:ring-mainBlue h-4 w-4 text-mainBlue border-gray-300 rounded'
            />
            {t('page:show_only_org_services')}
          </div>
          <div className='col-span-12 flex gap-2 flex-wrap justify-center sm:justify-start'>
            <Field
              type='text'
              name='keywords'
              value={values.keywords}
              placeholder={t('common:search_for_keywords')}
              className='appearance-none block max-w-max px-3 py-2 border border-gray-300 rounded-md
              shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue
              focus:border-mainBlue sm:text-sm'
            />
            <div className='col-span-12 flex gap-4 justify-center sm:justify-start'>
              <button
                disabled={isLoading}
                type='submit'
                className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-25'
              >
                {t('common:Submit')}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SearchForm;
