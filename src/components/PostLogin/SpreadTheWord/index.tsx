import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/User/mutations';
import {ORG_INVITE_MEMBERS, ORG_INVITE_MEMBERS_YUP} from 'constants/yup/organization';
import {Form, Formik} from 'formik';
import {useSession} from 'next-auth/react';
import {useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import Button from '@root/components/button';
import axios from 'axios';
import toast from 'react-hot-toast';
import {FieldError} from '../../../cinnamon/components/forms/error';

const SpreadTheWord = () => {
  const {data: session} = useSession();
  const {t} = useTranslation();
  const [tempArray, setTempArray] = useState<any>([]);
  const [inviteArray, setInviteArray] = useState<any>([]);
  const [showError, setError] = useState<any>(undefined);
  const [showSuccess, setShowSuccess] = useState('');
  const [createPendingInvite] = useMutation(mutations.generateInviteLink);
  const [loading, setLoading] = useState(false);
  const [IsSubmit, setIsSubmit] = useState(false);

  const submitHandler = async () => {
    try {
      setIsSubmit(true);
      setError('');
      await Promise.all(
        tempArray.map(async (invite: any) => {
          const response = await createPendingInvite({
            variables: {
              token: session?.accessToken,
              inviteeEmail: invite,
              inviteeName: invite,
            },
          });
          setInviteArray(prevState => {
            setShowSuccess(t('common:invites_generated'));
            return prevState.concat({
              invite,
              message: response.data?.generateInviteLink.message,
            });
          });
          setTempArray([]);
        })
      );
      setTempArray([]);
    } catch (err) {
      console.log(err);
    }
    setIsSubmit(false);
  };

  const handleAdd = async (values, resetForm) => {
    setShowSuccess('');
    setError('');
    setLoading(true);
    toast.loading(t('common:loading'));
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const inValid = regex.exec(values);

    if (!inValid) {
      setError(t('common:invalid_email'));
      return;
    }

    if (tempArray.includes(values)) {
      setError(t('common:email_already_in_the_list'));
      return;
    }
    const response = await axios.post('/api/emailVerify/handleVerifyEmail', {
      email: values,
    });
    if (response?.data?.error) {
      setError(response.data?.error);
      return;
    }
    for (let i = 0; i < inviteArray.length; i++) {
      if (inviteArray[i].invite === values) {
        setError(t('common:email_already_in_the_list'));
        return;
      }
    }
    setError('');
    setLoading(false);
    toast.dismiss();
    resetForm({values: ''});
    setTempArray(prevState => prevState.concat(values));
  };

  const handleRemoveEmail = async values => {
    setError('');
    if (tempArray.includes(values)) {
      setTempArray(prevState => prevState.filter(email => email !== values));
    }
  };

  function truncate(input) {
    if (input.length > 20) {
      return `${input.substring(0, 20)}...`;
    }
    return input;
  }
  const mailBody = person => `
Hello ${person?.invite},\n
Hope all is well. Not sure if you are already using a scheduling service, or are looking for a solution to enable your customers/prospects to schedule meetings with you without the back and forth for availability.\n
Here is the link you can click to activate your 30mins account: ${person?.message}
Once you activate you will get your own link. Typically, people add that link in their email signature. You may want to do the same.\n
And, not just this link, you can create many more service links like this. You can create paid services where the booker is charged a booking fee. The payment can be direct to you or you can offer via ESCROW thru us. You can also create recurring meetings, allowing bookers to optionally book weekly recurring meetings with you.\n
Best Regards`;

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-32 md:mx-8'>
        <div className='flex items-center justify-center self-start'>
          <img src='/assets/spreadtheword.svg' alt='spreadTheWord' />
        </div>

        <div className='sm:overflow-hidden'>
          <div className='bg-white py-6 px-2'>
            <div>
              <Formik
                initialValues={ORG_INVITE_MEMBERS}
                validationSchema={ORG_INVITE_MEMBERS_YUP}
                onSubmit={() => {}}
                enableReinitialize
                validateOnChange={false}
              >
                {({values, handleChange, resetForm, handleBlur, setFieldError, errors}) => (
                  <Form>
                    <>
                      <div className='grid grid-cols-6 gap-2'>
                        <div className='col-span-6 sm:col-span-6'>
                          <input
                            type='email'
                            onChange={el => {
                              handleChange(el);
                              setError(undefined);
                              setFieldError('email', undefined);
                            }}
                            name='email'
                            onBlur={handleBlur}
                            value={values.email}
                            className='shadow-sm focus:ring-mainBlue focus:border-mainBlue block w-full sm:text-sm border-gray-300 rounded-md'
                            placeholder={t('common:enter_an_email')}
                            onKeyDown={el => {
                              if ([' '].includes(el.key)) el.preventDefault();
                            }}
                          />
                          {showError || (errors.email && values.email.length > 1) ? (
                            <FieldError message={showError || errors.email} />
                          ) : null}
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <Button
                            variant='solid'
                            type='submit'
                            className='w-full'
                            disabled={loading}
                            onClick={() => {
                              handleAdd(values.email, resetForm).finally(() => {
                                toast.dismiss();
                                setLoading(false);
                              });
                            }}
                          >
                            + {t('common:add_to_list')}
                          </Button>
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <Button
                            type='button'
                            className='w-full'
                            disabled={tempArray?.length === 0 || IsSubmit}
                            variant='solid'
                            onClick={submitHandler}
                          >
                            {t('common:generate_invite')}
                          </Button>
                        </div>
                      </div>
                      <div className='flex flex-col pt-4 flex-1'>
                        <>
                          {showSuccess ? (
                            <div className='text-mainBlue mt-2 text-md font-normal text-center pb-4'>
                              {showSuccess}
                            </div>
                          ) : null}
                          <div className='max-h-64 overflow-y-auto '>
                            {tempArray &&
                              tempArray.map((email, index) => (
                                <div
                                  key={index}
                                  className='border-t border-b border-solid pl-4 relative py-4 w-full h-min flex justify-between'
                                >
                                  <span>{truncate(email)}</span>
                                  <button
                                    className='text-red-600 ml-1'
                                    onClick={() => handleRemoveEmail(email)}
                                  >
                                    {t('common:remove')}
                                  </button>
                                </div>
                              ))}
                          </div>
                        </>
                      </div>
                    </>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-3'>
        <div className='py-2 align-middle inline-block w-full sm:px-6 lg:px-8'>
          {inviteArray && inviteArray?.length > 0 && (
            <div className='shadow overflow-hidden border-b border-gray-200 rounded-md w-full'>
              <div className='min-w-full divide-y divide-gray-200 w-full'>
                <div className='px-6 py-3 bg-gray-300 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                  {t('common:Email')}
                </div>

                <div className='bg-white divide-y divide-gray-200 w-full'>
                  {inviteArray &&
                    inviteArray?.map((person, idx) => (
                      <div key={idx} className='w-full px-4'>
                        <div className='p-4 gap-2 flex flex-col w-full items-center justify-between sm:flex-row whitespace-nowrap text-sm text-gray-500'>
                          <span
                            className='flex break-all line-clamp-1 w-full'
                            title={person?.invite}
                          >
                            {person?.invite}
                          </span>
                          <a
                            href={`mailto:${
                              person?.invite
                            }?subject=You're invited to join 30mins.com!&body=${encodeURIComponent(
                              mailBody(person)
                            )}`}
                            className='w-full sm:w-max'
                          >
                            <Button variant='outline' className='w-full sm:w-max' type='button'>
                              {t('common:send_invite')}
                            </Button>
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default SpreadTheWord;
