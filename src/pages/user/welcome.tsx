import StepperTabs from 'components/PostLogin/WelcomePage/TabComponent';
import {useEffect, useState} from 'react';
import StepOne from 'components/PostLogin/WelcomePage/Steps/StepOne';
import StepTwo from 'components/PostLogin/WelcomePage/Steps/StepTwo';
import LastStep from 'components/PostLogin/WelcomePage/Steps/LastStep';
import {useRouter} from 'next/router';
import PreStep from 'components/PostLogin/WelcomePage/Steps/PreStepone';
import queries from 'constants/GraphQL/User/queries';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import integrationQueries from 'constants/GraphQL/Integrations/queries';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import {unstable_getServerSession} from 'next-auth';
import PostLoginLayout from '@root/components/layout/post-login';
import Header from '@root/components/header';

const Welcome = ({integrations, userDataResults}) => {
  const {query, replace} = useRouter();
  const Step = {
    currentStep: 0,
  };
  const [state, setState] = useState(Step);
  const {t} = useTranslation();

  const User = userDataResults?.data?.getUserById?.userData;

  const isWelcomeComplete = User?.welcomeComplete;

  const handleClick = (clickType: string) => {
    const {currentStep} = state;
    let newStep = currentStep;

    if (clickType === 'next') {
      newStep++;
    } else {
      newStep--;
    }

    setState({
      ...state,
      currentStep: newStep,
    });
  };

  useEffect(() => {
    if (query.step) {
      let {currentStep} = state;
      currentStep = parseInt(query.step.toString(), 10);
      replace({
        pathname: '/user/welcome',
        query: {},
      });

      setState({
        ...state,
        currentStep: currentStep,
      });
    }
  }, []);

  useEffect(() => {
    if (isWelcomeComplete) {
      setState({
        ...state,
        currentStep: 0,
      });
    }
  }, []);

  const tabs = [
    {
      title: 'Welcome',
      content: <PreStep handleClick={() => handleClick('next')} />,
    },
    {
      title: 'Personal Info',
      content: (
        <StepOne
          User={User}
          handleClick={() => handleClick('next')}
          prev={() => handleClick('prev')}
        />
      ),
    },
    {
      title: 'Calendar',
      content: (
        <StepTwo
          User={User}
          integrations={integrations}
          handleClick={() => handleClick('next')}
          prev={() => handleClick('prev')}
        />
      ),
    },
    {
      title: 'Finish Welcome',
      content: <LastStep User={User} integrations={integrations} />,
    },
  ];

  const crumbs = [{title: t('page:Welcome'), href: '/user/welcome'}];

  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:Welcome')}</title>
      </Head>
      <Header crumbs={crumbs} heading='' />
      <StepperTabs tabs={tabs} activeIndex={state.currentStep} />
    </PostLoginLayout>
  );
};

export default Welcome;
Welcome.auth = true;

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
  const {data: integrations} = await graphqlRequestHandler(
    integrationQueries.getCredentialsByToken,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: userDataResults} = await graphqlRequestHandler(
    queries.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  if (userDataResults?.data?.getUserById?.userData?.welcomeComplete === true) {
    return {
      redirect: {destination: '/user/dashboard', permanent: false},
    };
  }

  return {
    props: {
      userDataResults,
      integrations,
    },
  };
};
