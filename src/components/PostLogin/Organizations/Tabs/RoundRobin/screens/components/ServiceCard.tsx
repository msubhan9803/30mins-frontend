/* eslint-disable no-restricted-globals */
import useTranslation from 'next-translate/useTranslation';
import {Menu, Transition} from '@headlessui/react';
import {Fragment, useContext, useState} from 'react';
import {EllipsisVerticalIcon, PencilSquareIcon, TrashIcon} from '@heroicons/react/20/solid';
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline';
import ConfirmDialog from '@root/components/dialog/confirm';
import classNames from 'classnames';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import Link from 'next/link';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import mutations from 'constants/GraphQL/RoundRobin/mutations';
import Srvmutations from 'constants/GraphQL/Service/mutations';
import Loader from '@root/components/loader';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';
import {TABS} from 'constants/context/tabs';
import sanitizeHtml from 'sanitize-html';
import {toast} from 'react-hot-toast';
import Button from '@root/components/button';

type IProps = {
  service: any;
  organization: any;
  setFieldValue: any;
  SwitchTab: any;
  getServiceData: any;
};
const ServiceCard = ({service, organization, getServiceData, setFieldValue, SwitchTab}: IProps) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const [isPrivateOpen, setIsPrivateOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(service.isPrivate || false);

  const [editServiceIsPrivate, {loading: loadingIsPrivateService}] = useMutation(
    Srvmutations.editService
  );

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const {showModal, hideModal} = ModalContextProvider();

  const [deleteMutation] = useMutation(mutations.DeleteOrgRoundRobinService);

  const handleDeleteOrgService = async () => {
    const {data} = await deleteMutation({
      variables: {
        documentId: service._id,
        organizationId: organization._id,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });
    showNotification(NOTIFICATION_TYPES.info, data.deleteOrgRoundRobinService.message, false);
    getServiceData();
    hideModal();
  };

  const deleteService = () => {
    showModal(MODAL_TYPES.DELETE, {
      name: service.title,
      isOrgDelete: true,
      handleDelete: handleDeleteOrgService,
    });
  };

  const EditService = () => {
    setFieldValue('initdata', service);
    SwitchTab(TABS.ManageService);
  };

  const handleIsPrivateService = async docID => {
    try {
      setIsPrivate(!isPrivate);
      await editServiceIsPrivate({
        variables: {
          token: session?.accessToken,
          documentId: docID,
          serviceData: {
            slug: service.slug,
            isPrivate: !isPrivate,
          },
        },
      });
      setIsPrivateOpen(false);
      await getServiceData();
    } catch {
      setIsPrivateOpen(false);
    }
  };

  return (
    <>
      <div
        className={classNames([
          'bg-white w-full md:w-[49%] shadow-lg rounded-lg divide-y h-max divide-gray-200 col-span-1',
        ])}
        key={service?.title}
      >
        <div className='px-4 py-5 flex flex-wrap'>
          <div className='w-2/5 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2'>
            {service.isPrivate ? t('event:Private') : t('event:Public')}
          </div>

          <div className='w-3/5 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 justify-end text-right'>
            <Menu as='div' className='relative inline-block text-left'>
              <div>
                <Menu.Button>
                  <EllipsisVerticalIcon className='w-4 h-4' />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Menu.Items className='origin-top-right absolute right-4 -top-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  <div className='py-1'>
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
                        {isPrivate ? t('common:btn_public') : t('common:btn_private')}
                      </button>
                    </Menu.Item>

                    <Menu.Item>
                      {({active}) => (
                        <button
                          onClick={() => EditService()}
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'w-24 px-4 py-2 text-sm  flex'
                          )}
                        >
                          <PencilSquareIcon className='w-5 h-5 text-mainBlue' />
                          <span>Edit</span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({active}) => (
                        <button
                          onClick={() => deleteService()}
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'w-24 px-4 py-2 text-sm  flex'
                          )}
                        >
                          <TrashIcon className='w-5 h-5 text-red-600' /> <span>Delete</span>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        <div className='cursor-pointer hover:shadow-md max-h-36' onClick={() => EditService()}>
          <div className='px-4 py-5 p-4'>
            <p className='font-bold text-md break-words line-clamp-1' title={service?.title}>
              {service?.title}
            </p>
            {service.description && (
              <div
                className='sm:col-span-2 line-clamp-2 break-all'
                title={service.description.substring(3)}
              >
                <div
                  className='mt-1 text-sm text-gray-900 custom'
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(service.description),
                  }}
                />
              </div>
            )}

            <p>{service.price > 0 ? service.currency + service.price : t('event:Free')}</p>
          </div>
        </div>

        <div className='py-5 gap-2 px-4 flex w-full'>
          <button
            className=''
            onClick={() => {
              navigator.clipboard.writeText(
                `${location?.origin}/org/${service?.organizationId?.slug}/${service.slug}`
              );
              toast.success(t('common:Link Copied'));
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={`h-6 w-6 text-mainBlue`}
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
              />
            </svg>
          </button>
          <Link
            href={`${location?.origin}/org/${service?.organizationId?.slug}/${service.slug}`}
            passHref={false}
          >
            <a
              className='cursor-pointer text-sm text-mainBlue truncate w-full'
              target={'_blank'}
              title={`https://30mins.com/org/${service?.organizationId?.slug}/${service.slug}`}
            >
              https://30mins.com/org/{service?.organizationId?.slug}/{service.slug}
            </a>
          </Link>
        </div>
      </div>
      <ConfirmDialog
        title={
          isPrivate
            ? t('common:txt_edit_public_service_title')
            : t('common:txt_edit_private_service_title')
        }
        description={
          isPrivate
            ? t('common:txt_edit_public_service_desc')
            : t('common:txt_edit_private_service_desc')
        }
        isOpen={isPrivateOpen}
        setIsOpen={setIsPrivateOpen}
      >
        <Button variant='cancel' onClick={() => setIsPrivateOpen(false)}>
          {t('common:btn_cancel')}
        </Button>
        <Button variant='solid' onClick={() => handleIsPrivateService(service._id)}>
          {loadingIsPrivateService ? (
            <Loader />
          ) : isPrivate ? (
            t('common:btn_public')
          ) : (
            t('common:btn_private')
          )}
        </Button>
      </ConfirmDialog>
    </>
  );
};
export default ServiceCard;
