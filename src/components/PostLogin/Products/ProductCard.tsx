import {useContext, useEffect, useState} from 'react';
import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';
import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import classNames from 'classnames';

import mutations from 'constants/GraphQL/Products/mutations';

import ConfirmDialog from '@root/components/dialog/confirm';
import Button from '@root/components/button';
import Loader from '@root/components/loader';
import {useSession} from 'next-auth/react';
import toast from 'react-hot-toast';
import {UserContext} from '@root/context/user';
import ActionMenu from './ActionMenu';

import {IPropsProductCard} from './constants';

export default function ProductCard({data, refetch}: IPropsProductCard) {
  const {t} = useTranslation('common');
  const {data: session} = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isClamp, setIsClamp] = useState(true);
  const [deleteProduct, {loading: isLoading}] = useMutation(mutations.deleteProduct);
  const {user} = useContext(UserContext);

  useEffect(() => {
    const el = document.getElementById(`desc-${data?._id}`);

    if (el) {
      const text = el?.innerText;
      const length = text?.split('\n').length;

      if (length > 3 || text.length >= 170) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  }, [data?.description]);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const toggleClamp = () => setIsClamp(!isClamp);

  const handleDelete = async () => {
    try {
      await deleteProduct({
        variables: {
          token: session?.accessToken,
          documentId: data?._id,
        },
      });

      handleCloseDialog();
      await refetch!();
      toast.success(t('toast_product_delete'));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className={classNames('bg-white border border-[rgb(219_219_219)]')}>
        <div className='flex flex-col items-stretch justify-center'>
          <div className='border-b-w-[0.5px] border-b-[rgb(239_239_239)]'>
            <div className='flex justify-end items-end'>
              <ActionMenu
                id={data?._id}
                handleOpenDialog={handleOpenDialog}
                username={user?.username}
              />
            </div>
          </div>
          <div className='flex flex-col items-stretch'>
            <div className='pb-[100%] relative'>
              <Image src={data?.image} alt='...' layout='fill' />
            </div>
          </div>

          <div className='px-3 mt-2 mb-2 min-h-[100px]'>
            <h4
              className='font-medium text-base line-clamp-1 leading-tight mr-1 break-all'
              title={data?.title}
            >
              {data?.title}
            </h4>
            <p
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
            {showMore && (
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
          <div className='flex justify-end items-end gap-1 p-1 flex-row'>
            {data?.discount ? (
              <>
                <span className='bg-red-400 mr-auto shadow-sm rounded-lg p-1 font-semibold text-gray-800 right-2 top-1'>
                  {data.discount}% Off
                </span>
                <span className='text-sm line-through text-red-500'>${data.price}</span>
              </>
            ) : null}
            <span className='text-xl'>
              $
              {(Number(data?.price) - (Number(data?.price) * Number(data.discount)) / 100).toFixed(
                2
              )}
            </span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        title={t('Delete Product?')}
        description={t('This product will be permanently deleted')}
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
