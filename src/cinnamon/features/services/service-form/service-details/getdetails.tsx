import {UserContext} from '@root/context/user';
import {SERVICE_TYPES} from 'constants/enums';
import {useContext} from 'react';
import FREELANCING_WORK from './features/FREELANCING_WORK';
import FULL_TIME_JOB from './features/FULL_TIME_JOB';
import PART_TIME_JOB from './features/PART_TIME_JOB';
import MEETING from './features/meeting';
import EVENT from './features/event';

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
  const to = 'aaaaaeeeeeiiiiooooouuuunc------';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

export default function GetDetailsForm({
  ...rest
}: {
  handleChange: any;
  serviceTitle: any;
  serviceSlug: any;
  meetingDuration: any;
  meetingRecurring: any;
  serviceDescription: any;
  meetingType: any;
  dueDate: any;
  errors: any;
  searchTags: any;
  serviceType: any;
  move: any;
  step: any;
  mode: any;
  setValue: any;
  editOrgServiceLoading?: any;
  editServiceLoading?: any;
  submitEditService?: any;
  values?: any;
}) {
  const {user} = useContext(UserContext);

  switch (rest.serviceType) {
    case SERVICE_TYPES.MEETING:
      return <MEETING {...{...rest, slugify: slugify, user: user}} />;
    case SERVICE_TYPES.FULL_TIME_JOB:
      return <FULL_TIME_JOB {...{...rest, slugify: slugify, user: user}} />;
    case SERVICE_TYPES.FREELANCING_WORK:
      return <FREELANCING_WORK {...{...rest, slugify: slugify, user: user}} />;
    case SERVICE_TYPES.PART_TIME_JOB:
      return <PART_TIME_JOB {...{...rest, slugify: slugify, user: user}} />;
    case SERVICE_TYPES.EVENT:
      return <EVENT {...{...rest, slugify: slugify, user: user}} />;
    default:
      return <></>;
  }
}
