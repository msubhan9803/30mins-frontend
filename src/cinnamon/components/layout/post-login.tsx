import Head from 'next/head';

import Sidebar from '@components/sidebar';
import AuthRoute from '@helpers/auth-route';
import classNames from 'classnames';
import {HTMLAttributes, useEffect, useState} from 'react';

type IProps = {
  children: any;
  className?: HTMLAttributes<HTMLDivElement>['className'];
  shouldRedirect?: boolean;
};

const PostLoginLayout = ({children, className, shouldRedirect = true}: IProps) => {
  const [collapsed, setCollapsed] = useState(
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('collapsed')!) : false
  );

  useEffect(() => {
    localStorage.setItem('collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  return (
    <AuthRoute shouldRedirect={shouldRedirect}>
      <Head>
        <link rel='icon' href='/assets/favicon.ico' />
      </Head>
      <Sidebar setCollapsed={setCollapsed} collapsed={collapsed} />
      <div
        className={classNames(
          'min-h-screen flex flex-col h-full transition-width duration-300 ease-in-out',
          collapsed ? 'xl:pl-24' : 'xl:pl-72',
          className
        )}
      >
        <main className='h-full'>
          <div className='pb-6 h-full'>
            <div className='max-w-7xl h-full mx-auto px-4 sm:px-6 md:px-8 transition-width duration-300 ease-in-out pb-6'>
              {children}
            </div>
          </div>
        </main>
      </div>
    </AuthRoute>
  );
};

export default PostLoginLayout;
