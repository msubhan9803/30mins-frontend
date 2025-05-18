import {FreeMode, Pagination} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import ShopCartIcon from '@root/components/shop-cart-icon';
import useTranslation from 'next-translate/useTranslation';
import PublicProductCard from 'components/PostLogin/Products/PublicProductCard';

export default function ProductsList({products, email}) {
  const {t} = useTranslation('common');

  if (products?.length === 0) {
    return null;
  }

  return (
    <div className='container flex flex-col select-none mx-auto w-full h-max py-2'>
      <div className='flex justify-between pr-10'>
        <span className='ml-2 mb-2 text-3xl font-bold text-gray-900 px-6'>{t('products')}</span>
        <ShopCartIcon />
      </div>
      <div className='w-full px-8'>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          style={{padding: 10}}
          freeMode={true}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1800: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          pagination={{
            clickable: true,
          }}
          modules={[FreeMode, Pagination]}
          className='mySwiper'
        >
          {products.map((el, idx) => (
            <SwiperSlide key={idx}>
              <PublicProductCard data={el} email={email} />
            </SwiperSlide>
          ))}
        </Swiper>
        {products?.length === 0 && (
          <div className='w-full flex flex-col py-10 border rounded-md'>
            <span className='text-gray-500 text-2xl mx-auto'>{t('No product added yet')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
