import {Menu, Transition} from '@headlessui/react';
import {Fragment, useState} from 'react';
import {EyeIcon, EyeSlashIcon, PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import ConfirmDialog from '@root/components/dialog/confirm';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Service/mutations';
import {useSession} from 'next-auth/react';
import Loader from '@root/components/loader';
import useTranslation from 'next-translate/useTranslation';
import {toast} from 'react-hot-toast';
import Button from '@root/components/button';

export default function Actions({
  button,
  serviceID,
  refetch,
  slug,
  serviceType,
  isPrivate,
  isOrgService,
}) {
  const {t} = useTranslation('common');
  const {data: session} = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPrivateOpen, setIsPrivateOpen] = useState(false);

  const [deleteMutation, {loading}] = useMutation(mutations.deleteService);
  const handleDeleteService = async docID => {
    await deleteMutation({
      variables: {
        token: session?.accessToken,
        documentId: docID,
      },
    });
    refetch();
    setIsOpen(false);
    toast.success(t('toast_service_delete'));
  };

  const [editService, {loading: loadingIsPrivateService}] = useMutation(mutations.editService);
  const handleIsPrivateService = async docID => {
    try {
      await editService({
        variables: {
          token: session?.accessToken,
          documentId: docID,
          serviceData: {
            slug: slug,
            isPrivate: isPrivate ? false : true,
          },
        },
      });
      setIsPrivateOpen(false);
      toast.success(t('toast_service_visibility'));
      refetch();
    } catch {
      setIsPrivateOpen(false);
    }
  };

  return (
    <>
      <Menu as='div' className='relative inline-block text-left'>
        <div>{button}</div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute flex flex-col right-11 xl:right-8 -bottom-0 xl:-bottom-14 w-40 origin-top-right rounded-md bg-white shadow-lg border z-50 p-4'>
            <Menu.Item>
              <button
                onClick={() => setIsPrivateOpen(true)}
                className='flex px-3 py-2 hover:bg-gray-200 hover:bg-opacity-50 rounded-md'
              >
                {!isPrivate ? (
                  <EyeSlashIcon className='w-5 h-5 mr-2 text-black' />
                ) : (
                  <EyeIcon className='w-5 h-5 mr-2 text-black' />
                )}
                {isPrivate ? t('btn_public') : t('btn_private')}
              </button>
            </Menu.Item>

            <Menu.Item>
              <button
                onClick={() => {
                  switch (serviceType) {
                    case 'MEETING':
                      if (!isOrgService) {
                        router.push(
                          `/user/meeting-services/add-services/?mode=edit&sid=${serviceID}`
                        );
                      } else {
                        router.push(
                          `/user/organization-services/add-organization-service/?mode=edit&sid=${serviceID}`
                        );
                      }
                      break;
                    case 'FREELANCING_WORK':
                      router.push(
                        `/user/freelancing-services/add-services/?mode=edit&sid=${serviceID}`
                      );
                      break;

                    default:
                      router.push(`/user/other-services/add-services/?mode=edit&sid=${serviceID}`);
                      break;
                  }
                }}
                className='flex px-3 py-2 hover:bg-gray-200 hover:bg-opacity-50 rounded-md'
              >
                <PencilSquareIcon className='w-5 h-5 mr-2 text-mainBlue' />
                {t('btn_edit')}
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => setIsOpen(true)}
                className='flex px-3 py-2 hover:bg-gray-200 hover:bg-opacity-50 rounded-md'
              >
                <TrashIcon className='w-5 h-5 mr-2 text-red-500' />
                {t('Delete_record')}
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
      <ConfirmDialog
        title={t('txt_delete_service_title')}
        description={t('txt_delete_service_desc')}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <Button variant='cancel' onClick={() => setIsOpen(false)}>
          {t('btn_cancel')}
        </Button>
        <Button variant='solid' onClick={() => handleDeleteService(serviceID)}>
          {loading ? <Loader /> : 'Delete'}
        </Button>
      </ConfirmDialog>
      <ConfirmDialog
        title={isPrivate ? t('txt_edit_public_service_title') : t('txt_edit_private_service_title')}
        description={
          isPrivate ? t('txt_edit_public_service_desc') : t('txt_edit_private_service_desc')
        }
        isOpen={isPrivateOpen}
        setIsOpen={setIsPrivateOpen}
      >
        <Button variant='cancel' onClick={() => setIsPrivateOpen(false)}>
          {t('btn_cancel')}
        </Button>
        <Button variant='solid' onClick={() => handleIsPrivateService(serviceID)}>
          {loadingIsPrivateService ? <Loader /> : isPrivate ? t('btn_public') : t('btn_private')}
        </Button>
      </ConfirmDialog>
    </>
  );
}
