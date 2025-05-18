const serviceTypes = [
  {code: 'MEETING', title: 'Meeting'},
  {code: 'FREELANCING_WORK', title: 'Freelance Work'},
  {code: 'FULL_TIME_JOB', title: 'Full Time Job'},
  {code: 'PART_TIME_JOB', title: 'Part Time Job'},
];

export default serviceTypes;

export type IProps = {
  values: any;
  submitService: any;
  createServiceLoading: any;
  moveTo: (
    stepName:
      | 'ServiceType'
      | 'ServiceDetails'
      | 'ServicePayment'
      | 'Charity'
      | 'Security'
      | 'Availability'
      | 'Whitelist'
      | 'Blacklist'
      | 'Questions'
      | 'Media'
      | 'Summary'
  ) => void;
  serviceType: string;
  createOrgServiceLoading: any;
  move: (action: any, update: any) => Promise<void>;
  setmoreOptions: (input: boolean) => void;
};
