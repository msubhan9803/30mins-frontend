import queries from 'constants/GraphQL/User/queries';
import productqueries from 'constants/GraphQL/Products/queries';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {ChatBubbleLeftRightIcon, ShareIcon} from '@heroicons/react/24/outline';
import {CheckBadgeIcon} from '@heroicons/react/20/solid';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import PublicProductCard from 'components/PostLogin/Products/PublicProductCard';
import Button from '@components/button';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import sanitizeHtml from 'sanitize-html';
import Stripe from 'stripe';
import ShopCartIcon from '@components/shop-cart-icon';
import mutations from 'constants/GraphQL/Products/mutations';
import {getSession} from 'next-auth/react';
import TwitterIcon from '@root/media-icons/TwitterIcon';
import InstagramIcon from '@root/media-icons/InstagramIcon';
import FacebookIcon from '@root/media-icons/FacebookIcon';
import LinkedinIcon from '@root/media-icons/LinkedinIcon';
import YoutubeIcon from '@root/media-icons/YoutubeIcon';

export default function ProductsPage({user, products, invoiceLink, checkoutId}) {
  const {t} = useTranslation();
  const router = useRouter();
  const [publicUrl, setPublicUrl] = useState('');
  const {showModal} = ModalContextProvider();
  const [first, setfirst] = useState(false);
  useEffect(() => {
    setPublicUrl(window.origin + router.asPath);
  }, [user]);

  const shareProfile = () => {
    showModal(MODAL_TYPES.SHAREPROFILE, {
      name: user?.personalDetails?.name,
      userLink: publicUrl,
      sharePage: true,
    });
  };
  const sendMessageExtenmsion = () => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: user?.personalDetails?.name,
      providerEmail: user?.accountDetails?.email,
    });
  };

  useEffect(() => {
    if (invoiceLink && !first) {
      setfirst(true);
      if (checkoutId !== null) {
        showModal(MODAL_TYPES.CHECKOUT, {Step: 'paymentSuccess', invoiceLink, checkoutId});
      }
      router.replace(`${window.origin}/${router.asPath.split('?')[0]}`);
    }
  });

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

  return (
    <div>
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
      <div className='mt-6 mb-2 container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between'>
        <div className='bg-white  shadow rounded xl:flex lg:flex w-full'>
          <div className='xl:w-2/5 lg:w-2/5 bg-gray-100  py-8 border-gray-300  xl:border-r rounded-tl xl:rounded-bl rounded-tr xl:rounded-tr-none lg:border-r-2 border-b xl:border-b-0 flex justify-center items-center'>
            <div className='flex flex-col items-center'>
              <div className='h-36 w-36 rounded-full mb-3'>
                <img
                  className='relative rounded-full h-36 w-36 object-cover object-center '
                  src={user?.accountDetails?.avatar || '/assets/default-profile.jpg'}
                  alt=''
                />
              </div>
              <div className='flex flex-col gap-2'>
                <Button variant='solid' type='submit' onClick={shareProfile}>
                  <ShareIcon className='w-4 h-4 mr-2 ' /> {t('profile:share_page')}
                </Button>
                <Button variant='solid' type='button' onClick={sendMessageExtenmsion}>
                  <ChatBubbleLeftRightIcon className='w-4 h-4 mr-2' />{' '}
                  {t('page:send_message_extension')}
                </Button>
              </div>
            </div>
          </div>
          <div className='xl:w-3/5 lg:w-3/5 px-6 py-8'>
            <div className='flex-inline'>
              <div className='item w-full'>
                <h1 className='mb-2 text-3xl font-bold text-gray-900 flex gap-2'>
                  {user?.personalDetails?.name}
                  {user?.accountDetails?.verifiedAccount ? (
                    <CheckBadgeIcon width={26} className={'text-mainBlue'} />
                  ) : null}
                </h1>
              </div>
              {user?.personalDetails?.headline && (
                <p className='mb-2 text-sm text-gray-700 font-bold overflow-hidden break-words'>
                  {user?.personalDetails?.headline}
                </p>
              )}
              {hasSocials && (
                <div className='item w-full h-12 flex-row'>
                  <>
                    <div className='flex pt-2 text-sm text-gray-500'>
                      <div className='flex-1 inline-flex items-center gap-1'>
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
              {user?.personalDetails?.description && (
                <div className='sm:col-span-2 text-sm'>
                  <dd
                    className='custom'
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(user?.personalDetails?.description),
                    }}
                  ></dd>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto flex flex-col gap-2'>
        <div className='flex justify-between pr-10'>
          <span className='ml-2 mb-2 text-3xl font-bold text-gray-900 px-4'>
            {t('common:products')}
          </span>
          <ShopCartIcon />
        </div>
        <div className='mb-6 px-6 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2'>
          {products.map((el, idx) => (
            <PublicProductCard key={idx} data={el} email={user?.accountDetails?.email} />
          ))}
        </div>
        {products.length! === 0 && (
          <div className='border flex flex-col font-medium justify-center items-center rounded-md h-60'>
            {t('common:No_product_yet')}
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
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

    if (
      !userData?.data?.getPublicUserData?.userData ||
      !userId?.data?.getUserByUsername?.userData
    ) {
      return {
        notFound: true,
      };
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
        products: products?.data?.getPublicProductsData?.products || [],
      },
    };
  } catch (err) {
    console.log(err?.response?.data);
    return {
      notFound: true,
    };
  }
};
