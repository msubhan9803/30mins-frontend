import React from 'react';
import {Toaster} from 'react-hot-toast';

export default function MainToaster() {
  if (typeof window !== 'undefined') {
    const defaultProps: any =
      window?.innerWidth < 768
        ? {position: 'top-center', reverseOrder: true}
        : {
            position: 'bottom-right',
            reverseOrder: false,
          };

    return (
      <div className='gap-2'>
        <Toaster {...defaultProps} />
      </div>
    );
  }
  return <Toaster {...{position: 'top-center', reverseOrder: true}} />;
}
