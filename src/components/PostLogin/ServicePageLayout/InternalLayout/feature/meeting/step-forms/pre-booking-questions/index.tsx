import {IFormProps} from '../../constants';

// Questions components
import CheckBoxQ from './components/check-box-q';
import DropDownQ from './components/drop-down-q';
import FreeTextQ from './components/free-text-q';
import RadioQ from './components/radio-q';

export default function PreBookingQuestions({...props}: IFormProps) {
  const setQuestion = (item, index) => {
    const DefaultProps = {...item, index, ...props};
    switch (item.questionType) {
      case 'CHECKBOX':
        return <CheckBoxQ {...DefaultProps} />;
      case 'DROPDOWN':
        return <DropDownQ {...DefaultProps} />;
      case 'FREE_TEXT':
        return <FreeTextQ {...DefaultProps} />;
      case 'RADIO':
        return <RadioQ {...DefaultProps} />;
      default:
        return <></>;
    }
    return <></>;
  };

  return (
    <div className='w-full flex flex-col gap-4 pt-8 pb-8 px-0'>
      {(
        props.values.serviceData?.bookingQuestions ?? props.values.serviceData?.serviceQuestionsList
      ).map((item, index) => setQuestion(item, index))}
    </div>
  );
}
