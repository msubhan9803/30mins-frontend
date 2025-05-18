import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';

import postQueries from 'constants/GraphQL/Posts/queries';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Button from '@root/components/button';
import PostCard from 'components/PostLogin/Posts/PostCard';
import Loader from 'components/shared/Loader/Loader';
import Error from '@components/error';

import {PlusIcon} from '@heroicons/react/24/outline';

export default function Posts() {
  const {t} = useTranslation('common');
  const {t: tpage} = useTranslation('page');

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Profile'), href: '/user/profile'},
    {title: tpage('Posts'), href: '/user/posts'},
  ];

  const {data: session} = useSession();

  const {
    data: {getPostsByUserToken: {postData = null} = {}} = {},
    loading,
    refetch,
  } = useQuery(postQueries.getPostsByUserToken, {
    variables: {token: session?.accessToken, offset: null, limit: null},
    fetchPolicy: 'cache-and-network',
  });

  const handleRefetch = () => {
    refetch();
  };

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('my_posts')}</title>
      </Head>
      <Header crumbs={crumbs} heading={t('my_posts')} />

      <div className='mt-6 flex justify-end'>
        <Link href='/user/posts/post-form/?mode=create' passHref>
          <Button variant='solid' className='w-full sm:w-auto'>
            <PlusIcon className='mr-2 h-5 w-5' aria-hidden='true' />
            {t('create_new_post')}
          </Button>
        </Link>
      </div>

      {loading && !postData && (
        <div className='mt-4'>
          <Loader />
        </div>
      )}

      {!loading && !postData && (
        <div className='mt-4 pb-4'>
          <Error
            image={'/icons/errors/no-data.svg'}
            title={t('posts_no_x_added_main')}
            description={t('posts_no_x_added_description')}
            linkText={t('posts_learn_more')}
            linkURL='/blog/help_user_posts/'
          />
        </div>
      )}

      {postData && (
        <div className='mt-4 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start'>
          {postData.map(item => (
            <PostCard
              key={item._id}
              data={item}
              session={session}
              handleRefetch={handleRefetch}
              showMenus={true}
            />
          ))}
        </div>
      )}
    </PostLoginLayout>
  );
}
Posts.auth = true;
