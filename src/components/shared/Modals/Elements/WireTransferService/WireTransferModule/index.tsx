import useTranslation from 'next-translate/useTranslation';
import {BankDetails, UserContext, WireDetails} from '@root/context/user';
import {useContext, useState} from 'react';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import {useFormik} from 'formik';
import Button from '@root/components/button';
import {object, ref, string} from 'yup';
import {FieldError} from '@root/components/forms/error';
import mutations from 'constants/GraphQL/User/mutations';
import {isValidPhoneNumber} from 'react-phone-number-input';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';

export default function WireModule({userStripeAccount, onSubmit}) {
  const {t} = useTranslation('common');
  const {data: session} = useSession();
  const [countryCode, setcountryCode] = useState('us');
  const {user, refetchUser} = useContext(UserContext);
  const [updateUser] = useMutation(mutations.updateUser);
  const [PhoneValid, setPhoneValid] = useState(Boolean(user?.wireDetails?.phoneOfBank));
  const {hideModal, showModal} = ModalContextProvider();
  const [loading, setloading] = useState(false);
  const {
    values: v,
    setFieldValue: setV,
    handleChange,
    errors,
    setFieldError: setE,
    submitForm,
  } = useFormik<{wireDetails: WireDetails; bankDetails: BankDetails & {accountNumberConf}}>({
    initialValues: {
      wireDetails: {
        addressOfBank: user?.wireDetails?.addressOfBank || '',
        country: user?.wireDetails?.country || '',
        nameOnBank: user?.wireDetails?.nameOnBank || '',
        phoneOfBank: user?.wireDetails?.phoneOfBank || '',
      },
      bankDetails: {
        accountNumber: user?.bankDetails?.accountNumber || '',
        bankAddress: user?.bankDetails?.bankAddress || '',
        bankName: user?.bankDetails?.bankName || '',
        accountNumberConf: user?.bankDetails?.accountNumber || '',
        categoryAccount: user?.bankDetails?.categoryAccount || 'savings',
        currencyAccount: user?.bankDetails?.currencyAccount || '',
        typeAccount: user?.bankDetails?.typeAccount || 'personal',
        SWIFTBIC: user?.bankDetails?.SWIFTBIC || '',
      },
    },
    validationSchema: object().shape({
      bankDetails: object().shape({
        bankName: string().required().label('Name'),
        bankAddress: string().required().label('Address'),
        accountNumber: string().required().label('Account Number'),
        accountNumberConf: string()
          .required()
          .oneOf([ref('accountNumber'), null], 'Account Number must match')
          .label('Account Number Confirmation'),
        typeAccount: string().required().label('Type'),
        categoryAccount: string().required().label('Category'),
        currencyAccount: string().required().label('Currency'),
        SWIFTBIC: string().required().label('SWIFT/BIC'),
      }),
      wireDetails: object().shape({
        nameOnBank: string().required().label('Name On Bank'),
        phoneOfBank: string()
          .required()
          .test({
            test: () => (PhoneValid ? true : false),
            message: 'Phone Number is invalid',
            name: '',
            exclusive: false,
          })
          .label('Phone Of Bank'),
        addressOfBank: string().required().label('Address Of Bank'),
        country: string().required().label('Country'),
      }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      setloading(true);
      if (!PhoneValid) {
        setE('wireDetails.phoneOfBank', 'Phone Number is invalid');
      }
      delete values.bankDetails.accountNumberConf;
      await updateUser({
        variables: {
          userData: {
            ...values,
          },
          token: session?.accessToken,
        },
      });
      onSubmit && (await onSubmit());
      await refetchUser();
      setloading(false);
      hideModal();
    },
  });

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <span className='text-lg font-semibold'>{t('wire_details')}</span>
        <div className='grid grid-cols-2 gap-2 p-2'>
          <Field
            label={t('Name on Bank Account')}
            error={
              errors?.wireDetails?.nameOnBank && (
                <FieldError message={errors?.wireDetails?.nameOnBank} />
              )
            }
            required
            className='col-span-2 sm:col-span-1'
          >
            <Input
              type={'text'}
              name='wireDetails.nameOnBank'
              value={v?.wireDetails?.nameOnBank}
              handleChange={handleChange}
            />
          </Field>

          <Field
            label={t('Phone of Bank Account Holder')}
            error={
              errors?.wireDetails?.phoneOfBank && (
                <FieldError message={errors?.wireDetails?.phoneOfBank} />
              )
            }
            required
            className='col-span-2 sm:col-span-1'
          >
            <PhoneInput
              inputStyle={{width: '100%', padding: '22px 50px'}}
              value={`${v?.wireDetails?.phoneOfBank}`}
              country={countryCode}
              countryCodeEditable={false}
              onChange={(_, country: any, {target: {value}}) => {
                const {countryCode: CC} = country;
                if (countryCode !== 'us') {
                  setV('bookingData.bookerSmsReminders', false);
                }
                setcountryCode(CC);
                if (isValidPhoneNumber(value ? value : '', CC)) {
                  setPhoneValid(true);
                  setE('wireDetails.phoneOfBank', undefined);
                } else {
                  setPhoneValid(false);
                  setE('wireDetails.phoneOfBank', t('phone_number_invalid'));
                }
                setV('wireDetails.phoneOfBank', value);
              }}
              isValid={PhoneValid}
              inputProps={{
                id: 'wireDetails.phoneOfBank',
              }}
            />
          </Field>

          <Field
            label={t('Address of Bank Account Holder')}
            error={
              errors?.wireDetails?.addressOfBank && (
                <FieldError message={errors?.wireDetails?.addressOfBank} />
              )
            }
            required
            className='col-span-2 sm:col-span-1'
          >
            <Input
              type={'text'}
              name='wireDetails.addressOfBank'
              value={v?.wireDetails?.addressOfBank}
              handleChange={handleChange}
            />
          </Field>

          <Field
            label={t('Country')}
            error={
              errors?.wireDetails?.country && <FieldError message={errors?.wireDetails?.country} />
            }
            required
            className='col-span-2 sm:col-span-1'
          >
            <Input
              type={'text'}
              name='wireDetails.country'
              value={v?.wireDetails?.country}
              handleChange={handleChange}
            />
          </Field>
        </div>
      </div>

      <div>
        <span className='font-semibold text-lg'>{t('bank_information')}</span>
        <div className='grid grid-cols-2 gap-2 p-2'>
          <Field
            label={t('Bank Name')}
            required
            className='col-span-2 sm:col-span-1'
            error={
              errors?.bankDetails?.bankName && (
                <FieldError message={errors?.bankDetails?.bankName} />
              )
            }
          >
            <Input
              value={v?.bankDetails?.bankName}
              name='bankDetails.bankName'
              type={'text'}
              handleChange={handleChange}
            />
          </Field>

          <Field
            label={t('Bank Address')}
            required
            className='col-span-2 sm:col-span-1'
            error={
              errors?.bankDetails?.bankAddress && (
                <FieldError message={errors?.bankDetails?.bankAddress} />
              )
            }
          >
            <Input
              value={v?.bankDetails?.bankAddress}
              name='bankDetails.bankAddress'
              type={'text'}
              handleChange={handleChange}
            />
          </Field>

          <Field
            label={t('Account Number (IBAN)')}
            required
            className='col-span-2 sm:col-span-1'
            error={
              errors?.bankDetails?.accountNumber && (
                <FieldError message={errors?.bankDetails?.accountNumber} />
              )
            }
          >
            <Input
              value={v?.bankDetails?.accountNumber}
              name='bankDetails.accountNumber'
              type={'text'}
              handleChange={handleChange}
            />
          </Field>

          <Field
            label={t('Account Number (IBAN) again')}
            required
            className='col-span-2 sm:col-span-1'
            error={
              errors?.bankDetails?.accountNumberConf && (
                <FieldError message={errors?.bankDetails?.accountNumberConf} />
              )
            }
          >
            <Input
              value={v?.bankDetails?.accountNumberConf}
              name='bankDetails.accountNumberConf'
              type={'text'}
              handleChange={handleChange}
            />
          </Field>

          <Field
            label={t('Type of account')}
            required
            className='col-span-2 sm:col-span-1'
            error={
              errors?.bankDetails?.typeAccount && (
                <FieldError message={errors?.bankDetails?.typeAccount} />
              )
            }
          >
            <select
              value={v.bankDetails?.typeAccount}
              onChange={handleChange}
              id='bankDetails.typeAccount'
              name='bankDetails.typeAccount'
              className='block h-full w-full bg-white border border-gray-300 rounded-md shadow-sm py-[15px] px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
            >
              <option value='personal'> {t('personal')}</option>
              <option value='business'> {t('business')}</option>
            </select>
          </Field>

          <Field
            label={t('Category of account')}
            required
            className='col-span-2 sm:col-span-1'
            error={
              errors?.bankDetails?.categoryAccount && (
                <FieldError message={errors?.bankDetails?.categoryAccount} />
              )
            }
          >
            <select
              value={v.bankDetails?.categoryAccount}
              onChange={handleChange}
              id='bankDetails.categoryAccount'
              name='bankDetails.categoryAccount'
              className='block h-full w-full bg-white border border-gray-300 rounded-md shadow-sm py-[15px] px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
            >
              <option value='savings'> {t('savings')}</option>
              <option value='checking'> {t('checking')}</option>
              <option value='current'> {t('current')}</option>
            </select>
          </Field>

          <Field
            label={t('Currency of account')}
            required
            className='col-span-2 sm:col-span-1'
            error={
              errors?.bankDetails?.currencyAccount && (
                <FieldError message={errors?.bankDetails?.currencyAccount} />
              )
            }
          >
            <Input
              value={v?.bankDetails?.currencyAccount}
              name='bankDetails.currencyAccount'
              type={'text'}
              handleChange={handleChange}
            />
          </Field>

          <Field
            label={t('SWIFT/BIC')}
            required
            className='col-span-2 sm:col-span-1'
            error={
              errors?.bankDetails?.SWIFTBIC && (
                <FieldError message={errors?.bankDetails?.SWIFTBIC} />
              )
            }
          >
            <Input
              value={v?.bankDetails?.SWIFTBIC}
              name='bankDetails.SWIFTBIC'
              type={'text'}
              handleChange={handleChange}
            />
          </Field>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <Button
          variant='outline'
          onClick={() => {
            showModal(MODAL_TYPES.SETUP_PAYMENT_ESCROW, {
              SetupType: 'ESCROW',
              userStripeAccount: userStripeAccount,
            });
          }}
          disabled={loading}
          className='col-span-1'
        >
          {t('back')}
        </Button>
        <Button variant='solid' disabled={loading} onClick={submitForm} className='col-span-1'>
          {t('Save')}
        </Button>
      </div>
    </div>
  );
}
