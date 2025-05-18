import {SERVICE_TYPES} from 'constants/enums';
import JobCard from '../components/JobCard';

const FullTimeLayout = ({serviceData, providerUser}) => (
  <JobCard
    user={providerUser}
    serviceData={serviceData}
    serviceType={SERVICE_TYPES.FULL_TIME_JOB}
  />
);

export default FullTimeLayout;
