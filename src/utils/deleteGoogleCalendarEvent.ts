/* eslint-disable @typescript-eslint/dot-notation */
import {google} from 'googleapis';

export default async function deleteGoogleCalendarEvent(credential, eventData) {
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

    const {eventId} = eventData;

    const eventPayload = {
      auth: oauth2Client,
      calendarId: 'primary',
      eventId: eventId,
    };

    const event = await googleCalendar.events.delete(eventPayload);
    if (event) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
