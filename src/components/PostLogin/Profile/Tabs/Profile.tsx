import {useContext} from 'react';
import {UserContext} from '@context/user';
import Loader from 'components/shared/Loader/Loader';
import MainCard from './Profile/MainCard';
import Socials from './Profile/Socials';
import Organizations from './Profile/Organizations';
import Calendars from './Profile/Calendars';
import Extensions from './Profile/Extension';
import PaymentMethods from './Profile/PaymentMethods';
import VerifiedAccountNotice from './Profile/VerifiedAccountNotice';

const Profile = ({user, userServices, credentials, extensionsArray}) => {
  const User = user?.data?.getUserById?.userData;
  const {user: contextUser} = useContext(UserContext);
  const {googleCredentials, officeCredentials} = credentials;
  const hasIntegrations =
    (googleCredentials && googleCredentials?.length > 0) ||
    (officeCredentials && officeCredentials?.length > 0);

  if (!contextUser) {
    return <Loader />;
  }

  return (
    <div className='mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 px-0 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3 mb-36'>
      <div className='space-y-6 lg:col-start-1 lg:col-span-2'>
        <MainCard User={User} hasIntegrations={hasIntegrations} userServices={userServices} />
      </div>

      <section
        aria-labelledby='profile-info'
        className='lg:col-start-3 lg:col-span-1 flex flex-col gap-4'
      >
        {!contextUser?.verifiedAccount ? <VerifiedAccountNotice /> : null}
        <Socials User={User} />
        <Organizations fromDashboard={false} hasOrgExtension={false} showInvitedOrgs={false} />
        <Extensions extensionsArray={extensionsArray} />
        <Calendars
          credentials={credentials}
          hasIntegrations={hasIntegrations}
          fromDashboard={false}
        />
        <PaymentMethods User={User} fromDashboard={false} />
      </section>
    </div>
  );
};
export default Profile;
