export type IProps = {
  handleChange: any;
  serviceType: any;
  authenticationType: any;
  move: (action: any, update: any) => Promise<void>;
  step: number;
  mode: string | string[] | undefined;
  errors: any;
  stype: any;
  editOrgServiceLoading?: any;
  editServiceLoading?: any;
  isLoading?: any;
  values: any;
  submitEditService: () => void;
};
