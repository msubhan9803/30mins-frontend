import {Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/24/outline';
import {UsersIcon} from '@heroicons/react/20/solid';
import cn from 'classnames';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import mutations from 'constants/GraphQL/MutualAuth/mutations';
import {useContext, useEffect, useState} from 'react';
import {useLazyQuery, useMutation} from '@apollo/client';
import {useFormik} from 'formik';
import MutualAuthQuery from 'constants/GraphQL/MutualAuth/queries';
import {signIn, useSession} from 'next-auth/react';
import toast, {LoaderIcon} from 'react-hot-toast';
import {PSendRequest} from '@root/features/mutual-auths/features/constants';
import {CollapseDrawerContext} from 'store/Sidebar/Sidebar.context';

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

export default function SwitcherAuth({collapsed, isMobile, pathname}) {
  const {data: session} = useSession();
  const [show, setShow] = useState(false);
  const {t} = useTranslation();
  const router = useRouter();
  const [getUsers, {called, refetch}] = useLazyQuery(MutualAuthQuery.getMutualAuthList);
  const {handleActiveRouteToggle} = useContext(CollapseDrawerContext);
  const [updateMutualAuths] = useMutation(mutations.updateMutualAuths);
  const currentHref = `/user/mutual-auth`;

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

  const handleSettingsClick = async (route: string) => {
    handleActiveRouteToggle({
      routeName: currentHref,
      childRouteName: '',
      isDropdownOpen: false,
      href: route,
      isChild: false,
    });
    await router.push(route);
  };

  return (
    <div className='w-full flex justify-center items-center px-4'>
      <nav
        className={cn([
          currentHref === pathname && 'bg-mainBlue bg-opacity-[12.5%]',
          {'pr-1.5': !collapsed},
          {'flex items-center w-full': collapsed},
          `text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex py-2 ${
            !collapsed && 'pl-5'
          } items-center text-base rounded-lg text-left w-full`,
        ])}
      >
        <span
          className={cn([{'w-full': !collapsed}])}
          onClick={() => handleSettingsClick(currentHref)}
        >
          <span
            key={t('common:Mutual Auth')}
            className={cn(
              currentHref === pathname ? 'text-mainBlue' : 'text-gray-500',
              'hover:text-mainBlue flex group space-x-4',
              'items-center text-base font-normal rounded-lg',
              'cursor-pointer text-left select-none',
              {'w-full justify-start': collapsed}
            )}
          >
            <UsersIcon
              className={cn(
                currentHref === pathname ? 'text-mainBlue' : 'text-gray-500',
                'flex flex-shrink-0 group-hover:text-mainBlue items-start justify-center w-6 h-6'
              )}
              aria-hidden='true'
            />
            <span
              title={t('common:Authorized Users')}
              className={cn([
                {hidden: collapsed},
                'flex-1 min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy',
              ])}
            >
              {t('common:Mutual Auth').length > 18
                ? `${t('common:Mutual Auth').substring(0, 18).trim()}...`
                : t('common:Mutual Auth')}
            </span>
          </span>
        </span>
        <span
          className={cn(['p-2 text-gray-500 ', {hidden: collapsed}])}
          onClick={async () => {
            setShow(!show);
            if (!show) {
              FetchUsersdata(v);
            }
          }}
        >
          <ChevronDownIcon
            className={cn(['w-4 h-4', show ? (isMobile ? 'rotate-90' : '-rotate-90') : 'rotate-0'])}
          />
        </span>
      </nav>
      <Transition
        as={'nav'}
        show={show}
        onMouseLeave={() => {
          setShow(false);
        }}
        className={cn([
          'absolute p-2',
          collapsed && !isMobile ? 'bottom-2 left-24' : 'left-72 bottom-2 ',
          !collapsed && isMobile && 'bottom-16 -left-1',
        ])}
      >
        <div className='bg-white border w-52 h-56 rounded-md shadow-md self-end'>
          <ul className='h-full w-full overflow-y-scroll overflow-x-hidden'>
            {v.Usersdata?.map((el: any, idx) => (
              <Item
                user={el}
                key={idx}
                onClick={async () => {
                  setShow(false);
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
    </div>
  );
}
