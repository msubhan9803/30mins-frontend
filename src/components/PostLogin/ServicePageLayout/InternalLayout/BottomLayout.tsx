import {SERVICE_TYPES} from 'constants/enums';
import dynamic from 'next/dynamic';
import ReactPlayer from 'react-player';
import useTranslation from 'next-translate/useTranslation';
import Publications from 'components/PreLogin/Username/Publications';
import Education from 'components/PreLogin/Username/Education';
import JobHistory from 'components/PreLogin/Username/JobHistory';

const BottomLayout = ({serviceData, user}) => {
  const {t} = useTranslation();

  const serviceType = serviceData?.serviceType;
  const userPublications = user?.publications;
  const userEducation = user?.educationHistory?.sort(
    (a: any, b: any) => new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf()
  );
  const userJobHistory = user?.jobHistory?.sort(
    (a: any, b: any) => new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf()
  );

  const ReactSlides = dynamic(() => import('react-google-slides'), {
    ssr: false,
  });
  return (
    <>
      {(serviceType === SERVICE_TYPES.FULL_TIME_JOB ||
        serviceType === SERVICE_TYPES.PART_TIME_JOB) &&
      userPublications &&
      userPublications.length > 0 ? (
        <div className='w-full mt-5'>
          <div className='container mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between'>
            <div className='container mx-auto'>
              <h1 className='ml-2 mb-2 text-3xl font-bold text-gray-900'>
                {t('common:Publications')}
              </h1>
              <div className='w-full rounded '>
                {userPublications.map((item, key) => (
                  <div className='bg-white shadow rounded  mb-4 xl:flex lg:flex w-full' key={key}>
                    <Publications key={key} item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {(serviceType === SERVICE_TYPES.FULL_TIME_JOB ||
        serviceType === SERVICE_TYPES.PART_TIME_JOB) &&
      userEducation &&
      userEducation.length > 0 ? (
        <div className='w-full mt-5'>
          <div className='container mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between'>
            <div className='container mx-auto'>
              <h1 className='ml-2 mb-2 text-3xl font-bold text-gray-900'>
                {t('common:Education')}
              </h1>
              <div className='w-full rounded '>
                {userEducation.map((item, key) => (
                  <div className='bg-white shadow rounded mb-4 xl:flex lg:flex w-full' key={key}>
                    <Education key={key} item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {(serviceType === SERVICE_TYPES.FULL_TIME_JOB ||
        serviceType === SERVICE_TYPES.PART_TIME_JOB) &&
      userJobHistory &&
      userJobHistory.length > 0 ? (
        <div className='w-full mt-5'>
          <div className='container mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between'>
            <div className='container mx-auto'>
              <h1 className='ml-2 mb-2 text-3xl font-bold text-gray-900'>
                {t('common:Job History')}
              </h1>
              <div className='w-full rounded '>
                {userJobHistory.map((item, key) => (
                  <div className='bg-white shadow rounded mb-4 xl:flex lg:flex w-full' key={key}>
                    <JobHistory key={key} item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {serviceData?.media?.link &&
        serviceData?.media?.type === 'Google Slides' &&
        /https:\/\/docs\.google\.com\/presentation\/d\/(.*?)\/.*?\?usp=sharing/g.test(
          serviceData?.media?.link
        ) && (
          <div className='w-full h-full my-8'>
            <ReactSlides
              height='640'
              width='100%'
              slideDuration={5}
              position={1}
              showControls
              loop
              slidesLink={serviceData?.media?.link}
            />
          </div>
        )}

      {serviceData?.media?.link && serviceData?.media?.type === 'Youtube Embed' ? (
        <div
          className='relative flex justify-center flex-wrap w-full overflow-hidden my-8'
          style={{
            height: '0',
            paddingBottom: '56.25%',
          }}
        >
          <ReactPlayer url={`${serviceData?.media?.link}`} />
        </div>
      ) : null}
    </>
  );
};

export default BottomLayout;
