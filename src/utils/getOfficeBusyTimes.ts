import axios from 'axios';
import dayjs from 'dayjs';
import graphqlRequestHandler from './graphqlRequestHandler';
import {updateOfficeRefreshToken} from '../constants/GraphQL/Integrations/mutations';

const getOfficeBusyTimes = async (credential, startTime, endTime) => {
  const params = {
    scope: 'User.Read Calendars.Read Calendars.ReadWrite offline_access',
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
  const refreshToken = tokenData.refresh_token;

  await graphqlRequestHandler(
    updateOfficeRefreshToken,
    {refreshToken: refreshToken, credentialId: credential._id},
    process.env.BACKEND_API_KEY
  );

  const payload = {
    schedules: [credential.userEmail],
    startTime: {
      dateTime: startTime,
      timeZone: 'UTC',
    },
    endTime: {
      dateTime: endTime,
      timeZone: 'UTC',
    },
    availabilityViewInterval: 5,
  };

  const response = await axios.post(
    'https://graph.microsoft.com/v1.0/me/calendar/getSchedule',
    JSON.stringify(payload),
    {
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
    }
  );

  // Format response data
  const busyTimes = response.data.value[0].scheduleItems.map(item => ({
    start: dayjs(item.start.dateTime).utc(true).toISOString(),
    end: dayjs(item.end.dateTime).utc(true).toISOString(),
  }));

  return busyTimes;
};

export default getOfficeBusyTimes;
