export type IProps = {
  icon: any;
  errors: any;
  options: any;
  handleChange: any;
  collapsed: any;
  value: any;
  field: any;
  stepName?:
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
    | 'Summary';
  question: any;
  description: any;
  form?: any;
  move?: (action: any, update: any) => Promise<void>;
  step?: number;
  mode?: string | string[] | undefined;
  editOrgServiceLoading?: any;
  editServiceLoading?: any;
  submitEditService?: () => void;
};
