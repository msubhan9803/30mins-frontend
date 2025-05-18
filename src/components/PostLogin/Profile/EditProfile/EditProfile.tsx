import Tabs from 'components/PostLogin/Tabs/Tab';
import {SUMMARY_TABS, TABS, TABS_TYPES} from 'constants/context/tabs';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import GeneralEdit from '../Tabs/General';
import SocialLinks from '../Tabs/Socials';
import ChangeEmail from '../Tabs/ChangeEmail';

const EditProfile = ({userData}) => {
  const [currentTab, setTab] = useState(TABS.general);
  const router = useRouter();
  const {tab} = router.query;

  useEffect(() => {
    if (tab) {
      setTab(tab as string);
    }
  }, [tab]);

  const tabsContent = {
    [tab === TABS_TYPES.editProfile ? TABS.general : TABS.general]: (
      <GeneralEdit userData={userData} />
    ),
    [tab === TABS_TYPES.editProfile ? TABS.social : TABS.social]: (
      <SocialLinks userData={userData} />
    ),
    [tab === TABS_TYPES.editProfile ? TABS.email : TABS.email]: <ChangeEmail />,
  };

  return (
    <>
      <div className='flex justify-start'>
        <Tabs
          openedTab={currentTab}
          tabsNames={SUMMARY_TABS.editProfile}
          onChange={(tabName: string) => setTab(tabName)}
        />
      </div>
      {tabsContent[currentTab]}
    </>
  );
};
export default EditProfile;
