const getUserFromTeamsAvailability = (teamsAvailability, slot) => {
  teamsAvailability.sort((a, b) => a.priority - b.priority);
  for (let index = 0; index < teamsAvailability.length; index++) {
    const member = teamsAvailability[index];
    if (member.availability.includes(slot)) {
      return member.user;
    }
  }
  return {};
};
export default getUserFromTeamsAvailability;
