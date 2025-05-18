import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import {toast} from 'react-hot-toast';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import mutations from 'constants/GraphQL/Publications/mutations';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {GlobeAmericasIcon} from '@heroicons/react/20/solid';
import sanitizeHtml from 'sanitize-html';
import Button from '@root/components/button';

const PublicationCard = ({publication}) => {
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const {t} = useTranslation();
  const [deleteMutation] = useMutation(mutations.deletePublication);
  const router = useRouter();

  const EditPublication = itemID => {
    showModal(MODAL_TYPES.PUBLICATION, {
      pubID: itemID,
    });
  };

  const handleDelete = async itemID => {
    await deleteMutation({
      variables: {
        documentId: itemID,
        token: session?.accessToken,
      },
    });
    toast.success(t('common:publication_deleted'));
    router.reload();
  };

  const deletePublication = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: publication.headline,
      id: itemID,
      handleDelete: handleDelete,
    });
  };

  return (
    <>
      <div className='bg-white rounded-lg border shadow-lg mt-5 pad-24 flex flex-col '>
        <div
          className='flex-none sm:flex flex-row py-6 pubItemContainer flex-wrap justify-center px-4'
          key={publication.id}
        >
          <div className='w-36 h-36 rounded-md overflow-hidden'>
            <img
              className='w-full h-full object-cover object-center'
              src={publication.image}
              alt='publicationImage'
            />
          </div>
          <div className='flex flex-1 flex-col ml-2 overflow-hidden'>
            <span className='font-22 font-bold text-gray-700 break-words'>
              {publication.headline}
            </span>

            <a href={publication.url} target='_blank' rel='noreferrer'>
              <GlobeAmericasIcon className='w-6 h-6' />{' '}
            </a>
            <div className='unreset'>{publication.type}</div>
            {publication.description && (
              <div className='sm:col-span-2'>
                <dd
                  className='mt-1 custom'
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(publication.description),
                  }}
                ></dd>
              </div>
            )}
            <div className='flex items-center justify-end gap-3 my-2 mx-2'>
              <Button
                variant='solid'
                className='w-20 !text-xs'
                onClick={() => EditPublication(publication._id)}
              >
                {t('common:btn_edit')}
              </Button>
              <Button
                variant='cancel'
                className='w-20 !text-xs'
                onClick={() => deletePublication(publication._id)}
              >
                {t('common:btn_delete')}
              </Button>
            </div>
          </div>
        </div>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center' aria-hidden='true'>
            <div className='w-full border-t border-gray-300' />
          </div>
          <div className='relative flex justify-center'></div>
        </div>
      </div>
    </>
  );
};

export default PublicationCard;
