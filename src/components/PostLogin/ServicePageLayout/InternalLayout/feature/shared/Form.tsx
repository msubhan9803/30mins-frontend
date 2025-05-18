import {LoaderIcon} from 'react-hot-toast';
import {FormikErrors} from 'formik';

// forms
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import ContactInfo from '../meeting/step-forms/contact-info';
import Payment from '../meeting/step-forms/payment';
import AnyAdditionalInformation from '../meeting/step-forms/any-additional-information';
import ConferenceType from '../meeting/step-forms/conference-type';
import PreBookingQuestions from '../meeting/step-forms/pre-booking-questions';

import {Iaction, IinitialValues} from '../meeting/constants';
import Stepper from '../meeting/stepper';
import {SERVICE_TYPES} from '../../../../../../constants/enums';

dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  values: IinitialValues;
  loading: boolean;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  move: (action: Iaction, step: number) => void;
  handleChange(e: React.ChangeEvent<any>): void;
  setFieldError: (field: string, value: string | undefined) => void;
  errors: FormikErrors<IinitialValues>;
  errMsg: String;
  providerUser: any;
};

const Form = ({
  setFieldValue,
  loading,
  values,
  move,
  errors,
  handleChange,
  setFieldError,
  errMsg,
  providerUser,
}: IProps) => {
  const defaultProps = {setFieldValue, values, errors, handleChange, setFieldError, providerUser};
  const Tabs = {
    'contact-info': <ContactInfo {...defaultProps} />,
    'conference-type': <ConferenceType {...defaultProps} />,
    'pre-booking-questions': <PreBookingQuestions {...defaultProps} />,
    'any-additional-information': <AnyAdditionalInformation {...defaultProps} />,
    payment: <Payment {...defaultProps} errMsg={errMsg} move={move} />,
  };

  return (
    <div className='w-full h-max'>
      {!loading ? (
        <>
          {[SERVICE_TYPES.MEETING.toString(), SERVICE_TYPES.ROUND_ROBIN.toString()].includes(
            values.serviceData.serviceType
          ) ? (
            <div
              className={
                'justify-center w-full flex sm:justify-start font-bold text-xl text-gray-600'
              }
            >
              {dayjs(values.selectedTime).format('MMM DD, YYYY, hh:mm A')} -{' '}
              {values.selectedBookerTimezone}
            </div>
          ) : null}

          {values.serviceData.serviceType === 'EVENT' && (
            <div
              className={
                'justify-center w-full flex sm:justify-start font-bold text-xl text-gray-600'
              }
            >
              {dayjs(values?.attendingDateTime).format('MMM. DD YYYY - h:mmA')}
            </div>
          )}

          <Stepper
            setFieldValue={setFieldValue}
            move={move}
            type={values.serviceData.serviceType}
            values={values}
            setFieldError={setFieldError}
          />
          <div className='pb-20' ref={ref => ref?.scrollIntoView()}>
            {Tabs[values.STEPS[values.step]]}
          </div>
        </>
      ) : (
        <LoaderIcon style={{width: '50px', height: '50px'}} className='my-20 m-auto' />
      )}
    </div>
  );
};
export default Form;
