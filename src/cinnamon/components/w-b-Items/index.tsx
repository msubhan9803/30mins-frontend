import {XCircleIcon} from '@heroicons/react/20/solid';

export default function WBItems({key, value, onClick}) {
  return (
    <div
      key={key}
      className='flex px-3 py-1 border items-center max-w-full relative border-gray-300 rounded-full'
      title={value}
    >
      <label className='w-[95%] break-all line-clamp-1'>{value}</label>
      <XCircleIcon
        onClick={onClick}
        className='text-gray-500 hover:text-red-500 right-0 w-6 h-6 '
      />
    </div>
  );
}
