import useTranslation from 'next-translate/useTranslation';
import Layout from 'components/Layout/PreLogin';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import Image from 'next/image';
import Button from 'components/shared/Button/Button';

const Conference = () => {
  const {t} = useTranslation();

  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/conference/'}
        description={t('page:conference_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${t('page:Conference')} | 30mins`}
      />
      <div className="mx-auto grid grid-cols-1 px-6 sm:px-20 sm:grid-cols-2 bg-cover bg-center  pt-24 pb-24 sm:pt-0 sm:pb-0 bg-[url('/assets/conference_bg.jpg')] sm:bg-[url('/assets/conference_bg.jpg')] sm:h-[50vh]">
        <div className='mx-auto grid-cols-1 flex items-center justify-center'>
          <div className='mt-4'>
            <div className='mt-6'>
              <h1 className='text-3xl sm:text-5xl font-extrabold text-white tracking-tight'>
                {t('page:Conference_30mins_for')}
                {t(' ')}
                <span className='text-white'>{t('page:Conference_conference')}</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white grid grid-cols-1 sm:grid-cols-1 px-6 sm:px-40 px-6 pt-10 sm:px-20 pb-4 bg-cover bg-center bg-no-repeat'>
        <div className='text-center mb-4'>
          <h1 className='mx-auto mb-4 text-xl sm:text-3xl font-bold text-mainText tracking-tight'>
            <span>{t(`page:Conference_why_30mins_1`)}</span>&nbsp;
            <span className='text-mainBlue'>{t(`page:Conference_why_30mins_2`)}</span>&nbsp;
            <span>{t(`page:Conference_why_30mins_3`)}</span>&nbsp;
          </h1>
          <p className='mx-auto text-lg text-blueGray-400'>
            <span>{t(`page:Conference_offer_today_1`)}</span>&nbsp;
            <span className='text-mainBlue'>{t(`page:Conference_offer_today_2`)}</span>&nbsp;
            <span>{t(`page:Conference_offer_today_3`)}</span>&nbsp;
          </p>
        </div>
      </div>

      <div className='mx-auto grid grid-cols-3 px-4 sm:px-36 mt-4'>
        <div className='mx-auto grid grid-cols-1 col-span-1'>
          <div className='mt-0 sm:mx-auto sm:max-w-3xl sm:px-0 h-full flex items-center justify-center'>
            <Image
              src='/assets/conference1.png'
              alt='hero'
              height={600}
              width={600}
              layout='intrinsic'
              objectFit='contain'
            />
          </div>
        </div>
        <div className='mx-auto grid grid-cols-1 col-span-2'>
          <div className='mt-0 sm:mt-8'>
            <h1 className='text-2xl pt-4 pl-2 sm:text-5xl font-extrabold text-mainText tracking-tight'>
              {t('page:Conference_opportunity_speakers')}
            </h1>
            <span className='font-light text-base my-2'>
              <ul className='checkmark'>
                <li className='font-normal text-xs sm:text-xl font-bold '>
                  {t('page:Conference_opportunity_speakers_1')}
                </li>
                <li className='font-normal text-xs sm:text-xl font-bold '>
                  {t('page:Conference_opportunity_speakers_2')}
                </li>
                <li className='font-normal text-xs sm:text-xl font-bold '>
                  {t('page:Conference_opportunity_speakers_3')}
                </li>
              </ul>
            </span>
          </div>
        </div>
      </div>

      <div className='mx-auto grid grid-cols-3 px-4 mt-4 sm:mt-0 sm:px-36'>
        <div className='mx-auto grid grid-cols-1 col-span-2'>
          <div className='mt-0 sm:mt-24'>
            <h1 className='pt-4 pl-2 text-2xl sm:text-5xl font-extrabold text-mainText tracking-tight'>
              {t('page:Conference_opportunity_exhibitors')}
            </h1>
            <span className='font-light text-base my-6'>
              <ul className='checkmark'>
                <li className='font-normal text-xs sm:text-xl font-bold '>
                  {t('page:Conference_opportunity_exhibitors_1')}
                </li>
                <li className='font-normal text-xs sm:text-xl font-bold '>
                  {t('page:Conference_opportunity_exhibitors_2')}
                </li>
              </ul>
            </span>
          </div>
        </div>
        <div className='mx-auto grid grid-cols-1 col-span-1'>
          <div className='mt-0 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full flex items-center justify-center'>
            <Image
              src='/assets/conference2.png'
              alt='hero'
              height={392}
              width={392}
              layout='intrinsic'
              objectFit='contain'
            />
          </div>
        </div>
      </div>
      <div className='mx-auto grid grid-cols-3 px-4 sm:px-36'>
        <div className='mx-auto grid grid-cols-1 col-span-1'>
          <div className='mt-0 sm:mx-auto sm:max-w-3xl sm:px-0 h-full flex items-center justify-center'>
            <Image
              src='/assets/conference3.png'
              alt='hero'
              height={392}
              width={392}
              layout='intrinsic'
              objectFit='contain'
            />
          </div>
        </div>
        <div className='mx-auto grid grid-cols-1 col-span-2'>
          <div className='mt-0 sm:mt-24'>
            <h1 className='text-2xl pt-4 pl-2 sm:text-5xl font-extrabold text-mainText tracking-tight'>
              {t('page:Conference_opportunity_sponsors')}
            </h1>
            <span className='font-light text-base my-2'>
              <ul className='checkmark'>
                <li className='font-normal text-xs sm:text-xl font-bold '>
                  {t('page:Conference_opportunity_sponsors_1')}
                </li>
                <li className='font-normal text-xs sm:text-xl font-bold '>
                  {t('page:Conference_opportunity_sponsors_2')}
                </li>
              </ul>
            </span>
          </div>
        </div>
      </div>

      <div className='mx-auto grid grid-cols-3 px-4 mt-4 sm:mt-0 sm:px-36'>
        <div className='mx-auto grid grid-cols-1 col-span-2'>
          <div className='mt-0 sm:mt-24'>
            <h1 className='pt-4 pl-2 text-2xl sm:text-5xl font-extrabold text-mainText tracking-tight'>
              {t('page:Conference_opportunity_attendees')}
            </h1>
            <span className='font-light text-base my-6'>
              <ul className='checkmark'>
                <li className='font-normal text-xs sm:text-xl font-bold '>
                  {t('page:Conference_opportunity_attendees_1')}
                </li>
                <li className='font-normal text-xs sm:text-xl font-bold '>
                  {t('page:Conference_opportunity_attendees_2')}
                </li>
              </ul>
            </span>
          </div>
        </div>
        <div className='mx-auto grid grid-cols-1 col-span-1'>
          <div className='mt-0 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full flex items-center justify-center'>
            <Image
              src='/assets/conference4.png'
              alt='hero'
              height={600}
              width={600}
              layout='intrinsic'
              objectFit='contain'
            />
          </div>
        </div>
      </div>
      <div className='mx-auto bg-black grid grid-cols-1 sm:grid-cols-3 mt-4 gap-4 px-6 sm:px-20 pt-4 pb-4'>
        <div className='mx-auto grid grid-cols-1 sm:grid-cols-1 gap-4 mt-8 mb-8 pt-0 col-span-2'>
          <h1 className='text-xl sm:text-3xl font-extrabold text-white tracking-tight'>
            {t('page:Conference_arranging')}
          </h1>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-1 pt-0 mt-0 mx-0'>
          <div className='mt-0 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full flex items-center justify-center'>
            <Button
              type='button'
              href={`https://30mins.com/sales`}
              text={t('page:Conference_book_time')}
              className='inline-flex mr-3 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Conference;
