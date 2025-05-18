import Head from 'next/head';
import PostLoginLayout from '@root/components/layout/post-login';
import useTranslation from 'next-translate/useTranslation';
import {useMutation, useQuery} from '@apollo/client';
import queries from 'constants/GraphQL/Products/queries';
import {useSession} from 'next-auth/react';
import Loader from '@root/components/loader';
import Header from '@root/components/header';
import {useContext} from 'react';
import {UserContext} from '@root/context/user';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Button from '@root/components/button';
import {MODAL_TYPES} from 'constants/context/modals';
import {toast} from 'react-hot-toast';
import {XCircleIcon} from '@heroicons/react/24/outline';
import mutations from 'constants/GraphQL/Products/mutations';
import cn from 'classnames';
import {CartEntity, GetCurrentCartItems} from 'components/PostLogin/Product/cart-types';
// import {GetCurrentCartItems, CartEntity} from './constants';

export default function Cart() {
  const {t} = useTranslation();
  const {t: tpage} = useTranslation('page');
  const {data: session} = useSession();
  const {items} = useContext(UserContext);
  const {showModal} = ModalContextProvider();

  const [deleteCart, {loading: deleteLoading}] = useMutation(mutations.deleteCart);

  const {
    data: {getCurrentCartItems: {cart}} = {getCurrentCartItems: {cart: []}},
    loading,
    refetch,
  } = useQuery<{getCurrentCartItems: GetCurrentCartItems}>(queries.getCurrentCartItems, {
    variables: {token: session?.accessToken},
    skip: !session?.accessToken,
  });

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Product'), href: '#'},
    {title: tpage('Cart'), href: '/user/cart/'},
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('common:cart')}</title>
      </Head>
      <Header crumbs={crumbs} heading={tpage('Cart')} />

      <div className='flex flex-col border rounded-md p-2 overflow-y-scroll gap-2 h-[80%]'>
        {cart?.map((el: CartEntity, idx) => (
          <div className='' key={idx}>
            <div className='w-full shadow-sm rounded-md border flex flex-row items-center gap-2 overflow-hidden'>
              <img
                src={el.seller.accountDetails.avatar || '/assets/default-profile.jpg'}
                alt=''
                className='w-16'
              />
              <label>{el.seller.accountDetails.username}</label>
              <Button
                variant='solid'
                onClick={() => {
                  if (el.seller.accountDetails.stripeAccountId) {
                    showModal(MODAL_TYPES.CHECKOUT, {
                      sellerUsername: el.seller.accountDetails.username,
                      sellerId: el.seller._id,
                      sellerStripId: el.seller.accountDetails.stripeAccountId,
                      refetch,
                      amount:
                        items.length > 0
                          ? Number(
                              el.productQtts
                                ?.map(
                                  eel =>
                                    (Number(eel.product?.price.toFixed(0)) -
                                      (Number(eel.product?.price.toFixed(0)) *
                                        Number(eel.product?.discount)) /
                                        100) *
                                    Number(eel.quantity)
                                )
                                ?.reduce((a, b) => Number(a.toFixed(0)) + Number(b.toFixed(0)))
                            ).toFixed(0)
                          : 0,
                    });
                  } else {
                    toast.dismiss();
                    toast.error(t('common:This vendor has no connected Stripe account'));
                  }
                }}
                className='flex ml-auto mr-2'
              >
                {t('page:Checkout')}
              </Button>
            </div>
            <div className='w-[95%] mx-auto shadow-sm rounded-b border-t-0 border flex flex-col p-2 items-center gap-2'>
              {el.productQtts?.map(eel => (
                <>
                  <div
                    key={idx}
                    className='w-full border rounded-md flex flex-col sm:flex-row justify-center sm:justify-between items-center p-1'
                  >
                    <div className='flex flex-row w-full gap-2 p-1 items-center'>
                      <img src={eel.product?.image} alt='' className='w-12 h-12 my-auto' />
                      <div className='flex flex-col sm:flex-row gap-2 justify-between w-full'>
                        <span className='col-span-1 font-bold break-all line-clamp-1'>
                          {eel.product.title}
                        </span>
                        <div className='font-Karla col-span-1 items-center flex flex-row gap-1'>
                          <span className='font-light break-all line-clamp-1'>{eel.quantity}</span>{' '}
                          <span className='font-bold'>x</span>
                          <span className='font-light break-all line-clamp-1'>
                            $
                            {Number(eel.product?.price) -
                              (Number(eel.product?.price) * Number(eel.product?.discount)) / 100}
                          </span>
                          <span className='font-bold'>=</span> $
                          {(
                            (Number(eel.product?.price) -
                              (Number(eel.product?.price) * Number(eel.product?.discount)) / 100) *
                            Number(eel.quantity)
                          ).toFixed(0)}
                          <XCircleIcon
                            className={cn(['w-6 text-red-500 cursor-pointer'])}
                            onClick={async () => {
                              if (!loading && !deleteLoading) {
                                const id = toast.loading(t('common:loading'));
                                await deleteCart({
                                  variables: {
                                    productQttId: eel._id,
                                    token: session?.accessToken,
                                  },
                                });
                                await refetch();
                                toast.dismiss(id);
                                toast.success(
                                  t('common:Product deleted from the cart successfully')
                                );
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
              <span>
                <span className='font-bold'>Subtotal</span> <span></span>
                {' : '}
                <span className='font-bold'>
                  $
                  {el.productQtts?.length! > 0
                    ? el.productQtts
                        ?.map(eel => Number(eel.product.price) * Number(eel.quantity))
                        ?.reduce((a, b) => Number(Math.floor(a)) + Number(Math.floor(b)))
                        .toFixed(2)
                    : 0}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </PostLoginLayout>
  );
}

Cart.auth = true;
