import classNames from 'classnames';
import Footer from 'components/PreLogin/Footer';
import Head from 'next/head';
import {HTMLAttributes, PropsWithChildren} from 'react';
import Header from '../PreLogin/Header';

interface IProps extends PropsWithChildren<unknown> {
  mainStype?: HTMLAttributes<HTMLDivElement>['className'];
}

const PreLoginLayout = ({children, mainStype}: IProps) => (
  <div className='bg-white flex flex-col justify-between h-screen'>
    <Head>
      <link rel='icon' href='/assets/favicon.ico' />
    </Head>
    <Header />
    <main className={classNames(['mt-20', mainStype])}>{children}</main>
    <Footer />
  </div>
);

PreLoginLayout.auth = true;

export default PreLoginLayout;
