import {Transition} from '@headlessui/react';
import {UsersIcon} from '@heroicons/react/20/solid';
import useTranslation from 'next-translate/useTranslation';
import {useEffect} from 'react';
import {useLazyQuery, useMutation} from '@apollo/client';
import {useFormik} from 'formik';
import MutualAuthQuery from 'constants/GraphQL/MutualAuth/queries';
import {signIn, useSession} from 'next-auth/react';
import mutations from 'constants/GraphQL/MutualAuth/mutations';
import toast, {LoaderIcon} from 'react-hot-toast';
import cn from 'classnames';
import {PSendRequest} from '@root/features/mutual-auths/features/constants';

const Item = ({onClick, user}) => (
  <li onClick={onClick} className='flex flex-row items-center gap-2 border-b p-2 cursor-pointer'>
    <div className='flex flex-row w-full items-center justify-start gap-2 '>
      <div
        className={cn([
          'w-[35px] min-w-[35px] bg-gray-300 h-[35px] rounded-full drop-shadow-md overflow-hidden',
        ])}
      >
        {user && <img src={user?.avatar || '/assets/default-profile.jpg'} alt='' />}
      </div>
      <div className='flex flex-col' title={`${user?.name}\n(${user?.username})`}>
        <div className='rounded-md empty:bg-gray-300 text-xs font-bold break-all line-clamp-1'>
          {user?.name}
        </div>
        <div className='rounded-md empty:bg-gray-300 text-xs text-gray-500 font-bold break-all line-clamp-1'>
          {user?.username && `(${user?.username})`}
        </div>
      </div>
    </div>
  </li>
);

export default function AutorizedUser({show, setShow}) {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const [getUsers, {called, refetch}] = useLazyQuery(MutualAuthQuery.getMutualAuthList);
  const [updateMutualAuths] = useMutation(mutations.updateMutualAuths);

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
  const SendRequest = async ({actoin, email, name}: PSendRequest) => {
    const id = toast.loading(t('common:txt_loading'));
    const data = await updateMutualAuths({
      variables: {
        token: session?.accessToken,
        ownerEmail: email,
        origin: window.origin,
        actoin: actoin,
      },
    });
    if (actoin === 'CONNECT') {
      await signIn('credentials', {
        token: data?.data?.updateMutualAuths?.token,
        callbackUrl: `${window.origin}/user/dashboard`,
        email,
        name: name,
      });
    }
    toast.dismiss(id);
    if (data.data?.updateMutualAuths?.response?.status !== 200) {
      toast.error(t(`common:${data?.data?.updateMutualAuths?.response.message}`));
    } else {
      toast.success(t(`common:${data?.data?.updateMutualAuths?.response.message}`));
    }
  };
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

  return (
    <Transition
      as={'nav'}
      show={show}
      onMouseLeave={() => {
        setShow(false);
      }}
      className={cn(['absolute p-2 top-4'])}
    >
      <div className='bg-white border w-52 h-56 rounded-md shadow-md self-end'>
        <ul className='h-full w-full overflow-y-scroll overflow-x-hidden'>
          {v.Usersdata?.map((el: any, idx) => (
            <Item
              user={el}
              key={idx}
              onClick={async () => {
                await SendRequest({actoin: 'CONNECT', email: el?.email, name: el?.name});
              }}
            />
          ))}
          {v.getUsersLoading && (
            <div className='flex w-full h-full justify-center items-center'>
              <LoaderIcon style={{width: 24, height: 24}} />
            </div>
          )}
          {!v?.getUsersLoading && (v.Usersdata?.length === 0 || !v.Usersdata) && (
            <div className='flex flex-col w-full h-full justify-center items-center'>
              <UsersIcon style={{width: 50, height: 50}} className='text-gray-700 p-2' />
              <p className='font-bold text-sm'>{t('common:no_authorized_user')}</p>
            </div>
          )}
        </ul>
      </div>
    </Transition>
  );
}
