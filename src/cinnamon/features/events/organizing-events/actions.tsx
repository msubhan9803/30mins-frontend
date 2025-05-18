/* eslint-disable @typescript-eslint/no-unused-vars */
import {Menu, Transition} from '@headlessui/react';
import {Fragment, useState} from 'react';
import Link from 'next/link';

import {
  EyeIcon,
  EyeSlashIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import ConfirmDialog from '@root/components/dialog/confirm';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Event/mutations';
import {useSession} from 'next-auth/react';
import Loader from '@root/components/loader';
import useTranslation from 'next-translate/useTranslation';
import {toast} from 'react-hot-toast';
import dayjs from 'dayjs';

import Button from '@root/components/button';
import Field from '@components/forms/field';
import Input from '@components/forms/input';

export default function Actions({button, serviceID, refetch, isPublic, status, type}) {
  const {t} = useTranslation('common');

  const {data: session} = useSession();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isPublicOpen, setIsPublicOpen] = useState(false);
  const [isReSchedule, setIsReSchedule] = useState(false);
  const [newDateTime, setNewDateTime] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));

  const [cancelMutation, {loading}] = useMutation(mutations.cancelEvent);
  const [editMutation, {loading: loadingIsPublicService}] = useMutation(mutations.editEvent);
  const [rescheduleEvent, {loading: loadingReScheduleEvent}] = useMutation(
    mutations.rescheduleEvent
  );

  const handleDeleteService = async docID => {
    try {
      await cancelMutation({
        variables: {
          token: session?.accessToken,
          documentId: docID,
        },
      });

      toast.success(t('toast_event_delete'));

      setIsOpen(false);
      refetch();
    } catch (err) {
      setIsOpen(false);
    }
  };

  const handleIsPublicEvent = async docID => {
    try {
      await editMutation({
        variables: {
          token: session?.accessToken,
          documentId: docID,
          eventData: {
            isPublic: !isPublic,
          },
        },
      });
      setIsPublicOpen(false);
      toast.success(t('toast_event_visibility'));
      refetch();
    } catch (err) {
      setIsPublicOpen(false);
    }
  };

  const handleReScheduleEvent = async () => {
    try {
      const newEventDataTime = new Date(newDateTime).toISOString();

      await rescheduleEvent({
        variables: {
          token: session?.accessToken,
          documentId: serviceID,
          newEventDateTime: newEventDataTime,
        },
      });

      setIsReSchedule(false);
      toast.success(t('event_re_schedule'));
      refetch();
    } catch (err) {
      setIsReSchedule(false);
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
                onClick={() => setIsPublicOpen(true)}
                className='flex px-3 py-2 hover:bg-gray-200 hover:bg-opacity-50 rounded-md'
              >
                {isPublic ? (
                  <EyeSlashIcon className='w-5 h-5 mr-2 text-black' />
                ) : (
                  <EyeIcon className='w-5 h-5 mr-2 text-black' />
                )}
                {isPublic ? t('btn_private') : t('btn_public')}
              </button>
            </Menu.Item>

            <Menu.Item>
              <button
                onClick={() => {
                  router.push(`/user/events/add-event/?mode=edit&sid=${serviceID}`);
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

            <Menu.Item>
              <Link href={`/user/events/attendees/${serviceID}`} passHref>
                <button className='flex px-3 py-2 hover:bg-gray-200 hover:bg-opacity-50 rounded-md'>
                  <UserGroupIcon className='w-5 h-5 mr-2' />
                  {t('event_attendees')}
                </button>
              </Link>
            </Menu.Item>

            {status === 'CONCLUDED' && type === 'NOT_RECURRING' && (
              <Menu.Item>
                <button
                  onClick={() => setIsReSchedule(true)}
                  className='flex px-3 py-2 hover:bg-gray-200 hover:bg-opacity-50 rounded-md'
                >
                  <ArrowPathIcon className='w-5 h-5 mr-2 text-red-500 flex-shrink-0' />
                  <span className='whitespace-pre'>{t('re_schedule')}</span>
                </button>
              </Menu.Item>
            )}
          </Menu.Items>
        </Transition>
      </Menu>

      <ConfirmDialog
        title={t('txt_delete_event_title')}
        description={t('txt_delete_event_desc')}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <Button variant='cancel' onClick={() => setIsOpen(false)}>
          {t('btn_cancel')}
        </Button>
        <Button variant='solid' onClick={() => handleDeleteService(serviceID)}>
          {loading ? <Loader /> : t('btn_delete')}
        </Button>
      </ConfirmDialog>

      <ConfirmDialog
        title={isPublic ? t('txt_edit_private_event_title') : t('txt_edit_public_event_title')}
        description={isPublic ? t('txt_edit_private_event_desc') : t('txt_edit_public_event_desc')}
        isOpen={isPublicOpen}
        setIsOpen={setIsPublicOpen}
      >
        <Button variant='cancel' onClick={() => setIsPublicOpen(false)}>
          {t('btn_cancel')}
        </Button>
        <Button variant='solid' onClick={() => handleIsPublicEvent(serviceID)}>
          {loadingIsPublicService ? <Loader /> : isPublic ? t('btn_private') : t('btn_public')}
        </Button>
      </ConfirmDialog>

      <ConfirmDialog
        title={t('re_schedule_event')}
        description={t('re_schedule_event_desc')}
        isOpen={isReSchedule}
        setIsOpen={setIsReSchedule}
      >
        <div className='w-full flex flex-col gap-4'>
          <Field label={t(`common:date_time`)} classes='flex w-full justify-start'>
            <Input
              type='datetime-local'
              value={newDateTime}
              handleChange={e => {
                setNewDateTime(e.target.value);
              }}
            />
          </Field>

          <div className='flex justify-end gap-2'>
            <Button variant='cancel' onClick={() => setIsReSchedule(false)}>
              {t('btn_cancel')}
            </Button>
            <Button variant='solid' onClick={handleReScheduleEvent}>
              {loadingReScheduleEvent ? <Loader /> : t('re_schedule')}
            </Button>
          </div>
        </div>
      </ConfirmDialog>
    </>
  );
}
