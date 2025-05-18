import Script from 'next/script';
import * as gtag from '../../lib/gtag';

const GoogleScripts = () => (
  <>
    <Script
      strategy='afterInteractive'
      src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
    />

    <Script
      strategy='afterInteractive'
      id='gtag-init"'
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gtag.GA_TRACKING_ID}', {
          page_path: window.location.pathname,
        });
      `,
      }}
    />
  </>
);

export default GoogleScripts;
