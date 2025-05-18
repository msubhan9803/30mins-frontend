/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable import/prefer-default-export */
import React, {FC, ButtonHTMLAttributes} from 'react';
import cn from 'classnames';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onClick: () => void;
}

export const Button: FC<Props> = ({className, active, children, onClick, ...props}) => {
  return (
    <button
      className={cn(['image-editor-button', active && 'image-editor-button--active', className])}
      onClick={async () => {
        await onClick();
      }}
      {...props}
    >
      {children}
    </button>
  );
};
