import {Menu, Transition} from '@headlessui/react';
import {Fragment, useCallback, useContext} from 'react';
import {ChevronDownIcon} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {toast} from 'react-hot-toast';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {UserContext} from '@root/context/user';
import {IProps} from './constants';

export default function Actions(props: IProps) {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const [leaveMutation] = useMutation(mutations.handleLeave);
  const [deleteMutation] = useMutation(mutations.deleteOrganization);
  const router = useRouter();
  const {hasOrgExtention} = useContext(UserContext);
  const {showModal, hideModal} = ModalContextProvider();
  const isOwner = props?.role === 'owner' && props?.userId === props.OriginUserId;

  const handleLeaveOrganization = useCallback(
    async organization => {
      try {
        const response = await leaveMutation({
          variables: {
            token: session?.accessToken,
            organizationId: organization?._id,
          },
        });
        const {data} = response;
        if (data?.leaveOrganization?.status === 400) {
          toast.success(t(data?.leaveOrganization?.message));
        } else {
          props?.refetch!();
          hideModal();
        }
      } catch (err) {
        console.log(err);
      }
    },
    [leaveMutation, router, session?.accessToken]
  );

  const editOrg = data => {
    showModal(MODAL_TYPES.ORGANIZATION, {
      orgId: data._id,
      initdata: {
        title: data.title,
        slug: data.slug,
        headline: data.headline,
        description: data.description,
        searchTags: data.searchTags,
        website: data.website,
        supportEmail: data.supportEmail,
        supportPhone: data.supportPhone,
        location: data.location,
        socials: {
          facebook: data?.socials?.facebook || '',
          instagram: data?.socials?.instagram || '',
          linkedin: data?.socials?.linkedin || '',
          twitter: data?.socials?.twitter || '',
          youtube: data?.socials?.youtube || '',
        },
        media: {type: data.media?.type || '', link: data.media?.link || ''},
        isPrivate: data.isPrivate,
        image: data.image,
        publicFeatures: data?.publicFeatures || [],
      },
      hasOrgExtention,
    });
  };
  const inviteMembers = async organization => {
    showModal(MODAL_TYPES.ORG_INVITE_MEMBERS, {
      initData: organization,
    });
  };

  const handleDeleteOrganization = useCallback(
    async ordID => {
      await deleteMutation({
        variables: {
          documentId: ordID,
          token: session?.accessToken,
        },
      });
      toast.success(t('common:organization_deleted'));
      props?.refetch!();
      hideModal();
    },
    [deleteMutation, router, session?.accessToken]
  );

  const handleDeleteOrganizationModal = useCallback(
    organization => {
      showModal(MODAL_TYPES.DELETE, {
        name: organization?.title,
        id: organization?._id,
        handleDelete: () => handleDeleteOrganization(organization?._id),
      });
    },
    [handleDeleteOrganization, showModal]
  );

  return (
    <div className='absolute right-1 bottom-1'>
      <Menu as='div' className='relative inline-block text-left'>
        <div className=''>
          <Menu.Button className='flex bg-white items-center justify-center border border-gray-300 rounded-lg w-7 h-7 hover:bg-gray-200 hover:bg-opacity-60 shadow-md z-10'>
            <ChevronDownIcon className='w-6 h-6 text-gray-400' />
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
          <Menu.Items className='absolute flex flex-col right-8 -bottom-1 w-40 origin-top-right rounded-md bg-white shadow-lg border z-50 py-2 px-3'>
            <Menu.Item>
              <a
                href={`/org/${props.organizationId?.slug}`}
                target='_blank'
                rel='noreferrer'
                className='hover:bg-white hover:text-black p-1 px-4 my-1 bg-gray-500 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white active:opacity-75'
              >
                <button className='w-full'>{t('common:view_the_page')}</button>
              </a>
            </Menu.Item>

            {isOwner && (
              <Menu.Item>
                <button
                  onClick={async () => {
                    await handleDeleteOrganizationModal(props.organizationId);
                  }}
                  className='hover:bg-white hover:text-black p-1 px-4 my-1 bg-red-500 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white active:opacity-75'
                >
                  {t('common:btn_delete')}
                </button>
              </Menu.Item>
            )}

            {!isOwner && (
              <Menu.Item>
                <button
                  onClick={async () => {
                    handleLeaveOrganization(props.organizationId);
                  }}
                  className='hover:bg-white hover:text-black p-1 px-4 my-1 bg-red-500 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white active:opacity-75'
                >
                  {t('common:leave')}
                </button>
              </Menu.Item>
            )}

            {isOwner && (
              <Menu.Item>
                <button
                  onClick={async () => {
                    await editOrg(props.organizationId);
                  }}
                  className='hover:bg-white hover:text-black p-1 px-4 my-1 bg-mainBlue border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white active:opacity-75'
                >
                  {t('common:edit')}
                </button>
              </Menu.Item>
            )}

            {isOwner && (
              <Menu.Item>
                <button
                  onClick={async () => {
                    inviteMembers(props.organizationId);
                  }}
                  className='hover:bg-white hover:text-black p-1 px-4 my-1 bg-mainBlue border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white active:opacity-75'
                >
                  {t('common:invite members')}
                </button>
              </Menu.Item>
            )}

            {isOwner && (
              <Menu.Item>
                <button
                  onClick={async () => {
                    router.push(`/user/organizations/services/?oid=${props.organizationId._id}`);
                  }}
                  className='hover:bg-white hover:text-black p-1 px-4 my-1 bg-mainBlue border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white active:opacity-75'
                >
                  {t('common:services')}
                </button>
              </Menu.Item>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
