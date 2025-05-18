import {useMutation} from '@apollo/client';
import Button from '@root/components/button';
import mutations from 'constants/GraphQL/MutualAuth/mutations';
import cn from 'classnames';
import {useState} from 'react';
import {signIn, useSession} from 'next-auth/react';
import {toast} from 'react-hot-toast';
import useTranslation from 'next-translate/useTranslation';
import {PSendRequest, TypeMutualAuthList} from '../constants';

export default function UserCardMutualAuth({
  user,
  mode,
}: {
  mode: TypeMutualAuthList;
  user?: any;
  index?: any;
  setValue;
  v;
}) {
  const {t} = useTranslation('common');
  const [RQSent, setRQSent] = useState(false);
  const {data: session} = useSession();

  const [updateMutualAuths] = useMutation(mutations.updateMutualAuths);
  const SendRequest = async ({actoin, email, name}: PSendRequest) => {
    const id = toast.loading(t('txt_loading'));
    setRQSent(true);
    const data = await updateMutualAuths({
      variables: {
        token: session?.accessToken,
        ownerEmail: email,
        origin: window.origin,
        actoin: actoin,
      },
    });
    if (actoin === 'CONNECT') {
      await signIn('credentials', {
        token: data?.data?.updateMutualAuths?.token,
        callbackUrl: `${window.origin}/user/dashboard`,
        email,
        name: name,
      });
    }
    toast.dismiss(id);
    if (data.data?.updateMutualAuths?.response?.status !== 200) {
      toast.error(t(data?.data?.updateMutualAuths?.response.message));
    } else {
      toast.success(t(data?.data?.updateMutualAuths?.response.message));
    }
  };

  return (
    <div className='w-full border-2 rounded-md mx-auto'>
      <div
        className={cn([
          'flex flex-col sm:flex-row overflow-hidden gap-2 px-4 py-2 items-start sm:items-center h-full w-full justify-center sm:justify-between',
        ])}
      >
        <div className='flex flex-row w-full items-center justify-start gap-2 '>
          <div
            className={cn([
              'w-[50px] min-w-[50px] bg-gray-300 h-12 rounded-full shadow-md overflow-hidden',
            ])}
          >
            {user && <img src={user?.avatar || '/assets/default-profile.jpg'} alt='' />}
          </div>
          <div className='flex flex-col'>
            <div className='rounded-md empty:bg-gray-300 font-bold'>{user?.name}</div>
            <div className='rounded-md empty:bg-gray-300 text-xs text-gray-500 font-bold'>
              {user?.username && `(${user?.username})`}
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2 w-full sm:flex sm:flex-row gap-2 sm:justify-end'>
          {mode === 'getAuthorizedUser' && (
            <>
              <Button
                variant='solid'
                onClick={async () => {
                  await SendRequest({actoin: 'CONNECT', email: user?.email, name: user?.name});
                }}
                disabled={RQSent}
                className='col-span-1'
              >
                {t('Connect')}
              </Button>
              <Button
                variant='cancel'
                onClick={async () => {
                  await SendRequest({actoin: 'REMOVEACCESS', email: user?.email});
                }}
                disabled={RQSent}
                className='col-span-1'
              >
                {t('Remove Access')}
              </Button>
            </>
          )}
          {mode === 'getPendingInvites' && (
            <>
              <Button
                variant='solid'
                onClick={async () => {
                  await SendRequest({actoin: 'ACCEPT', email: user?.email});
                }}
                disabled={RQSent}
                className='col-span-1'
              >
                {t('Accept')}
              </Button>
              <Button
                variant='cancel'
                onClick={async () => {
                  await SendRequest({actoin: 'DECLINE', email: user?.email});
                }}
                disabled={RQSent}
                className='col-span-1'
              >
                {t('Decline')}
              </Button>
            </>
          )}
          {mode === 'getPendingRequest' && (
            <>
              <Button
                variant='cancel'
                onClick={async () => {
                  await SendRequest({actoin: 'CANCEL', email: user?.email});
                }}
                disabled={RQSent}
                className='col-span-2'
              >
                {t('Cancel')}
              </Button>
            </>
          )}
          {mode === 'searchUnauthorizedUser' && (
            <>
              <Button
                variant='solid'
                disabled={RQSent}
                onClick={async () => {
                  await SendRequest({actoin: 'SENDREQUEST', email: user?.email});
                }}
                className='col-span-2'
              >
                {t('Send request')}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
