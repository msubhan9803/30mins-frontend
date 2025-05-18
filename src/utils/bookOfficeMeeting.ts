import axios from 'axios';
import mutations from 'constants/GraphQL/Booking/mutations';
import dayjs from 'dayjs';
import graphqlRequestHandler from './graphqlRequestHandler';

export default async function bookOfficeMeeting(credential, eventData) {
  try {
    const params = {
      scope: 'User.Read Calendars.Read Calendars.ReadWrite',
      client_id: process.env.MS_GRAPH_CLIENT_ID!,
      refresh_token: credential.credentials.refresh_token,
      grant_type: 'refresh_token',
      client_secret: process.env.MS_GRAPH_CLIENT_SECRET!,
    };

    const {data: tokenData} = await axios.post(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      new URLSearchParams(params),
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    );

    const accessToken = tokenData.access_token;

    const {bookingData, bookingID, startTime, endTime, attendees} = eventData;

    const convertedAttendees = attendees.map(attendee => ({
      emailAddress: {
        address: attendee.email,
        name: attendee.name,
      },
    }));
    const {
      bookerName,
      bookerEmail,
      providerName,
      providerEmail,
      title,
      price,
      subject,
      currency,
      charity,
      meetingCount,
      conferenceType,
      additionalNotes,
      zoomJoinUrl,
      zoomPassword,
      conferenceLink,
    } = bookingData;

    let descriptionData = ``;

    if (title) {
      descriptionData += `<p>Meeting Title: ${title}</p>`;
    }
    if (bookerName) {
      descriptionData += `<p>Client Name: ${bookerName}</p>`;
    }
    if (bookerEmail !== '') {
      descriptionData += `<p>Client Email: ${bookerEmail}</p>`;
    }
    if (providerName) {
      descriptionData += `<p>Organizer Name: ${providerName}</p>`;
    }
    if (providerEmail) {
      descriptionData += `<p>Organizer Email: ${providerEmail}</p>`;
    }
    if (meetingCount !== '') {
      descriptionData += `<p>Meeting Count: ${meetingCount}</p>`;
    }
    if (conferenceType) {
      descriptionData += `<p>Meeting Type: ${conferenceType}</p>`;
    }
    if (conferenceLink) {
      descriptionData += `Conference Link: ${conferenceLink}</p>`;
    }

    if (zoomJoinUrl) {
      descriptionData += `Zoom Join Url: ${zoomJoinUrl}</p>`;
    }
    if (zoomPassword) {
      descriptionData += `Zoom Password: ${zoomPassword}</p>`;
    }
    if (charity) {
      descriptionData += `Charity: ${charity}</p>`;
    }
    if (price) {
      descriptionData += `Total Price: ${currency} ${price}`;
    }
    if (additionalNotes) {
      descriptionData += `<p>Additional Notes: ${additionalNotes}</p>`;
    }
    if (bookingID) {
      descriptionData += `<p>After your meeting, be sure to mark the Meeting as Complete<br>
        <a href="https://30mins.com/user/meetingDetails/${bookingID}/decline"> Decline</a> <span> </span><a href="https://30mins.com/user/meetingDetails/${bookingID}/cancel">Cancel</a>
      You can view/manage your meeting here: <a href="https://30mins.com/user/meetingDetails/${bookingID}">https://30mins.com/user/meetingDetails/${bookingID}</a></p>`;
    }

    const shouldGenerateLink = [
      'skypeForBusiness',
      'skypeForConsumer',
      'teamsForBusiness',
    ].includes(conferenceType);

    const eventPayload = {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: descriptionData,
      },
      start: {
        dateTime: startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: 'UTC',
      },
      attendees: convertedAttendees,
      recurrence: {
        pattern: {},
        range: {},
      },
      allowNewTimeProposals: true,
      isOnlineMeeting: shouldGenerateLink,
    };

    if (shouldGenerateLink) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      eventPayload['onlineMeetingProvider'] = conferenceType;
    }

    const dayIndex = dayjs(startTime).day();
    let dayOfWeekString = '';
    switch (dayIndex) {
      case 0:
        dayOfWeekString = 'Sunday';
        break;
      case 1:
        dayOfWeekString = 'Monday';
        break;
      case 2:
        dayOfWeekString = 'Tuesday';
        break;
      case 3:
        dayOfWeekString = 'Wednesday';
        break;
      case 4:
        dayOfWeekString = 'Thursday';
        break;
      case 5:
        dayOfWeekString = 'Friday';
        break;
      case 6:
        dayOfWeekString = 'Saturday';
        break;
      default:
        dayOfWeekString = '';
    }

    const officeDate = new Date(startTime).toISOString().split('T')[0];

    eventPayload.recurrence.pattern = {
      type: 'weekly',
      interval: 1,
      daysOfWeek: [dayOfWeekString],
    };

    eventPayload.recurrence.range = {
      type: 'numbered',
      startDate: officeDate,
      numberOfOccurrences: meetingCount,
    };

    const response = await axios.post(
      'https://graph.microsoft.com/v1.0/me/calendar/events',
      JSON.stringify(eventPayload),
      {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
      }
    );
    await graphqlRequestHandler(
      mutations.updateCalendarEvents,
      {
        bookingId: bookingID,
        events: {
          office: {
            office365Calendar: true,
            office365CalendarEventId: response.data.id,
          },
        },
      },
      process.env.BACKEND_API_KEY
    );

    if (response?.data?.onlineMeeting?.joinUrl) {
      return response.data.onlineMeeting.joinUrl;
    }

    return '';
  } catch (err) {
    console.log(err);
    throw err;
  }
}
