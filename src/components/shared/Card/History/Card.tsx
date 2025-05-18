import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/JobHistory/mutations';
import sanitizeHtml from 'sanitize-html';
import {toast} from 'react-hot-toast';
import Button from '@root/components/button';

const HistoryCard = ({jobs}) => {
  const {showModal} = ModalContextProvider();

  const {t} = useTranslation();

  const EditJobHistory = itemID => {
    showModal(MODAL_TYPES.JOBHISTORY, {
      eventID: itemID,
    });
  };

  const {data: session} = useSession();
  const router = useRouter();
  const [deleteMutation] = useMutation(mutations.deleteJobHistory);

  const DeleteJobHistory = async itemID => {
    await deleteMutation({
      variables: {
        documentId: itemID,
        token: session?.accessToken,
      },
    });
    toast.success(t('common:job_deleted_history'));
    router.reload();
  };

  const deleteHistory = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: jobs.company,
      id: itemID,
      handleDelete: DeleteJobHistory,
    });
  };

  return (
    <div key={jobs.id} className='bg-white rounded-lg border shadow-lg mt-5 pad-24 flex flex-col'>
      <div
        className='flex-none sm:flex flex-row py-6 pubItemContainer flex-wrap justify-center px-4'
        key={jobs.id}
      >
        <div className='flex flex-1 flex-col ml-2 overflow-hidden'>
          <span className='font-22 font-bold text-gray-700 break-words'>
            {jobs.position} - {jobs.company}
          </span>
          <div className='unreset'>
            {new Date(jobs.startDate).toLocaleDateString('en-us', {
              year: 'numeric',
              month: 'short',
            })}
            -{' '}
            {jobs.current && jobs.endDate === null
              ? 'Present'
              : new Date(jobs.endDate).toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'short',
                })}
          </div>
          <div className='unreset'>
            {jobs.location} - {jobs.employmentType}
          </div>
          {jobs.roleDescription && (
            <div className='sm:col-span-2'>
              <dd
                className='mt-1 custom break-words'
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(jobs.roleDescription),
                }}
              ></dd>
            </div>
          )}

          <div className='flex items-center justify-end gap-3 my-2 mx-2'>
            <Button
              variant='solid'
              className='w-20 !text-xs'
              onClick={() => EditJobHistory(jobs._id)}
            >
              {t('common:btn_edit')}
            </Button>
            <Button
              variant='cancel'
              className='w-20 !text-xs'
              onClick={() => deleteHistory(jobs._id)}
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
  );
};

export default HistoryCard;
