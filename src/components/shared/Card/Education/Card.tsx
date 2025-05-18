import {useMutation} from '@apollo/client';
import {toast} from 'react-hot-toast';
import {MODAL_TYPES} from 'constants/context/modals';
import mutations from 'constants/GraphQL/EducationHistory/mutations';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Button from '@root/components/button';

const EducationCard = ({education}) => {
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const router = useRouter();
  const [deleteMutation] = useMutation(mutations.deleteEducationHistory);
  const {t} = useTranslation();

  const EditEducation = itemID => {
    showModal(MODAL_TYPES.EDUCATION, {
      eventID: itemID,
      initdata: education,
    });
  };

  const handleDelete = async itemID => {
    await deleteMutation({
      variables: {
        documentId: itemID,
        token: session?.accessToken,
      },
    });
    toast.success(t('common:education_deleted'));
    router.reload();
  };

  const deleteEducation = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: education.school,
      id: itemID,
      handleDelete: handleDelete,
    });
  };

  return (
    <>
      <div className='bg-white rounded-lg border shadow-lg mt-5 pad-24 flex flex-col'>
        <div
          className='flex-none sm:flex flex-row py-6 pubItemContainer flex-wrap justify-center px-4'
          key={education.id}
        >
          <div className='flex flex-1 flex-col  overflow-hidden'>
            <span className='font-22 font-bold text-gray-700 break-words'>
              {education.school} - {education.fieldOfStudy}
            </span>

            <div className='unreset'>{education.degree}</div>
            <div className='unreset'>
              {new Date(education.startDate).toLocaleDateString('en-us', {
                year: 'numeric',
                month: 'short',
              })}
              -{' '}
              {education.current && education.endDate === null
                ? 'Present'
                : new Date(education.endDate).toLocaleDateString('en-us', {
                    year: 'numeric',
                    month: 'short',
                  })}
            </div>
            <div>{education.graduated ? 'Graduated' : null}</div>
            {education.extracurricular && (
              <div className='sm:col-span-2'>
                <dd
                  className='mt-1 custom'
                  dangerouslySetInnerHTML={{
                    __html: education.extracurricular,
                  }}
                ></dd>
              </div>
            )}
            <div className='flex items-center justify-end gap-3 my-2 mx-2'>
              <Button
                variant='solid'
                className='w-20 !text-xs'
                onClick={() => EditEducation(education._id)}
              >
                {t('common:btn_edit')}
              </Button>
              <Button
                variant='cancel'
                className='w-20 !text-xs'
                onClick={() => deleteEducation(education._id)}
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

export default EducationCard;
