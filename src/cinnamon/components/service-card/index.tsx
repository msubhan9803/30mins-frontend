import {FREELANCING_WORK, FULL_TIME_JOB, MEETING, PART_TIME_JOB, ROUND_ROBIN} from './types-cards';

// eslint-disable-next-line @typescript-eslint/naming-convention
type serviceType =
  | 'FULL_TIME_JOB'
  | 'PART_TIME_JOB'
  | 'FREELANCING_WORK'
  | 'MEETING'
  | 'ROUND_ROBIN';
type IProps<T> = {
  type: T;
  service: any;
  username: any;
};

const ServiceCard = ({service, username, type}: IProps<serviceType>) => {
  const defaulteTypeCard = {
    FULL_TIME_JOB: <FULL_TIME_JOB {...{service, username}} />,
    PART_TIME_JOB: <PART_TIME_JOB {...{service, username}} />,
    FREELANCING_WORK: <FREELANCING_WORK {...{service, username}} />,
    MEETING: <MEETING {...{service, username}} />,
    ROUND_ROBIN: <ROUND_ROBIN service={service} />,
  };

  return <>{defaulteTypeCard[type]}</>;
};

export default ServiceCard;
