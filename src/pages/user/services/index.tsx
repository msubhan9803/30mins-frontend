import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';

import queries from 'constants/GraphQL/Service/queries';
import {SERVICE_TYPES} from 'constants/enums';

import PostLoginLayout from '@components/layout/post-login';
import Header from '@components/header';
import Error from '@components/error';
import TableHead from '@root/features/services/service-display/table-head';
import TableRow from '@root/features/services/service-display/table-row';
import {useContext, useState} from 'react';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import ConfirmDialog from '@root/components/dialog/confirm';
import {UserContext} from '@root/context/user';
import ActionBar from '@root/features/services/service-display/action-bar';
import Loader from 'components/shared/Loader/Loader';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import Head from 'next/head';
import Button from '@root/components/button';

export default function Services() {
  const {t} = useTranslation('common');
  const router = useRouter();
  const {data: session} = useSession();
  const {hasOrgs, hasOrgServiceCats, hasCalendar, hasOrgExtention} = useContext(UserContext);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {showModal} = ModalContextProvider();
  const toggleWorkingHours = () => {
    if (!hasCalendar) {
      setDialogOpen(true);
    } else {
      showModal(MODAL_TYPES.CHANGETIME);
    }
  };

  const crumbs = [{title: t('page:Home'), href: '/'}];

  const {
    data: {getServicesByUserId: {serviceData = {}} = {}} = {},
    loading,
    refetch,
  } = useQuery(queries.getServicesByUserId, {
    variables: {token: session?.accessToken},
    fetchPolicy: 'cache-and-network',
  });

  const addServicePress = () => {
    if (!hasCalendar) {
      setDialogOpen(true);
    } else {
      router.push('/user/services/service-form/?mode=create');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <PostLoginLayout>
      <Head>
        <title>My Services</title>
      </Head>
      <Header crumbs={crumbs} heading={t('my_services')} />
      <>
        <ActionBar addServicePress={addServicePress} toggleWorkingHours={toggleWorkingHours} />
        {!serviceData && (
          <Error
            image={'/icons/errors/no-data.svg'}
            title={t('common:oops_no_services')}
            description={t('common:why_services')}
          />
        )}
        {serviceData && (
          <>
            <div className='border border-gray-300 border-opacity-75 rounded-lg mt-4 shadow-md'>
              <table className='table-auto max-w-full w-full'>
                <TableHead />
                <tbody>
                  {serviceData.length > 0 &&
                    // eslint-disable-next-line array-callback-return, consistent-return
                    serviceData.map((service, index) => {
                      if (service.serviceType !== SERVICE_TYPES.ROUND_ROBIN)
                        return <TableRow refetch={refetch} key={index} service={service} />;
                    })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </>

      <ConfirmDialog
        title={
          hasCalendar
            ? hasOrgExtention
              ? hasOrgs
                ? hasOrgServiceCats
                  ? ''
                  : t('org_error_title')
                : t('org_error_title')
              : t('org_extention_error_title')
            : t('credentials_error_title')
        }
        description={
          hasCalendar
            ? hasOrgExtention
              ? hasOrgs
                ? hasOrgServiceCats
                  ? ''
                  : t('org_error_description')
                : t('org_error_description')
              : t('org_extention_error_description')
            : t('credentials_error_description')
        }
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
      >
        <Button variant='cancel' onClick={() => setDialogOpen(false)}>
          {t('btn_cancel')}
        </Button>
        <Button
          variant='solid'
          onClick={() =>
            hasCalendar
              ? hasOrgExtention
                ? !hasOrgs || !hasOrgServiceCats
                  ? router.push('/user/organizations')
                  : ''
                : router.push('/user/extensions')
              : router.push('/user/integrations')
          }
        >
          {hasCalendar
            ? hasOrgExtention
              ? !hasOrgs || !hasOrgServiceCats
                ? t('go_to_organizations')
                : ''
              : t('go_to_extentions')
            : t('go_to_connected_calendars')}
        </Button>
      </ConfirmDialog>
    </PostLoginLayout>
  );
}
Services.auth = true;
