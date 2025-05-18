/* eslint-disable @typescript-eslint/dot-notation */
import axios from 'axios';

export default async function deleteOfficeCalendarEvent(credential, eventData) {
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
    const {eventId} = eventData;

    const response = await axios.delete(`https://graph.microsoft.com/v1.0/me/events/${eventId}`, {
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (response) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
