import {PencilIcon} from '@heroicons/react/20/solid';
import {MODAL_TYPES} from 'constants/context/modals';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import AvailabilityQueries from 'constants/GraphQL/CollectiveAvailability/queries';
import {useContext, useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {NotificationContext} from 'store/Notification/Notification.context';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import AvailabilityMutations from 'constants/GraphQL/CollectiveAvailability/mutations';
import sanitizeHtml from 'sanitize-html';
import Button from '@root/components/button';

const ListGroups = ({t, values, session, setFieldValue, handleClear}) => {
  const {showModal, hideModal} = ModalContextProvider();

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const handleEditGroup = async (name, _id) => {
    const {data} = await graphqlRequestHandler(
      AvailabilityMutations.EditGroup,
      {
        groupData: {
          guestIDs: values.groups
            .filter(group => group._id === _id)[0]
            .guestIDs.map(guest => guest._id),
          name: name,
        },
        documentId: _id,
      },
      session?.accessToken
    );
    const EditGroup = data?.data?.editGroup;
    if (EditGroup?.status === 200) {
      showNotification(NOTIFICATION_TYPES.success, EditGroup?.message, false);
      const {data: getAllGroups} = await graphqlRequestHandler(
        AvailabilityQueries.getAllGroups,
        {},
        session?.accessToken
      );
      setFieldValue('groups', getAllGroups?.data?.getAllGroups?.groupData);
      setFieldValue('idSelectedGroup', '');
      setFieldValue('availableTimeSlots', []);
      setFieldValue('emails', []);
      setFieldValue('email', '');
      hideModal();
    }
  };
  const showUpdateGroup = _id => {
    showModal(MODAL_TYPES.EDIT_AVAILABILITY_GROUP_TITLE, {
      handleConfirm: handleEditGroup,
      title: t('common:txt_edit_group_title'),
      values: values,
      id: _id,
      setFieldValue: setFieldValue,
    });
  };

  const GroupItem = ({_id, guestIDs, name}) => {
    const [SelectIsLeading, setSelectIsLeading] = useState(false);

    const HandleGetGroupByID = async id => {
      setSelectIsLeading(true);
      const {data} = await graphqlRequestHandler(
        AvailabilityQueries.getGroupByID,
        {
          documentId: id,
        },
        session?.accessToken
      );
      handleClear(setFieldValue);
      setFieldValue(
        'emails',
        data?.data.getGroupById?.groupData?.guestIDs?.map(guests => ({
          _id: guests._id,
          email: guests.accountDetails.email,
        }))
      );
      setFieldValue('idSelectedGroup', data?.data?.getGroupById?.groupData?._id);
      setSelectIsLeading(false);
    };

    return (
      <li className='block p-1'>
        <div className='grid grid-cols-1 sm:grid-cols-4 col-span-1 gap-2 grid-flow-col border-b pb-1'>
          <div className='col-span-1  sm:col-span-3'>
            <div className='flex flex-row'>
              <span className='font-bold text-sm line-clamp-1'>
                {name.length < 25 ? name : `${name.substring(0, 25).trim()}...`}
              </span>
              <PencilIcon
                className='text-gray-500 ml-1 hover:text-blue-500 cursor-pointer focus:outline-none '
                width={18}
                height={18}
                onClick={() => showUpdateGroup(_id)}
              />
            </div>
            <div
              className='block cursor-pointer col-span-1 my-auto text-sm text-gray-400 line-clamp-2  hover:line-clamp-3 duration-1000'
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  guestIDs?.map(group => group?.accountDetails?.email)?.join(', ')
                ),
              }}
            />
          </div>
          <Button
            variant='solid'
            onClick={() => HandleGetGroupByID(_id)}
            disabled={SelectIsLeading}
            className='my-auto'
          >
            <span className='m-auto'>
              {SelectIsLeading ? t('common:txt_loading') : t('common:Select')}
            </span>
          </Button>
        </div>
      </li>
    );
  };
  return (
    <ul className='grid grid-cols-1 gap-1 p-2 h-48 border rounded-sm mt-2 overflow-y-auto'>
      {values?.groups?.map(({_id, guestIDs, name}, index) => (
        <GroupItem key={index} _id={_id} guestIDs={guestIDs} name={name} />
      ))}
    </ul>
  );
};

export default ListGroups;
