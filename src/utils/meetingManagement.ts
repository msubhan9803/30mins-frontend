import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {ORDER} from 'constants/enums';
import axios from 'axios';

export const confirmMeeting = async (data, reason) => {
  try {
    const res = await axios.post('/api/meetings/confirm', {
      meetingDetails: data,
      feedback: reason,
    });
    if (res?.data?.success) {
      return ORDER.ORDER_CONFIRMED;
    }
    return ORDER.ORDER_NOT_CONFIRMED;
  } catch {
    return ORDER.ORDER_NOT_COMPLETED;
  }
};

export const completeMeeting = async (data, reason) => {
  try {
    const res = await axios.post('/api/meetings/complete', {
      meetingDetails: data,
      feedback: reason,
    });
    if (res?.data?.success) {
      return ORDER.ORDER_COMPLETED;
    }
    return ORDER.ORDER_NOT_COMPLETED;
  } catch {
    return ORDER.ORDER_NOT_COMPLETED;
  }
};
export const cancelMeeting = async (data, reason, User) => {
  try {
    const res = await axios.post('/api/meetings/cancel', {
      meetingDetails: data,
      reason: reason,
    });
    if (res?.data?.success) {
      try {
        await axios.post('/api/booking/deleteCalendarEventApi', {
          bookingData: data,
          userData: User,
        });
        return ORDER.ORDER_CANCELLED;
      } catch {
        return ORDER.ORDER_CANCELLED_EVENT_NOT_DELETED;
      }
    }
    return ORDER.ORDER_NOT_CANCELLED;
  } catch {
    return ORDER.ORDER_NOT_CANCELLED;
  }
};

export const declineMeeting = async (
  meetingData,
  values,
  User,
  reason,
  setLoading,
  showNotification
) => {
  if (reason === '') {
    showNotification(NOTIFICATION_TYPES.success, 'Please provide reason', false);
    return;
  }
  setLoading(true);
  const res = await axios.post('/api/meetings/decline', {
    meetingDetails: meetingData,
    reason: values,
  });
  if (res?.data?.success) {
    await axios.post('/api/booking/deleteCalendarEventApi', {
      bookingData: meetingData,
      userData: User,
    });
    setLoading(false);
    showNotification(NOTIFICATION_TYPES.success, 'Meeting declined successfully', false);
  }
};
