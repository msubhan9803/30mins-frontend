import useTranslation from 'next-translate/useTranslation';
import CenteredContainer from 'components/shared/Container/CenteredContainer';
import Layout from 'components/Layout/PreLogin';
import HeadSeo from 'components/shared/HeadSeo/Seo';

const HowPaymentsWork = () => {
  const {t} = useTranslation();

  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/howpaymentswork/'}
        description={t('page:privacy_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${t('page:How_Payments_Work')} | 30mins`}
      />
      <div className='px-8 py-12 flex flex-col gap-8'>
        <CenteredContainer className='containerCenter gap-8'>
          <h1 className='headerLg font-bold'>{t('page:How_Payments_Work')}</h1>
          <p>{t('page:HPM_details_1')}</p>
          <div id='direct'>
            <h3 className='header font-bold'>{t('page:HPM_Direct')}</h3>
            <div className='grid grid-cols-1 sm:grid-cols-4'>
              <div className='col-span-1 sm:col-span-1'>
                <img className='h-48' src='/icons/services/direct.svg' alt='ESCROW' />
              </div>
              <div className='col-span-1 sm:col-span-3 items-center justify-center'>
                <br />
                <p>{t('page:HPM_direct_details_1')}</p>
                <br />
                <p>{t('page:HPM_direct_details_2')}</p>
                <br />
                <p>{t('page:HPM_direct_details_3')}</p>
                <br />
                <p>{t('page:HPM_direct_details_4')}</p>
              </div>
            </div>
          </div>

          <div id='escrow'>
            <h3 className='header font-bold'>{t('page:HPM_Escrow')}</h3>
            <div className='grid grid-cols-1 sm:grid-cols-4'>
              <div className='col-span-1 sm:col-span-1'>
                <img className='h-48' src='/icons/services/escrow.svg' alt='ESCROW' />
              </div>
              <div className='col-span-1 sm:col-span-3'>
                <br />
                <p>{t('page:HPM_escrow_details_1')}</p>
                <br />
                <p>{t('page:HPM_escrow_details_2')}</p>
                <br />
                <p>{t('page:HPM_escrow_details_3')}</p>
                <br />
                <p>{t('page:HPM_escrow_details_4')}</p>
              </div>
            </div>
          </div>

          <div id='manual'>
            <h3 className='header font-bold'>{t('page:HPM_Manual')}</h3>
            <div className='grid grid-cols-1 sm:grid-cols-4'>
              <div className='col-span-1 sm:col-span-1'>
                <img className='h-48' src='/icons/services/manual.svg' alt='ESCROW' />
              </div>
              <div className='col-span-1 sm:col-span-3'>
                <br />
                <p>{t('page:HPM_manual_details_1')}</p>
                <br />
                <p>{t('page:HPM_manual_details_2')}</p>
                <br />
                <p>{t('page:HPM_manual_details_3')}</p>
                <br />
                <p>{t('page:HPM_manual_details_4')}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <h3 className='header font-bold'>{t('page:Payment_Disputes')}</h3>
            <p>{t('page:Please_email_us_disputes')}</p>
          </div>
        </CenteredContainer>
      </div>
    </Layout>
  );
};

export default HowPaymentsWork;
