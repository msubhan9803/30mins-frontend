export default function validateChange(e, day, index, mode, availabilityDays) {
  if (index > 0) {
    if (mode === 'end') {
      if (e <= availabilityDays[day].hours[index].start) {
        return 'end_time_inferior_or_equal';
      }
      if (e <= availabilityDays[day].hours[index - 1].end) {
        return 'end_time_exists_in_previous_timeslot';
      }
      if (availabilityDays[day].hours[index + 1]) {
        if (e > availabilityDays[day].hours[index + 1].start) {
          return 'end_time_inferior_or_equal';
        }
      }
    }

    if (mode === 'start') {
      if (e < availabilityDays[day].hours[index - 1].start) {
        return 'timeslot_starts_before_previous_timeslost';
      }
      if (
        e >= availabilityDays[day].hours[index - 1].start &&
        e < availabilityDays[day].hours[index - 1].end
      ) {
        return 'start_time_exists_in_previous_timeslot';
      }
      if (e >= availabilityDays[day].hours[index].end) {
        return 'end_time_inferior_or_equal';
      }
      if (
        e === availabilityDays[day].hours[index - 1].start &&
        e === availabilityDays[day].hours[index - 1].end
      ) {
        return 'end_time_inferior_or_equal';
      }
    }

    if (mode === 'activate') {
      return 'range_initial_values';
    }
  }

  if (index === 0) {
    if (mode === 'end') {
      if (e <= availabilityDays[day].hours[index].start) {
        return 'end_time_inferior_or_equal';
      }
      if (availabilityDays[day].hours[index + 1]) {
        if (e > availabilityDays[day].hours[index + 1].start) {
          return 'end_time_inferior_or_equal';
        }
      }
    }

    if (mode === 'start') {
      if (e >= availabilityDays[day].hours[index].end) {
        return 'end_time_inferior_or_equal';
      }
    }

    if (mode === 'activate') {
      return 'range_initial_values';
    }
  }

  if (mode === 'end') {
    if (e <= availabilityDays[day].hours[index].start) {
      return 'end_time_inferior_or_equal';
    }
  }

  return 'no_errors';
}
