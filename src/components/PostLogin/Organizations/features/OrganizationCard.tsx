// import sanitizeHtml from 'sanitize-html';
import {IProps} from './constants';
import Actions from './actions';

export default function OrganizationCard(props: IProps) {
  return (
    <div className='mix-w-full flex flex-col md:flex-row border min-h-[350px] md:min-h-max md:h-[200px] shadow-md hover:shadow bg-white rounded-md '>
      <div
        className='h-48 m-4 w-auto md:h-auto md:w-48 flex-none bg-cover bg-center text-center overflow-hidden rounded'
        style={{
          backgroundImage: `url(${
            props.organizationId?.image ||
            'https://files.stripe.com/links/MDB8YWNjdF8xSXExT2dKV2FIT3E3dTdkfGZsX3Rlc3RfMW15OUp4UHNvb29Lem9BVXFrdjBId0JT00jAdxbWe4'
          })`,
        }}
        title='Forest'
      ></div>
      <div className='relative w-full h-full p-4 flex flex-col justify-between leading-normal'>
        <div className='w-full grid h-full grid-rows-6'>
          <div
            title={props.organizationId?.title}
            className='text-gray-900 w-full row-span-1 font-bold line-clamp-1 break-all text-xl'
          >
            {props.organizationId?.title}
          </div>

          <p className='text-sm text-gray-500 w-full row-span-1 font-bold line-clamp-1 flex items-center'>
            {props.role}
          </p>

          <p
            className='text-sm text-gray-800 w-full row-span-4 line-clamp-5 break-words  font-bold'
            style={{lineHeight: 1.75}}
            title={props.organizationId.headline}
          >
            {props.organizationId.headline}
          </p>
        </div>
        <Actions {...props} />
      </div>
    </div>
  );
}
