import React, {useState} from 'react';
import {GetServerSideProps} from 'next/types';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';

import Layout from 'components/Layout/PreLogin';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import Button from '@root/components/button';
import Loader from '@root/components/loader';
import CenteredContainer from 'components/shared/Container/CenteredContainer';
import BlogCard from 'components/PreLogin/Blog/BlogCard';

import blogsList from 'utils/blogList';

const getBlogsBySlugList = async slugList => {
  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      query GetAllPosts($PostsBySlugs: [String]) {
        posts(
          where: {nameIn: $PostsBySlugs, orderby: {field: NAME_IN, order: ASC}}
        ) {
          nodes {
            databaseId
            title
            slug
            date
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
      }
        `,
      variables: {
        PostsBySlugs: slugList,
      },
    }),
  };

  const response = await fetch('https://blog.30mins.com/graphql', params).then(res => res.json());
  const blogsData = response?.data?.posts?.nodes || [];

  return blogsData;
};

const Blog = ({blogsData}) => {
  const {t} = useTranslation();

  const [blogListState, setBlogListState] = useState(blogsData);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);
  const [totalBlogs] = useState(blogsList.length);

  const loadMoreBlogs = async () => {
    setLoadingLoadMore(true);

    const slugList = blogsList.slice(blogListState.length, blogListState.length + 3);

    const response = await axios.post('/api/other-blogs', {
      data: slugList,
    });

    const newBlogs = response?.data?.blogsData || [];

    setBlogListState([...blogListState, ...newBlogs]);
    setLoadingLoadMore(false);
  };

  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/blog/'}
        description={t('page:pricing_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${t('common:Blog')} | 30mins`}
      />

      <CenteredContainer className='containerCenter gap-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-4 px-2 lg:px-6 xl:px-12'>
          {blogListState.map((blog, index) => (
            <BlogCard data={blog} key={index} />
          ))}
        </div>

        {blogListState.length < totalBlogs && (
          <div className='flex items-center justify-center mt-4'>
            <Button variant='solid' type='button' onClick={loadMoreBlogs}>
              {!loadingLoadMore ? t('common:load_more_blogs') : <Loader color={'currentColor'} />}
            </Button>
          </div>
        )}
      </CenteredContainer>
    </Layout>
  );
};

export default Blog;

export const getServerSideProps: GetServerSideProps = async () => {
  const list = blogsList.slice(0, 9);

  const blogsData = await getBlogsBySlugList(list);

  return {
    props: {
      blogsData,
    },
  };
};
