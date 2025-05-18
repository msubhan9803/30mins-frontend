import Head from 'next/head';
import PostLoginLayout from '@root/components/layout/post-login';
import Link from 'next/link';
import Header from '@root/components/header';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import queries from 'constants/GraphQL/Products/queries';
import Loader from '@root/components/loader';
import {useSession} from 'next-auth/react';
import sanitizeHtml from 'sanitize-html';
import dayjs from 'dayjs';
import CommonTable from '@root/components/common-table';
import {CheckBadgeIcon, ExclamationCircleIcon} from '@heroicons/react/20/solid';
import Button from '@root/components/button';
import {toast} from 'react-hot-toast';
import mutations from 'constants/GraphQL/Products/mutations';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import React, {useContext} from 'react';
import {UserContext} from '@context/user';
import TwitterIcon from '../../../cinnamon/media-icons/TwitterIcon';
import FacebookIcon from '../../../cinnamon/media-icons/FacebookIcon';
import LinkedinIcon from '../../../cinnamon/media-icons/LinkedinIcon';
import YoutubeIcon from '../../../cinnamon/media-icons/YoutubeIcon';
import InstagramIcon from '../../../cinnamon/media-icons/InstagramIcon';

function Lable({title, value}) {
  return (
    <span className='flex flex-row gap-1'>
      <span className='font-bold'>{title}</span> : <span className='font-normal'>{value}</span>
    </span>
  );
}

