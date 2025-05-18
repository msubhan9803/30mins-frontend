/* eslint-disable @typescript-eslint/dot-notation */
import cuid from 'cuid';
import {google} from 'googleapis';
import mutations from 'constants/GraphQL/Booking/mutations';
import graphqlRequestHandler from './graphqlRequestHandler';

export default async function bookGoogleMeeting(credential, eventData) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );

    oauth2Client.setCredentials(credential.credentials);

    const googleCalendar = google.calendar({
      version: 'v3',
      auth: oauth2Client,
    });

    const {bookingData, bookingID, startTime, endTime, attendees} = eventData;
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

    const eventPayload = {
      calendarId: 'primary',
      requestBody: {
        summary: subject,
        description: descriptionData,
        start: {
          dateTime: startTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: endTime,
          timeZone: 'UTC',
        },
        attendees,
      },
    };

    if (meetingCount > 1) {
      eventPayload.requestBody['recurrence'] = [`RRULE:FREQ=WEEKLY;COUNT=${meetingCount}`];
    }

    // Generate and Attach Google Meet Link
    if (conferenceType === 'googleMeet') {
      eventPayload.requestBody['conferenceData'] = {
        createRequest: {
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
          requestId: cuid(),
        },
      };

      eventPayload['conferenceDataVersion'] = 1;
    }

    const event = await googleCalendar.events.insert(eventPayload);
    await graphqlRequestHandler(
      mutations.updateCalendarEvents,
      {
        bookingId: bookingID,
        events: {
          google: {
            googleCalender: true,
            googleCalendarEventId: event.data.id,
          },
        },
      },
      process.env.BACKEND_API_KEY
    );

    return event.data.hangoutLink;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
