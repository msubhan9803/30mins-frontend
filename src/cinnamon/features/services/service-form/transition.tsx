import classNames from 'classnames';

export default function Transition({children, show, step}) {
  return (
    <>
      {show && (
        <div
          className={classNames([
            'w-full p-0 md:p-4 border-0 md:border rounded-b-lg mt-12 md:mt-0 shadow-none md:shadow-md bg-white border-gray-200 pb-20',
            step <= 3 && 'rounded-t-lg',
          ])}
        >
          <div className='flex flex-col w-full'>{children}</div>
        </div>
      )}
    </>
  );
}
