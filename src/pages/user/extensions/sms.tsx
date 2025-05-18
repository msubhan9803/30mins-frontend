import {GetServerSideProps} from 'next';
import Head from 'next/head';
import {useSession} from 'next-auth/react';
import Header from '@components/header';
import PostLoginLayout from '@components/layout/post-login';
import useTranslation from 'next-translate/useTranslation';
import {Field, Form, Formik} from 'formik';
import {isValidPhoneNumber} from 'react-phone-number-input';
import PhoneInput from 'react-phone-input-2';
import Button from '@components/button';
import {useMutation} from '@apollo/client';
import {FieldError} from '@components/forms/error';
import {useRouter} from 'next/router';
import {Elements} from '@stripe/react-stripe-js';
import React from 'react';
import userMutations from '../../../constants/GraphQL/User/mutations';
import stripeProductIDs from '../../../constants/stripeProductIDs';
import {MODAL_TYPES} from '../../../constants/context/modals';
import {ModalContextProvider} from '../../../store/Modal/Modal.context';
import getUserExtensionsData from '../../../utils/extensions/getUserExtensionsData';
import getStripe from '../../../utils/getStripe';
import ExtensionsInfoContainer from '../../../components/PostLogin/Extensions/SingleExtensionPage/ExtensionsInfoContainer';

const SmsExtensionPage = ({
  hasExtension,
  remindersEnabled,
  currentSmsPhone,
  prices,
  paymentMethods,
  customerId,
  activeExtensions,
  giftedExtensions,
  discount,
}) => {
  const {data: session} = useSession();
  const router = useRouter();
  const {showModal} = ModalContextProvider();
  const {t} = useTranslation();
  const [sendSmsOtpMutation] = useMutation(userMutations.sendSmsOtp);
  const [updateUser] = useMutation(userMutations.updateUser);

  const extensionIds = [stripeProductIDs.EXTENSIONS.SMS_REMINDER];

  const displayPriceData = prices.filter(
    price => price.id === stripeProductIDs.EXTENSIONS.SMS_REMINDER
  )[0];

  const displayPrices = prices.filter(price => extensionIds.includes(price.id));

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Extensions'), href: '/user/extensions'},
    {title: t(`page:SMS Reminder`), href: `/user/extensions/sms`},
  ];

  const submitHandler = async values => {
    await sendSmsOtpMutation({
      variables: {
        phone: values.phone,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });

    showModal(MODAL_TYPES.VERIFY_SMS_OTP, {phone: values.phone});
  };

  const preferenceHandler = async value => {
    await updateUser({
      variables: {
        token: session?.accessToken,
        userData: {
          accountDetails: {
            smsSettings: {
              reminders: value,
            },
          },
        },
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });

    router.reload();
  };

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:SMS Reminder')}</title>
      </Head>

      <Header crumbs={crumbs} heading={t('page:SMS Reminder')} />
      <Elements stripe={getStripe()}>
        <ExtensionsInfoContainer
          title={t(`page:SMS Reminder`)}
          description={displayPriceData?.product?.description}
          image={displayPriceData?.product?.images[0]}
          customerId={customerId}
          activeExtensions={activeExtensions}
          giftedExtensions={giftedExtensions}
          paymentMethods={paymentMethods}
          prices={displayPrices}
          discount={discount}
        />
      </Elements>

      {hasExtension ? (
        <Formik
          initialValues={{phone: currentSmsPhone, remindersEnabled, PhoneValid: true}}
          onSubmit={async values => submitHandler(values)}
        >
          {({setFieldValue, setFieldError, values}) => (
            <div className={'gap-2 grid grid-col-1 sm:grid-cols-2'}>
              <Form className={'flex flex-col gap-2 col-span-1'}>
                <div>
                  <PhoneInput
                    inputStyle={{width: '100%', padding: '22px 50px'}}
                    onlyCountries={['us']}
                    value={currentSmsPhone}
                    country={'us'}
                    onChange={(_, country1: any, {target: {value}}) => {
                      const {countryCode} = country1;
                      if (isValidPhoneNumber(value ? value : '', countryCode)) {
                        setFieldValue('PhoneValid', true);
                        setFieldError('phone', undefined);
                      } else {
                        setFieldValue('PhoneValid', false);
                        setFieldError('phone', 'Invalid Phone Number');
                      }
                      setFieldValue('phone', value);
                    }}
                  />
                  {!values.PhoneValid ? <FieldError message={t('common:invalid_phone')} /> : null}
                </div>
                <Button type={'submit'} variant={'solid'} disabled={values.PhoneValid === false}>
                  {t('common:update_phone')}
                </Button>
                <div className={'flex gap-4 items-center py-4'}>
                  <Field
                    type='checkbox'
                    name='remindersEnabled'
                    className={
                      'focus:ring-transparent h-5 w-5 text-mainBlue border-gray-300 rounded cursor-pointer'
                    }
                  />
                  <label>{t('common:send_sms_warning')}</label>
                </div>
                <Button
                  type={'button'}
                  variant={'solid'}
                  onClick={async () => preferenceHandler(values.remindersEnabled)}
                >
                  {t('common:update_preferences')}
                </Button>
              </Form>
            </div>
          )}
        </Formik>
      ) : (
        <div className='text-center mt-4'>
          <span className='text-gray-500 text-2xl'>
            {t('common:This feature requires the SMS Extension to be active')}
          </span>
        </div>
      )}
    </PostLoginLayout>
  );
};

export default SmsExtensionPage;

SmsExtensionPage.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const {props: extensionsProps} = await getUserExtensionsData(context);

    const hasExtension = extensionsProps?.userData?.accountDetails?.activeExtensions.includes(
      stripeProductIDs.EXTENSIONS.SMS_REMINDER
    );

    return {
      props: {
        hasExtension,
        remindersEnabled:
          extensionsProps?.userData?.accountDetails?.smsSettings?.reminders || false,
        currentSmsPhone: extensionsProps?.userData?.accountDetails?.smsSettings?.phone || '',
        ...extensionsProps,
      },
    };
  } catch (err) {
    return {
      props: {
        errors: 'Unknown Error',
        hasExtension: false,
        remindersEnabled: false,
        currentSmsPhone: '',
      },
    };
  }
};
