import {useRef} from 'react';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Button from '@root/components/button';

const Search = () => {
  const {t} = useTranslation();
  const searchUser: any = useRef(null);
  const router = useRouter();
  const handleSearchUsers = async e => {
    e.preventDefault();
    router.push({
      pathname: '/users',
      query: {
        keywords: searchUser.current.value,
      },
    });
  };

  return (
    <form onSubmit={handleSearchUsers} className='px-3 py-2 hidden sm:flex h-max gap-2'>
      <input
        type='text'
        ref={searchUser}
        name='search'
        className='text-xs block border py-2 border-gray-300 rounded-md text-gray-900 placeholder-gray-500 shadow-sm focus:border-mainBlue focus:mainBlue'
        placeholder={t(`common:search_for_experts`)}
        maxLength={254}
        size={38}
      />
      <Button
        variant='solid'
        type='submit'
        className='text-sm block font-medium rounded-md border sm:px-5 px-2 py-1.5 border-transparent bg-mainBlue text-white shadow duration-150 ease-out hover:bg-blue-800 focus:outline-none focus:ring-2 focus:mainBlue focus:ring-offset-2'
      >
        {t('meeting:search')}
      </Button>
    </form>
  );
};

export default Search;
