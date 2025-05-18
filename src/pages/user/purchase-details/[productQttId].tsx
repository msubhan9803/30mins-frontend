import Head from 'next/head';
import PostLoginLayout from '@root/components/layout/post-login';
import Header from '@root/components/header';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import {useMutation, useQuery} from '@apollo/client';
import queries from 'constants/GraphQL/Products/queries';
import Loader from '@root/components/loader';
import {useSession} from 'next-auth/react';
import dayjs from 'dayjs';
import CommonTable from '@root/components/common-table';
import Button from '@root/components/button';
import {useContext, useState} from 'react';
import {UserContext} from '@root/context/user';
import mutations from 'constants/GraphQL/Products/mutations';
import toast from 'react-hot-toast';
import {TData} from 'components/PostLogin/Product/types';
import sanitizeHtml from 'sanitize-html';

export default function PurchaseDetails() {
  const {query} = useRouter();
  const {data: session} = useSession();
  const {t} = useTranslation('common');
  const {t: tpage} = useTranslation('page');
  const {user} = useContext(UserContext);
  const [Loading, setLoading] = useState(false);

  const Status = {
    REFUNDED: t('refunded'),
    REFUND_DENIED: t('refund denied'),
    PENDING_ACTION: t('pending action'),
    NONE: t('none'),
  };

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Product'), href: '#'},
    {
      title: tpage('Purchase History Details'),
      href: `/user/purchase-details/${query?.productQttId}`,
    },
  ];

  const [productQttUpdateStatus] = useMutation(mutations.productQttUpdateStatus);

  const {data, loading, refetch} = useQuery<TData>(queries.getProductQttWithCompleteDetails, {
    variables: {
      token: session?.accessToken,
      documentId: query?.productQttId,
    },
    skip: !session?.accessToken || !query?.productQttId,
  });

  const el = data?.getProductQttWithCompleteDetails?.productQtt || undefined;

  const columns = [
    {Header: 'Image', accessor: 'image'},
    {Header: 'Product Name', accessor: 'title'},
    {Header: 'َQuantity', accessor: 'quantity'},
    {Header: 'Price', accessor: 'price'},
    {Header: 'Discount', accessor: 'discount'},
    {Header: 'Refund State', accessor: 'refundStatus'},
  ];

  if (loading) {
    return <Loader />;
  }

  if (!el) {
    return (
      <>
        <PostLoginLayout>
          <Head>
            <title>{tpage('Purchase History Details')}</title>
          </Head>
          <Header crumbs={crumbs} heading={tpage('Purchase History Details')} />
          <div className='w-full h-full flex items-center flex-col pt-7'>
            <span className='font-Karla text-xl'>{t('No records found')}</span>
          </div>
        </PostLoginLayout>
      </>
    );
  }

  return (
    <PostLoginLayout>
      <Head>
        <title>{tpage('Purchase History Details')}</title>
      </Head>
      <Header crumbs={crumbs} heading={tpage('Purchase History Details')} />
      <div className='w-full h-max flex flex-col border rounded-md shadow-sm'>
        <div className='h-max flex flex-col justify-center p-2 border-b shadow-sm'>
          <span className='flex flex-row gap-1'>
            <span className='font-bold'>{t('Checkout id')}</span> :{' '}
            <span className='font-normal'>{el?.checkout?._id}</span>
          </span>

          <span className='flex flex-row gap-1'>
            <span className='font-bold'>{t('Seller Email')}</span> :{' '}
            <span className='font-normal'>{el?.product.seller?.accountDetails?.email}</span>
          </span>

          <span className='flex flex-row gap-1'>
            <span className='font-bold'>{t('Buyer Email')}</span> :{' '}
            <span className='font-normal'>{el?.checkout.buyer.accountDetails.email}</span>
          </span>

          <span className='flex flex-row gap-1'>
            <span className='font-bold'>{t('Date')}</span> :{' '}
            <span className='font-normal'>
              {dayjs.unix(Number(el?.checkout?.createdAt) / 1000).format('MMM DD, YYYY h:mm A')}
            </span>
          </span>
        </div>
        <div className='h-max flex flex-col p-2 border-b shadow-sm gap-4'>
          <span className='font-bold'>{t('Product details')}</span>
          <CommonTable
            columns={columns}
            data={[
              {
                image: <img src={el?.product?.image} alt='' className='w-16 h-16 my-auto' />,
                title: el?.product.title,
                sellerEmail: el?.product.seller?.accountDetails?.email,
                quantity: el?.quantity,
                refundStatus: Status[el?.refundStatus],
                price: `$${el?.checkoutPrice?.toFixed(2)}`,
                productQttId: el?._id,
                discount: `${
                  el?.product?.discount ? `${el?.product.discount}% off` : t('common:none')
                }`,
              },
            ]}
          />

          <div>
            <h2 className={'font-bold'}>{t('common:post_purchase_response')}</h2>
            {sanitizeHtml(el?.product.resText)
              ?.replace(/<\/?[^>]+(>|$)/g, '')
              .replace(/&nbsp;/gi, ' ')}
            <h2 className={'font-bold'}>{t('common:product_description')}</h2>
            {sanitizeHtml(el?.product.description)
              ?.replace(/<\/?[^>]+(>|$)/g, '')
              .replace(/&nbsp;/gi, ' ')}
          </div>
        </div>
        <div className='p-4 flex flex-row justify-between items-center'>
          <span className='col-span-1 font-bold break-all line-clamp-1'>
            <span>{t('Total')} : </span> $
            {(Number(el?.checkoutPrice) * Math.floor(Number(el?.quantity))).toFixed(2)}
          </span>

          {user?.accountType === 'admin' && (
            <div className='flex flex-col gap-1'>
              <Button
                variant='solid'
                disabled={Loading || el.refundStatus !== 'PENDING_ACTION'}
                onClick={async () => {
                  setLoading(true);
                  toast.loading(t('loading'));
                  await productQttUpdateStatus({
                    variables: {
                      token: session?.accessToken,
                      productQttId: el?._id,
                      action: 'REFUNDED',
                      authCode: null,
                    },
                  });
                  await refetch();
                  toast.dismiss();

                  setLoading(false);
                }}
              >
                {t('common:Mark Refund Processed')}
              </Button>
              <Button
                variant='cancel'
                disabled={Loading || el.refundStatus !== 'PENDING_ACTION'}
                onClick={async () => {
                  setLoading(true);
                  toast.loading(t('loading'));
                  await productQttUpdateStatus({
                    variables: {
                      token: session?.accessToken,
                      productQttId: el?._id,
                      action: 'REFUND_DENIED',
                      authCode: null,
                    },
                  });
                  await refetch();
                  toast.dismiss();

                  setLoading(false);
                }}
              >
                {t('common:Deny Refund')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </PostLoginLayout>
  );
}

PurchaseDetails.auth = true;
