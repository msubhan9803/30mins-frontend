import queries from 'constants/GraphQL/Sitemap/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import dayjs from 'dayjs';
import blogList from '../../utils/blogList';
import staticSiteList from '../../utils/staticSiteList';

const Sitemap = () => {};

export const getServerSideProps = async ({params, res}) => {
  const {name} = params;
  let isValidName = false;

  const sitemapTypes = ['profiles', 'organizations', 'services'];
  const hexCharList = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
  ];

  if (name === 'sitemap-0.xml') {
    const blogSitemap = blogList
      .map(
        blogUrl =>
          `
      <url>
        <loc>https://30mins.com/blog/${blogUrl}/</loc>
        <lastmod>${dayjs().format('YYYY-MM-DD')}</lastmod>
      </url>
     `
      )
      .join('');
    const staticSitemap = staticSiteList
      .map(
        staticUrl =>
          `
      <url>
        <loc>${staticUrl}/</loc>
        <lastmod>${dayjs().format('YYYY-MM-DD')}</lastmod>
      </url>
     `
      )
      .join('');

    res.setHeader('Content-Type', 'text/xml');
    res.write(
      `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
              xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        ${blogSitemap}
        ${staticSitemap}
      </urlset>`
    );
    res.end();

    return {
      props: {},
    };
  }

  sitemapTypes.forEach(type => {
    hexCharList.forEach(char => {
      if (name === `${type}-${char}.xml`) {
        isValidName = true;
      }
    });
  });

  if (!isValidName) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
      props: {},
    };
  }

  const rawName = name.split('.').slice(0, -1).join('.');
  const [sitemapType, sitemapIndex] = rawName.split('-');

  const dataResponse = await graphqlRequestHandler(
    queries.getSitemap,
    {
      sitemapType,
      sitemapIndex,
    },
    process.env.BACKEND_API_KEY
  );

  if (dataResponse.data.data.getSitemap.sitemap === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
      props: {},
    };
  }

  const xmlString = Buffer.from(
    dataResponse.data.data.getSitemap.sitemap.content,
    'base64'
  ).toString('ascii');

  res.setHeader('Content-Type', 'text/xml');
  res.write(
    xmlString.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, '')
  );
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
