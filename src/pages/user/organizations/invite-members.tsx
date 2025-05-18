import {useEffect, useState} from 'react';
import Head from 'next/head';

import useTranslation from 'next-translate/useTranslation';
import {useQuery, useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {Formik, Form} from 'formik';
import {toast} from 'react-hot-toast';
import axios from 'axios';
import classnames from 'classnames';

import queries from 'constants/GraphQL/Organizations/queries';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {ORG_INVITE_MEMBERS} from 'constants/yup/organization';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import DropDownComponent from 'components/shared/DropDownComponent';
import Loader from 'components/shared/Loader/Loader';
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import Button from '@root/components/button';

import graphqlRequestHandler from 'utils/graphqlRequestHandler';

export default function OrganizationInviteMembers() {
  const {t} = useTranslation();

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Organizations'), href: '/user/organizations'},
    {title: t('page:Invite Members'), href: '/user/organizations/invite-members'},
  ];

  const {data: session} = useSession();

  const {data: organizations, loading: orgLoading} = useQuery(
    queries.getOrganizationManagementDetails,
    {
      variables: {
        token: session?.accessToken,
      },
    }
  );

  const organizationsData = organizations?.getOrganizationManagementDetails?.membershipData;

  const [currentSelectedOrg, setCurrentSelectedOrg] = useState<any>(null);
  const [checkingEmial, setCheckingEmial] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState<any>([]);
  const [tempArray, setTempArray] = useState<any>([]);
  const [loadingInv, setloadingInv] = useState(false);

  const [createPendingInvite] = useMutation(mutations.createPendingInvite);

  const {data: membersResults} = useQuery(queries.getOrganizationMemberResults, {
    variables: {
      documentId: currentSelectedOrg?._id,
      searchParams: {
        keywords: '',
        pageNumber: 1,
        resultsPerPage: 10000000,
      },
    },
    skip: !organizationsData,
  });

  const membersEmail: string[] = [];
  const userData = membersResults?.getOrganizationMemberResults?.userData;
  userData?.filter(el => membersEmail.push(el.accountDetails.email));

  useEffect(() => {
    if (!currentSelectedOrg) return;

    setLoading(true);

    const getInvites = async () => {
      toast.loading(t('common:loading'));

      setloadingInv(true);

      const {data} = await graphqlRequestHandler(
        queries.getPendingInvitesByOrgId,
        {token: session?.accessToken, organizationId: currentSelectedOrg?._id},
        session?.accessToken
      );

      const {data: data2} = await graphqlRequestHandler(
        queries.getPendingJoinRequestsByOrgId,
        {token: session?.accessToken, organizationId: currentSelectedOrg?._id},
        session?.accessToken
      );

      setInviteData(data2?.data?.getPendingJoinRequestsByOrgId?.pendingJoinRequests);
      setInviteData([
        ...(data?.data?.getPendingInvitesByOrgId?.pendingInvites?.map(
          (invite: any) => invite?.inviteeUserId?.accountDetails?.email
        ) || []),
        ...(data2?.data?.getPendingJoinRequestsByOrgId?.pendingJoinRequests.map(
          el => el?.requesterUserId?.accountDetails?.email
        ) || []),
      ]);

      setloadingInv(false);
      toast.dismiss();
    };

    getInvites();

    setLoading(false);
  }, [currentSelectedOrg]);

  useEffect(() => {
    if (organizationsData) {
      setCurrentSelectedOrg(organizationsData[0]?.organizationId || null);
    }
  }, [organizationsData]);

  const selectOrganizations =
    organizationsData
      ?.filter(item => item.role === 'owner' || item.role === 'admin')
      ?.map(item => ({
        value: item.organizationId._id,
        key: item.organizationId.title,
      })) ?? [];

  const handleChangeOrganization = e => {
    const {value} = e.target;

    const currentOrg = organizationsData.find(item => item.organizationId._id === value);

    setCurrentSelectedOrg(currentOrg?.organizationId);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      await Promise.all(
        tempArray.map(async (invite: any) => {
          await createPendingInvite({
            variables: {
              token: session?.accessToken,
              inviteeEmail: invite,
              organizationId: currentSelectedOrg?._id,
              organizationTitle: currentSelectedOrg?.title,
            },
          });
        })
      );

      toast.success(t('common:Invite Sent Successfully'));
      setLoading(false);
      setTempArray([]);
    } catch (err) {
      toast.error(t('common:Couldn`t Sent Invite Successfully'));
      console.log(err);
    }
  };

  const handleAdd = async (values, {resetForm, setFieldError}) => {
    setCheckingEmial(true);

    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const inValid = regex.exec(values);

    toast.loading(t('common:loading'));

    if (!inValid) {
      setFieldError('email', t('common:Invalid email address'));
      return;
    }

    if (inviteData?.includes(values) || tempArray.includes(values)) {
      setFieldError('email', t('common:This email is already added into list'));
      return;
    }

    const response = await axios.post('/api/emailVerify/handleVerifyEmail', {
      email: values,
    });

    if (response?.data?.error) {
      setFieldError('email', response.data?.error);
      return;
    }

    setFieldError('email', undefined);
    resetForm({values: ''});
    setTempArray(prevState => prevState.concat(values));
    setCheckingEmial(false);
  };

  const handleRemoveEmail = async values => {
    if (tempArray.includes(values)) {
      setTempArray(prevState => prevState.filter(email => email !== values));
    }
  };

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:Invite Members')}</title>
      </Head>
      <Header crumbs={crumbs} heading={t('page:Invite Members')} />

      {orgLoading && !organizationsData && (
        <div className='mt-6'>
          <Loader />
        </div>
      )}

      {!orgLoading && !organizationsData && (
        <div className='mt-6 text-center'>
          <p className='text-gray-500 text-2xl'>{t('common:no_organization_found')}</p>
        </div>
      )}

      <div className='mt-6'>
        {organizationsData && (
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
            <p className='text-lg font-semibold text-mainText'>{t('common:select_organization')}</p>
            <DropDownComponent
              name='currentOrganization'
              options={selectOrganizations}
              className='w-full max-w-[300px]'
              onChange={handleChangeOrganization}
            />
          </div>
        )}

        {loading && !inviteData && (
          <div className='mt-4'>
            <Loader />
          </div>
        )}

        <div className='mt-4'>
          <div className='w-full max-w-3xl'>
            <Formik initialValues={ORG_INVITE_MEMBERS} onSubmit={onSubmit} enableReinitialize>
              {({values, errors, handleChange, setFieldError, resetForm}) => (
                <Form
                  onKeyPress={e => {
                    e.which === 13 && e.preventDefault();
                  }}
                >
                  <div
                    className={classnames(
                      'w-full flex flex-col gap-2 md:flex-row max-w-2xl items-end',
                      {'items-center': errors.email}
                    )}
                  >
                    <Field
                      label={t('common:email_address')}
                      error={errors.email && <FieldError message={errors.email} />}
                      className='w-full flex-grow'
                    >
                      <Input
                        type='email'
                        handleChange={handleChange}
                        name='email'
                        value={values.email}
                        onKeyPress={e =>
                          e.key === 'Enter'
                            ? handleAdd(values.email, {resetForm, setFieldError}).finally(() => {
                                toast.dismiss();
                                setCheckingEmial(false);
                              })
                            : null
                        }
                        className='w-full shadow-sm focus:ring-mainBlue focus:border-mainBlue block  sm:text-sm border-gray-300 rounded-md'
                        placeholder='Enter an email'
                      />
                    </Field>
                    <Button
                      variant='outline'
                      type='button'
                      className={classnames('w-full md:w-max md:mb-[7px]', {
                        'md:mb-0': errors.email,
                      })}
                      disabled={checkingEmial || loadingInv}
                      onClick={() => {
                        membersEmail.includes(values.email)
                          ? setFieldError('email', 'Member already exists')
                          : handleAdd(values.email, {resetForm, setFieldError}).finally(() => {
                              toast.dismiss();
                              setCheckingEmial(false);
                            });
                      }}
                    >
                      + {t('common:add_to_the_list')}
                    </Button>
                    <Button
                      type='submit'
                      disabled={tempArray?.length === 0 || checkingEmial || loadingInv}
                      variant='solid'
                      className={classnames('w-full md:w-max md:mb-[7px]', {
                        'md:mb-0': errors.email,
                      })}
                    >
                      {loading ? t('common:txt_loading1') : t('common:send_invites')}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className='flex pt-4 max-w-3xl'>
            <div className='w-full max-h-64 overflow-y-auto '>
              {tempArray &&
                tempArray.map((email, index) => (
                  <div
                    key={index}
                    title={email}
                    className='border-t border-b border-solid relative py-4 w-full h-min flex flex-col sm:flex-row justify-between px-2 gap-2'
                  >
                    <span className='w-full break-all line-clamp-1 '>{email}</span>
                    <Button variant='cancel' onClick={() => handleRemoveEmail(email)}>
                      {t('common:remove')}
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </PostLoginLayout>
  );
}
OrganizationInviteMembers.auth = true;
