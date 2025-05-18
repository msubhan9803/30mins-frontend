const timeslots: {code: string; label: string}[] = [];
const hours = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
];
const minutes = ['00', '15', '30', '45'];

hours.forEach(hour => {
  minutes.forEach(minute => {
    timeslots.push({code: `${hour}:${minute}`, label: `${hour}:${minute}`});
  });
});

export const days = [
  {code: 'monday', title: 'Monday'},
  {code: 'tuesday', title: 'Tuesday'},
  {code: 'wednesday', title: 'Wednesday'},
  {code: 'thursday', title: 'Thursday'},
  {code: 'friday', title: 'Friday'},
  {code: 'saturday', title: 'Saturday'},
  {code: 'sunday', title: 'Sunday'},
];

export const activation = [
  {code: 'yes', title: 'Yes, custom'},
  {code: 'no', title: 'No, default'},
];

type Hour = {
  start: string;
  end: string;
};

type Day = {
  isActive: boolean;
  hours: Hour[];
};

export type AvailabilityDays = {
  monday: Day;
  tuesday: Day;
  wednesday: Day;
  thursday: Day;
  friday: Day;
  saturday: Day;
  sunday: Day;
};

export {timeslots};
