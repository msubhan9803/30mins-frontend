import router from 'next/router';
import {useSession} from 'next-auth/react';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/User/mutations';
import {useFormik} from 'formik';
import WorkingHoursForm from '@features/users/working-hours-form';
import useTranslation from 'next-translate/useTranslation';
import {useContext, useEffect, useState} from 'react';
import Button from '@root/components/button';
import {UserContext} from '@root/context/user';
import {LoaderIcon, toast} from 'react-hot-toast';
import TimezoneSelect from 'react-timezone-select';

const DefaultHours = () => {
  const {data: session} = useSession();
  const {user} = useContext(UserContext);
  const {t} = useTranslation();
  const [updateWorkingHours] = useMutation(mutations.updateWorkingHours);
  const [updateUser] = useMutation(mutations.updateUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timezone, setTimeZone] = useState(user?.timezone ? user.timezone : '');
  const handleTimezone = async ({value}) => {
    setTimeZone(value);
    await updateUser({
      variables: {
        userData: {locationDetails: {timezone: value}},
        token: session?.accessToken,
      },
    });
  };
  const omitTypename = (key, value) => (key === '__typename' ? undefined : value);
  // Formik Initialization
  const {values, errors, setFieldValue, submitForm} = useFormik({
    initialValues: {
      availabilityDays:
        user?.workingHours && JSON.parse(JSON?.stringify(user?.workingHours), omitTypename),
      isValid: undefined,
    },
    enableReinitialize: false,
    onSubmit: async () => {
      try {
        if (values?.isValid) {
          toast.error(t(`common:${values?.isValid}`));
          return;
        }
        setIsSubmitting(true);
        await updateWorkingHours({
          variables: {
            workingHours: {
              isCustomEnabled: true,
              monday: values.availabilityDays.monday,
              tuesday: values.availabilityDays.tuesday,
              wednesday: values.availabilityDays.wednesday,
              thursday: values.availabilityDays.thursday,
              friday: values.availabilityDays.friday,
              saturday: values.availabilityDays.saturday,
              sunday: values.availabilityDays.sunday,
            },
            token: session?.accessToken,
          },
        });
        setIsSubmitting(false);
        router.reload();
      } catch (err) {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (user?.workingHours) {
      setFieldValue(
        'availabilityDays',
        JSON.parse(JSON?.stringify(user?.workingHours), omitTypename)
      );
    }
    if (user?.timezone) {
      setTimeZone(user?.timezone);
    }
  }, [user?.workingHours]);

  if (!user?.workingHours)
    return (
      <div className='w-full h-full flex flex-1 justify-center items-center'>
        <LoaderIcon style={{width: 32, height: 32}} />
      </div>
    );
  return (
    <div className={'py-4'}>
      <div className='mb-4 flex flex-wrap flex-row justify-between items-center space-y-5'>
        <TimezoneSelect
          value={timezone}
          onChange={handleTimezone}
          labelStyle='abbrev'
          className='mt-1 space-y-4 md:max-w-[300px] grow timezone-wrapper'
        />
        <Button
          variant='solid'
          type='submit'
          className='w-full md:w-32'
          onClick={submitForm}
          disabled={isSubmitting}
        >
          {isSubmitting ? t('common:btn_saving') : t('common:btn_save')}
        </Button>
      </div>

      <WorkingHoursForm
        handleChange={setFieldValue}
        setFieldValue={setFieldValue}
        errors={errors}
        availabilityDays={values.availabilityDays}
      />
    </div>
  );
};

export default DefaultHours;
