import useTranslation from 'next-translate/useTranslation';
import {useEffect} from 'react';
import {useLazyQuery} from '@apollo/client';
import {useFormik} from 'formik';
import MutualAuthQuery from 'constants/GraphQL/MutualAuth/queries';
import {useSession} from 'next-auth/react';
import {LoaderIcon} from 'react-hot-toast';

export default function AutorizedUser({changed}) {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const [getUsers, {called, refetch}] = useLazyQuery(MutualAuthQuery.getMutualAuthList);

  const {values: v, setFieldValue: setValue} = useFormik({
    initialValues: {
      getUsersLoading: false,
      resultsPerPage: 15,
      Usersdata: [],
      pageNumber: 0,
      userCount: 0,
      keywords: '',
    },
    onSubmit: () => {},
  });

  const FetchUsersdata = async val => {
    setValue('getUsersLoading', true);
    if (called) {
      setValue('Usersdata', []);
      const data = await refetch({
        token: session?.accessToken,
        actoin: 'getAuthorizedUser',
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
          actoin: 'getAuthorizedUser',
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

  useEffect(() => {
    FetchUsersdata(v);
  }, [changed]);

  return (
    <ul className='h-full w-full'>
      {v.Usersdata?.length > 0 ? (
        <div className='h-full w-full flex flex-col justify-start items-start'>
          <p className='text-sm'>{t('common:you_have_authorized')} :</p>
          <dd className='h-full w-full list-disc flex flex-col text-sm justify-start items-start'>
            {v.Usersdata?.map((el: any, idx) =>
              idx < 3 ? <li>{el?.username && `${el?.username}`}</li> : idx === 3 && `...`
            )}
          </dd>
        </div>
      ) : (
        !v.getUsersLoading && (
          <p className='text-xs text-blueGray-400 h-[6rem]'>
            {t(`common:DASHBOARD_AUTHORIZE_DESCRIPTION`)}
          </p>
        )
      )}
      {v.getUsersLoading && (
        <div className='flex w-full h-full justify-center items-center'>
          <LoaderIcon style={{width: 24, height: 24}} />
        </div>
      )}
    </ul>
  );
}
