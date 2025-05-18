import {Formik} from 'formik';
import SwitchScreens from './screens/components/SwitchScreens';

type IProps = {
  organization: any;
  context?: any;
  handleDisableSelect?: (check: boolean) => void;
};

const RoundRobin = ({organization, context, handleDisableSelect}: IProps) => (
  <Formik initialValues={{organizationID: ''}} onSubmit={() => {}} enableReinitialize={true}>
    {({values, setFieldValue}) => (
      <div className='overflow-hidden relative w-full h-max shadow-md rounded'>
        <SwitchScreens
          values={values}
          setFieldValue={setFieldValue}
          organization={organization}
          context={context}
          handleDisableSelect={handleDisableSelect}
        />
      </div>
    )}
  </Formik>
);
export default RoundRobin;
