import {useSession} from 'next-auth/react';
import {Field, Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/User/mutations';
import Loader from 'components/shared/Loader/Loader';
import {useContext, useState} from 'react';
import {useRouter} from 'next/router';
import {DIRECT_PAYMENT_OPTIONS, ESCROW_PAYMENT_OPTIONS, PAYMENT_ACCOUNTS} from 'constants/enums';
import {NotificationContext} from 'store/Notification/Notification.context';
import {UserContext} from '@root/context/user';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {MODAL_TYPES} from '../../../constants/context/modals';
import {ModalContextProvider} from '../../../store/Modal/Modal.context';

const PaymentOptions = ({user, userStripeAccount, hasDirectServices, hasEscrowServices}) => {
  const {data: session, status} = useSession();
  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const [updatePaymentMethods] = useMutation(mutations.updatePaymentMethods);
  const [paymentAccounts] = useState(user?.accountDetails?.paymentAccounts);
  const router = useRouter();
  const {user: User} = useContext(UserContext);
  const activeStripeAccount = userStripeAccount && userStripeAccount?.charges_enabled;
  const {showModal} = ModalContextProvider();

  const {t} = useTranslation();

  if (status === 'loading') {
    return <Loader />;
  }

  const checkDisabled = option => {
    if (option === 'none') {
      return false;
    }

    if (option === 'stripe') {
      return !activeStripeAccount;
    }

    return !user?.accountDetails[option];
  };

  const handleUpdate = async values => {
    await updatePaymentMethods({
      variables: {
        direct: values.directAccounts.length === 0 ? [''] : values.directAccounts,
        escrow: values.escrowAccounts.length === 0 ? [''] : values.escrowAccounts,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });

    router.reload();
  };

  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);
    if (
      (values.directAccounts.includes(PAYMENT_ACCOUNTS.STRIPE) ||
        values.escrowAccounts.includes(PAYMENT_ACCOUNTS.STRIPE)) &&
      !activeStripeAccount
    ) {
      setSubmitting(false);
      showNotification(NOTIFICATION_TYPES.error, t('setting:stripe_required'), false);
      return;
    }

    if (
      hasEscrowServices &&
      (values.escrowAccounts.length === 0 || values?.escrowAccounts?.includes('none'))
    ) {
      showModal(MODAL_TYPES.CONFIRM, {
        handleConfirm: async () => {
          await handleUpdate(values);
        },
        title: `${t('common:service_payment_warning')}?`,
        message: `${t('common:removal_escrow_services')}`,
      });
      setSubmitting(false);

      return;
    }

    if (
      hasDirectServices &&
      (values.directAccounts.length === 0 || values?.directAccounts?.includes('none'))
    ) {
      showModal(MODAL_TYPES.CONFIRM, {
        handleConfirm: async () => {
          await handleUpdate(values);
        },
        title: `${t('common:service_payment_warning')}`,
        message: `${t('common:removal_direct_services')}`,
      });
      setSubmitting(false);

      return;
    }

    await handleUpdate(values);

    router.reload();
    setSubmitting(false);
  };

  return (
    <>
      <div className='mt-4'>
        <div className='bg-white'>
          <Formik
            initialValues={{
              directAccounts: paymentAccounts?.direct || [],
              escrowAccounts: paymentAccounts?.escrow[0] || 'none',
            }}
            onSubmit={(values, {setSubmitting}) => {
              submitHandler(values, setSubmitting);
            }}
            enableReinitialize
          >
            {({isSubmitting, values}) => (
              <div className='grid grid-cols-3'>
                <div className='col-span-3'>
                  <span className='font-medium text-lg text-mainBlue'>
                    {t('setting:new_receiving_payments_header_2')}
                  </span>
                </div>
                <div className='col-span-3'>
                  <table className='w-full border text-left'>
                    <thead>
                      <tr className=''>
                        <th className='border text-left px-4 w-1/4 bg-gray-700 text-white'>
                          {t('setting:new_receiving_payments_options_1')}
                        </th>
                        <th className='border text-left px-4 bg-gray-700 text-white'>
                          {t('setting:new_receiving_payments_options_1_details')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='border text-left px-4'>
                          {t('setting:new_receiving_payments_options_2')}
                        </td>
                        <td className='text-sm border text-left px-4'>
                          {t('setting:new_receiving_payments_options_2_details')}
                        </td>
                      </tr>
                      <tr>
                        <td className='border text-left px-4'>
                          {t('setting:new_receiving_payments_options_3')}
                        </td>
                        <td className='text-sm border text-left px-4'>
                          {t('setting:new_receiving_payments_options_3_details')}
                        </td>
                      </tr>
                      <tr>
                        <td className='border text-left px-4'>
                          {t('setting:new_receiving_payments_options_4')}
                        </td>
                        <td className='text-sm border text-left px-4'>
                          {t('setting:new_receiving_payments_options_4_details')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className='col-span-3 mt-4'>
                  <Form className='grid grid-cols-2 gap-4'>
                    {activeStripeAccount &&
                      !values.directAccounts.includes(PAYMENT_ACCOUNTS.STRIPE) &&
                      !values.escrowAccounts.includes(PAYMENT_ACCOUNTS.STRIPE) && (
                        <div className='col-span-2 text-sm text-red-500'>
                          {t('setting:stripe_not_in_use')}
                        </div>
                      )}

                    <div className='col-span-2 sm:col-span-1'>
                      <div className='flex flex-col col-span-12 h-min'>
                        <div className='form-check'>
                          <label className='form-check-label inline-block font-bold text-lg text-gray-800'>
                            {t('setting:select_account_direct_payment')}
                          </label>
                        </div>

                        <div className='flex flex-col gap-2 py-2 items-start pl-2'>
                          {Object.keys(DIRECT_PAYMENT_OPTIONS).map((option, index) => (
                            <div className='flex gap-2' key={index}>
                              <Field
                                type='checkbox'
                                className='checked:bg-mainBlue disabled:opacity-20'
                                name='directAccounts'
                                value={DIRECT_PAYMENT_OPTIONS[option]}
                              />
                              <label
                                htmlFor='directAccounts'
                                className='block text-sm font-medium text-gray-700 '
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className='col-span-12'>
                        <div className='flex mb-6 '>
                          <button
                            type='submit'
                            disabled={isSubmitting}
                            className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                          >
                            {t('common:btn_save')}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-2 sm:col-span-1'>
                      <div className='flex flex-col col-span-12 h-min'>
                        <div className='form-check'>
                          <label className='form-check-label inline-block font-bold text-xl text-gray-800'>
                            {t('setting:select_account_escrow_payment')}
                          </label>
                        </div>
                        <div className='form-check'>
                          <span className='text-sm text-gray-400 max-w-sm'></span>
                        </div>

                        <div className='flex flex-wrap gap-2 py-2 items-start pl-2'>
                          {Object.keys(ESCROW_PAYMENT_OPTIONS).map((option, index) => (
                            <div className='flex gap-2' key={index}>
                              <Field
                                type='radio'
                                className='checked:bg-mainBlue disabled:opacity-20'
                                name='escrowAccounts'
                                value={ESCROW_PAYMENT_OPTIONS[option]}
                                disabled={checkDisabled(ESCROW_PAYMENT_OPTIONS[option])}
                              />
                              <label
                                htmlFor='escrowAccounts'
                                className='block text-sm font-medium text-gray-700 '
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                          <div className='flex gap-2'>
                            <Field
                              type='radio'
                              className='checked:bg-mainBlue disabled:opacity-20'
                              name='escrowAccounts'
                              value={'wireTransfer'}
                              disabled={Boolean(!User?.bankDetails?.bankName)}
                            />
                            <label
                              htmlFor='escrowAccounts'
                              className='block text-sm font-medium text-gray-700 '
                            >
                              {t('common:wire_transfer')}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-12'>
                        <div className='flex mb-6 '>
                          <button
                            type='submit'
                            disabled={isSubmitting}
                            className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                          >
                            {t('common:btn_save')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};
export default PaymentOptions;
