import {useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import FormDisplay from './FormDisplay';

dayjs.extend(relativeTime);

enum FormTypes {
  NONE = 'NONE',
  LINK_USER_TO_ORGANIZATION = 'LINK_USER_TO_ORGANIZATION',
  RESET_WELCOME = 'RESET_WELCOME',
  ADD_AFFILIATE = 'ADD_AFFILIATE',
  MAKE_USER_VERIFIED = 'MAKE_USER_VERIFIED',
}

const Miscellaneous = () => {
  const [displayingForm, setDisplayingForm] = useState(FormTypes.NONE);

  return (
    <div>
      <FormDisplay
        setDisplayingForm={setDisplayingForm}
        displayingForm={displayingForm}
        formTypes={FormTypes}
      />
    </div>
  );
};

export default Miscellaneous;
