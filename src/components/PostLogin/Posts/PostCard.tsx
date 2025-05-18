import {useState, useEffect} from 'react';
import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';
import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import {toast} from 'react-hot-toast';
import classNames from 'classnames';

import mutations from 'constants/GraphQL/Posts/mutations';

import {HeartIcon, ShareIcon, BookmarkIcon} from '@heroicons/react/24/outline';

import ConfirmDialog from '@root/components/dialog/confirm';
import Button from '@root/components/button';
import Loader from '@root/components/loader';
import ActionMenu from './ActionMenu';

import {IPropsPostCard} from './constants';

export default function PostCard({data, session, showMenus, handleRefetch}: IPropsPostCard) {
  const {t} = useTranslation('common');

  const [isOpen, setIsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isClamp, setIsClamp] = useState(true);

  const [deletePost, {loading: isLoading}] = useMutation(mutations.deletePost);

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
      await deletePost({
        variables: {
          token: session?.accessToken,
          documentId: data?._id,
        },
      });

      handleRefetch?.();
      handleCloseDialog();

      toast.success(t('toast_post_delete'));
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
              {showMenus && <ActionMenu id={data?._id} handleOpenDialog={handleOpenDialog} />}
            </div>
          </div>
          <div className='flex flex-col items-stretch'>
            <div className='pb-[100%] relative'>
              <Image src={data?.image} alt='...' layout='fill' />
            </div>
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
