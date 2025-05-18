import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import ProductQueries from 'constants/GraphQL/Products/queries';
import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Button from '@root/components/button';
import ProductCard from 'components/PostLogin/Products/ProductCard';
import Loader from 'components/shared/Loader/Loader';
import {PlusIcon} from '@heroicons/react/24/outline';

export default function Posts() {
  const {t} = useTranslation('common');
  const {t: tpage} = useTranslation('page');
  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Product'), href: '#'},
    {title: tpage('All Products'), href: '/user/all-products'},
  ];

  const {data: session} = useSession();

  const {
    data: {getProductsByUserId: {products = null} = {}} = {},
    loading,
    refetch,
  } = useQuery(ProductQueries.getProductsByUserId, {
    variables: {token: session?.accessToken},
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <PostLoginLayout>
      <Head>
        <title>{tpage('All Products')}</title>
      </Head>
      <Header crumbs={crumbs} heading={tpage('All Products')} />

      <div className='mt-6 flex justify-end'>
        <Link href='/user/products/product-form/?mode=create' passHref>
          <Button variant='solid' className='w-full sm:w-auto'>
            <PlusIcon className='mr-2 h-5 w-5' aria-hidden='true' />
            {t('create_new_product')}
          </Button>
        </Link>
      </div>

      {loading && !products && (
        <div className='mt-4'>
          <Loader />
        </div>
      )}

      {!loading && !products && (
        <div className='mt-5 text-center'>
          <p className='text-gray-500 text-2xl'>{t('No Product Found')}</p>
          {JSON.stringify(products)}
        </div>
      )}

      {products && (
        <div className='mt-4 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start'>
          {products.map(item => (
            <ProductCard key={item._id} data={item} refetch={refetch} />
          ))}
        </div>
      )}

      {products?.length === 0 && !loading && (
        <div className='w-full flex flex-col'>
          <span className='text-gray-500 text-2xl mx-auto'>{t('No Product Found')}</span>
        </div>
      )}
    </PostLoginLayout>
  );
}
Posts.auth = true;
