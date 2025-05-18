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

export default function AllMeetingServices() {
  const {t} = useTranslation('common');
  const {t: tpage} = useTranslation('page');
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

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Meeting Services'), href: '#'},
    {title: tpage('All Meeting Services'), href: '/user/meeting-services/all-meeting-services'},
  ];

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
      router.push('/user/meeting-services/add-services/?mode=create&stepType=MEETING');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <PostLoginLayout>
      <Head>
        <title>{tpage('All Meeting Services')}</title>
      </Head>
      <Header crumbs={crumbs} heading={tpage('All Meeting Services')} />
      <div className='pb-4'>
        <ActionBar addServicePress={addServicePress} toggleWorkingHours={toggleWorkingHours} />
        {serviceData?.filter &&
        serviceData?.filter(el => el.serviceType === SERVICE_TYPES.MEETING)?.length > 0 ? (
          <>
            <div className='border border-gray-300 border-opacity-75 rounded-lg mt-4 shadow-md'>
              <table className='table-auto max-w-full w-full'>
                <TableHead withoutType />
                <tbody>
                  {serviceData?.length > 0 &&
                    serviceData
                      ?.filter(service => !service.isOrgService)
                      // eslint-disable-next-line array-callback-return, consistent-return
                      ?.map((service, index) => {
                        if (service.serviceType === SERVICE_TYPES.MEETING)
                          return (
                            <TableRow refetch={refetch} key={index} service={service} withoutType />
                          );
                      })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <Error
            image={'/icons/errors/no-data.svg'}
            title={t('common:meeting_no_x_added_main')}
            description={t('common:meeting_no_x_added_description')}
            linkText={t('common:meeting_learn_more')}
            linkURL='/blog/help_user_meeting_services_all_meeting_services/'
          />
        )}
      </div>

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

AllMeetingServices.auth = true;
