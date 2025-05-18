import useTranslation from 'next-translate/useTranslation';
import {useSession} from 'next-auth/react';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import mutations from 'constants/GraphQL/Organizations/mutations';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';
import Button from '@root/components/button';
import {toast} from 'react-hot-toast';

const InvitedOrganizationDisplayItem = ({pendingInvites, onEvent}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const {data: session} = useSession();
  const orgID = pendingInvites?.organizationId?._id;
  const [acceptMutation, {loading: loader1}] = useMutation(mutations.acceptPendingInvite);
  const [rejectMutation, {loading: loader2}] = useMutation(mutations.declinePendingInvite);

  const acceptInvite = async () => {
    try {
      await acceptMutation({
        variables: {
          token: session?.accessToken,
          organizationId: orgID,
          pendingInviteId: pendingInvites?._id,
        },
      });
      onEvent();
      toast.success(t('common:invite_accepted_successfully'));
      router.reload();
    } catch (err) {
      toast.error(t("common:Couldn't Accept Invite"));
      console.log(err);
    }
  };

  const rejectInvite = async () => {
    try {
      await rejectMutation({
        variables: {
          token: session?.accessToken,
          organizationId: orgID,
          pendingInviteId: pendingInvites?._id,
        },
      });
      onEvent();
      toast.success(t('common:Invite Rejected Successfully'));
      router.reload();
    } catch (err) {
      toast.error(t("common:Couldn't Invite Rejected Successfully"));
      console.log(err);
    }
  };
  return (
    <div className='flex flex-col py-4 px-4 border-b-2 border-solid gap-4'>
      <div className='flex gap-4 sm:gap-6 flex-wrap'>
        <div className='w-36 h-36 rounded-md overflow-hidden'>
          <img
            className='w-full h-full object-contain object-center'
            src={
              pendingInvites?.organizationId?.image ||
              'https://files.stripe.com/links/MDB8YWNjdF8xSXExT2dKV2FIT3E3dTdkfGZsX3Rlc3RfMW15OUp4UHNvb29Lem9BVXFrdjBId0JT00jAdxbWe4'
            }
            alt='OrganizationImage'
          />
        </div>
        <div className='flex-1 flex flex-col w-full overflow-hidden break-words'>
          <h3 className='text-sm sm:text-xl font-bold text-gray-900 '>
            {t('common:you_were_invited_to_org')} {pendingInvites?.organizationId?.title}
          </h3>
          <h4 className='sm:text-lg text-gray-500 leading-5'>
            {pendingInvites?.organizationId?.headline}
          </h4>
          <p className='hidden font-light sm:line-clamp-3 leading-5 mt-2 '>
            {pendingInvites?.organizationId?.description && (
              <div className='sm:col-span-2'>
                <dd
                  className='mt-1 custom'
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(pendingInvites?.organizationId?.description),
                  }}
                ></dd>
              </div>
            )}
          </p>

          <br></br>
          <Link href={`/org/${pendingInvites?.organizationId?.slug}`}>
            <a target={'_blank'} className='text-sm'>
              {t('event:view_public_page')}
            </a>
          </Link>
        </div>
      </div>
      <div className='w-full flex flex-col sm:flex-row justify-end gap-2 flex-wrap'>
        <Button variant='outline' disabled={loader1 || loader2} onClick={rejectInvite}>
          {t('common:btn_ignore')}
        </Button>
        <Button variant='solid' disabled={loader1 || loader2} onClick={acceptInvite}>
          {t('common:btn_accept')}
        </Button>
      </div>
    </div>
  );
};
export default InvitedOrganizationDisplayItem;
