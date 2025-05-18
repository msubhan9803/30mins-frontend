import orgQuery from 'constants/GraphQL/Organizations/queries';
import Image from 'next/image';
import Button from 'components/shared/Button/Button';
import {useMutation, useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {useRouter} from 'next/router';
import {PencilIcon, PlusIcon} from '@heroicons/react/20/solid';

const Organizations = ({fromDashboard, hasOrgExtension, showInvitedOrgs}) => {
  const {data: session} = useSession();
  const router = useRouter();
  const {t} = useTranslation();
  const {data: organizations} = useQuery(orgQuery.getOrganizationsByUserId, {
    variables: {token: session?.accessToken},
  });

  const {data: invitedUsers} = useQuery(orgQuery.getPendingInvitesByUserId, {
    variables: {token: session?.accessToken},
  });

  const invitedOrgs = invitedUsers?.getPendingInvitesByUserId?.pendingInvites;

  const orgs = organizations?.getOrganizationsByUserId?.membershipData;

  const [acceptMutation] = useMutation(mutations.acceptPendingInvite);
  const [rejectMutation] = useMutation(mutations.declinePendingInvite);

  const acceptInvite = async itemID => {
    try {
      await acceptMutation({
        variables: {
          token: session?.accessToken,
          organizationId: itemID?.organizationId?._id,
          pendingInviteId: itemID?._id,
        },
      });
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectInvite = async itemID => {
    try {
      await rejectMutation({
        variables: {
          token: session?.accessToken,
          organizationId: itemID?.organizationId?._id,
          pendingInviteId: itemID?._id,
        },
      });
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return !fromDashboard ? (
    <>
      {orgs?.length > 0 ? (
        <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
          <div className='flex justify-between'>
            <h2 className='text-md font-bold text-gray-700'>{t('page:Organizations')}</h2>
            <div className='flex flex-row items-center'>
              <a href='/user/organizations'>
                <PlusIcon className='w-4 h-4 text-sm font-medium text-gray-500 mr-2' />
              </a>
              <a href='/user/organizations'>
                <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
              </a>
            </div>
          </div>
          <div className='mt-2 flow-root'>
            {orgs !== null ? (
              <div className='sm:col-span-2'>
                <dd className='mt-1 text-sm text-gray-900 overflow-hidden break-words'>
                  {t('profile:you_are_member_of_organization')}
                  {orgs?.map((org, index) => (
                    <li key={index}>
                      <a
                        href={`/org/${org?.organizationId?.slug}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-mainBlue'
                      >
                        <span className='text-sm text-mainBlue mr-1'>
                          {org?.organizationId?.title}
                        </span>
                        {' - '}
                        <span>({org?.role})</span>
                      </a>
                    </li>
                  ))}
                </dd>
              </div>
            ) : (
              <>
                <span className='mt-1 text-sm text-gray-900 overflow-hidden break-words'>
                  {t('profile:you_are_not_member_of_any_organization')}
                </span>
                <p>
                  <a href='/user/organizations' target='_blank' rel='noreferrer'>
                    <button
                      type='button'
                      className='mt-2 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                    >
                      {t('profile:create_org_now')}
                    </button>
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
          <div className='flex justify-between'>
            <h2 className='text-md font-bold text-gray-700'>{t('page:Organizations')}</h2>
            <div className='flex flex-row items-center'>
              <a href='/user/organizations'>
                <PlusIcon className='w-4 h-4 text-sm font-medium text-gray-500 mr-2' />
              </a>
              <a href='/user/organizations'>
                <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
              </a>
            </div>
          </div>

          <span className='mt-1 text-sm text-gray-900 overflow-hidden break-words'>
            {t('profile:you_are_not_member_of_any_organization')}
          </span>
          <p>
            <a href='/user/organizations' target='_blank' rel='noreferrer'>
              <button
                type='button'
                className='mt-2 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
              >
                {t('profile:create_org_now')}
              </button>
            </a>
          </p>
        </div>
      )}
      {invitedOrgs && invitedOrgs?.length > 0 && (
        <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
          <h2 className='text-md font-bold text-red-600'>{t('common:pending_invitations')}</h2>
          <div className='mt-2 flow-root'>
            {invitedOrgs?.map((org, index) => (
              <li key={index}>
                <span className='text-sm text-gray-900'>{org?.organizationId?.title} - </span>
                <button onClick={() => acceptInvite(org)}>
                  <span className="className='mt-1 text-sm text-mainBlue overflow-hidden break-words px-2">
                    Accept
                  </span>
                </button>
                <button onClick={() => rejectInvite(org)}>
                  <span className="className='mt-1 text-sm text-gray-900 overflow-hidden break-words">
                    Ignore
                  </span>
                </button>
              </li>
            ))}
          </div>
        </div>
      )}
    </>
  ) : (
    <>
      {!showInvitedOrgs ? (
        <>
          {orgs?.length > 0 ? (
            <div className='col-span-1 border border-gray-100 w-full pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
              <div className='flex flex-col items-center justify-between'>
                <div className='text-blue-500 mx-auto mb-0'>
                  <Image src={`/icons/services/ORG.svg`} height={96} width={96} alt='' />
                </div>
                <h3 className='mb-2 font-bold font-heading'>{t('page:Organizations')}</h3>
              </div>
              <div className='mt-2 flow-root h-[6rem] w-full'>
                {orgs !== null ? (
                  <div className='sm:col-span-2 w-full sm:px-6 lg:px-8'>
                    {t('profile:you_are_member_of_organization')}
                    <dd className='mt-1 text-sm text-gray-900 overflow-hidden break-words flex flex-col justify-start items-start'>
                      {orgs?.map(
                        (org, index) =>
                          index < 3 && (
                            <li key={index}>
                              <a
                                href={`/org/${org?.organizationId?.slug}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-sm text-mainBlue'
                              >
                                <span className='text-sm text-mainBlue mr-1'>
                                  {org?.organizationId?.title}
                                </span>
                                {' - '}
                                <span>({org?.role})</span>
                              </a>
                            </li>
                          )
                      )}
                    </dd>
                  </div>
                ) : (
                  <>
                    <span className='mt-1 text-xs text-blueGray-400 overflow-hidden break-words'>
                      {t('common:not_member_of_any_organization')}
                    </span>
                  </>
                )}
              </div>
              <Button
                type='button'
                href={'/user/organizations/'}
                text={t('common:dashboard_edit_organizations')}
                className='inline-flex text-xs mb-4 w-3/4 sm:text-sm justify-center mt-2 mr-3 sm:w-3/4 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
              />
            </div>
          ) : (
            <>
              {!hasOrgExtension ? (
                <div className='col-span-1 border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
                  <div className='flex flex-col items-center justify-between'>
                    <div className='text-blue-500 mx-auto mb-0'>
                      <Image src={`/icons/services/ORG.svg`} height={96} width={96} alt='' />
                    </div>
                    <h3 className='mb-2 font-bold font-heading'>
                      {t(`common:DO_YOU_HAVE_A_TEAM`)}
                    </h3>
                    <p className='text-xs text-blueGray-400 h-[6rem]'>
                      {t(`common:DO_YOU_HAVE_A_TEAM_DESCRIPTION`)}
                    </p>
                    <Button
                      type='button'
                      href={'/user/extensions/organizations/'}
                      text={t('common:DO_YOU_HAVE_A_TEAM_ADD_ORG_EXTENSION')}
                      className='inline-flex text-xs mb-4 w-3/4 sm:text-sm justify-center mt-2 mr-3 sm:w-3/4 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
                    />
                  </div>
                </div>
              ) : (
                <div className='col-span-1 border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
                  <div className='flex flex-col items-center justify-between'>
                    <div className='text-blue-500 mx-auto mb-0'>
                      <Image src={`/icons/services/ORG.svg`} height={96} width={96} alt='' />
                    </div>
                    <h3 className='mb-2 font-bold font-heading'>{t('page:Organizations')}</h3>
                    <p className='text-xs text-blueGray-400 h-[6rem]'>
                      {t('common:not_member_of_any_organization')}
                    </p>
                    <Button
                      type='button'
                      href={'/user/organizations/'}
                      text={t('common:dashboard_edit_organizations')}
                      className='inline-flex text-xs mb-4 w-3/4 sm:text-sm justify-center mt-2 mr-3 sm:w-3/4 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {invitedOrgs && invitedOrgs?.length > 0 && (
            <div className='col-span-1 border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
              <div className='flex flex-col items-center justify-between'>
                <div className='text-blue-500 mx-auto mb-0'>
                  <Image src={`/icons/services/ORG.svg`} height={96} width={96} alt='' />
                </div>
                <h3 className='mb-2 font-bold font-heading'>{t('common:pending_invitations')}</h3>
                <div className='mt-2 flow-root'>
                  {invitedOrgs?.map((org, index) => (
                    <li key={index}>
                      <span className='text-sm text-gray-900'>{org?.organizationId?.title} - </span>
                      <button onClick={() => acceptInvite(org)}>
                        <span className="className='mt-1 text-sm text-mainBlue overflow-hidden break-words px-2">
                          Accept
                        </span>
                      </button>
                      <button onClick={() => rejectInvite(org)}>
                        <span className="className='mt-1 text-sm text-gray-900 overflow-hidden break-words">
                          Ignore
                        </span>
                      </button>
                    </li>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default Organizations;
