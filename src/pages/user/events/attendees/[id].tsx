import {useContext, useState} from 'react';
import {GetServerSideProps} from 'next';
import {getSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import {useRouter} from 'next/router';

import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import eventQueries from 'constants/GraphQL/Event/queries';
import {UserContext} from '@context/user';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

export default function EventAttendeeDetail({eventName, attendeesList}) {
  const {t: tpage} = useTranslation('page');
  const {t} = useTranslation('common');

  const router = useRouter();
  const {id} = router.query;

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Events'), href: '/user/events/organizing-events'},
    {title: tpage('Event Attendees'), href: `/user/events/attendees/${id}`},
  ];

  const {user} = useContext(UserContext);

  const [selecteRow, setSelectedRow] = useState(-1);

  const handleClick = index => {
    if (index === selecteRow) setSelectedRow(-1);
    else setSelectedRow(index);
  };

  return (
    <PostLoginLayout>
      <Head>
        <title> {eventName}</title>
      </Head>

      <Header crumbs={crumbs} heading={eventName} />

      <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-4 inline-block min-w-full sm:px-6 lg:px-8'>
          <div className=''>
            <table className='min-w-full sm:min-w-full md:min-w-full lg:w-full text-center table-fixed md:mt-5 mt-14'>
              <thead className='border-b bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='min-w-[20%] w-[20%] max-w-[20%]  text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                  >
                    {t('name_attendee')}
                  </th>
                  <th
                    scope='col'
                    className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                  >
                    {t('attendee_email')}
                  </th>
                  <th
                    scope='col'
                    className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                  >
                    {t('status')}
                  </th>
                  <th
                    scope='col'
                    className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                  >
                    {t('registered_at')}
                  </th>
                  <th
                    scope='col'
                    className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                  >
                    {t('event_date')}
                  </th>
                </tr>
              </thead>
              <tbody className='overflow-y-scroll'>
                {attendeesList &&
                  attendeesList.map((attendee, index) => {
                    const name = attendee.attendeeId?.personalDetails?.name ?? '';
                    const email = attendee.attendeeId?.accountDetails?.email ?? '';

                    return (
                      <>
                        <tr
                          key={index}
                          className='bg-white border-b w-20 py-2 cursor-pointer'
                          onClick={() => handleClick(index)}
                        >
                          <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 break-words text-left'>
                            {name}
                          </td>
                          <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 '>
                            {email}
                          </td>
                          <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 break-words'>
                            {attendee.attendeeStatus}
                          </td>
                          <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 break-words'>
                            {dayjs(new Date(attendee.registeredDateTime))
                              .tz(user?.timezone || dayjs.tz.guess())
                              .format('ddd DD MMM YYYY  hh:mm A')}
                          </td>
                          <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 whitespace-normal break-words'>
                            {dayjs(new Date(attendee.attendingDateTime))
                              .tz(user?.timezone || dayjs.tz.guess())
                              .format('ddd DD MMM YYYY  hh:mm A')}
                          </td>
                        </tr>

                        {selecteRow === index && (
                          <tr className='w-full bg-gray-100 '>
                            <td colSpan={5}>
                              <div className='w-full'>
                                {attendee.answeredQuestions.map(
                                  ({question, answer, selectedOptions}, i) => {
                                    if (question) {
                                      return (
                                        <div key={i} className='p-4'>
                                          <p className='text-left text-sm p-0 px-1 pt-0 pb-0 w-full font-medium text-gray-700'>
                                            {t('question')}: {question}
                                          </p>
                                          <p className='text-left text-sm px-1 pb-2 w-full font-medium text-gray-700'>
                                            {t('answer')}:
                                            <span className='w-full p-0'>
                                              {answer ?? selectedOptions.join(' ')}
                                            </span>
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
              </tbody>
            </table>

            {attendeesList?.length === 0 && (
              <div className='flex justify-center mt-5 text-gray-500 text-2xl'>
                {t('no_attendee_registered')}
              </div>
            )}
          </div>
        </div>
      </div>
    </PostLoginLayout>
  );
}

EventAttendeeDetail.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  const router = context.resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router}`,
        permanent: false,
      },
    };
  }

  const {
    data: {
      data: {getAllAttendeesByEventId},
    },
  } = await graphqlRequestHandler(
    eventQueries.getAllAttendeesByEventId,
    {
      eventId: context.query.id,
    },
    process.env.BACKEND_API_KEY
  );

  const attendeesList = getAllAttendeesByEventId?.attendees ?? [];
  const eventName = getAllAttendeesByEventId?.eventData?.serviceTitle ?? 'Event';

  return {
    props: {
      attendeesList,
      eventName,
    },
  };
};
