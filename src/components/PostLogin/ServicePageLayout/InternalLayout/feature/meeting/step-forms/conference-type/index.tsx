import classNames from 'classnames';
import {RadioGroup} from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import {CheckCircleIcon, XCircleIcon} from '@heroicons/react/20/solid';
import {IFormProps} from '../../constants';

export default function ConferenceType({setFieldValue, values}: IFormProps) {
  const {t} = useTranslation();
  const {serviceData} = values;

  // conferenceType
  const conferenceTypeOptions = {
    inPerson: {title: 'in_person', img: '/icons/services/MEETING.svg'},
    onPhone: {title: 'on_phone', img: '/icons/services/on_phone.svg'},
    googleMeet: {title: 'googleMeet', img: '/icons/services/google_meet.svg'},
    skypeForBusiness: {title: 'skypeForBusiness', img: '/icons/services/skypeForBusiness.svg'},
    skypeForConsumer: {title: 'skypeForConsumer', img: '/icons/services/skypeForConsumer.svg'},
    teamsForBusiness: {title: 'teamsForBusiness', img: '/icons/services/teamsForBusiness.svg'},
    zoom: {title: 'zoom', img: '/icons/services/zoom.svg'},
  };

  return (
    <div className='flex flex-wrap justify-evenly gap-y-2 sm:justify-start'>
      {serviceData.conferenceType.map((item, i) => (
        <RadioGroup
          key={i}
          value={values.bookingData.conferenceType}
          onChange={() => {
            setFieldValue('bookingData.conferenceType', item);
          }}
          className='flex flex-col gap-2 mr-0 sm:mr-10 hover:ring-1 hover:rounded-lg w-36 hover:shadow-md'
        >
          <RadioGroup.Option value={item} className={'cursor-pointer'}>
            {({checked}) => (
              <RadioGroup.Label
                className={classNames([
                  'flex flex-col items-center gap-2',
                  checked && 'ring-1 rounded-lg w-36 shadow-sm',
                ])}
              >
                <img alt='' className='w-16 md:w-20' src={conferenceTypeOptions[item].img} />
                <span className='text-black text-center'>
                  {t(`common:${conferenceTypeOptions[item].title}`)}
                </span>
                {checked ? (
                  <CheckCircleIcon className='w-8 text-green-600' />
                ) : (
                  <XCircleIcon className='w-8 text-gray-400' />
                )}
              </RadioGroup.Label>
            )}
          </RadioGroup.Option>
        </RadioGroup>
      ))}
    </div>
  );
}
