import Head from 'next/head';

const HeadSeo = ({title, description, canonicalUrl, ogTwitterImage, ogType}) => (
  <Head>
    <title>{title}</title>
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <meta name='description' content={description} />
    <meta name='author' content={title} />
    <meta property='og:type' content={ogType} />
    <meta name='og:title' property='og:title' content={title} />
    <meta name='og:description' property='og:description' content={description} />
    <meta property='og:locale' content='en_US' />
    <meta property='og:site_name' content={'https://30mins.com'} key='site_name' />
    <meta property='og:url' content={canonicalUrl} />
    <meta name='twitter:card' content='summary' />
    <meta name='twitter:title' content={title} />
    <meta name='twitter:description' content={description} />
    <link rel='icon' href='/assets/favicon.ico' />
    <link rel='apple-touch-icon' href='/assets/favicon.ico' />
    <meta property='og:image' content={ogTwitterImage} />
    <meta name='twitter:image' content={ogTwitterImage} />
    <link rel='canonical' href={canonicalUrl} />
  </Head>
);

export default HeadSeo;
