import {useLazyQuery} from '@apollo/client';
import Button from '@root/components/button';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import {useFormik} from 'formik';
import {useSession} from 'next-auth/react';
import {useEffect} from 'react';
import useTranslation from 'next-translate/useTranslation';
import MutualAuthQuery from 'constants/GraphQL/MutualAuth/queries';
import DropDownList from './features/drop-down-list';
import ListOfUsers from './features/list-of-users';

export default function MultualAuths() {
  const {data: session} = useSession();
  const {t} = useTranslation('common');
  const {
    values: v,
    setFieldValue: setValue,
    handleChange,
  } = useFormik({
    initialValues: {
      getUsersLoading: false,
      mode: 'searchUnauthorizedUser',
      resultsPerPage: 15,
      Usersdata: [],
      pageNumber: 0,
      userCount: 0,
      keywords: '',
    },
    onSubmit: () => {},
  });

  const [getUsers, {called, refetch}] = useLazyQuery(MutualAuthQuery.getMutualAuthList);

  const FetchUsersdata = async val => {
    setValue('getUsersLoading', true);
    if (called) {
      setValue('Usersdata', []);
      const data = await refetch({
        token: session?.accessToken,
        actoin: val.mode,
        searchParams: {
          keywords: val.keywords,
          resultsPerPage: val.resultsPerPage,
          pageNumber: val.pageNumber,
        },
      });
      setValue('userCount', data?.data?.getMutualAuthList?.userCount);
      setValue('Usersdata', data?.data?.getMutualAuthList?.Data);
    } else {
      setValue('Usersdata', []);
      const data = await getUsers({
        variables: {
          token: session?.accessToken,
          actoin: val.mode,
          searchParams: {
            keywords: val.keywords,
            resultsPerPage: val.resultsPerPage,
            pageNumber: val.pageNumber,
          },
        },
      });
      setValue('userCount', data?.data?.getMutualAuthList?.userCount);
      setValue('Usersdata', data?.data?.getMutualAuthList?.Data);
    }
    setValue('getUsersLoading', false);
  };
  useEffect(() => {
    if (!called) {
      FetchUsersdata(v);
    }
  }, []);
  const clear = async (val, mode) => {
    setValue('keywords', '');
    setValue('pageNumber', 0);
    await FetchUsersdata({...val, keywords: '', pageNumber: 0, mode});
  };

  return (
    <div className='w-full h-full'>
      <div className='w-full md:2/3 pb-4 mx-auto flex flex-col gap-2'>
        <DropDownList setValue={setValue} values={v} clear={clear} loading={v.getUsersLoading} />
        <Field label=''>
          <div className='flex flex-row w-full gap-2'>
            <Input
              disabled={v.getUsersLoading}
              className='pt-1 pb-1'
              handleChange={handleChange}
              name={'keywords'}
              value={v.keywords}
              onKeyDown={async el => {
                if (el.key === 'Enter') {
                  setValue('pageNumber', 0);
                  await FetchUsersdata({...v, pageNumber: 0});
                }
              }}
              type='text'
              placeholder={t('Search User')}
            />
            <Button
              variant='solid'
              type='submit'
              onClick={async () => {
                setValue('pageNumber', 0);
                FetchUsersdata({...v, pageNumber: 0});
              }}
              disabled={v.getUsersLoading}
            >
              {t('search')}
            </Button>
          </div>
        </Field>
        <ListOfUsers
          getUsersLoading={v.getUsersLoading}
          token={session?.accessToken}
          getUsers={getUsers}
          setValue={setValue}
          values={v}
        />
      </div>
    </div>
  );
}
