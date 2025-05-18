/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable import/prefer-default-export */
import React, {FC} from 'react';

interface Props {
  className?: string;
}

export const CubeIcon: FC<Props> = ({className}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    version='1.0'
    width='24'
    height='24'
    xmlSpace='preserve'
    preserveAspectRatio='xMidYMid meet'
    className={className}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z'
    />
  </svg>
);
