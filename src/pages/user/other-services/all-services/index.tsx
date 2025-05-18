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
import ConfirmDialog from '@root/components/dialog/confirm';
import {UserContext} from '@root/context/user';
import Loader from 'components/shared/Loader/Loader';
import Head from 'next/head';

import {PlusIcon} from '@heroicons/react/24/outline';
import Button from '@root/components/button';
import useTranslation from 'next-translate/useTranslation';
import {LoaderIcon} from 'react-hot-toast';

export default function AllFreelancingServices() {
  const {t} = useTranslation('common');
  const {t: tpage} = useTranslation('page');
  const router = useRouter();
  const {data: session} = useSession();
  const {hasOrgs, hasOrgServiceCats, hasCalendar, hasOrgExtention} = useContext(UserContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  const crumbs = [
    {title: tpage('Home'), href: '/'},
    {title: tpage('Other Services'), href: '#'},
    {title: tpage('All Services'), href: '/user/other-services/all-services'},
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
      router.push('/user/other-services/add-services/?mode=create');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <PostLoginLayout>
      <Head>
        <title>{tpage('All Services')}</title>
      </Head>
      <Header crumbs={crumbs} heading={tpage('All Services')} />
      <div className='pb-4'>
        <div className='flex mt-6 justify-between flex-wrap gap-x-6'>
          <div className='flex gap-x-3 flex-grow justify-end'>
            <Button
              variant='solid'
              onClick={() => {
                setLoading(true);
                addServicePress();
              }}
            >
              {Loading ? (
                <LoaderIcon style={{width: 18, height: 18}} className='mr-2' />
              ) : (
                <PlusIcon className='mr-2 h-5 w-5' aria-hidden='true' />
              )}
              {t('add_new_job_post')}
            </Button>
          </div>
        </div>
        {serviceData?.filter &&
        serviceData?.filter(el =>
          [SERVICE_TYPES.FULL_TIME_JOB, SERVICE_TYPES.PART_TIME_JOB].includes(el.serviceType)
        )?.length > 0 ? (
          <>
            <div className='border border-gray-300 border-opacity-75 rounded-lg mt-4 shadow-md'>
              <table className='table-auto max-w-full w-full'>
                <TableHead withoutType />
                <tbody>
                  {serviceData.length > 0 &&
                    // eslint-disable-next-line array-callback-return, consistent-return
                    serviceData.map((service, index) => {
                      if (
                        [SERVICE_TYPES.FULL_TIME_JOB, SERVICE_TYPES.PART_TIME_JOB].includes(
                          service.serviceType
                        )
                      )
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
            title={t('common:oops_no_job_posts')}
            description={t('common:why_job_posts')}
            linkText={t('common:job_post_learn_more')}
            linkURL='/blog/help_user_other_services_all_services'
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

AllFreelancingServices.auth = true;
