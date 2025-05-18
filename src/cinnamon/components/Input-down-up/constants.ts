import {InputHTMLAttributes} from 'react';

const Tdate = 'date' as const;
type Date = {
  type: typeof Tdate;
  title?: any;
};

const Tnum = 'number' as const;
type Num = {
  type: typeof Tnum;
  title: string;
};

export type IProps = (Date | Num) & {
  label: string;
  maxLength?: number;
  error: any;
  id?: string;
  handleChange: (any) => void;
  onBlur?: (any) => void;
  value: any;
  min?: string;
  max?: string;
  onKeyDown?: InputHTMLAttributes<HTMLInputElement>['onKeyDown'];
  onClickUp: () => void;
  onClickDown: () => void;
};
