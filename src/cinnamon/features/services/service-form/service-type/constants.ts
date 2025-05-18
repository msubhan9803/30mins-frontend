const serviceTypes = [
  {code: 'MEETING', title: 'Meeting'},
  {code: 'FREELANCING_WORK', title: 'Freelance Work'},
  {code: 'FULL_TIME_JOB', title: 'Full Time Job'},
  {code: 'PART_TIME_JOB', title: 'Part Time Job'},
];

export default serviceTypes;

export type IProps = {
  handleChange: any;
  serviceType: any;
  organizationName: any;
  organizationId: any;
  otherServices?: boolean;
  orgServiceCategory: any;
  move: (action: any, update: any) => Promise<void>;
  step: number;
  mode: string | string[] | undefined;
  errors: any;
  stype: any;
  editOrgServiceLoading: any;
  editServiceLoading: any;
  submitEditService: () => void;
};
