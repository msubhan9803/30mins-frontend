import useTranslation from 'next-translate/useTranslation';
import {LoaderIcon} from 'react-hot-toast';
import UserCardMutualAuth from './user-card-mutual-auth';

export default function ListOfUsers({values: v, getUsers, getUsersLoading, setValue, token}) {
  const {t} = useTranslation('common');
  return (
    <div
      onScroll={async el => {
        if (
          el.currentTarget.scrollHeight - el.currentTarget.scrollTop <
          el.currentTarget.clientHeight + 1
        ) {
          if (v.Usersdata?.length < v.userCount && getUsersLoading === false) {
            setValue('getUsersLoading', true);
            const data = await getUsers({
              variables: {
                token: token,
                actoin: v.mode,
                searchParams: {
                  keywords: v.keywords,
                  resultsPerPage: v.resultsPerPage,
                  pageNumber: v.pageNumber + 1,
                },
              },
            });
            setValue('Usersdata', [
              ...(v.Usersdata || []),
              ...(data?.data?.getMutualAuthList?.Data || []),
            ]);
            setValue('userCount', data?.data?.getMutualAuthList?.userCount);
            setValue('pageNumber', v.pageNumber + 1);
            setValue('getUsersLoading', false);
          }
        }
      }}
      className='p-2 border h-[750px] rounded-md overflow-y-scroll overflow-x-hidden bg-white/50 flex flex-col gap-2'
    >
      {v.Usersdata?.map((el, idx) => (
        <UserCardMutualAuth
          key={idx}
          index={idx}
          user={el}
          v={v}
          setValue={setValue}
          mode={v.mode}
        />
      ))}
      <div className='flex w-full justify-center items-center'>
        {v.Usersdata?.length === 0 && !getUsersLoading && (
          <p className='font-bold'>{t('No Records found')}</p>
        )}
        {getUsersLoading && <LoaderIcon style={{width: 24, height: 24}} />}
      </div>
    </div>
  );
}
