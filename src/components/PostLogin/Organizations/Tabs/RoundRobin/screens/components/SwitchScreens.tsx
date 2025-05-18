import {memo, useRef, useState} from 'react';
import {SUMMARY_TABS} from 'constants/context/tabs';
import CurrentTeamsAndServices from '../Tabs/CurrentTeamsAndServices';
import ManageService from '../Tabs/ManageService';
import ManageTeam from '../Tabs/ManageTeam';

type IProps = {
  values: any;
  setFieldValue: any;
  organization: any;
  context?: any;
  handleDisableSelect?: (check: boolean) => void;
};

const SwitchScreens = ({
  values,
  setFieldValue,
  organization,
  context,
  handleDisableSelect,
}: IProps) => {
  const [index, setIndex] = useState(0);
  const refswitch = useRef<any>();

  const SwitchTab = tabName => {
    if (SUMMARY_TABS.roundRobinManagement.indexOf(tabName) > index) {
      refswitch.current.className = 'animate-fadeOutLeft duration-200';
      setTimeout(() => {
        setIndex(SUMMARY_TABS.roundRobinManagement.indexOf(tabName));
        refswitch.current.className = 'relative animate-fadeInRight h-max duration-200';
      }, 200);
    } else {
      refswitch.current.className = 'animate-fadeOutRight duration-200';
      setTimeout(() => {
        setIndex(SUMMARY_TABS.roundRobinManagement.indexOf(tabName));
        refswitch.current.className = 'relative animate-fadeInLeft h-max duration-200';
      }, 200);
    }

    handleDisableSelect?.(tabName === 'ManageTeam');
  };

  const Tabs = [
    <CurrentTeamsAndServices
      key={1}
      values={values}
      SwitchTab={SwitchTab}
      setFieldValue={setFieldValue}
      organization={organization}
      context={context}
    />,
    <ManageService
      key={2}
      values={values}
      SwitchTab={SwitchTab}
      setFieldValue={setFieldValue}
      organization={organization}
    />,
    <ManageTeam
      key={3}
      values={values}
      SwitchTab={SwitchTab}
      setFieldValue={setFieldValue}
      organization={organization}
    />,
  ];

  return (
    <div ref={refswitch} className='relative flex animate-fadeInRight min-h-full duration-200'>
      {Tabs[index]}
    </div>
  );
};

export default memo(SwitchScreens);
