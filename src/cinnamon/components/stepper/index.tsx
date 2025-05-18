import {CheckIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';

type IProps = {
  step: number;
  max: Array<string>;
  size: 2 | 4 | 8 | 12 | 24;
};

export default function Stepper({max, step, size = 4}: IProps) {
  //   values.STEPS?.forEach((tab, index) => {
  //     if (index === values.step) {
  //       TabSteps[tab].status = 'current';
  //     } else if (index < values.step) {
  //       TabSteps[tab].status = 'complete';
  //     } else {
  //       TabSteps[tab].status = 'upcoming';
  //     }
  //   });

  return (
    <nav aria-label='Progress'>
      {max.length > 1 && (
        <ol role='list' className='flex items-center justify-center py-3'>
          {max.map((_, index) => (
            <li
              key={index}
              className={classNames(index !== max.length - 1 ? 'pr-3 sm:pr-10' : '', 'relative')}
            >
              {index < step ? (
                <>
                  <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                    <div
                      className={`h-0.5 w-full bg-mainBlue transition-width duration-500 ease-in-out`}
                    />
                  </div>
                  <div
                    className={`relative w-${size} h-${size} flex items-center justify-center bg-mainBlue rounded-full hover:bg-blue-900`}
                  >
                    <CheckIcon className={`w-5 h-{5} text-white`} aria-hidden='true' />
                    {/* <span className='sr-only'>{TabSteps[step].title}</span> */}
                  </div>
                </>
              ) : index === step ? (
                <>
                  <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                    <div className='h-0.5 w-full bg-gray-200' />
                  </div>
                  <div
                    className={`relative w-${size} h-${size} flex items-center justify-center bg-white border-2 border-mainBlue rounded-full`}
                    aria-current='step'
                  >
                    <span className='h-2.5 w-2.5 bg-mainBlue rounded-full' aria-hidden='true' />
                    {/* <span className='sr-only'>{TabSteps[step].title}</span> */}
                  </div>
                </>
              ) : (
                <>
                  <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                    <div className='h-0.5 w-full bg-gray-200' />
                  </div>
                  <div
                    className={`group relative w-${size} h-${size} flex items-center justify-center bg-white border-2 border-gray-300 rounded-full`}
                  >
                    <span className='h-2.5 w-2.5 bg-transparent rounded-full' aria-hidden='true' />
                    {/* <span className='sr-only'>{TabSteps[step].title}</span> */}
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
