import queries from 'constants/GraphQL/User/queries';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import React, {useCallback, useRef, useState, useContext} from 'react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/User/mutations';
import {useRouter} from 'next/router';
import axios from 'axios';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';
import Header from '@root/components/header';
import dayjs from 'dayjs';
import {UserContext} from '@root/context/user';
import Table from './table';
import SearchForm from './SearchForm';

const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const AllAffiliates = ({session}) => {
  const {t} = useTranslation();

  const [users, setUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const queryIdRef = useRef(0);

  const {user} = useContext(UserContext);

  const [searchFilter, setSearchFilter] = useState({
    keywords: '',
    newSearch: false,
  });

  const [userSelectedIds, setUserSelectedIds] = useState({
    UserIds: [],
    isSelected: false,
  });

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const [deleteUser] = useMutation(mutations.adminDeleteUser);
  const [AdminDeleteUsers] = useMutation(mutations.adminDeleteUsers);
  const {showModal, hideModal} = ModalContextProvider();
  const router = useRouter();

  const handleMutationAdminDeleteUsers = async () => {
    const {data} = await AdminDeleteUsers({
      variables: {
        userIDs: userSelectedIds.UserIds,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
          'Content-Type': 'application/json',
        },
      },
    });
    showNotification(NOTIFICATION_TYPES.success, data?.adminDeleteUsers?.response?.message, false);
    router.reload();
    hideModal();
  };
  const handleMutationAdminDeleteUserById = async row => {
    const {data} = await AdminDeleteUsers({
      variables: {
        userIDs: row,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
          'Content-Type': 'application/json',
        },
      },
    });
    showNotification(NOTIFICATION_TYPES.success, data?.adminDeleteUsers?.response?.message, false);
    router.reload();
    hideModal();
  };
  const handleAdminDeleteUsers = async () => {
    try {
      showModal(MODAL_TYPES.DELETE, {
        isAdminDeleteUsers: true,
        handleDelete: handleMutationAdminDeleteUsers,
      });
    } catch (err) {
      showNotification(NOTIFICATION_TYPES.error, 'Error', false);
    }
  };

  const queryUsers = useCallback(
    async (userSearchParams, pageNumber, pageSize) => {
      const queryId = ++queryIdRef.current;

      const searchPayload = userSearchParams;
      delete searchPayload.newSearch;

      if (queryId === queryIdRef.current) {
        setIsLoading(true);
        graphqlRequestHandler(
          queries.getUsersForAdmin,
          {
            userSearchParams: {
              ...userSearchParams,
              isAffiliate: true,
              pageNumber,
              resultsPerPage: pageSize,
            },
            token: session?.accessToken,
          },
          process.env.BACKEND_API_KEY
        )
          .then(response => {
            const usersCount = response?.data?.data?.getUsersForAdmin?.userCount || 0;
            const userData = response?.data?.data?.getUsersForAdmin?.userData;
            if (userData) {
              userData?.forEach(element => {
                if (element?.accountDetails?.verifiedEmail)
                  element.accountDetails.verifiedEmailString = 'Yes';
                else element.accountDetails.verifiedEmailString = 'No';

                if (element?.welcomeComplete) element.welcomeCompleteString = 'Yes';
                else element.welcomeCompleteString = 'No';
              });
            }
            setUsers(response?.data?.data?.getUsersForAdmin?.userData);
            setPageCount(Math.ceil(usersCount / pageSize));
            setIsLoading(false);
          })
          .catch(e => console.log(e));
      }
    },
    [session?.accessToken]
  );

  const handleuserDelete = async row => {
    try {
      await axios.post('/api/stripe/deleteCustomerByAdmin', {
        customerDocumentId: row?.original._id,
      });

      await deleteUser({
        variables: {
          token: session?.accessToken,
          documentId: row?.original._id,
        },
      });

      router.reload();
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  const deleteUserMutation = row => {
    showModal(MODAL_TYPES.DELETE, {
      isDeleteAccount: true,
      name: row.original?.personalDetails?.name,
      handleDelete: () => {
        handleuserDelete(row);
      },
    });
  };

  const ActionColumn = ({row, value}) => (
    <div className='flex items-center'>
      <Link href={`/user/allusers/${value}`} passHref>
        <div className='mr-2 w-12 justify-center flex items-center text-gray-600 p-2 border-transparent border  bg-gray-100 hover:text-mainBlue cursor-pointer rounded focus:outline-none focus:border-gray-800 focus:shadow-outline-gray'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='icon cursor-pointer icon-tabler icon-tabler-edit'
            width={20}
            height={20}
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path stroke='none' d='M0 0h24v24H0z' />
            <path d='M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3' />
            <path d='M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3' />
            <line x1={16} y1={5} x2={19} y2={8} />
          </svg>
        </div>
      </Link>
      {row.isSelected && (
        <a
          className='w-12 justify-center flex items-center text-gray-600 p-2 border-transparent border bg-gray-100
                          hover:text-red-600 cursor-pointer rounded focus:outline-none focus:border-gray-800 focus:shadow-outline-gray'
          onClick={() => deleteUserMutation(row)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='icon cursor-pointer icon-tabler icon-tabler-trash'
            width={20}
            height={20}
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path stroke='none' d='M0 0h24v24H0z' />
            <line x1={4} y1={7} x2={20} y2={7} />
            <line x1={10} y1={11} x2={10} y2={17} />
            <line x1={14} y1={11} x2={14} y2={17} />
            <path d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12' />
            <path d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' />
          </svg>
        </a>
      )}
    </div>
  );
  const ActionDeleteColumn = ({row}) => (
    <div className='flex items-center'>
      <p
        className='w-12 justify-center flex items-center text-gray-600 p-2 border-transparent border bg-gray-100
                          hover:text-red-600 cursor-pointer rounded focus:outline-none focus:border-gray-800 focus:shadow-outline-gray'
        onClick={() => handleMutationAdminDeleteUserById(row?.original?._id)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='icon cursor-pointer icon-tabler icon-tabler-trash'
          width={20}
          height={20}
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path stroke='none' d='M0 0h24v24H0z' />
          <line x1={4} y1={7} x2={20} y2={7} />
          <line x1={10} y1={11} x2={10} y2={17} />
          <line x1={14} y1={11} x2={14} y2={17} />
          <path d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12' />
          <path d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' />
        </svg>
      </p>
    </div>
  );

  const PublicView = ({row}) => (
    <>
      <div className='flex items-center'>
        <Link href={`https://30mins.com/${row.original.accountDetails.username}`} passHref>
          Public View
        </Link>
      </div>
    </>
  );

  const lastLogin = ({row}) => (
    <>
      <div className='flex items-center'>
        {row.original.lastSeen
          ? dayjs(row.original.lastSeen).tz(user?.timezone).format('ddd DD MMM YYYY - hh:mm A')
          : '...'}
      </div>
    </>
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Username',
        accessor: 'accountDetails.username',
      },
      {
        Header: 'Email',
        accessor: 'accountDetails.email',
      },
      {
        Header: 'Verified Email',
        accessor: 'accountDetails.verifiedEmailString',
      },
      {
        Header: 'Welcome Complete',
        accessor: 'welcomeCompleteString',
      },
      {
        Header: 'Timezone',
        accessor: 'locationDetails.timezone',
      },
      {
        Header: 'Public View',
        Cell: PublicView,
      },
      {
        Header: 'Last Login',
        Cell: lastLogin,
      },
      {
        Header: 'Actions',
        accessor: '_id',
        Cell: ActionColumn,
      },
      {
        Header: 'Delete',
        Cell: ActionDeleteColumn,
      },
    ],
    []
  );

  const crumbs = [{title: t('common:all_affiliates'), href: '/'}];

  return (
    <>
      <Header crumbs={crumbs} heading={t('common:all_affiliates')} />
      <div className='min-h-screen text-gray-900'>
        <main className='max-w-7xl mx-auto px-0 pt-4'>
          <SearchForm
            setSearchFilter={setSearchFilter}
            isLoading={isLoading}
            userSelectedIds={userSelectedIds.isSelected}
            handleAdminDeleteUsers={handleAdminDeleteUsers}
          />
          <div className='mt-6'>
            <Table
              columns={columns}
              data={users}
              pageCount={pageCount}
              searchFilter={searchFilter}
              query={queryUsers}
              isLoading={isLoading}
              setUserSelectedIds={setUserSelectedIds}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default AllAffiliates;
