import {useEffect, useState} from 'react';
import {GetServerSideProps} from 'next';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import userQuery from 'constants/GraphQL/User/queries';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import PostLoginLayout from '@root/components/layout/post-login';
import Header from '@root/components/header';
import {Formik} from 'formik';
import queries from 'constants/GraphQL/Organizations/queries';
import AddRoundRobinService from 'components/PostLogin/Organizations/Tabs/RoundRobin/screens/Tabs/AddRoundRobinService';

const OrganizationPage = () => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const [currentSelectedOrg, setCurrentSelectedOrg] = useState<any>(null);
  const {data: organizations} = useQuery(queries.getOrganizationManagementDetails, {
    variables: {
      token: session?.accessToken,
    },
  });

  const organizationsData = organizations?.getOrganizationManagementDetails?.membershipData;

  const crumbs = [
    {title: t('page:Home'), href: '/'},
    {title: t('page:Add Round Robin Service'), href: '/user/round-robin/add-round-robin-service'},
  ];

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

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Add Round Robin Service')} />
      <Head>
        <title> {t('page:Add Round Robin Service')}</title>
      </Head>

      <Formik initialValues={{organizationID: ''}} onSubmit={() => {}} enableReinitialize={true}>
        {({values, setFieldValue}) => (
          <div className='overflow-hidden relative w-full h-max shadow-md rounded'>
            {currentSelectedOrg && (
              <AddRoundRobinService
                key={2}
                values={values}
                setFieldValue={setFieldValue}
                organization={currentSelectedOrg}
                handleChangeOrganization={handleChangeOrganization}
                selectOrganizations={selectOrganizations}
              />
            )}
          </div>
        )}
      </Formik>
    </PostLoginLayout>
  );
};
export default OrganizationPage;
OrganizationPage.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  const router = context.resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router}`,
        permanent: false,
      },
    };
  }

  const {data: user} = await graphqlRequestHandler(
    userQuery.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  return {
    props: {
      user,
    },
  };
};
