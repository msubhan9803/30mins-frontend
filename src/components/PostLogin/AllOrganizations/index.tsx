import {PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline';
import Header from '@root/components/header';
import {toast} from 'react-hot-toast';
import {MODAL_TYPES} from 'constants/context/modals';
import mutations from 'constants/GraphQL/Organizations/mutations';
import queries from 'constants/GraphQL/Organizations/queries';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useCallback, useMemo, useRef, useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import Table from './Table';

const AllOrganizations = ({session}) => {
  const {t} = useTranslation();
  const [organizations, setOrganizations] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoresults] = useState(false);
  const {showModal} = ModalContextProvider();

  const queryIdRef = useRef(0);
  const router = useRouter();

  // search state
  const [searchFilter, setSearchFilter] = useState({keywords: '', newSearch: false});

  const queryOrganizations = useCallback(
    async (searchParams, pageNumber, pageSize) => {
      const queryId = ++queryIdRef.current;

      const searchPayload = searchParams;
      delete searchPayload.newSearch;

      try {
        if (queryId === queryIdRef.current) {
          setIsLoading(true);

          const dataResponse = await graphqlRequestHandler(
            queries.getOrganizationsForAdmin,
            {
              orgSearchParams: {
                ...searchParams,
                pageNumber,
                resultsPerPage: pageSize,
              },
              token: session?.accessToken,
            },
            session?.accessToken
          );
          if (dataResponse?.data?.data?.getOrganizationsForAdmin?.response?.status === 404) {
            setNoresults(true);
            setIsLoading(false);
          } else {
            setNoresults(false);
            const organzationsCount =
              dataResponse?.data?.data?.getOrganizationsForAdmin?.organizationCount || 0;
            setOrganizations(dataResponse?.data?.data?.getOrganizationsForAdmin?.organizationData);
            setPageCount(Math.ceil(organzationsCount / pageSize));
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    [session?.accessToken]
  );

  const handleDelete = async id => {
    await graphqlRequestHandler(
      mutations.adminDeleteOrganization,
      {
        documentId: id,
        token: session?.accessToken,
      },
      session?.accessToken
    );

    toast.success(t('common:organization_deleted'));
    router.reload();
  };

  const deleteOrganizations = column => {
    const organization = column.cell.row.original;
    showModal(MODAL_TYPES.DELETE, {
      name: 'organization',
      id: organization._id,
      handleDelete: handleDelete,
    });
  };

  const FormatedDate = ({value}) => (
    <div className='flex items-center'>{dayjs.unix(value / 1000).toString()}</div>
  );

  const PublicUrl = ({value}) => (
    <a
      href={value ? `/org/${value}` : ''}
      className='text-mainBlue'
      target='_blank'
      rel='noreferrer'
    >
      {value ? `https://30mins.com/org/${value}` : 'no public url'}
    </a>
  );

  const ActionColumn = ({column}: any) => (
    <div className='flex items-center'>
      <Link href={`/user/updateOrganization/${column.cell.row.original._id}`} passHref>
        <div className='mr-2 w-10 justify-center flex items-center text-gray-600 p-2 border-transparent border  bg-gray-100 hover:text-mainBlue cursor-pointer rounded focus:outline-none focus:border-gray-800 focus:shadow-outline-gray'>
          <PencilSquareIcon />
        </div>
      </Link>
      <button onClick={() => deleteOrganizations(column)}>
        <div className='mr-2 w-10 justify-center flex items-center text-gray-600 p-2 border-transparent border  bg-red-100 hover:text-mainBlue cursor-pointer rounded focus:outline-none focus:border-gray-800 focus:shadow-outline-gray'>
          <TrashIcon />
        </div>
      </button>
    </div>
  );

  // organzation table columns
  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
        Cell: ({value}: {value: string}) => (
          <div>{value.length > 50 ? `${value.slice(0, 30)} ...` : value}</div>
        ),
      },
      {
        Header: 'Date Created',
        accessor: 'createdDate',
        Cell: FormatedDate,
      },
      {
        Header: 'Public Url',
        accessor: 'slug',
        Cell: PublicUrl,
      },
      {
        Header: 'Actions',
        accessor: '_id',
        Cell: column => <ActionColumn column={column} />,
      },
    ],
    []
  );

  const crumbs = [{title: t('page:All Organzation'), href: '/'}];

  return (
    <>
      <Header crumbs={crumbs} heading={t('page:All Organzation')} />
      <div className='min-h-screen text-gray-9000'>
        <main className='max-w-7xl mx-auto px-0 pt-4'>
          <Table
            setSearchFilter={setSearchFilter}
            columns={columns}
            data={organizations}
            pageCount={pageCount}
            searchFilter={searchFilter}
            query={queryOrganizations}
            isLoading={isLoading}
            noResults={noResults}
          />
        </main>
      </div>
    </>
  );
};

export default AllOrganizations;
