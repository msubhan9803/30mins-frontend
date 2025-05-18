import {useContext, useEffect, useState} from 'react';
import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';
import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import classNames from 'classnames';
import mutations from 'constants/GraphQL/Products/mutations';
import {BookmarkIcon, HeartIcon, ShareIcon} from '@heroicons/react/24/outline';
import ConfirmDialog from '@root/components/dialog/confirm';
import Button from '@root/components/button';
import Loader from '@root/components/loader';
import {useSession} from 'next-auth/react';
import {UserContext} from '@root/context/user';
import toast from 'react-hot-toast';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import {useRouter} from 'next/router';

import {IPropsPProductCard} from './constants';

export default function PublicProductCard({data}: IPropsPProductCard) {
  const {t} = useTranslation('common');
  const {data: session} = useSession();
  const {query, basePath} = useRouter();
  const {refItems} = useContext(UserContext);
  const VDescription = description =>
    description?.split('\n').length > 3 || description.length >= 170;
  const [isOpen, setIsOpen] = useState(false);
  const [isClamp, setIsClamp] = useState(true);
  const [deletePost, {loading: isLoading}] = useMutation(mutations.deleteProduct);
  const [
    qtt,
    // setQtt
  ] = useState(1);
  const toggleClamp = () => setIsClamp(!isClamp);
  const handleCloseDialog = () => {
    setIsOpen(false);
  };
  const [loading, setloading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [addCart] = useMutation(mutations.addCart, {variables: {}});

  const {showModal} = ModalContextProvider();

  const AddToCart = async productId => {
    await toast.dismiss();
    toast.loading(t('loading'));
    await addCart({
      variables: {
        productId: productId,
        quantity: Number(qtt),
        token: session?.accessToken,
      },
    });
    await refItems();
    showModal(MODAL_TYPES.PUBLICCHECKOUT, {});
    await toast.dismiss();
  };

  useEffect(() => {
    if (isAuthenticated && session) {
      setIsAuthenticated(false);
      AddToCart(data._id).finally(() => {
        showModal(MODAL_TYPES.PUBLICCHECKOUT);
      });
    }
  }, [isAuthenticated, session]);

  const handleDelete = async () => {
    try {
      await deletePost({
        variables: {
          token: session?.accessToken,
          documentId: data?._id,
        },
      });
      handleCloseDialog();
      toast.success(t('toast_post_delete'));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleClick = async () => {
    setloading(true);

    if (session?.accessToken) {
      await AddToCart(data._id);
    } else {
      showModal(MODAL_TYPES.AUTH_MODAL, {
        onAuthComplete: () => {
          setIsAuthenticated(true);
        },
      });
    }

    setloading(false);
  };

  return (
    <>
      <div className={classNames('bg-white border border-[rgb(219_219_219)]')}>
        <div className='flex flex-col items-stretch justify-center h-full'>
          <div className='border-b-w-[0.5px] border-b-[rgb(239_239_239)]'>
            <div className='flex justify-end items-end'></div>
          </div>
          <div className='flex flex-col items-stretch'>
            <a href={`${basePath}/${query?.username}/products/${data?._id}`}>
              <div className='pb-[100%] mx-6 relative'>
                <Image src={data?.image} alt='...' layout='fill' />
                {data?.discount ? (
                  <span className='absolute bg-red-400 shadow-sm rounded-lg p-1 font-semibold text-gray-800 right-2 top-1'>
                    {data.discount}% Off
                  </span>
                ) : null}
              </div>
            </a>
          </div>
          <div className='rounded-lg hidden'>
            <div className='flex flex-col border-l border-l-[rgb(239_239_239)]'>
              <div className='mt-1 px-2.5 pb-1.5 flex items-center'>
                <span className='p-2 -ml-2 flex items-center cursor-pointer'>
                  <HeartIcon className='w-6 h-6 text-mainText' />
                </span>
                <span className='p-2 flex items-center cursor-pointer'>
                  <ShareIcon className='w-6 h-6 text-mainText' />
                </span>
                <span className='p-2 ml-auto -mr-2.5 flex items-center cursor-pointer'>
                  <BookmarkIcon className='w-6 h-6 text-mainText' />
                </span>
              </div>
            </div>
          </div>
          <div className='px-3 mt-2 mb-2 min-h-[100px]'>
            <h4
              className='font-medium text-base line-clamp-1 leading-tight mr-1 break-all'
              title={data?.title}
            >
              {data?.title}
            </h4>
            <dd
              id={`desc-${data?._id}`}
              className={classNames(
                'min-h-[50px] text-sm mt-1 leading-tight text-mainText break-all',
                {
                  'line-clamp-3': isClamp,
                }
              )}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(data?.description),
              }}
            />
            {VDescription(data?.description) && (
              <span
                className='text-xs text-mainBlue font-medium cursor-pointer'
                onClick={toggleClamp}
              >
                {isClamp ? t('show_more') : t('show_less')}
              </span>
            )}
          </div>
          <div className='px-3 mt-2 mb-2 flex items-center gap-1 flex-wrap min-h-[55px]'>
            {data.tags.map((item: string, i: number) => (
              <span
                key={i}
                className='py-1 px-2 min-w-[50px] text-center text-xs text-mainText leading-tight border gap-2 min-w-10  shadow-inner shadow-gray-100 rounded-3xl'
              >
                {item}
              </span>
            ))}
          </div>
          <div className='flex justify-between items-end gap-1 p-1 flex-row'>
            {data.price ? (
              <div>
                {data?.discount ? (
                  <span className='text-sm line-through text-red-500'>${data.price}</span>
                ) : null}
                <span className='text-xl'>
                  $
                  {(
                    Number(data?.price) -
                    (Number(data?.price) * Number(data.discount)) / 100
                  ).toFixed(2)}
                </span>
              </div>
            ) : (
              <div>
                <span className='text-xl font-bold'>FREE</span>
              </div>
            )}

            <div className='flex flex-row gap-2 items-center'>
              <Button
                variant='solid'
                disabled={loading}
                onClick={async () => {
                  await handleClick();
                }}
              >
                {t('Add to Cart')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        title={'Delete Post?'}
        description={'This post will be permanently deleted.'}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <Button variant='cancel' onClick={handleCloseDialog}>
          {t('btn_cancel')}
        </Button>
        <Button variant='solid' onClick={handleDelete}>
          {isLoading ? <Loader /> : 'Delete'}
        </Button>
      </ConfirmDialog>
    </>
  );
}
