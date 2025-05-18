import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import integrationQueries from 'constants/GraphQL/Integrations/queries';
import bookGoogleMeeting from 'utils/bookGoogleMeeting';
import bookOfficeMeeting from 'utils/bookOfficeMeeting';
import bookingEmailHandler from 'utils/bookingEmailHandler';
import freelanceEmailHandler from 'utils/freelanceEmailHandler';
import createZoomMeeting from 'utils/createZoomMeeting';
import scheduleBookingReminders from 'utils/scheduleBookingReminders';
import query from 'constants/GraphQL/Booking/queries';
import {SERVICE_TYPES} from '../../../constants/enums';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {userData, bookingData} = req.body;

    const emailData = {
      body: {
        ...bookingData,
      },
    };

    const providerTimeZone = userData.locationDetails.timezone;

    let reminderPayload = {
      bookingId: bookingData._id,
      bookerLanguage: req.body.bookerLanguage,
      providerLanguage: req.body.providerLanguage,
      providerTimeZone,
      providerId: userData._id,
      ...bookingData,
    };

    if (bookingData.serviceType === SERVICE_TYPES.FREELANCING_WORK) {
      await scheduleBookingReminders(reminderPayload);
      await freelanceEmailHandler(emailData, providerTimeZone, bookingData._id);
      res.status(200).send({message: 'Booking Confirmed'});
      return;
    }

    const {data: credentialsResponse} = await graphqlRequestHandler(
      integrationQueries.getCredentialsByUserId,
      {
        userId: userData._id,
      },
      process.env.BACKEND_API_KEY
    );

    const credentialResponse = credentialsResponse.data.getCredentialsByUserId;
    const {googleCredentials, officeCredentials, zoomCredentials} = credentialResponse;

    const attendees = [{email: bookingData.bookerEmail, name: bookingData.bookerName}];

    bookingData.ccRecipients.forEach((recipient: any, index: number) => {
      if (recipient) {
        attendees.push({
          email: recipient,
          name: `CC:${index}`,
        });
      }
    });

    const eventData = {
      bookingData: bookingData,
      bookingID: bookingData._id,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      attendees,
    };

    if (googleCredentials?.length > 0) {
      const googleMeetLink = await bookGoogleMeeting(googleCredentials[0], eventData);

      if (bookingData.conferenceType === 'googleMeet') {
        emailData.body.conferenceLink = googleMeetLink;
      }
    }

    if (officeCredentials?.length > 0) {
      const microsoftMeetingLink = await bookOfficeMeeting(officeCredentials[0], eventData);

      if (microsoftMeetingLink) {
        emailData.body.conferenceLink = microsoftMeetingLink;
      }
    }

    if (bookingData.conferenceType === 'zoom') {
      const zoomMeetingData = await createZoomMeeting(zoomCredentials[0], eventData, userData._id);
      emailData.body.zoomJoinUrl = zoomMeetingData.join_url;
      emailData.body.zoomStartUrl = zoomMeetingData.start_url;
      emailData.body.zoomPassword = zoomMeetingData.password;
    }
    // goal to have provider auth code and client auth code.

    // Booker Auth Code
    const {data: bookerAuthCodeRes} = await graphqlRequestHandler(
      query.getStatusAuthCode,
      {bookingId: bookingData._id, email: bookingData.bookerEmail},
      process.env.BACKEND_API_KEY
    );

    // Provider Auth Code
    const {data: providerAuthCodeRes} = await graphqlRequestHandler(
      query.getStatusAuthCode,
      {bookingId: bookingData._id, email: bookingData.providerEmail},
      process.env.BACKEND_API_KEY
    );

    reminderPayload = {
      ...reminderPayload,
      providerAuthCode: providerAuthCodeRes.data.getStatusAuthCode.statusAuthCode.authCode,
      clientAuthCode: bookerAuthCodeRes.data.getStatusAuthCode.statusAuthCode.authCode,
    };

    await scheduleBookingReminders(reminderPayload);

    await bookingEmailHandler(
      emailData,
      providerTimeZone,
      bookingData._id,
      providerAuthCodeRes.data.getStatusAuthCode.statusAuthCode,
      bookerAuthCodeRes.data.getStatusAuthCode.statusAuthCode
    );

    // await bookingEmailHandler(emailData, providerTimeZone, bookingData._id, {}, {});
    res.status(200).send({message: 'Booking Confirmed'});
    return;
  } catch (err) {
    res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
