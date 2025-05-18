import queries from 'constants/GraphQL/Booking/queries';
import useTranslation from 'next-translate/useTranslation';
import React, {useCallback, useContext, useRef, useState} from 'react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Booking/mutations';
import {useRouter} from 'next/router';
import {NotificationContext} from 'store/Notification/Notification.context';
import Header from '@root/components/header';
import dayjs from 'dayjs';
import {CheckIcon} from '@heroicons/react/20/solid';
import Table from './table';
import {MODAL_TYPES} from '../../../constants/context/modals';
import {NOTIFICATION_TYPES} from '../../../constants/context/notification';
import {EscrowReleaseStatus} from '../../../constants/enums';

const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const Payouts = ({session}) => {
  const {t} = useTranslation();

  const [payouts, setPayouts] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const queryIdRef = useRef(0);

  const [searchFilter, setSearchFilter] = useState({
    showReleased: false,
    newSearch: false,
  });

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const [manualEscrowRelease] = useMutation(mutations.manualEscrowRelease);
  const {showModal, hideModal} = ModalContextProvider();
  const router = useRouter();

  const handleManualEscrowRelease = async row => {
    const {data} = await manualEscrowRelease({
      variables: {
        documentId: row,
        token: session?.accessToken,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
          'Content-Type': 'application/json',
        },
      },
    });
    showNotification(
      NOTIFICATION_TYPES.success,
      data?.manualEscrowRelease?.response?.message,
      false
    );
    router.reload();
    hideModal();
  };

  const queryPayouts = useCallback(
    async (payoutSearchParams, pageNumber, pageSize) => {
      const queryId = ++queryIdRef.current;

      delete payoutSearchParams.newSearch;

      if (queryId === queryIdRef.current) {
        setIsLoading(true);
        graphqlRequestHandler(
          queries.getPendingPayouts,
          {
            searchParams: {
              ...payoutSearchParams,
              pageNumber,
              resultsPerPage: pageSize,
            },
            token: session?.accessToken,
          },
          process.env.BACKEND_API_KEY
        )
          .then(response => {
            const payoutCount = response?.data?.data?.getPendingPayouts?.payoutCount || 0;
            const payoutData = response?.data?.data?.getPendingPayouts?.payoutData;
            setPayouts(payoutData);
            setPageCount(Math.ceil(payoutCount / pageSize));
            setIsLoading(false);
          })
          .catch(e => console.log(e));
      }
    },
    [session?.accessToken]
  );

  const ActionReleaseColumn = ({row}) => (
    <div className='flex items-center'>
      {row.original?.status === EscrowReleaseStatus.UNRELEASED ? (
        <button
          className='w-12 justify-center flex items-center text-gray-600 p-2 border-transparent border bg-gray-100
                          hover:text-red-600 cursor-pointer rounded focus:outline-none focus:border-gray-800 focus:shadow-outline-gray'
          onClick={() =>
            showModal(MODAL_TYPES.CONFIRM, {
              handleConfirm: async () => {
                await handleManualEscrowRelease(row?.original?._id);
              },
              title: `${t('common:release_payout')}?`,
              message: `${t('common:release_question')}`,
            })
          }
        >
          <CheckIcon width={20} height={20} />
        </button>
      ) : null}
    </div>
  );

  const PayoutMethodCell = ({row}) => (
    <div className='flex items-center'>
      {`${row?.original?.providerPayoutMethod?.payoutType}: ${row?.original?.providerPayoutMethod?.payoutId}`}
    </div>
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Provider Email',
        accessor: 'providerEmail',
      },
      {
        Header: 'Account',
        Cell: PayoutMethodCell,
      },
      {
        Header: 'Amount',
        accessor: 'amountToRelease',
      },
      {
        Header: 'Booking Id',
        accessor: 'bookingId',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Release',
        Cell: ActionReleaseColumn,
      },
    ],
    []
  );

  const crumbs = [{title: t('page:Home'), href: '/'}];

  return (
    <>
      <Header crumbs={crumbs} heading={t('page:pending_payouts')} />
      <div className='min-h-screen text-gray-900'>
        <main className='max-w-7xl mx-auto px-0 pt-4'>
          <div className={'flex gap-4'}>
            <button
              className={
                !searchFilter.showReleased
                  ? 'font-medium border-b-2 border-mainBlue text-mainBlue p-5 mr-10 pl-0 pb-2 mb-5 pr-0'
                  : 'font-medium border-mainBlue text-gray-500 p-5 mr-10 pl-0 pb-2 mb-5 pr-0'
              }
              onClick={() => setSearchFilter({newSearch: true, showReleased: false})}
              disabled={isLoading}
            >
              {t('common:UnReleased')}
            </button>
            <button
              className={
                searchFilter.showReleased
                  ? 'font-medium border-b-2 border-mainBlue text-mainBlue p-5 mr-10 pl-0 pb-2 mb-5 pr-0'
                  : 'font-medium border-mainBlue text-gray-500 p-5 mr-10 pl-0 pb-2 mb-5 pr-0'
              }
              onClick={() => setSearchFilter({newSearch: true, showReleased: true})}
              disabled={isLoading}
            >
              {t('common:Released')}
            </button>
          </div>
          <div className='mt-6'>
            <Table
              columns={columns}
              data={payouts}
              pageCount={pageCount}
              searchFilter={searchFilter}
              query={queryPayouts}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default Payouts;
