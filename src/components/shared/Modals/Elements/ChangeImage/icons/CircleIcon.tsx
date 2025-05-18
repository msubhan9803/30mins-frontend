/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable import/prefer-default-export */
import React, {FC} from 'react';

interface Props {
  className?: string;
}

export const CircleIcon: FC<Props> = ({className}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    aria-hidden='true'
    width='20'
    className={className}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    ></path>
  </svg>
);
