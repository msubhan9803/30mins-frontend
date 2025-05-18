import Head from 'next/head';
import PostLoginLayout from '@root/components/layout/post-login';
import useTranslation from 'next-translate/useTranslation';
import Header from '@root/components/header';
import {useQuery} from '@apollo/client';
import queries from 'constants/GraphQL/Products/queries';
import {useSession} from 'next-auth/react';
import Loader from '@root/components/loader';
import dayjs from 'dayjs';
import CommonTable from '@root/components/common-table';
import {useMemo} from 'react';

export default function Checkout() {
  const {t: tpage} = useTranslation();
  const {data: session} = useSession();
  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Product'), href: '#'},
    {title: tpage('Purchases'), href: '/user/purchases/'},
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Date/time',
        accessor: 'date',
      },
      {
        Header: 'Total Cost',
        accessor: 'total',
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
      },
      {
        Header: 'Seller Email',
        accessor: 'email',
      },
      {
        Header: 'Purchase details',
        accessor: 'details',
      },
    ],
    []
  );

  const {
    data: {getAllCompletedCheckout: {checkouts}} = {
      getAllCompletedCheckout: {checkouts: []},
    },
    loading,
  } = useQuery(queries.getAllCompletedCheckout, {
    variables: {token: session?.accessToken},
    skip: !session?.accessToken,
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <PostLoginLayout>
      <Head>
        <title>{tpage('Purchases')}</title>
      </Head>
      <Header crumbs={crumbs} heading={tpage('Purchases')} />
      <div className='w-full rounded-md h-[90%] flex flex-col p-2 gap-2'>
        <CommonTable
          columns={columns}
          data={checkouts?.map(el => ({
            _id: el.checkout._id,
            date: dayjs.unix(Number(el?.checkout?.createdAt) / 1000).format('MMM DD, YYYY h:mm A'),
            total: `$${Math.floor(el.total)}`,
            quantity: el.countOfItems,
            email: el?.seller?.accountDetails?.email,
            details: (
              <a
                href={`/user/purchases/${el.checkout._id}`}
                className='underline font-medium text-base italic hover:text-mainBlue'
              >
                More details
              </a>
            ),
          }))}
        />
      </div>
    </PostLoginLayout>
  );
}

Checkout.auth = true;
