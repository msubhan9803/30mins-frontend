import {ChevronRightIcon} from '@heroicons/react/24/outline';
import cn from 'classnames';
import Link from 'next/link';

type Props = {
  href: string;
  title: string;
};

const Crumb = ({href, title}: Props) => (
  <li className='m-0 p-0 list-none'>
    <div className='flex items-center'>
      <Link href={href} passHref>
        <a href={href} className={cn(['text-sm font-normal text-gray-700 hover:text-gray-800'])}>
          {title}
        </a>
      </Link>
      <ChevronRightIcon
        className='mx-3 mt-0.5 flex-shrink-0 h-3 w-3 text-gray-500'
        aria-hidden='true'
      />
    </div>
  </li>
);

export default Crumb;
