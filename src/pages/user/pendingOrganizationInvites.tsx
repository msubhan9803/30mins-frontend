import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import PendingOrganizationInvitePage from 'components/PostLogin/Organizations/PendingOrganizationInvitePage';
import PostLoginLayout from '@root/components/layout/post-login';

const PendingOrganizationInvites = () => {
  const {t} = useTranslation();
  return (
    <PostLoginLayout>
      <Head>
        <title> {t('profile:organization_page_button')}</title>
      </Head>
      <PendingOrganizationInvitePage />
    </PostLoginLayout>
  );
};
export default PendingOrganizationInvites;
PendingOrganizationInvites.auth = true;
