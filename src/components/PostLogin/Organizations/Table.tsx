import {useState, useMemo, useCallback} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import {toast} from 'react-hot-toast';
import mutations from 'constants/GraphQL/Organizations/mutations';

const Table = ({orgs, userId, refetch}) => {
  const [search, setSearch] = useState('');
  const {t} = useTranslation();
  const {data: session} = useSession();
  const [leaveMutation] = useMutation(mutations.handleLeave);
  const [deleteMutation] = useMutation(mutations.deleteOrganization);
  const router = useRouter();
  const {showModal, hideModal} = ModalContextProvider();

  const filteredOrgs =
    useMemo(() => {
      if (!search) {
        return orgs;
      }
      return orgs.filter(({organizationId}) =>
        organizationId.title.toLowerCase().includes(search.toLowerCase())
      );
    }, [orgs, search]) || [];

  const handleDeleteOrganization = useCallback(
    async ordID => {
      await deleteMutation({
        variables: {
          documentId: ordID,
          token: session?.accessToken,
        },
      });
      toast.success(t('common:organization_deleted'));
      refetch();
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
          refetch();
          hideModal();
        }
      } catch (err) {
        console.log(err);
      }
    },
    [leaveMutation, router, session?.accessToken]
  );

  const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <div className='container mx-auto'>
      <div className='my-6 flex gap-4 mt-0'>
        <input
          type='search'
          className='rounded-md border-gray'
          onChange={e => setSearch(e.target.value)}
          placeholder={t('common:search')}
        />
      </div>
      <div className='max-h-[650px] overflow-y-scroll'>
        <table className='min-w-full text-center'>
          <thead className='border-b bg-gray-50'>
            <tr>
              <th scope='col' className='text-sm w-[15%] font-bold text-black px-6 py-4'>
                {t('common:logo')}
              </th>
              <th scope='col' className='text-sm w-[35%] font-bold text-black px-6 py-4'>
                {t('common:name')}
              </th>
              <th scope='col' className='text-sm w-[35%] font-bold text-black px-6 py-4'>
                {t('common:role')}
              </th>
              <th scope='col' className='text-sm w-[35%] font-bold text-black px-6 py-4'>
                {t('common:public_page_url')}
              </th>
              <th scope='col' className='text-sm w-[15%] font-bold text-black px-6 py-4'>
                {t('common:actions')}
              </th>
            </tr>
          </thead>
          <tbody className='w-full'>
            {filteredOrgs?.length > 0 &&
              filteredOrgs.map(org => {
                const isOwner = org?.role === 'owner' && org?.userId === userId;
                const organization = org?.organizationId;
                const orgID = organization?._id;

                return (
                  <tr key={orgID} className='bg-white border-b w-full'>
                    <td colSpan={1} className='w-[15%] p-2 text-center items-center justify-center'>
                      <img
                        className='w-24 h-24 m-auto object-contain object-center'
                        src={
                          organization?.image ||
                          'https://files.stripe.com/links/MDB8YWNjdF8xSXExT2dKV2FIT3E3dTdkfGZsX3Rlc3RfMW15OUp4UHNvb29Lem9BVXFrdjBId0JT00jAdxbWe4'
                        }
                        alt='Organization Image'
                      />
                    </td>
                    <td colSpan={1} className='p-2'>
                      <span className='font-semibold w-32 md:w-3/4 mx-auto break-words line-clamp-2'>
                        {organization?.title}
                      </span>
                    </td>
                    <td colSpan={1} className='p-2'>
                      <span className='font-semibold w-32 md:w-3/4 mx-auto break-words line-clamp-2'>
                        {capitalizeFirstLetter(org?.role)}
                      </span>
                    </td>
                    <td colSpan={1} className='p-2'>
                      <a
                        href={`/org/${organization?.slug}`}
                        target='_blank'
                        rel='noreferrer'
                        className='text-base mx-auto italic underline text-center break-all line-clamp-1 my-auto text-mainBlue visited:text-mainText'
                      >
                        {/* {`https://30mins.com/org/${organization?.slug}`} */}
                        {t('common:view_the_page')}
                      </a>
                    </td>
                    <td colSpan={1} className='px-6 py-4'>
                      {isOwner ? (
                        <button
                          onClick={() => {
                            handleDeleteOrganizationModal(organization);
                          }}
                          className='p-1 px-4 my-1 bg-red-500 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white active:opacity-75'
                        >
                          {t('common:btn_delete')}
                        </button>
                      ) : null}
                      <button
                        onClick={() => {
                          handleLeaveOrganization(organization);
                        }}
                        className='p-1 px-4 my-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md active:opacity-75'
                      >
                        {t('common:leave')}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {filteredOrgs?.length === 0 && (
        <div className='w-full h-full flex justify-center items-center'>
          <span>{t('common:no_result_found')}</span>
        </div>
      )}
    </div>
  );
};

export default Table;
