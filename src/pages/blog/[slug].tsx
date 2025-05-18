import Layout from 'components/Layout/PreLogin';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import useTranslation from 'next-translate/useTranslation';
import {GetServerSideProps} from 'next/types';
import CenteredContainer from 'components/shared/Container/CenteredContainer';
import BlogContent from 'components/PreLogin/Blog/BlogContent';

const removeTags = (str: string) => str.replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/gi, '');

const Blog = ({blogData}) => {
  const {t} = useTranslation();

  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/blog/'}
        description={t('page:pricing_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${removeTags(blogData?.title || '') || ''} | 30mins`}
      />
      <CenteredContainer className='containerCenter gap-8'>
        <BlogContent blogData={blogData} />
      </CenteredContainer>
    </Layout>
  );
};

export default Blog;

export const getServerSideProps: GetServerSideProps = async context => {
  let blogData = null;

  try {
    const slug = context?.params?.slug;

    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetAllPosts($slug: String) {
            postBy(slug: $slug) {
              databaseId
              title
              slug
              content
              featuredImage {
                node {
                  sourceUrl
                }
              }
              author {
                node {
                  name
                  avatar {
                    url
                  }
                }
              }
              categories {
                nodes {
                  name
                }
              }
            }
          }
          `,
        variables: {
          slug,
        },
      }),
    };

    const response = await fetch('https://blog.30mins.com/graphql', params).then(res => res.json());
    blogData = response?.data?.postBy || null;
  } catch (err) {
    console.log(err);
  }

  if (!blogData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      blogData,
    },
  };
};
