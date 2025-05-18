import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import integrationQueries from 'constants/GraphQL/Integrations/queries';

import deleteGoogleCalendarEvent from 'utils/deleteGoogleCalendarEvent';
import deleteOfficeCalendarEvent from 'utils/deleteOfficeCalendarEvent';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {bookingData} = req.body;

    const {data: credentialsResponse} = await graphqlRequestHandler(
      integrationQueries.getCredentialsByUserId,
      {
        userId: bookingData.provider,
      },
      process.env.BACKEND_API_KEY
    );

    const credentialResponse = credentialsResponse.data.getCredentialsByUserId;
    const {googleCredentials, officeCredentials} = credentialResponse;

    if (bookingData?.googleCalendarEvent?.googleCalendarEventId) {
      const eventData = {
        eventId: bookingData?.googleCalendarEvent?.googleCalendarEventId,
      };
      if (googleCredentials[0]) {
        await deleteGoogleCalendarEvent(googleCredentials[0], eventData);
      }
    }
    if (bookingData?.officeCalendar?.officeCalendarEventId) {
      const eventData = {
        eventId: bookingData?.officeCalendar?.officeCalendarEventId,
      };
      if (officeCredentials[0]) {
        await deleteOfficeCalendarEvent(officeCredentials[0], eventData);
      }
    }

    res.status(200).send({message: 'successfull!'});
  } catch (err) {
    console.log(err);
    if (err.response.data.error.code === 410) {
      res.status(200).send({message: 'resource_has_been_deleted'});
    }
    res.status(500).send({message: 'Unknown Server Error', error: {'Unknown Server Error': err}});
  }
};

export default handler;
