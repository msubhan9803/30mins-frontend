import useTranslation from 'next-translate/useTranslation';
import mutations from 'constants/GraphQL/User/mutations';
import cn from 'classnames';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useContext, useEffect, useState} from 'react';
import {UserContext} from '@root/context/user';
import {RadioGroup} from '@headlessui/react';
import {useSession} from 'next-auth/react';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import Button from '@root/components/button';
import {useFormik} from 'formik';
import {object, ref, string} from 'yup';
import {FieldError} from '@root/components/forms/error';
import {LoaderIcon} from 'react-hot-toast';
import {MODAL_TYPES} from 'constants/context/modals';
import Modal from '../Modal';

const Types = [
  {code: 'stripe', title: 'Stripe Account', type: 'Stripe'},
  {code: 'upiId', title: 'UPI Account', type: 'UPI'},
  {code: 'payoneerId', title: 'Payoneer Account', type: 'Payoneer'},
  {code: 'paypalId', title: 'Paypal Account', type: 'Paypal'},
  {code: 'wireTransfer', title: 'Wire Transfer', type: 'Wire Transfer'},
];

const SetupPayment = () => {
  const {t} = useTranslation('common');
  const [Ptype, setPtype] = useState('');
  const {data: session} = useSession();
  const [showForm, setShowForm] = useState(false);
  const [updateUser] = useMutation(mutations.updateUser);
  const router = useRouter();
  const {store, hideModal, showModal} = ModalContextProvider();
  const {modalProps} = store || {};
  const {SetupType, userStripeAccount} = modalProps;
  const {user, refetchUser} = useContext(UserContext);
  const [updatePaymentMethods] = useMutation(mutations.updatePaymentMethods);
  const [Loading, setLoading] = useState(false);

  const handleUpdateEscrow = async val => {
    await updatePaymentMethods({
      variables: {
        direct: user?.direct,
        escrow: [val],
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });
  };

  const {values, errors, setFieldValue, setFieldError, submitForm, isSubmitting} = useFormik({
    initialValues: {
      id: '',
      reId: '',
    },
    validationSchema: object().shape({
      id: string().required().label('ID'),
      reId: string()
        .required()
        .label('ID')
        .oneOf([ref('id'), null], 'Re-Enter the same ID'),
    }),
    onSubmit: async () => {
      try {
        setLoading(true);

        await updateUser({
          variables: {
            userData: {
              accountDetails: {
                [Ptype]: values.id,
              },
            },
            token: session?.accessToken,
          },
        });
        await handleUpdateEscrow(Ptype);
        await refetchUser();
        hideModal();
        setLoading(false);
      } catch {
        setFieldError('id', t('common:general_api_error'));
        setLoading(false);
      }
    },
  });

  const pendingVerification =
    userStripeAccount?.requirements?.disabled_reason === 'requirements.pending_verification';
  const chargesEnabled = userStripeAccount?.charges_enabled;
  const activeStripeAccount = userStripeAccount && userStripeAccount?.charges_enabled;

  const Clear = () => {
    setPtype('');
    setFieldValue('id', '');
    setFieldValue('reId', '');
    setShowForm(false);
  };

  const handleUpdateDirect = async val => {
    await updatePaymentMethods({
      variables: {
        direct: [val],
        escrow: user?.escrow,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    });
  };

  useEffect(() => {}, [Loading]);

  return (
    <Modal
      title={
        SetupType === 'ESCROW'
          ? t('Setup account for escrow payments')
          : t('Setup account for direct payments')
      }
    >
      {Loading || isSubmitting ? (
        <>
          <div className='duration-700 animate-fadeIn p-2 h-60 flex flex-col justify-center items-center'>
            <LoaderIcon style={{width: 45, height: 45}} />
          </div>
        </>
      ) : !showForm ? (
        SetupType === 'ESCROW' ? (
          <div className='duration-700 animate-fadeIn p-2'>
            <div className='w-full flex flex-col gap-2'>
              <span className='font-semibold'>{t('Select account for ESCROW')} : </span>
              <RadioGroup
                value={Ptype}
                onChange={async e => {
                  setPtype(e);
                  switch (e) {
                    case 'stripe':
                      if (
                        activeStripeAccount &&
                        !pendingVerification &&
                        userStripeAccount &&
                        chargesEnabled
                      ) {
                        setLoading(true);
                        await handleUpdateEscrow(e);
                        await refetchUser();
                        await hideModal();
                        setLoading(false);
                      } else {
                        await router.push(
                          `/api/stripe/createAccount/?returnUrl=${
                            window.origin
                          }${router.asPath.replace('&', '`')}`
                        );
                      }

                      break;
                    case 'upiId':
                      if (user?.upiId) {
                        setLoading(true);
                        await handleUpdateEscrow('upiId');
                        await refetchUser();
                        setLoading(false);
                        hideModal();
                      } else {
                        setShowForm(true);
                      }
                      break;
                    case 'payoneerId':
                      if (user?.payoneerId) {
                        setLoading(true);
                        await handleUpdateEscrow('payoneerId');
                        await refetchUser();
                        setLoading(false);
                        hideModal();
                      } else {
                        setShowForm(true);
                      }
                      break;
                    case 'paypalId':
                      if (user?.paypalId) {
                        setLoading(true);
                        await handleUpdateEscrow('paypalId');
                        await refetchUser();
                        setLoading(false);
                        hideModal();
                      } else {
                        setShowForm(true);
                      }
                      break;
                    case 'wireTransfer':
                      if (user?.bankDetails?.bankName) {
                        setLoading(true);
                        await handleUpdateEscrow('wireTransfer');
                        await refetchUser();
                        setLoading(false);
                        hideModal();
                      } else {
                        showModal(MODAL_TYPES.WIRE_TRANSFER_SERVICE, {
                          userStripeAccount: userStripeAccount,
                          onSubmit: async () => {
                            await handleUpdateEscrow('wireTransfer');
                          },
                        });
                      }
                      break;
                    default:
                      break;
                  }
                }}
                name='serviceType'
              >
                <div className='flex flex-wrap gap-8'>
                  {Types?.map(type => (
                    <RadioGroup.Option
                      key={type.code}
                      value={type.code}
                      className={({checked}) =>
                        cn(
                          checked ? 'border-mainBlue' : 'bg-white',
                          'w-full md:w-1/3 select-none flex-grow flex-shrink-0 flex cursor-pointer rounded-lg p-4 border border-gray-300 shadow-md'
                        )
                      }
                    >
                      {({checked}) => (
                        <div className='flex w-full items-center justify-between'>
                          <div className='flex space-x-6 items-center'>
                            <div className='text-sm flex flex-col'>
                              <RadioGroup.Label
                                className={cn(
                                  checked ? 'text-mainBlue' : 'text-mainText',
                                  'text-lg font-medium '
                                )}
                              >
                                {type.code}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as='span'
                                className={cn([`inline text-gray-500`])}
                              >
                                {type.code === 'stripe' ? (
                                  activeStripeAccount &&
                                  !pendingVerification &&
                                  userStripeAccount &&
                                  chargesEnabled ? (
                                    <>
                                      <span>{t(`${type.code}_DESCRIPTION`)}</span>
                                      <br />(
                                      <span className='font-bold'>
                                        {t('common:active_account')}: {userStripeAccount.email}
                                      </span>
                                      )
                                    </>
                                  ) : (
                                    <>
                                      <span>{t(`${type.code}_DESCRIPTION`)}.</span>
                                      <br />(
                                      <span className='font-bold'>
                                        {t('No Account have connected yet')}
                                      </span>
                                      )
                                    </>
                                  )
                                ) : user![type.code] ? (
                                  <div>
                                    (
                                    <span className='font-bold'>
                                      {t('common:active_account')}: {user![type.code]}
                                    </span>
                                    )
                                  </div>
                                ) : (
                                  type.code !== 'wireTransfer' && (
                                    <>
                                      <span className='font-bold'>
                                        {t('No Account have connected yet')}
                                      </span>
                                    </>
                                  )
                                )}
                                {type.code === 'stripe' && pendingVerification && (
                                  <>
                                    <br />
                                    {pendingVerification
                                      ? t('common:stripe_pending')
                                      : t('common:stripe_info_needed')}
                                  </>
                                )}
                              </RadioGroup.Description>
                            </div>
                          </div>
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        ) : (
          <>
            <div className='duration-700 animate-fadeIn p-2'>
              <div className='w-full flex flex-col gap-2'>
                <span className='font-semibold'>{t('Select account for DIRECT Payment')} : </span>
                <RadioGroup
                  value={Ptype}
                  onChange={async e => {
                    setPtype(e);
                    switch (e) {
                      case 'stripe':
                        if (
                          activeStripeAccount &&
                          !pendingVerification &&
                          userStripeAccount &&
                          chargesEnabled
                        ) {
                          setLoading(true);
                          await handleUpdateDirect(e);
                          await refetchUser();
                          await hideModal();
                          setLoading(false);
                        } else {
                          await router.push(
                            `/api/stripe/createAccount/?returnUrl=${
                              window.origin
                            }${router.asPath.replace('&', '`')}`
                          );
                        }

                        break;
                      default:
                        break;
                    }
                  }}
                  name='serviceType'
                >
                  <div className='flex flex-wrap gap-8'>
                    <RadioGroup.Option
                      key={Types[0].code}
                      value={Types[0].code}
                      className={({checked}) =>
                        cn(
                          checked ? 'border-mainBlue' : 'bg-white',
                          'w-full md:w-1/3 select-none flex-grow flex-shrink-0 flex cursor-pointer rounded-lg p-8 border border-gray-300 shadow-md'
                        )
                      }
                    >
                      {({checked}) => (
                        <div className='flex w-full items-center justify-between'>
                          <div className='flex space-x-6 items-center'>
                            <div className='text-sm flex flex-col'>
                              <RadioGroup.Label
                                className={cn(
                                  checked ? 'text-mainBlue' : 'text-mainText',
                                  'text-lg font-medium '
                                )}
                              >
                                {Types[0].code}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as='span'
                                className={cn([`inline text-gray-500`])}
                              >
                                {Types[0].code === 'stripe' &&
                                  (activeStripeAccount &&
                                  !pendingVerification &&
                                  userStripeAccount &&
                                  chargesEnabled ? (
                                    <>
                                      <span>{t(`${Types[0].code}_DESCRIPTION`)}</span>
                                      <br />(
                                      <span className='font-bold'>
                                        {t('common:active_account')}: {userStripeAccount.email}
                                      </span>
                                      )
                                    </>
                                  ) : (
                                    <>
                                      <span>{t(`${Types[0].code}_DESCRIPTION`)}</span>
                                      <br />(
                                      <span className='font-bold'>
                                        {t('No Account have connected yet')}
                                      </span>
                                      )
                                    </>
                                  ))}
                                {Types[0].code === 'stripe' && pendingVerification && (
                                  <>
                                    {pendingVerification
                                      ? t('common:stripe_pending')
                                      : t('common:stripe_info_needed')}
                                  </>
                                )}
                              </RadioGroup.Description>
                            </div>
                          </div>
                        </div>
                      )}
                    </RadioGroup.Option>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </>
        )
      ) : (
        <div className='duration-700 w-full animate-fadeIn flex flex-col gap-2 p-2'>
          <Field
            label={`${Types.find(el => el.code === Ptype)?.type} ID`}
            error={errors.id && <FieldError message={errors.id} />}
            required
          >
            <Input
              handleChange={el => {
                setFieldValue('id', el.target.value);
              }}
              type={'text'}
              value={values.id}
            />
          </Field>
          <Field
            label={`Re-Enter your ${Types.find(el => el.code === Ptype)?.type} ID`}
            error={errors.reId && <FieldError message={errors.reId} />}
            required
          >
            <Input
              handleChange={el => {
                setFieldValue('reId', el.target.value);
              }}
              type={'text'}
              value={values.reId}
            />
          </Field>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 w-full '>
            <Button
              variant='outline'
              disabled={Loading}
              className='col-span-1'
              onClick={() => {
                Clear();
              }}
            >
              {t('back')}
            </Button>
            <Button variant='solid' className='col-span-1' disabled={Loading} onClick={submitForm}>
              {t('save')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SetupPayment;
