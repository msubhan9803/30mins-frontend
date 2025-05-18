import {useQuery} from '@apollo/client';
import Header from '@root/components/header';
import Loader from '@root/components/loader';
import queries from 'constants/GraphQL/Products/queries';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import PostLoginLayout from '@components/layout/post-login';
import CommonTable from '@root/components/common-table';
import {useMemo} from 'react';

export default function ProductsSold() {
  const {t} = useTranslation('common');
  const {t: tpage} = useTranslation('page');
  const {data: session} = useSession();

  const {
    data: {getAllCommandedProduct: {productQtt}} = {getAllCommandedProduct: {productQtt: []}},
    loading,
  } = useQuery(queries.getAllCommandedProduct, {
    variables: {
      token: session?.accessToken,
    },
    skip: !session?.accessToken,
  });

  const crumbs = [
    {title: t('home'), href: '/'},
    {title: tpage('Product'), href: '#'},
    {title: tpage('Product sold'), href: '/user/products-sold'},
  ];

  console.log(productQtt);

  const columns = useMemo(
    () => [
      {
        Header: 'Image',
        accessor: 'image',
      },
      {
        Header: 'Title',
        accessor: 'title',
      },

      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
      },
      {
        Header: 'Refund Status',
        accessor: 'refundStatus',
      },
      {
        Header: 'Total',
        accessor: 'total',
      },
      {
        Header: 'More Details',
        accessor: 'link',
      },
    ],
    []
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('Product sold')} />
      <div className='w-full h-[90%]'>
        <CommonTable
          columns={columns}
          data={productQtt.map(el => ({
            checkoutId: el?.checkout?._id,
            checkoutPrice: el.checkoutPrice,
            quantity: el.quantity,
            total: `$${Math.floor(el.checkoutPrice) * Math.floor(el.quantity)}`,
            _id: el?.product?._id,
            description: el?.product?.description,
            discount: el?.product?.discount,
            image: <img src={el?.product?.image} alt='' className='w-16 h-16 my-auto' />,
            price: `$${el?.product?.price}`,
            tags: el?.product?.tags,
            title: el?.product?.title,
            refundStatus: t(`common:${el?.refundStatus.toLowerCase()}`),
            link: (
              <a
                className='underline font-medium text-base italic hover:text-mainBlue'
                href={`/user/purchase-details/${el._id}`}
              >
                {t('More Details')}
              </a>
            ),
          }))}
        />
      </div>
    </PostLoginLayout>
  );
}

ProductsSold.auth = true;
