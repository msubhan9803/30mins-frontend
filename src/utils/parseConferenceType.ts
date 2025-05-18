const parseConference = conferenceType => {
  switch (conferenceType) {
    case 'googleMeet':
      return 'Google Meet';
    case 'onPhone':
      return 'On Phone';
    default:
      return 'In Person';
  }
};

export default parseConference;
