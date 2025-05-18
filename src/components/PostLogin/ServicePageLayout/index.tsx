import React from 'react';
import {SERVICE_TYPES} from 'constants/enums';
import ProfileLayout from './InternalLayout/ProfileLayout';
import MFServiceLayout from './InternalLayout/MFServiceLayout';
import FullTimeLayout from './InternalLayout/FullTimeLayout';
import PartTimeLayout from './InternalLayout/PartTimeLayout';
import BottomLayout from './InternalLayout/BottomLayout';

const ServiceLayout = ({serviceData, providerUser, bookerUser}) => {
  const renderServiceType = (serviceType: SERVICE_TYPES) => {
    switch (serviceType) {
      case SERVICE_TYPES.FULL_TIME_JOB:
        return <FullTimeLayout providerUser={providerUser} serviceData={serviceData} />;
      case SERVICE_TYPES.PART_TIME_JOB:
        return <PartTimeLayout providerUser={providerUser} serviceData={serviceData} />;
      default:
        return (
          <MFServiceLayout
            providerUser={providerUser}
            serviceData={serviceData}
            bookerUser={bookerUser}
          />
        );
    }
  };

  return (
    <>
      <div className='w-full h-full'>
        <div className='container p-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between h-full'>
          <div className='bg-white h-max self-start shadow rounded w-full'>
            <div className='lg:flex'>
              <ProfileLayout user={providerUser} />
              {renderServiceType(serviceData?.serviceType)}
            </div>
            <BottomLayout user={providerUser} serviceData={serviceData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceLayout;
