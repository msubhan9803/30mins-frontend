import {useContext, useEffect, useState} from 'react';
import sanitizeHtml from 'sanitize-html';
import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import classNames from 'classnames';
import mutations from 'constants/GraphQL/Products/mutations';
import Button from '@root/components/button';
import {useSession} from 'next-auth/react';
import {UserContext} from '@root/context/user';
import toast from 'react-hot-toast';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';

import {useRouter} from 'next/router';
import graphqlRequestHandler from '../../../utils/graphqlRequestHandler';

export default function SelectedProductDisplay({data, is_success_page}) {
  const {t} = useTranslation('common');
  const {data: session} = useSession();
  const {refItems, items} = useContext(UserContext);
  const router = useRouter();

  const [loading, setloading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [freeSignedIn, setFreeSignedIn] = useState(false);

  const [addCart] = useMutation(mutations.addCart, {variables: {}});
  const isFreeProduct = Number(data.price) === 0;

  const {showModal} = ModalContextProvider();

  const AddToCart = async productId => {
    await toast.dismiss();
    toast.loading(t('loading'));
    await addCart({
      variables: {
        productId: productId,
        quantity: 1,
        token: session?.accessToken,
      },
    });
    await refItems();

    if (!isFreeProduct) {
      showModal(MODAL_TYPES.PUBLICCHECKOUT, {});
    }
    await toast.dismiss();
    setloading(false);
  };

  const getDownloadButtonText = () => {
    if (isFreeProduct) {
      if (freeSignedIn || session?.accessToken) {
        return t('common:download_now');
      }
      return t('common:free_product_download_signed_out');
    }
    return t('common:Add to Cart');
  };

  const handleFreeCheckout = async () => {
    const {data: checkoutResponse} = await graphqlRequestHandler(
      mutations.checkout,
      {
        token: session?.accessToken,
      },
      ''
    );
    refItems();
    return checkoutResponse?.data?.checkout?.checkoutId;
  };

  const handleClick = async () => {
    setloading(true);
    let cartItemsTotal = 0;
    items?.forEach(item => {
      cartItemsTotal += item.price;
    });

    if (isFreeProduct && cartItemsTotal === 0) {
      if (session?.accessToken) {
        await AddToCart(data._id);
        const checkoutId = await handleFreeCheckout();
        await router.push(`${window.origin}/user/purchases/${checkoutId}`);
        setloading(false);
      } else {
        setloading(false);
        showModal(MODAL_TYPES.FREE_DOWNLOAD_AUTH_MODAL, {
          onAuthComplete: async () => {
            await toast.dismiss();
            setFreeSignedIn(true);
            toast.success(t('signed_in'));
            setloading(false);
          },
        });
      }
      return;
    }

    if (session?.accessToken && !isFreeProduct) {
      await AddToCart(data._id);
    } else {
      setloading(false);
      showModal(MODAL_TYPES.AUTH_MODAL, {
        onAuthComplete: () => {
          setIsAuthenticated(true);
        },
      });
    }

    setloading(false);
  };

  useEffect(() => {
    if (isAuthenticated && session && !isFreeProduct) {
      setIsAuthenticated(false);
      AddToCart(data._id).finally(() => {
        showModal(MODAL_TYPES.PUBLICCHECKOUT);
      });
    }
  }, [isAuthenticated, session]);

  return (
    <>
      <div className={classNames('bg-white')}>
        <div className={'flex flex-col md:flex-row'}>
          <div className='flex flex-col justify-between min-h-full'>
            <div className='flex flex-col '>
              <div className='relative'>
                {data?.discount ? (
                  <span className='absolute bg-red-400 shadow-sm rounded-lg px-3 font-semibold text-gray-800 right-2 top-1'>
                    {data.discount}% Off
                  </span>
                ) : null}
              </div>
            </div>

            <div className='mt-2 min-h-[100px] text-center md:text-left grid grid-cols-1 md:grid-cols-4'>
              <div className='flex flex-row col-span-4'>
                <h4
                  className='font-bold text-2xl md:text-3xl leading-tight mr-1 pt-4 md:pt-0 break-words'
                  title={data?.title}
                >
                  {data?.title}
                </h4>
              </div>
              <div className='col-span-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 border-b-[1px]'>
                <div
                  className={'col-span-1 w-full px-8 md:pt-8 justify-center lg:place-items-start'}
                >
                  <img
                    src={data.image}
                    alt={`Product Image for: ${data.title}`}
                    className={'object-contain'}
                  />
                </div>
                <div className={'col-span-2 md:pt-8 md:px-8 flex flex-col text-left'}>
                  <dd
                    id={`desc-${data?._id}`}
                    className={classNames(
                      'min-h-[50px] text-sm pr-4 mt-1 line-clamp-16 leading-normal text-gray-900 break-words custom'
                    )}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(data?.description),
                    }}
                  />
                  {data?.tags?.length !== 0 && (
                    <div className='mt-2 mb-2 flex items-center gap-1 flex-wrap min-h-[55px]'>
                      {data?.tags?.map((item: string, i: number) => (
                        <span
                          key={i}
                          className='py-1 px-2 min-w-[50px] text-center text-xs text-mainText leading-tight border gap-2 min-w-10  shadow-inner shadow-gray-100 rounded-3xl'
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {isFreeProduct ? (
                  <div className='col-span-1 md:col-span-3 pb-4 lg:col-span-1 mt-4 md:mt-8 lg:mt-16 items-start gap-4 px-8 flex-row'>
                    <Button
                      variant='solid'
                      className={
                        isFreeProduct && (freeSignedIn || session?.accessToken)
                          ? 'bg-green-500 h-full min-h-[75px] lg:min-h-[125px] w-full self-center text-xl md:text-xl'
                          : 'bg-mainBlue h-full min-h-[75px] lg:min-h-[125px] w-full self-center text-xl md:text-xl'
                      }
                      disabled={loading}
                      onClick={async () => {
                        await handleClick();
                      }}
                    >
                      {getDownloadButtonText()}
                    </Button>
                  </div>
                ) : (
                  <div className='flex justify-between grid grid-cols-1 md:grid-cols-3 items-end gap-4 px-3 flex-row'>
                    <div className='col-span-1'>
                      {Number(data?.price) ? (
                        <div>
                          {data?.discount ? (
                            <span className='text-lg font-bold line-through text-red-500'>
                              ${data.price}
                            </span>
                          ) : null}
                          <span className='text-xl font-bold'>
                            $
                            {(
                              Number(data?.price) -
                              (Number(data?.price) * Number(data.discount)) / 100
                            ).toFixed(2)}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className='col-span-1'></div>

                    <div className='col-span-1 justify-center md:justify-end items-center md:items-end pb-2'>
                      {!is_success_page ? (
                        <div className='flex flex-row gap-2 justify-center md:justify-end items-center md:items-end'>
                          <Button
                            variant='solid'
                            className={
                              isFreeProduct && (freeSignedIn || session?.accessToken)
                                ? 'bg-green-500 h-[50px]'
                                : 'bg-mainBlue h-[50px]'
                            }
                            disabled={loading}
                            onClick={async () => {
                              await handleClick();
                            }}
                          >
                            {getDownloadButtonText()}
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
