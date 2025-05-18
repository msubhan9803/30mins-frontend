import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';

import Loader from 'components/shared/Loader/Loader';
import AuthRouteLogin from '@helpers/AuthRouteLogin';

type Props = {
  children: React.ReactNode;
  shouldRedirect?: boolean;
};

const AuthRoute = ({children, shouldRedirect}: Props) => {
  const {push} = useRouter();
  const {status} = useSession();

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'unauthenticated' && shouldRedirect) {
    push('/');
    return <Loader />;
  }

  if (status === 'unauthenticated' && !shouldRedirect) {
    return <AuthRouteLogin />;
  }

  return <>{children}</>;
};

export default AuthRoute;
