import React, {ReactElement, ReactNode, useEffect} from 'react';
import Script from 'next/script';
import {SessionProvider} from 'next-auth/react';
import {ApolloProvider} from '@apollo/client';
import {AppProps} from 'next/app';
import type {NextPage} from 'next';
import NotificationMessage from 'components/PostLogin/LiveChat/features/notification-message';
import {NotificationContextProvider} from 'store/Notification/Notification.context';
import Notification from 'components/shared/Notification/Notification';
import {CollapseDrawerProvider} from 'store/Sidebar/Sidebar.context';
import CookiesConsent from 'components/shared/CookieConsent/Cookie';
import {TabsContextProvider} from 'store/Tabs/Tabs.context';
import {ModalProvider} from 'store/Modal/Modal.context';
import MainToaster from '@root/components/mainToaster';
import StoreContextProviders from 'store/contexts';
import {useRouter} from 'next/router';
import {UserContextProvider} from 'store/UserContext/User.context';
import OnlineStatusProvider from 'components/shared/OnlineStatus';
import GoogleScripts from 'cinnamon/helpers/google-scripts';
import AuthRoute from 'cinnamon/helpers/auth-route';
import UserCtxProvider from '@context/user';
import client from '../lib/apollo-client';
import * as gtag from '../lib/gtag';

import 'styles/globals.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  auth: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({Component, pageProps}: AppPropsWithLayout) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = url => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const getLayout = Component.getLayout ?? (page => page);

  return (
    <>
      <GoogleScripts />
      <Script
        id={'rewardful-script'}
      >{`(function(w, r) {w._rwq = r; w[r] = w[r] || function() { (w[r].q = w[r].q || []).push(arguments); };})(window, "rewardful");`}</Script>
      <Script async src='https://r.wdfl.co/rw.js' data-rewardful='bba830'></Script>

      <SessionProvider session={pageProps.session}>
        <ApolloProvider client={client}>
          {Component.auth ? (
            <StoreContextProviders
              contextProvider={[
                CollapseDrawerProvider,
                NotificationContextProvider,
                TabsContextProvider,
                UserCtxProvider,
                UserContextProvider,
              ]}
            >
              <StoreContextProviders contextProvider={[ModalProvider]}>
                <AuthRoute>
                  <Notification />
                  <OnlineStatusProvider />
                  {getLayout(<Component {...pageProps} />)}
                  <NotificationMessage />
                  <MainToaster />
                </AuthRoute>
              </StoreContextProviders>
            </StoreContextProviders>
          ) : (
            <>
              <StoreContextProviders
                contextProvider={[UserCtxProvider, UserContextProvider, CollapseDrawerProvider]}
              >
                <StoreContextProviders contextProvider={[ModalProvider]}>
                  {getLayout(<Component {...pageProps} />)}
                  <MainToaster />
                </StoreContextProviders>
              </StoreContextProviders>
            </>
          )}
          <CookiesConsent />
        </ApolloProvider>
      </SessionProvider>
    </>
  );
};

export default MyApp;
