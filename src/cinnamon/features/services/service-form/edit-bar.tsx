import classNames from 'classnames';

type Props = {
  setStep: any;
  step: number;
  max: number;
  serviceType: string;
  disabled: string[];
  move: (action: any, update: any, setTabStep?: number) => Promise<void>;
  mode: string | string[] | undefined;
};

const steps = {
  MEETING: ['Charity', 'Security', 'Availability', 'Questions', 'Media'],
  FREELANCING_WORK: ['Charity', 'Questions', 'Media'],
  FULL_TIME_JOB: ['Charity', 'Availability', 'Questions', 'Media'],
  PART_TIME_JOB: ['Charity', 'Availability', 'Questions', 'Media'],
  EVENT: ['Charity', 'Security', 'Availability', 'Questions', 'Media'],
};

export default function EditBar({serviceType, move, step, disabled, mode, max}: Props) {
  return (
    <div className='overflow-x-scroll lg:overflow-x-visible lg:justify-evenly scrollable flex w-full flex-grow border border-transparent md:border-gray-200 border-b-0 px-0 md:px-2'>
      {steps[serviceType].map((s, index) => (
        <button
          onClick={() => {
            mode === 'edit'
              ? disabled.includes(s)
                ? null
                : move('setTabStep', false, index + 4)
              : index - 4 > max || disabled.includes(s)
              ? null
              : move('setTabStep', false, index + 4);
          }}
          key={index}
          className={classNames(
            'flex justify-center gap-x-2 w-full text-sm flex-shrink pb-4 pt-5 px-2 border-b-2 border-white font-medium text-gray-500 transition-all duration-200',
            mode === 'edit' &&
              step === index + 4 &&
              '!border-mainBlue !text-mainBlue bg-gradient-to-t from-indigo-50 to-white',
            mode === 'create' &&
              step === index + 4 &&
              '!border-mainBlue !text-mainBlue bg-gradient-to-t from-indigo-50 to-white',
            disabled.includes(s) && '!text-gray-400 !text-opacity-70',
            mode === 'create' && index - 4 > max && '!text-gray-400 !text-opacity-70'
          )}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
