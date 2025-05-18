import {useCallback, useMemo, useRef, useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {useSession} from 'next-auth/react';
import {Column} from 'react-table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import {TrashIcon} from '@heroicons/react/24/outline';
import graphqlRequestHandler from '../../../utils/graphqlRequestHandler';
import userQueries from '../../../constants/GraphQL/User/queries';
import Table from '../AllExtentions/Table';
import FormDisplay from './FormDisplay';
import userMutations from '../../../constants/GraphQL/User/mutations';
import organizationMutation from '../../../constants/GraphQL/Organizations/mutations';
import {ModalContextProvider} from '../../../store/Modal/Modal.context';

dayjs.extend(relativeTime);

enum FormTypes {
  NONE = 'NONE',
  USER_CREATION = 'USER_CREATION',
  ORGANIZATION_CREATION = 'ORGANIZATION_CREATION',
  LINK_USER_TO_ORGANIZATION = 'LINK_USER_TO_ORGANIZATION',
}

enum TableTabs {
  ORGANIZATIONS = 'ORGANIZATIONS',
  USERS = 'USERS',
}

const Marketing = () => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {showModal, hideModal} = ModalContextProvider();
  const router = useRouter();

  const [displayingForm, setDisplayingForm] = useState(FormTypes.NONE);
  const [tableTabSelected, setTableTabSelected] = useState(TableTabs.USERS);
  const queryIdRef = useRef(0);
  const [tableData, setTableData] = useState([]);
  const [searchFilter, setSearchFilter] = useState({keywords: '', newSearch: false});
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoresults] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const queryMarketerResults = useCallback(
    async (searchParams, pageNumber, pageSize) => {
      const queryId = ++queryIdRef.current;

      delete searchParams.newSearch;

      try {
        if (queryId === queryIdRef.current) {
          setIsLoading(true);

          const {data: results} = await graphqlRequestHandler(
            userQueries.getResultsForMarketer,
            {
              searchParams: {
                ...searchParams,
                pageNumber,
                resultsPerPage: pageSize,
                searchType: tableTabSelected,
              },
              token: session?.accessToken,
            },
            session?.accessToken
          );

          if (results?.data?.getResultsForMarketer?.response?.status !== 200) {
            setNoresults(true);
            setIsLoading(false);
          } else {
            setNoresults(false);
            setIsLoading(false);
            const returnDataCount = results?.data?.getResultsForMarketer?.returnDataCount || 0;
            setTableData(
              tableTabSelected === TableTabs.USERS
                ? results?.data?.getResultsForMarketer?.returnUserData
                : results?.data?.getResultsForMarketer?.returnOrgData
            );
            setPageCount(Math.ceil(returnDataCount / pageSize));
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [session?.accessToken, tableTabSelected]
  );

  const [deleteOrgMutation] = useMutation(organizationMutation.marketerDeleteOrganization);
  const handleDeleteOrg = async orgTitle => {
    try {
      await deleteOrgMutation({
        variables: {
          organizationTitle: orgTitle,
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });

      router.reload();
    } catch (err) {
      console.log('Unknown Error');
      hideModal();
    }
  };

  const [deleteUserMutation] = useMutation(userMutations.marketerDeleteUser);
  const handleDeleteUser = async userEmail => {
    try {
      await deleteUserMutation({
        variables: {
          userEmail: userEmail,
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
      router.reload();
    } catch (err) {
      console.log('Unknown Error');
      hideModal();
    }
  };

  const WelcomeComplete = ({value}) => <div>{value ? 'yes' : 'no'}</div>;
  const JoinLink = ({value}) => (
    <a
      target={'_blank'}
      href={`${process.env.NEXT_PUBLIC_FRONT_END_URL}/join?code=${value}`}
      rel='noreferrer'
    >{`${process.env.NEXT_PUBLIC_FRONT_END_URL}/join?code=${value}`}</a>
  );

  const ProfileLink = ({value}) => (
    <a
      target={'_blank'}
      href={`${process.env.NEXT_PUBLIC_FRONT_END_URL}/${value}`}
      rel='noreferrer'
    >{`${process.env.NEXT_PUBLIC_FRONT_END_URL}/${value}`}</a>
  );

  const OrgLink = ({value}) => (
    <a
      target={'_blank'}
      href={`${process.env.NEXT_PUBLIC_FRONT_END_URL}/org/${value}`}
      rel='noreferrer'
    >{`${process.env.NEXT_PUBLIC_FRONT_END_URL}/org/${value}`}</a>
  );
  const CreatedAt = ({value}) => <div>{dayjs((value / 1000) * 1000).fromNow()}</div>;

  const OrgDeleteAction = ({data, row}) => (
    <button
      onClick={async () => {
        showModal('CONFIRM', {
          handleConfirm: async () => {
            await handleDeleteOrg(data[row.index].title);
          },
          title: t('common:delete_confirm'),
        });
      }}
      className='flex px-3 py-2 hover:bg-gray-200 hover:bg-opacity-50 rounded-md'
    >
      <TrashIcon className='w-5 h-5 mr-2 text-red-500' />
      {t('common:Delete_record')}
    </button>
  );

  const UserDeleteAction = ({data, row}) =>
    data[row.index].welcomeComplete ? null : (
      <button
        onClick={async () => {
          showModal('CONFIRM', {
            handleConfirm: async () => {
              await handleDeleteUser(data[row.index].accountDetails.email);
            },
            title: t('common:delete_confirm'),
          });
        }}
        className='flex px-3 py-2 hover:bg-gray-200 hover:bg-opacity-50 rounded-md'
      >
        <TrashIcon className='w-5 h-5 mr-2 text-red-500' />
        {t('common:Delete_record')}
      </button>
    );

  const UserColumns = useMemo(
    () =>
      [
        {
          Header: t('common:createdBy'),
          accessor: 'createdBy.accountDetails.username',
        },
        {
          Header: t('common:email_header'),
          accessor: 'accountDetails.email',
        },
        {
          Header: t('common:joinLink'),
          accessor: 'couponCode',
          Cell: JoinLink,
        },
        {
          Header: t('common:profile_link'),
          accessor: 'accountDetails.username',
          Cell: ProfileLink,
        },
        {
          Header: t('common:welcomeComplete'),
          accessor: 'welcomeComplete',
          Cell: WelcomeComplete,
        },
        {
          Header: t('common:createdAt'),
          accessor: 'createdAt',
          Cell: CreatedAt,
        },
        {
          Header: t('common:Delete_record'),
          accessor: '',
          Cell: UserDeleteAction,
        },
      ] as Column<{Header: string; accessor: string}>[],
    [t]
  );

  const OrgColumns = useMemo(
    () =>
      [
        {
          Header: t('common:createdBy'),
          accessor: 'createdBy.accountDetails.username',
        },
        {
          Header: t('common:Title'),
          accessor: 'title',
        },
        {
          Header: t('common:website'),
          accessor: 'website',
        },
        {
          Header: t('common:organization_link'),
          accessor: 'slug',
          Cell: OrgLink,
        },
        {
          Header: t('common:createdAt'),
          accessor: 'createdAt',
          Cell: CreatedAt,
        },
        {
          Header: t('common:Delete_record'),
          accessor: '',
          Cell: OrgDeleteAction,
        },
      ] as Column<{Header: string; accessor: string}>[],
    [t]
  );

  return (
    <div>
      <div className='flex items-start'>
        <button
          type='button'
          onClick={() => setTableTabSelected(TableTabs.USERS)}
          className={
            tableTabSelected === TableTabs.USERS
              ? 'font-medium border-b-2 border-mainBlue text-mainBlue p-5 mr-10 pl-0 pb-2 mb-5 pr-0'
              : 'font-medium border-mainBlue text-gray-500 p-5 mr-10 pl-0 pb-2 mb-5 pr-0'
          }
        >
          {t('common:txt_Users')}
        </button>
        <button
          type='button'
          onClick={() => setTableTabSelected(TableTabs.ORGANIZATIONS)}
          className={
            tableTabSelected === TableTabs.ORGANIZATIONS
              ? 'font-medium border-b-2 border-mainBlue text-mainBlue p-5 mr-10 pl-0 pb-2 mb-5 pr-0'
              : 'font-medium border-mainBlue text-gray-500 p-5 mr-10 pl-0 pb-2 mb-5 pr-0'
          }
        >
          {t('common:Organizations')}
        </button>
      </div>
      <FormDisplay
        setDisplayingForm={setDisplayingForm}
        displayingForm={displayingForm}
        formTypes={FormTypes}
      />

      {tableTabSelected === TableTabs.USERS ? (
        <Table
          data={tableData}
          columns={UserColumns}
          isLoading={isLoading}
          noResults={noResults}
          query={queryMarketerResults}
          pageCount={pageCount}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
      ) : (
        <Table
          data={tableData}
          columns={OrgColumns}
          isLoading={isLoading}
          noResults={noResults}
          query={queryMarketerResults}
          pageCount={pageCount}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
      )}
    </div>
  );
};

export default Marketing;
