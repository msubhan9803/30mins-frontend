import queries from 'constants/GraphQL/User/queries';
import productqueries from 'constants/GraphQL/Products/queries';
import {useRouter} from 'next/router';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {getSession, useSession} from 'next-auth/react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import {CheckBadgeIcon} from '@heroicons/react/20/solid';
import PublicProductCard from 'components/PostLogin/Products/PublicProductCard';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import Stripe from 'stripe';
import mutations from 'constants/GraphQL/Products/mutations';
import _ from 'lodash';
import ShopCartIcon from '@components/shop-cart-icon';
import SelectedProductDisplay from '../../../components/PostLogin/Products/SelectedProductDisplay';
import TwitterIcon from '../../../cinnamon/media-icons/TwitterIcon';
import FacebookIcon from '../../../cinnamon/media-icons/FacebookIcon';
import LinkedinIcon from '../../../cinnamon/media-icons/LinkedinIcon';
import YoutubeIcon from '../../../cinnamon/media-icons/YoutubeIcon';
import InstagramIcon from '../../../cinnamon/media-icons/InstagramIcon';

export default function ProductPage({user, products, invoiceLink, checkoutId, selectedProduct}) {
  const {t} = useTranslation();
  const router = useRouter();
  const {showModal} = ModalContextProvider();
  const [first, setfirst] = useState(false);
  const {data: session} = useSession();

  const sendMessageExtension = (name, email) => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: name,
      providerEmail: email,
    });
  };

  const UserSocials = user?.personalDetails?.socials;

  const facebookLink = UserSocials?.facebook;
  const twitterLink = UserSocials?.twitter;
  const instagramLink = UserSocials?.instagram;
  const linkedinLink = UserSocials?.linkedin;
  const youtubeLink = UserSocials?.youtube;

  const hasSocials =
    UserSocials &&
    ((facebookLink && facebookLink !== '') ||
      (instagramLink && instagramLink !== '') ||
      (twitterLink && twitterLink !== '') ||
      (linkedinLink && linkedinLink !== '') ||
      (youtubeLink && youtubeLink !== ''));

  useEffect(() => {
    if (invoiceLink && !first) {
      setfirst(true);
      if (checkoutId !== null) {
        showModal(MODAL_TYPES.CHECKOUT, {Step: 'paymentSuccess', invoiceLink, checkoutId});
      }
      router.replace(`${window.origin}/${router.asPath.split('?')[0]}`);
    }
  });

  return (
    <>
      <HeadSeo
        title={`${selectedProduct?.title} | 30mins.com`}
        description={
          user?.personalDetails?.name
            ? user?.personalDetails?.name
            : '30mins.com | Social Platform for you to monetize time!'
        }
        canonicalUrl={`https://30mins.com/${user?.accountDetails?.username}`}
        ogTwitterImage={
          selectedProduct?.image
            ? selectedProduct?.image
            : 'https://30mins.com/assets/30mins-ogimage.jpg'
        }
        ogType={'website'}
      />

      <div className={'container p-6 mx-auto h-full w-full'}>
        <div className={'flex flex-col lg:flex-row relative'}>
          {selectedProduct?.price ? (
            <div className={'absolute top-4 left-4 z-10'}>
              <ShopCartIcon />
            </div>
          ) : null}
          <div className={'flex flex-col min-h-full divide-y space-y-2'}>
            <SelectedProductDisplay data={selectedProduct} is_success_page={false} />
          </div>
        </div>

        <div className='mt-4'>
          <h2 className='mb-2 text-2xl font-bold text-gray-900 gap-2'>Connect with the Seller</h2>
        </div>
        <div>
          <div className='grid grid-cols-1 lg:grid-cols-4'>
            <div className='col-span-1 flex flex-col items-center bg-gray-100  py-8 border-gray-300  xl:border-r rounded-tl xl:rounded-bl rounded-tr xl:rounded-tr-none lg:border-r-2 border-b xl:border-b-0 flex justify-center items-center'>
              <div className='h-36 w-36 rounded-full mb-3'>
                <img
                  className='relative rounded-full h-36 w-36 object-cover object-center '
                  src={user?.accountDetails?.avatar || '/assets/default-profile.jpg'}
                  alt=''
                />
              </div>
              <div className='item w-full justify-center flex flex-row'>
                <h2 className='mb-2 text-2xl font-bold text-gray-900 gap-2'>
                  {user?.personalDetails?.name}
                </h2>
                {user?.accountDetails?.verifiedAccount ? (
                  <CheckBadgeIcon width={26} className={'text-mainBlue'} />
                ) : null}
              </div>
              {hasSocials && (
                <div className='item w-full mb-2 flex-row'>
                  <>
                    <div className='flex pt-2 text-sm text-gray-500'>
                      <div className='flex-1 inline-flex justify-center gap-1'>
                        {twitterLink && <TwitterIcon link={twitterLink} />}
                        {facebookLink && <FacebookIcon link={facebookLink} />}
                        {linkedinLink && <LinkedinIcon link={linkedinLink} />}
                        {instagramLink && <InstagramIcon link={instagramLink} />}
                        {youtubeLink && <YoutubeIcon link={youtubeLink} />}
                      </div>
                    </div>
                  </>
                </div>
              )}
              {user?.personalDetails?.headline && (
                <p className='mb-2 px-2 text-sm text-gray-700 font-bold overflow-hidden break-words'>
                  {user?.personalDetails?.headline}
                </p>
              )}
            </div>
            <div className='col-span-3 grid lg:grid-cols-3'>
              <div className='col-span-3 px-4 pt-4 lg:pt-0'>
                {selectedProduct?.serviceMessage && (
                  <div className='sm:col-span-2 text-sm'>{selectedProduct?.serviceMessage}</div>
                )}
              </div>
              {session ? (
                <div className='col-span-3 grid md:grid-cols-3 px-4'>
                  <div className={'col-span-1 flex flex-col mt-4'}>
                    <div className='self-center w-[64px]'>
                      <a
                        href={`https://30mins.com/${user?.accountDetails?.username}/${
                          selectedProduct?.service?.slug || ''
                        }`}
                        className='break-all text-gray-900 font-bold'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <img src={`/icons/services/calendar.svg`} alt='' className='' />
                      </a>
                    </div>
                    <div className='self-center'>
                      <a
                        href={`https://30mins.com/${user?.accountDetails?.username}/${
                          selectedProduct?.service?.slug || ''
                        }`}
                        className='break-all text-gray-900 font-bold'
                      >
                        Schedule a call
                      </a>
                    </div>
                  </div>
                  <div className={'col-span-1 flex flex-col mt-4'}>
                    <div className='self-center w-[64px]'>
                      <a
                        onClick={() =>
                          sendMessageExtension(
                            user?.personalDetails?.name,
                            user?.accountDetails?.email
                          )
                        }
                        className='break-all text-gray-900 font-bold cursor-pointer'
                      >
                        <img src={`/icons/services/send-email.svg`} alt='' className='' />
                      </a>
                    </div>
                    <div className='self-center'>
                      <a
                        onClick={() =>
                          sendMessageExtension(
                            user?.personalDetails?.name,
                            user?.accountDetails?.email
                          )
                        }
                        className='break-all text-gray-900 font-bold cursor-pointer'
                      >
                        Send Message
                      </a>
                    </div>
                  </div>
                  <div className={'col-span-1 flex flex-col mt-4'}>
                    <div className='self-center w-[64px]'>
                      <Link
                        href={{
                          pathname: '/user/chat',
                          query: {
                            membersEmail: [session?.user?.email, user?.accountDetails?.email],
                          },
                        }}
                        as='/user/chat'
                        className='text-xs tracking-tight font-bold cursor-pointer'
                        title={t('common:live_chat')}
                        passHref
                      >
                        <img src={`/icons/services/chat.svg`} alt='' className='cursor-pointer' />
                      </Link>
                    </div>
                    <div className='self-center font-bold cursor-pointer'>
                      <Link
                        href={{
                          pathname: '/user/chat',
                          query: {
                            membersEmail: [session?.user?.email, user?.accountDetails?.email],
                          },
                        }}
                        as='/user/chat'
                        className='text-xs tracking-tight font-bold'
                        title={t('common:live_chat')}
                        passHref
                      >
                        Live Chat
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='col-span-3 grid sm:grid-cols-2 px-4'>
                  <div className={'col-span-1 flex flex-col mt-4'}>
                    <div className='self-center w-[64px]'>
                      <a
                        href={`https://30mins.com/${user?.accountDetails?.username}/${
                          selectedProduct?.service?.slug || ''
                        }`}
                        className='break-all text-gray-900 font-bold'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <img src={`/icons/services/calendar.svg`} alt='' className='' />
                      </a>
                    </div>
                    <div className='self-center'>
                      <a
                        href={`https://30mins.com/${user?.accountDetails?.username}/${
                          selectedProduct?.service?.slug || ''
                        }`}
                        className='break-all text-gray-900 font-bold'
                      >
                        Schedule a call
                      </a>
                    </div>
                  </div>
                  <div className={'col-span-1 flex flex-col mt-4'}>
                    <div className='self-center w-[64px]'>
                      <a
                        onClick={() =>
                          sendMessageExtension(
                            user?.personalDetails?.name,
                            user?.accountDetails?.email
                          )
                        }
                        className='break-all text-gray-900 font-bold cursor-pointer'
                      >
                        <img src={`/icons/services/send-email.svg`} alt='' className='' />
                      </a>
                    </div>
                    <div className='self-center'>
                      <a
                        onClick={() =>
                          sendMessageExtension(
                            user?.personalDetails?.name,
                            user?.accountDetails?.email
                          )
                        }
                        className='break-all text-gray-900 font-bold cursor-pointer'
                      >
                        Send Message
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {products.length !== 0 && (
          <div className='container mx-auto flex flex-col gap-2 py-8'>
            <div className='flex justify-between pr-10'>
              <span className='ml-2 mb-2 text-3xl font-bold text-gray-900 px-4'>
                {t('common:other_products')}
              </span>
            </div>
            <div className='mb-6 px-6 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2'>
              {products.map((el, idx) => (
                <PublicProductCard key={idx} data={el} email={user?.accountDetails?.email} />
              ))}
            </div>
          </div>
        )}
        <div className='flex flex-col my-4 py-4 border-t-[0px] justify-center items-center'></div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const {data: userData} = await graphqlRequestHandler(
    queries.getPublicUserData,
    {
      username: context.query.username,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: products} = await graphqlRequestHandler(
    productqueries.getPublicProductsData,
    {
      username: context.query.username,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: userId} = await graphqlRequestHandler(
    queries.getUserByUsername,
    {
      username: context.query.username,
    },
    process.env.BACKEND_API_KEY
  );

  const productsData = products?.data?.getPublicProductsData?.products;

  if (
    !productsData ||
    !productsData?.length ||
    !userData?.data?.getPublicUserData?.userData ||
    !userId?.data?.getUserByUsername?.userData
  ) {
    return {
      notFound: true,
    };
  }

  const selectedProduct = productsData.filter((product, index) => {
    if (product._id === context.query.pid) {
      _.pullAt(productsData, index);
      return true;
    }
    return false;
  });

  if (!selectedProduct || !selectedProduct?.length) {
    return {notFound: true};
  }

  const user = userData?.data?.getPublicUserData?.userData;

  let link: any = null;
  if (context?.query?.payment_intent && context.query.payment_intent_client_secret) {
    const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
      apiVersion: '2020-08-27',
    });
    const intentResponse = await stripe.paymentIntents.retrieve(
      context.query.payment_intent.toString()
    );
    link = intentResponse.charges.data[0].receipt_url;
  }
  let checkoutId: any = null;
  if (context?.query?.redirect_status === 'succeeded') {
    const session = await getSession(context);
    const {data} = await graphqlRequestHandler(
      mutations.checkout,
      {
        token: session?.accessToken,
      },
      ''
    );
    checkoutId = data?.data?.checkout?.checkoutId;
  }

  return {
    props: {
      user,
      invoiceLink: link,
      checkoutId: checkoutId,
      products: productsData || [],
      selectedProduct: selectedProduct[0],
    },
  };
};