export default function CheckoutDetails() {
  const {query} = useRouter();
  const {data: session} = useSession();
  const {t} = useTranslation('common');
  const {showModal, hideModal} = ModalContextProvider();
  const {t: tpage} = useTranslation('page');
  const {user} = useContext(UserContext);

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Product'), href: '#'},
    {title: tpage('Purchase History Details'), href: `/user/purchases/${query?.cid}`},
  ];

  const sendMessageExtension = (name, email) => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: name,
      providerEmail: email,
    });
  };

  const [productQttUpdateStatus] = useMutation(mutations.productQttUpdateStatus);

  const {
    data: {getCompletedCheckoutId: {checkout, productQtt}} = {
      getCompletedCheckoutId: {checkout: {}, productQtt: []},
    },
    loading,
    refetch,
  } = useQuery(queries.getCompletedCheckoutId, {
    variables: {
      token: session?.accessToken,
      checkoutId: query?.cid,
    },
    skip: !session?.accessToken,
  });

  const [getDownloadUrl] = useLazyQuery(queries.getProductDownloadUrl);

  const handleDownloadRequest = async productId => {
    const {data: downloadUrlData} = await getDownloadUrl({
      variables: {
        token: session?.accessToken,
        productId,
      },
      fetchPolicy: 'no-cache',
    });

    if (downloadUrlData?.getProductDownloadUrl?.response?.status !== 200) {
      toast.error(t('general_api_error'));
      return;
    }

    window.open(downloadUrlData?.getProductDownloadUrl?.downloadUrl);
  };

  const sendRefund = async (productQttId, reason) => {
    toast.loading(t('loading'));
    const {data} = await productQttUpdateStatus({
      variables: {
        token: session?.accessToken,
        productQttId: productQttId,
        action: 'PENDING_ACTION',
        authCode: null,
        refundReason: reason,
      },
    });
    await refetch();
    toast.dismiss();
    if (data?.productQttUpdateStatus?.status === 200) {
      toast.success(t('refund request sent successful'));
      hideModal();
    } else {
      toast.error(t('failed to send refund request'));
      hideModal();
    }
  };

  const RefundActionColumn = ({row}) => (
    <div className='flex items-center justify-center'>
      <Button
        variant={
          Math.floor(dayjs().diff(dayjs.unix(Number(checkout?.createdAt) / 1000), 'days')) > 3
            ? 'ghost'
            : 'cancel'
        }
        disabled={row.original.refundRequested || row.original.price === 0}
        onClick={async () => {
          if (
            Math.floor(dayjs().diff(dayjs.unix(Number(checkout?.createdAt) / 1000), 'days')) > 3
          ) {
            toast.dismiss();
            toast(
              t(
                'common:Three days have passed, you may not be able to request a refund for your money'
              ),
              {
                icon: <ExclamationCircleIcon width={25} height={25} />,
                duration: 1000,
              }
            );
          } else {
            showModal(MODAL_TYPES.REFUNDPRODUCT, {
              // eslint-disable-next-line @typescript-eslint/return-await
              sendRefund: async reason => await sendRefund(row.original.productQttId, reason),
            });
          }
        }}
      >
        {row.original.refundRequested ? t('Request sent') : t('Refund')}
      </Button>
    </div>
  );

  const columns = [
    {Header: 'Image', accessor: 'image'},
    {Header: 'Product Name', accessor: 'title'},
    {Header: 'َQuantity', accessor: 'quantity'},
    {Header: 'Price', accessor: 'price'},
    {Header: 'Discount', accessor: 'discount'},
    {Header: 'Description', accessor: 'description'},
    {Header: 'File', accessor: 'file'},
    {
      Header: 'Refund',
      Cell: RefundActionColumn,
    },
  ];

  const UserSocials = productQtt ? productQtt[0]?.product?.seller?.personalDetails?.socials : {};

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

  if (loading) {
    return <Loader />;
  }

  if (!checkout) {
    return (
      <>
        <PostLoginLayout>
          <Head>
            <title>{tpage('Purchase History Details')}</title>
          </Head>
          <Header crumbs={crumbs} heading={tpage('Purchase History Details')} />
          <div className='w-full h-full flex flex-col'>
            <span>{t('No records found')}</span>
          </div>
        </PostLoginLayout>
      </>
    );
  }

  return (
    <PostLoginLayout shouldRedirect={false}>
      <Head>
        <title>{tpage('Purchase History Details')}</title>
      </Head>
      <Header crumbs={crumbs} heading={tpage('Purchase History Details')} />

      {productQtt?.length > 1 ? (
        <>
          <div className='w-full h-max flex flex-col border rounded-md shadow-sm'>
            <div className='h-max flex flex-col justify-center p-2 border-b shadow-sm'>
              <Lable title={t('Checkout id')} value={checkout?._id} />
              <Lable
                title={t('Seller Email')}
                value={productQtt[0]?.product?.seller?.accountDetails?.email}
              />
              <Lable
                title={t('Date')}
                value={dayjs.unix(Number(checkout?.createdAt) / 1000).format('MMM DD, YYYY h:mm A')}
              />
            </div>
            <div className='h-max flex flex-col p-2 border-b shadow-sm'>
              <span className='font-bold'>Products</span>
              <CommonTable
                columns={columns}
                data={productQtt.map(el => ({
                  image: <img src={el?.product?.image} alt='' className='w-16 h-16 my-auto' />,
                  title: el.product.title,
                  quantity: el.quantity,
                  refundRequested: el.refundRequested,
                  price: el.checkoutPrice,
                  productQttId: el._id,
                  discount: `${el.product.discount}% off`,
                  file: el.product?.file?.link ? (
                    <Button
                      onClick={async () => handleDownloadRequest(el.product?._id)}
                      variant='solid'
                    >
                      {t('Download')}
                    </Button>
                  ) : (
                    'No file attached'
                  ),
                  description: (
                    <dd
                      className='mt-1 text-sm line-clamp-6 text-gray-900 custom'
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(el.product.description),
                      }}
                    ></dd>
                  ),
                }))}
              />
            </div>

            <div className='p-4 flex flex-row justify-between'>
              <span className='col-span-1 font-bold break-all line-clamp-1'>
                <span>{t('Total')} : </span> $
                {productQtt.length! > 0 &&
                  productQtt
                    ?.map(el => Number(Math.floor(el.checkoutPrice)) * Number(el.quantity))
                    ?.reduce((a, b) => Number(Math.floor(a)) + Number(Math.floor(b)))}
              </span>
            </div>
          </div>
        </>
      ) : productQtt?.length === 1 && productQtt[0]?.checkoutPrice === 0 ? (
        <div className='flex flex-col'>
          <div>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
              <div className='col-span-1 px-8'>
                <img src={productQtt[0]?.product?.image} alt='' className='w-96' />
              </div>
              <div className='col-span-2 px-4'>
                <div className='font-bold'>{productQtt[0]?.product?.title}</div>
                <dd
                  className='mt-1 text-sm pr-4 line-clamp-16 text-gray-900 custom'
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(productQtt[0]?.product?.description),
                  }}
                ></dd>
              </div>
              <div className='col-span-1 md:col-span-3 lg:col-span-1 p-8'>
                {productQtt[0].product?.file?.link ? (
                  <>
                    <Button
                      variant='solid'
                      className='text-xl w-[90%] h-[50px]'
                      onClick={async () => handleDownloadRequest(productQtt[0]?.product?._id)}
                    >
                      {t('Download')}
                    </Button>

                    <span className='text-xs sm:text-sm'>
                      You can download from this page anytime.
                    </span>
                  </>
                ) : (
                  <span className='text-xs sm:text-sm'>No downloadable asset.</span>
                )}
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <h2 className='mb-2 text-2xl font-bold text-gray-900 gap-2'>Connect with the Seller</h2>
          </div>
          <div>
            <div className='grid grid-cols-1 sm:grid-cols-4'>
              <div className='col-span-1 flex flex-col items-center bg-gray-100  py-8 border-gray-300  xl:border-r rounded-tl xl:rounded-bl rounded-tr xl:rounded-tr-none lg:border-r-2 border-b xl:border-b-0 flex justify-center items-center'>
                <div className='h-36 w-36 rounded-full mb-3'>
                  <img
                    className='relative rounded-full h-36 w-36 object-cover object-center '
                    src={
                      productQtt[0]?.product?.seller?.accountDetails?.avatar ||
                      '/assets/default-profile.jpg'
                    }
                    alt=''
                  />
                </div>
                <div className='item w-full justify-center flex flex-row'>
                  <h2 className='mb-2 text-2xl font-bold text-gray-900 gap-2'>
                    {productQtt[0].product?.seller?.personalDetails?.name}
                  </h2>
                  {productQtt[0]?.product?.seller?.accountDetails?.verifiedAccount ? (
                    <CheckBadgeIcon width={26} className={'text-mainBlue'} />
                  ) : null}
                </div>
                {hasSocials && (
                  <div className='item w-full h-12 flex-row'>
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
                {productQtt[0]?.product?.seller?.personalDetails?.headline && (
                  <p className='mb-2 text-sm text-gray-700 font-bold overflow-hidden break-words px-2'>
                    {productQtt[0]?.product?.seller?.personalDetails?.headline}
                  </p>
                )}
              </div>
              <div className='col-span-3 grid grid-cols-3'>
                <div className='col-span-3 px-4 pt-4 lg:pt-0'>
                  {productQtt[0]?.product?.serviceMessage && (
                    <div className='sm:col-span-2 text-sm'>
                      {productQtt[0]?.product?.serviceMessage}
                    </div>
                  )}
                </div>
                {
                  <div className='col-span-3 grid sm:grid-cols-3 px-4'>
                    <div className={'col-span-1 flex flex-col mt-4'}>
                      <div className='self-center w-[64px]'>
                        <a
                          href={`https://30mins.com/${
                            productQtt[0]?.product?.seller?.accountDetails?.username
                          }/${productQtt[0]?.product?.service?.slug || ''}`}
                          className='break-all text-gray-900 font-bold'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <img src={`/icons/services/calendar.svg`} alt='' className='' />
                        </a>
                      </div>
                      <div className='self-center'>
                        <a
                          href={`https://30mins.com/${
                            productQtt[0]?.product?.seller?.accountDetails?.username
                          }/${productQtt[0]?.product?.service?.slug || ''}`}
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
                              productQtt[0].product?.seller?.personalDetails?.name,
                              productQtt[0].product?.seller?.accountDetails?.email
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
                              productQtt[0].product?.seller?.personalDetails?.name,
                              productQtt[0].product?.seller?.accountDetails?.email
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
                              membersEmail: [
                                user?.email,
                                productQtt[0].product?.seller?.accountDetails?.email,
                              ],
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
                      <div className='self-center font-bold'>
                        <Link
                          href={{
                            pathname: '/user/chat',
                            query: {
                              membersEmail: [
                                user?.email,
                                productQtt[0].product?.seller?.accountDetails?.email,
                              ],
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
                }
              </div>
            </div>
          </div>
        </div>
      ) : productQtt?.length === 1 && productQtt[0]?.product?.checkoutPrice > 0 ? (
        <>
          <div className='w-full h-max flex flex-col border rounded-md shadow-sm'>
            <div className='h-max flex flex-col justify-center p-2 border-b shadow-sm'>
              <Lable title={t('Checkout id')} value={checkout?._id} />
              <Lable
                title={t('Seller Email')}
                value={productQtt[0]?.product?.seller?.accountDetails?.email}
              />
              <Lable
                title={t('Date')}
                value={dayjs.unix(Number(checkout?.createdAt) / 1000).format('MMM DD, YYYY h:mm A')}
              />
            </div>
            <div className='h-max flex flex-col p-2 border-b shadow-sm'>
              <span className='font-bold'>Products</span>
              <CommonTable
                columns={columns}
                data={productQtt.map(el => ({
                  image: <img src={el?.product?.image} alt='' className='w-16 h-16 my-auto' />,
                  title: el.product.title,
                  quantity: el.quantity,
                  refundRequested: el.refundRequested,
                  price: el.checkoutPrice,
                  productQttId: el._id,
                  discount: `${el.product.discount}% off`,
                  file: el.product?.file?.link ? (
                    <Button
                      onClick={async () => handleDownloadRequest(el.product?._id)}
                      variant='solid'
                    >
                      {t('Download')}
                    </Button>
                  ) : (
                    'No file attached'
                  ),
                  description: (
                    <dd
                      className='mt-1 text-sm line-clamp-6 text-gray-900 custom'
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(el.product.description),
                      }}
                    ></dd>
                  ),
                }))}
              />
            </div>

            <div className='p-4 flex flex-row justify-between'>
              <span className='col-span-1 font-bold break-all line-clamp-1'>
                <span>{t('Total')} : </span> $
                {productQtt.length! > 0 &&
                  productQtt
                    ?.map(el => Number(Math.floor(el.checkoutPrice)) * Number(el.quantity))
                    ?.reduce((a, b) => Number(Math.floor(a)) + Number(Math.floor(b)))}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div>You have reached this page in error! Please contact us immediately.</div>
      )}
    </PostLoginLayout>
  );
}
