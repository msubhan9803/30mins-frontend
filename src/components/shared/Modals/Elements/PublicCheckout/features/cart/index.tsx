/* eslint-disable no-unsafe-optional-chaining */
import useTranslation from 'next-translate/useTranslation';
import {useMutation, useQuery} from '@apollo/client';
import queries from 'constants/GraphQL/Products/queries';
import {useSession} from 'next-auth/react';
import {useContext, useEffect, useState} from 'react';
import {UserContext} from '@root/context/user';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Button from '@root/components/button';
import _ from 'lodash';
import {LoaderIcon, toast} from 'react-hot-toast';
import {XCircleIcon} from '@heroicons/react/24/outline';
import mutations from 'constants/GraphQL/Products/mutations';
import cn from 'classnames';
import sanitizeHtml from 'sanitize-html';
import {GetCurrentCartItems} from 'components/PostLogin/Product/constants';
import {MODAL_TYPES} from '../../../../../../../constants/context/modals';
import graphqlRequestHandler from '../../../../../../../utils/graphqlRequestHandler';

export default function Cart() {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {items, refItems} = useContext(UserContext);
  const {showModal, hideModal} = ModalContextProvider();
  const [deletingPQttId, setdeletingPQttId] = useState('');
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [deleteCart] = useMutation(mutations.deleteCart);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const {
    data: {getCurrentCartItems: {cart}} = {getCurrentCartItems: {cart: []}},
    loading,
    refetch,
  } = useQuery<{getCurrentCartItems: GetCurrentCartItems}>(queries.getCurrentCartItems, {
    variables: {token: session?.accessToken},
    skip: !session?.accessToken,
  });

  useEffect(() => {
    refetch();
    refItems();
  }, []);

  useEffect(() => {
    if (items?.length) {
      refetch();
      refItems();
    }
  }, [items?.length]);

  useEffect(() => {}, [cart]);

  const handleFreeCheckout = async () => {
    setCheckoutLoading(true);
    const {data} = await graphqlRequestHandler(
      mutations.checkout,
      {
        token: session?.accessToken,
      },
      ''
    );
    const checkoutId = data?.data?.checkout?.checkoutId;
    await refetch();
    refItems();
    showModal(MODAL_TYPES.CHECKOUT, {Step: 'paymentSuccess', invoiceLink: undefined, checkoutId});
    setCheckoutLoading(false);
  };

  if (loading) {
    return (
      <>
        <div className='text-sm font-bold italic text-mainBlue w-full flex justify-center items-center text-center h-10'>
          <svg
            className='custom_loader animate-spin -ml-1 mr-3 h-10 w-10 text-mainBlue'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        </div>
      </>
    );
  }
  const getTable: any = () => cart?.map(({productQtts}: any) => productQtts) || [];

  const element: any = _.union(...getTable())?.map(
    (eel: any) =>
      Math.floor(
        Math.floor(eel.product?.price) -
          (Math.floor(eel.product?.price) * Math.floor(eel.product?.discount)) / 100
      ) * Math.floor(eel.quantity)
  );

  return (
    <div>
      <div className='flex flex-col border rounded-md overflow-y-scroll max-h-[350px] h-[80%]'>
        {cart?.map((el, idx) => (
          <div key={idx} className='flex flex-col justify-center gap-1 divide-y'>
            {el.productQtts?.map((ell, i) => (
              <div key={i} className='flex flex-row w-full items-center gap-2 p-2'>
                <div className=''>
                  <img src={ell.product.image} alt='' className='w-12 h-12 my-auto' />
                </div>
                <div className='grid grid-cols-6 w-full items-center gap-2'>
                  <div className='col-span-1'>
                    <span>{ell.product.title}</span>
                  </div>
                  <div className='col-span-2'>
                    <span>{el.seller.accountDetails.username}</span>
                  </div>
                  <div className='col-span-2'>
                    <span className='font-bold break-all line-clamp-1'>
                      ({t('common:ATTACHMENTS').toLowerCase()} : {ell.product.file.name ? '1' : '0'}
                      )
                    </span>
                    <dd
                      className='line-clamp-3'
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(ell.product.description),
                      }}
                    ></dd>
                  </div>
                  <div className='col-span-1'>
                    <span className='flex flex-row gap-1'>
                      $
                      {Math.floor(
                        (Number(ell.product?.price) -
                          (Number(ell.product?.price) * Number(ell.product?.discount)) / 100) *
                          Number(ell?.quantity)
                      )}
                    </span>
                  </div>
                </div>
                <div className='w-max'>
                  {deleteLoading && ell?._id === deletingPQttId ? (
                    <LoaderIcon style={{width: 23, height: 23}} />
                  ) : (
                    <XCircleIcon
                      className={cn(['w-6 text-red-500 cursor-pointer'])}
                      onClick={async () => {
                        if (!loading && !deleteLoading) {
                          setdeleteLoading(true);
                          setdeletingPQttId(ell?._id);
                          await deleteCart({
                            variables: {
                              productQttId: ell?._id,
                              token: session?.accessToken,
                            },
                          });
                          await refetch({token: session?.accessToken});
                          toast.success(t('common:Product deleted from the cart successfully'));
                          await refItems();
                          setdeleteLoading(false);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        {cart?.length! === 0 && (
          <span className='flex flex-col w-full justify-center items-center font-normal'>
            {t('common:You have no items in your cart')}
          </span>
        )}
      </div>
      <div className='flex flex-row items-center justify-between p-4'>
        <div className='flex'>
          <Button
            variant='solid'
            onClick={() => {
              hideModal();
            }}
          >
            {t('common:Continue adding more products')}
          </Button>
        </div>
        <div className='flex flex-col'>
          <span className='font-bold'>
            Subtotal
            {' : '}$
            {element?.length > 1
              ? element?.reduce((a, b) => Math.floor(a) + Math.floor(b))
              : element[0]
              ? element[0]
              : 0}
          </span>

          <Button
            variant='solid'
            disabled={element?.length === 0}
            onClick={async () => {
              if (cart) {
                const cartTotal =
                  element?.length > 1
                    ? element?.reduce((a, b) => Math.floor(a) + Math.floor(b))
                    : element[0]
                    ? element[0]
                    : 0;

                if (cartTotal > 0) {
                  showModal(MODAL_TYPES.CHECKOUT, {
                    refetch,
                    amount: cartTotal,
                  });
                } else {
                  await handleFreeCheckout();
                }
              } else {
                toast.dismiss();
                toast.error(t('common:This vendor has no connected Stripe account'));
              }
            }}
            className='flex ml-auto mr-2'
          >
            {checkoutLoading ? t('common:loading') : t('page:Checkout')}
          </Button>
        </div>
      </div>
    </div>
  );
}

Cart.auth = true;
