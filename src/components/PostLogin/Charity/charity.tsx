import {/* useMutation */ useQuery} from '@apollo/client';
import {MODAL_TYPES} from 'constants/context/modals';
import queries from 'constants/GraphQL/User/queries';
import charityQuery from 'constants/GraphQL/Charity/queries';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Loader from 'components/shared/Loader/Loader';
import trimString from 'utils';
import {PencilSquareIcon /* TrashIcon */} from '@heroicons/react/24/outline';
import Header from '@root/components/header';
// import mutations from 'constants/GraphQL/Charity/mutations';

const Charity = () => {
  const {data: session} = useSession();
  const router = useRouter();
  const {data, loading} = useQuery(queries.getUserById, {
    variables: {token: session?.accessToken},
  });

  // const [deleteMutation] = useMutation(mutations.deleteCharity);

  const isAdmin = data?.getUserById?.userData?.accountDetails?.accountType === 'admin';
  const {t} = useTranslation();

  const {showModal} = ModalContextProvider();

  const toggleAddCharity = () => {
    showModal(MODAL_TYPES.CHARITY);
  };

  const toggleEditCharity = itemID => {
    showModal(MODAL_TYPES.CHARITY, {
      charityID: itemID,
    });
  };

  /*
  Need to implement in future tickets
  const DeleteCharity = async itemID => {
    await deleteMutation({
      variables: {
        documentId: itemID,
        token: session?.accessToken,
      },
    });
    router.reload();
  }; */

  const {data: charityData, loading: charityLoading} = useQuery(charityQuery.getCharities, {
    variables: {token: session?.accessToken},
  });

  const charities = charityData !== null && charityData?.getCharities?.charityData;

  useEffect(() => {
    if (!isAdmin && !loading) {
      router.push('/');
    }
  }, [session, loading]);

  if (charityLoading) {
    return <Loader />;
  }

  if (!isAdmin && !loading) {
    return null;
  }
  const crumbs = [{title: t('common:txt_charity_setting'), href: '/'}];

  return (
    <>
      <Header crumbs={crumbs} heading={t('common:txt_charity_setting')} />

      <div className='text-right'>
        <button
          type='button'
          onClick={toggleAddCharity}
          className='mb-4 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {t('common:txt_add_charity')}
        </button>
      </div>
      <div className='flex flex-col'>
        <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr className='grid grid-cols-1 sm:grid-cols-5 pt-4'>
                    <th
                      scope='col'
                      className='col-span-1 px-6 w-[150px] sm:w-[400px] text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {t('common:Charity')}
                    </th>
                    <th
                      scope='col'
                      className='col-span-1 px-6 w-[150px] sm:w-[300px] text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:block'
                    >
                      taxID
                    </th>
                    <th
                      scope='col'
                      className='col-span-1 px-6 w-[150px] sm:w-[300px] text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:block'
                    >
                      Website
                    </th>
                    <th
                      scope='col'
                      className='col-span-1 px-6 w-[150px] sm:w-[600px] text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:block'
                    >
                      Description
                    </th>
                    <th
                      scope='col'
                      className='col-span-1 px-6 w-[150px] sm:w-[400px] text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:block'
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {charities && charities.length > 0
                    ? charities.map(charity => (
                        <>
                          <tr className='grid grid-cols-1 sm:grid-cols-5 pt-4'>
                            <td
                              key={charity}
                              className='col-span-1 px-6 text-sm font-bold text-gray-900'
                            >
                              {charity.name}
                            </td>
                            <td className='col-span-1 px-6 whitespace-nowrap text-sm font-medium text-gray-900'>
                              {charity.taxID}
                            </td>
                            <td className='col-span-1 px-6 text-sm font-medium text-gray-900'>
                              {trimString(charity?.website || '', 100)}
                            </td>
                            <td className='col-span-1 px-6 text-sm font-medium text-gray-900'>
                              {trimString(charity.description, 100)}
                            </td>
                            <td className='col-span-1 px-6 whitespace-nowrap text-sm font-medium text-gray-900'>
                              <button onClick={() => toggleEditCharity(charity._id)}>
                                <PencilSquareIcon className='text-mainBlue w-6 h-6 mr-4' />
                              </button>
                              {/* <button onClick={() => DeleteCharity(charity._id)}>
                                <TrashIcon className='text-red-600 w-6 h-6' />
                              </button> */}
                            </td>
                          </tr>
                        </>
                      ))
                    : 'No charities to show'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Charity;
