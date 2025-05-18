import productqueries from 'constants/GraphQL/Products/queries';
import React from 'react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import sanitizeHtml from 'sanitize-html';
import classNames from 'classnames';
import {getSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import Loader from '../../../components/shared/Loader/Loader';

export default function DownloadSuccess({user, product}) {
  const router = useRouter();

  if (typeof window === 'undefined') {
    return <Loader />;
  }

  return (
    <div className={'h-screen w-screen overflow-scroll'}>
      <HeadSeo
        title={`${user?.personalDetails?.name} | 30mins.com`}
        description={
          user?.personalDetails?.headline
            ? user?.personalDetails?.headline
            : 'Providing my services on 30mins.com for easy booking without the back and forth!'
        }
        canonicalUrl={`https://30mins.com/${user?.accountDetails?.username}`}
        ogTwitterImage={
          user?.accountDetails?.avatar
            ? user?.accountDetails?.avatar
            : 'https://30mins.com/assets/30mins-ogimage.jpg'
        }
        ogType={'website'}
      />

      <div className={'container px-4 py-10 grid grid-cols-1 h-full w-full'}>
        <div className={'col-span-1 grid grid-cols-1 md:grid-cols-6'}>
          <div className={'col-span-4 col-start-2 w-full text-center justify-center items-center'}>
            <h4
              className='font-bold text-3xl text-mainBlue leading-tight mr-1 break-words'
              title={product?.title}
            >
              {product?.title}
            </h4>
          </div>
        </div>
        <div className={'col-span-1 grid grid-cols-1 md:grid-cols-6'}>
          <div
            className={
              'col-span-4 col-start-2 flex flex-col w-full text-center justify-center items-center'
            }
          >
            <div className='flex flex-col lg:flex-row pt-4'>
              <div className='lg:w-3/5 text-left content-start px-6'>
                <dd
                  id={`desc-${product?._id}`}
                  className={classNames(
                    'min-h-[50px] text-sm md:text-lg mt-1 leading-normal text-mainText break-words line-clamp-10'
                  )}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(product?.description),
                  }}
                />
              </div>
              <div className='w-full lg:w-2/5 grid justify-items-center lg:justify-items-start px-6'>
                <img
                  src={product?.image}
                  alt={`Product Image for: ${product.title}`}
                  className={'h-[256px] w-[256px] object-contain'}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={'col-span-1 grid grid-cols-1 md:grid-cols-6 mb-4'}>
          <div
            className={
              'col-span-4 col-start-2 flex flex-col w-full text-center justify-center items-center'
            }
          >
            <div className='mt-4 text-md border-2 border-[#3bb44a] px-2 py-2'>
              <div className='text-md flex flex-col items-center lg:items-start lg:flex-row border-[1px] border-[#3bb44a] bg-[#3bb44a] px-5 py-5'>
                <div className='text-lg sm:text-xl font-bold mr-5 text-white'>
                  Your download link:
                </div>
                <div className='text-lg sm:text-xl font-bold text-mainBlue text-white break-all'>
                  <a
                    href={`https://30mins.com/user/purchases/${router?.query?.cid}`}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {`https://30mins.com/user/purchases/${router?.query?.cid}`}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {product?.service?.slug && (
          <div className={'col-span-1 grid grid-cols-1 md:grid-cols-6'}>
            <div className='text-blue-500 col-span-4 col-start-2 flex flex-row w-full min-h-full text-lg font-bold items-center justify-center'>
              <div className='self-center'>
                <Image src={`/icons/services/calendar.svg`} height={64} width={64} alt='' />
              </div>
              <div className='self-center'>
                <a
                  href={`https://30mins.com/${user?.accountDetails?.username}/${product?.service?.slug}`}
                  className='break-all text-mainBlue'
                >
                  https://30mins.com/{user?.accountDetails?.username}/{product?.service?.slug}
                </a>
              </div>
            </div>
          </div>
        )}
        {product?.serviceMessage && (
          <div className={'col-span-1 grid grid-cols-1 md:grid-cols-6 mb-4'}>
            <div className='col-span-4 col-start-2 flex flex-row w-full min-h-full text-lg font-bold items-center justify-center'>
              <div className='m-auto text-sm sm:text-lg font-normal justify-center'>
                {product?.serviceMessage}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const {data: product} = await graphqlRequestHandler(
    productqueries.getProductDownloadSuccessData,
    {
      documentId: context.query.pid,
    },
    process.env.BACKEND_API_KEY
  );

  const productData = product?.data?.getProductDownloadSuccessData?.product;

  if (!productData) {
    return {
      notFound: true,
    };
  }

  const user = productData?.seller;

  return {
    props: {
      user,
      product: productData,
    },
  };
};
