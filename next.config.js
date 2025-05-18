const nextTranslate = require('next-translate');

module.exports = nextTranslate();

module.exports = nextTranslate({
  async redirects() {
    return [
      {
        source: '/signups',
        destination: '/auth/signup',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/auth/signup',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/signin',
        destination: '/auth/login',
        permanent: true,
      },
    ];
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'localhost',
      '30mins-com.s3.us-east-2.amazonaws.com',
      '30minsassetsproduction.s3.us-east-2.amazonaws.com',
      '30minsassetsstage.s3.us-east-2.amazonaws.com',
      '30mins-stage-images.s3.us-east-2.amazonaws.com',
      'blog.30mins.com',
    ],
  },
  experimental: {
    esmExternals: false,
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pt', 'it', 'ro'],
  },
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = {fs: false};

    return config;
  },
});
