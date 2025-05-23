/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable import/prefer-default-export */
import React, {FC} from 'react';

interface Props {
  className?: string;
}

export const BrightnessIcon: FC<Props> = ({className}) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    xmlSpace='preserve'
  >
    <path d='M12 15.3c-1.8 0-3.3-1.5-3.3-3.3 0-1.8 1.5-3.3 3.3-3.3 1.8 0 3.3 1.5 3.3 3.3 0 1.8-1.5 3.3-3.3 3.3zm0-5.1c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8 1.8-.8 1.8-1.8-.8-1.8-1.8-1.8zM12 7.7c-.4 0-.8-.3-.8-.8V5.2c0-.4.3-.8.8-.8s.8.3.8.8V7c0 .4-.4.7-.8.7zM9 9c-.3.3-.8.3-1.1 0L6.6 7.7c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0L9 7.9c.3.3.3.8 0 1.1zM7.7 12c0 .4-.3.8-.8.8H5.2c-.4 0-.8-.3-.8-.8s.3-.8.8-.8H7c.4.1.7.4.7.8zM9 15c.3.3.3.8 0 1.1l-1.3 1.3c-.3.3-.8.3-1.1 0-.3-.3-.3-.8 0-1.1L7.9 15c.3-.3.8-.3 1.1 0zM12 16.3c.4 0 .8.3.8.8v1.8c0 .4-.3.8-.8.8s-.8-.3-.8-.8V17c.1-.4.4-.7.8-.7zM15 15c.3-.3.8-.3 1.1 0l1.3 1.3c.3.3.3.8 0 1.1s-.8.3-1.1 0L15 16.1c-.3-.3-.3-.8 0-1.1zM16.3 12c0-.4.3-.8.8-.8h1.8c.4 0 .8.3.8.8s-.3.8-.8.8H17c-.4 0-.7-.4-.7-.8zM15 9c-.3-.3-.3-.8 0-1.1l1.3-1.3c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1L16.1 9c-.3.3-.8.3-1.1 0z' />
  </svg>
);
