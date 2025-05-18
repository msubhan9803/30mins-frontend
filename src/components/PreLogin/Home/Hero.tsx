import Button from '@root/components/button';
import Input from '@root/components/forms/input';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

const Hero = ({userData, userList}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const [searchUser, setsearchUser] = useState('');
  const [randomServiceArray, setRandomServiceArray] = useState<any[]>([]);
  const parsedWelcomeComplete = userData?.data?.getUserById?.userData?.welcomeComplete;

  // console.log(userData?.data?.getUserById?.userData?.welcomeComplete, 'welcomeComplete');

  useEffect(() => {
    const tempServiceArray = ['Wi-Fi', 'RTLS', 'AI/ML'];

    const getMultipleRandom = (arr, num) => {
      const shuffled = [...arr]?.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, num);
    };

    setRandomServiceArray([...getMultipleRandom(tempServiceArray, 1)]);
  }, []);

  const handleSearchUsers = async e => {
    e.preventDefault();
    router.push({
      pathname: '/users',
      query: {
        keywords: searchUser,
      },
    });
  };

  const handleSearchTag = async value => {
    router.push({
      pathname: '/users',
      query: {
        keywords: value,
      },
    });
  };

  return (
    <div className='overflow-hidden'>
      <div className="mx-auto grid grid-cols-1 px-6 sm:px-20 lg:grid-cols-2 bg-cover bg-center  pt-24 pb-24 sm:pt-0 sm:pb-0 bg-[url('/assets/hero_bg_mobile.jpg')] sm:bg-[url('/assets/hero_bg.jpg')] sm:h-screen">
        {userData && parsedWelcomeComplete !== true && (
          <div className='mx-auto grid-cols-1 flex items-start justify-start'>
            <div className='mt-32'>
              <div className='mt-0'>
                <h1 className='text-xl sm:text-3xl font-extrabold text-mainText tracking-tight'>
                  {t('page:hero_loggedin_1')} &nbsp; {t('page:hero_loggedin_2')} &nbsp;
                  <span className='text-mainBlue'>{t('page:hero_loggedin_3')}</span>
                </h1>
                <span>
                  <p className='mt-2'> {t('page:hero_loggedin_4')} </p>
                </span>
              </div>
              <div className='mt-10'>
                <div className='mt-3 font-bold'>
                  <Link href={`/${router.locale}/user/welcome2/`} passHref>
                    <Button type='button' variant='solid' onClick={() => {}}>
                      {t('page:hero_loggedin_6')}
                    </Button>
                  </Link>
                  <span>
                    <p className='mt-2 pl-2'> {t('page:hero_loggedin_7')} </p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {userData && parsedWelcomeComplete === true && (
          <div className='mx-auto grid-cols-1 flex items-center justify-center'>
            <div className='mt-4'>
              <div className='mt-6'>
                <h1 className='text-3xl sm:text-5xl font-extrabold text-mainText tracking-tight'>
                  {t('page:Hero_social_platform_for_experts_to')}
                  {t(' ')}
                  <span className='text-mainBlue'>{t('page:Hero_monetize_time')}</span>
                </h1>
                <span>
                  <p className='mt-2'> {t('page:Hero_explain')} </p>
                </span>
              </div>
            </div>
          </div>
        )}
        {!userData && (
          <div className='mx-auto grid-cols-1 flex items-center justify-center'>
            <div className='mt-4'>
              <div className='mt-6'>
                <h1 className='text-3xl sm:text-5xl font-extrabold text-mainText tracking-tight'>
                  {t('page:Hero_social_platform_for_experts_to')}
                  {t(' ')}
                  <span className='text-mainBlue'>{t('page:Hero_monetize_time')}</span>
                </h1>
                <span>
                  <p className='mt-2'> {t('page:Hero_explain')} </p>
                </span>
              </div>
              <div className='mt-10'>
                <div className='mt-3 font-bold items-center justify-center'>
                  <div className='flex flex-row items-center '>
                    <Link href={`/${router.locale}/auth/signup`} passHref>
                      <Button type='button' variant='solid' onClick={() => {}}>
                        {t('page:Hero_get_your_free_link')}
                      </Button>
                    </Link>
                    &nbsp;
                    {t('common:or')}
                    &nbsp;
                    <a href={`/${router.locale}/auth/login`} className='inline-flex text-mainBlue'>
                      {t('common:LOGIN')}
                    </a>
                    &nbsp;
                    {t('common:here')}
                  </div>
                  <p> {t('page:hero_loggedin_7')} </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='bg-black flex lg:flex-row flex-col justify-between w-full items-center gap-4 p-4 sm:p-6 md:p-8 md:px-20'>
        <h1 className='text-2xl sm:text-4xl font-extrabold text-white tracking-tight'>
          {t('page:looking_for_expert')}
        </h1>

        <div className='flex flex-col justify-start w-max '>
          <form onSubmit={handleSearchUsers} className='flex flex-col sm:flex-row gap-2 w-max'>
            <Input
              handleChange={({target: {value}}) => setsearchUser(value)}
              type='text'
              value={searchUser}
              name='search'
              className='h-[44px] w-full'
              placeholder={`Experts, freelancers, services, influencers ...`}
              maxLength={254}
              size={30}
            />
            <Button
              type='submit'
              onClick={() => {}}
              variant='solid'
              className='justify-center flex h-[44px] w-full sm:w-1/6 items-center'
            >
              {t('meeting:search')}
            </Button>
          </form>
          <div className='flex-row hidden sm:block'>
            {randomServiceArray &&
              randomServiceArray.map((item, index) => (
                <button key={index} onClick={() => handleSearchTag(item)}>
                  <span className='px-2 text-mainBlue font-bold'>{item}</span>
                </button>
              ))}
            {userList &&
              userList?.map((user, i) => (
                <a href={`https://30mins.com/${user?.accountDetails?.username}`} key={i}>
                  <span className='px-2 text-mainBlue font-bold'>
                    {user?.personalDetails?.name}
                  </span>
                </a>
              ))}
          </div>
        </div>
      </div>

      <div className='mx-auto grid grid-cols-3 px-4 sm:px-36'>
        <div className='mx-auto grid grid-cols-1 col-span-1'>
          <div className='mt-0 sm:mx-auto sm:max-w-3xl sm:px-0 h-full flex items-center justify-center'>
            <Image
              src='/assets/expert1.png'
              alt='hero'
              height={900}
              width={600}
              layout='intrinsic'
              objectFit='contain'
            />
          </div>
        </div>
        <div className='mx-auto grid grid-cols-1 col-span-2 ml-5'>
          <div className='mt-0 sm:mt-24'>
            <h1 className='text-2xl pt-4 pl-2 sm:text-4xl font-extrabold text-mainText tracking-tight'>
              {t('page:Hero_are_you_an_expert')}
            </h1>
            <span className='font-light text-base my-2'>
              <ul className='checkmark'>
                <li className='text-xs sm:text-xl font-normal '>
                  {t('page:Hero_have_you_written_a_book')}
                </li>
                <li className='text-xs sm:text-xl font-normal '>
                  {t('page:Hero_you_are_a_professor')}
                </li>
                <li className='text-xs sm:text-xl font-normal '>
                  {t('page:Hero_you_are_a_tutor')}
                </li>
              </ul>
            </span>
          </div>
          <div className='bg-mainBlue p-2 mt-4 sm:mt-0 md:p-4 h-max'>
            <h1 className='text-sm sm:text-xl font-bold text-white tracking-tight'>
              {t('page:Hero_are_you_an_expert_2')}
            </h1>
          </div>
        </div>
      </div>

      <div className='mx-auto grid grid-cols-3 px-4 mt-4 sm:mt-0 sm:px-36'>
        <div className='mx-auto grid grid-cols-1 col-span-2'>
          <div className='mt-0 sm:mt-24'>
            <h1 className='pt-4 pl-2 text-2xl sm:text-4xl font-extrabold text-mainText tracking-tight'>
              {t('page:Hero_do_you_have_a_following')}
            </h1>
            <span className='font-light text-base my-6'>
              <ul className='checkmark'>
                <li className='text-xs sm:text-xl font-normal '>
                  {t('page:Hero_do_you_have_a_following_details')}
                </li>
              </ul>
            </span>
          </div>
          <div className='bg-[#3bb44a] p-2 mt-4 sm:mt-0 md:p-4 h-max'>
            <h1 className='text-sm sm:text-xl  font-bold text-white tracking-tight'>
              {t('page:Hero_do_you_have_a_following_2')}
            </h1>
          </div>
        </div>
        <div className='mx-auto grid grid-cols-1 col-span-1'>
          <div className='mt-0 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full flex items-center justify-center'>
            <Image
              src='/assets/expert2.png'
              alt='hero'
              height={392}
              width={392}
              layout='intrinsic'
              objectFit='contain'
            />
          </div>
        </div>
      </div>

      <div className='mx-auto grid grid-cols-3 px-4 sm:px-36'>
        <div className='mx-auto grid grid-cols-1 col-span-1'>
          <div className='mt-0 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full flex items-center justify-center'>
            <Image
              src='/assets/expert3.png'
              alt='hero'
              height={900}
              width={600}
              layout='intrinsic'
              objectFit='contain'
            />
          </div>
        </div>
        <div className='mx-auto grid grid-cols-1 col-span-2'>
          <div className='mt-0 mx-4 sm:mt-36'>
            <h1 className='pt-6 sm:pt-12 pl-2 text-2xl sm:text-4xl font-extrabold text-mainText tracking-tight'>
              {t('page:Hero_run_awareness_campaigns')}
            </h1>
            <span className='font-light text-base my-6'>
              <ul className='checkmark'>
                <li className='text-xs sm:text-xl font-normal'>
                  {t('page:Hero_run_awareness_campaigns_details_1')}
                </li>
                <li className='text-xs sm:text-xl font-normal'>
                  {t('page:Hero_run_awareness_campaigns_details_2')}
                </li>
              </ul>
            </span>
          </div>
          <div className='bg-[#dbae49] p-2 mt-4 mx-2 sm:mx-0 sm:mt-0 md:p-4 h-max'>
            <h1 className='text-sm sm:text-xl font-bold text-white tracking-tight'>
              {t('page:Hero_run_awareness_campaigns_2')}
            </h1>
          </div>
        </div>
      </div>

      <div className='mx-auto bg-slate-50 grid grid-cols-1 h-max md:grid-cols-2 gap-4 md:gap-10 md:h-[600px] p-4 md:p-10'>
        <div className='mx-auto flex flex-row items-start col-span-1 '>
          <span className='w-25 text-[10rem] flex justify-center items-center text-center text-[#3bb44a] h-[170px] md:h-[200px]'>
            1
          </span>
          <div className='h-[170px] md:h-[200px] flex flex-col items-start p-4'>
            <div className='flex items-center justify-center'>
              <h1 className='text-2xl sm:text-3xl pt-1 font-bold text-[#3bb44a] tracking-tight'>
                {t('page:Hero_explain_1_title')}
              </h1>
            </div>
            <div className='pt-2 pl-2'>
              <p className='text-xs sm:text-base pt-2 font-normal sm:font-normal text-black tracking-tight'>
                {t('page:Hero_explain_1')}
              </p>
            </div>
          </div>
        </div>

        <div className='mx-auto flex flex-row items-start col-span-1'>
          <span className='w-25 text-[10rem] flex justify-center items-center text-center text-[#dcae49] h-[170px] md:h-[200px]'>
            2
          </span>
          <div className='h-[170px] md:h-[200px] flex flex-col items-start p-4'>
            <div className='flex items-center justify-center'>
              <h1 className='text-2xl sm:text-3xl pt-2 text-[#dcae49] font-bold tracking-tight'>
                {t('page:Hero_explain_2_title')}
              </h1>
            </div>
            <div className='pt-2 pl-2'>
              <p className='text-xs sm:text-base pt-1 font-normal sm:font-normal text-black tracking-tight'>
                {t('page:Hero_explain_2')}
              </p>
            </div>
          </div>
        </div>

        <div className='mx-auto flex flex-row items-start col-span-1'>
          <span className='w-25 text-[10rem] flex justify-center items-center text-center text-[#00a3fe] h-[170px] md:h-[200px]'>
            3
          </span>
          <div className='h-[170px] md:h-[200px] flex flex-col items-start p-4'>
            <div className='flex items-center justify-center'>
              <h1 className='text-2xl sm:text-3xl pt-2 font-bold text-[#00a3fe] tracking-tight'>
                {t('page:Hero_explain_3_title')}
              </h1>
            </div>
            <div className='pt-2 pl-2'>
              <p className='text-xs sm:text-base pt-1 font-normal sm:font-normal text-black tracking-tight'>
                {t('page:Hero_explain_3')}
              </p>
            </div>
          </div>
        </div>

        <div className='mx-auto flex flex-row items-start col-span-1'>
          <span className='w-25 text-[10rem] flex justify-center items-center text-center text-[#d54a30] h-[170px] md:h-[200px]'>
            4
          </span>
          <div className='h-[170px] md:h-[200px] flex flex-col items-start p-4'>
            <div className='flex items-center justify-center'>
              <h1 className='text-2xl sm:text-3xl pt-2 font-bold text-[#d54a30] tracking-tight'>
                {t('page:Hero_explain_4_title')}
              </h1>
            </div>
            <div className='pt-2 pl-2'>
              <p className='text-xs sm:text-base pt-1 font-normal sm:font-normal text-black tracking-tight'>
                {t('page:Hero_explain_4')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto bg-black grid grid-cols-1 sm:grid-cols-2 mt-0 gap-4 px-6 sm:px-20 pt-4 pb-0'>
        <div className='mx-auto grid grid-cols-1 sm:grid-cols-1 gap-4 mt-4 sm:mt-8 pt-0 sm:pt-8'>
          <h1 className='text-2xl sm:text-4xl font-extrabold text-white tracking-tight lg:mt-24 md:mt-4 sm:mt-0 	'>
            {t('page:Hero_join_now_for_new_social')}
          </h1>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-1 pt-4 mt-0 mx-0'>
          <div className='mt-0 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full flex items-center justify-center'>
            <Image
              src='/assets/newsociallink.png'
              alt='hero'
              height={384}
              width={384}
              layout='intrinsic'
              objectFit='contain'
            />
          </div>
        </div>
      </div>

      <div className='mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 items-left justify-start px-0 sm:px-20'>
        <div className='mx-auto grid-cols-1 col-span-1 hidden lg:block'>
          <div className='h-full flex items-center justify-center'>
            <Image
              src='/assets/expert4.png'
              alt='hero'
              height={350}
              width={350}
              layout='intrinsic'
              objectFit='contain'
            />
          </div>
        </div>
        <div className='grid-cols-1 col-span-2 flex flex-col justify-center items-left p-3'>
          <div className='mt-0 sm:mt-4 mb-4'>
            <h1 className='text-xl pt-2 pl-2 sm:text-3xl font-bold text-mainText tracking-tight'>
              {t('page:Hero_your_personal_url')}
            </h1>
            <span className='font-light pl-2 text-base my-6'>
              {t('page:Hero_your_personal_url_2')}
            </span>
          </div>
          <div className='mt-0 sm:mt-4'>
            <h1 className='text-xl pt-2 pl-2 sm:text-3xl font-bold text-mainText tracking-tight'>
              {t('page:Hero_schedule_without_back_and_forth')}
            </h1>
            <p className='font-light pl-2 text-base my-6  mt-2'>
              {t('page:Hero_schedule_without_back_and_forth_2')}
            </p>
          </div>
          <div className='mt-0 sm:mt-4'>
            <h1 className='text-xl pt-2 pl-2 sm:text-3xl font-bold text-mainText tracking-tight'>
              {t('page:Hero_free_or_paid')}
            </h1>
            <p className='font-light pl-2 text-base my-6  mt-2'>{t('page:Hero_free_or_paid_2')}</p>
          </div>
          <div className='mt-0 sm:mt-4'>
            <h1 className='text-xl pt-2 pl-2 sm:text-3xl font-bold text-mainText tracking-tight'>
              {t('page:Hero_automated_followup')}
            </h1>
            <p className='font-light pl-2 text-base my-6 mt-2'>
              {t('page:Hero_automated_followup_2')}
            </p>
          </div>
          <div className='mt-0 sm:mt-4'>
            <h1 className='text-xl pt-2 pl-2 sm:text-3xl font-bold text-mainText tracking-tight'>
              {t('page:Hero_why_organization')}
            </h1>
            <p className='font-light pl-2 text-base my-6  mt-2'>
              {t('page:Hero_why_organization_2')}
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white grid grid-cols-1 sm:grid-cols-1 mt-2 mx-4 px-4 sm:mx-8 sm:px-8 pt-4 pb-4'>
        <div className='flex flex-wrap -mx-3 -mb-6'>
          <div className='w-full md:w-1/2 lg:w-1/4 px-3 mb-6'>
            <div className='border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
              <div className='text-blue-500 mx-auto mb-4'>
                <Image src={`/icons/services/MEETING.svg`} height={96} width={96} alt='' />
              </div>
              <h3 className='mb-2 font-bold font-heading'>{t(`common:MEETING`)}</h3>
              <p className='text-sm text-blueGray-400'>{t(`common:MEETING_DESCRIPTION`)}</p>
            </div>
          </div>
          <div className='w-full md:w-1/2 lg:w-1/4 px-3 mb-6'>
            <div className='border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
              <div className='text-blue-500 mx-auto mb-4'>
                <Image src={`/icons/services/FREELANCING_WORK.svg`} height={96} width={96} alt='' />
              </div>
              <h3 className='mb-2 font-bold font-heading'>{t(`common:FREELANCING_WORK`)}</h3>
              <p className='text-sm text-blueGray-400'>
                {t(`common:FREELANCING_WORK_DESCRIPTION`)}
              </p>
            </div>
          </div>
          <div className='w-full md:w-1/2 lg:w-1/4 px-3 mb-6'>
            <div className='border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
              <div className='text-blue-500 mx-auto mb-4'>
                <Image src={`/icons/services/FULL_TIME_JOB.svg`} height={96} width={96} alt='' />
              </div>
              <h3 className='mb-2 font-bold font-heading'>{t(`common:FULL_TIME_JOB`)}</h3>
              <p className='text-sm text-blueGray-400'>{t(`common:FULL_TIME_JOB_DESCRIPTION`)}</p>
            </div>
          </div>
          <div className='w-full md:w-1/2 lg:w-1/4 px-3 mb-6'>
            <div className='border border-gray-100 pt-8 px-6 pb-6 bg-white text-center rounded shadow hover:shadow-lg hover-up-2 transition duration-500 min-h-full'>
              <div className='text-blue-500 mx-auto mb-4'>
                <Image src={`/icons/services/PART_TIME_JOB.svg`} height={96} width={96} alt='' />
              </div>
              <h3 className='mb-2 font-bold font-heading'>{t(`common:PART_TIME_JOB`)}</h3>
              <p className='text-sm text-blueGray-400'>{t(`common:PART_TIME_JOB_DESCRIPTION`)}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className='bg-white grid grid-cols-1 sm:grid-cols-1 mt-2 px-6 pt-10 sm:px-20 pb-4 bg-cover bg-center bg-no-repeat'
        style={{backgroundImage: "url('/icons/services/paymenttypes_bg.svg')"}}
      >
        <div className='text-center mb-4'>
          <h1 className='mx-auto mb-4 text-4xl font-extrabold text-mainText tracking-tight'>
            <span>{t(`common:Choose_how_you`)}</span>&nbsp;
            <span className='text-mainBlue'>{t(`common:Choose_PAY`)}</span>&nbsp;
            <span>{t(`common:Choose_or_get`)}</span>&nbsp;
            <span className='text-mainBlue'>{t(`common:Choose_PAID`)}</span>
          </h1>
          <p className='max-w-sm mx-auto text-lg text-blueGray-400'>
            {t(`common:Choose_After_all_its_between_you_two`)}
          </p>
        </div>

        <div className='flex flex-wrap -mx-3'>
          <div className='w-full md:w-1/2 lg:w-1/3 px-3 mb-6'>
            <div className='pt-2 pb-2 sm:pb-8 h-full text-center bg-white rounded shadow flex flex-col justify-between'>
              <div className='px-4 h-max flex flex-col gap-2 items-center justify-center'>
                <img className='h-48 mb-6 mx-auto' src='/icons/services/escrow.svg' alt='ESCROW' />
                <h3 className='text-2xl font-extrabold text-mainText font-heading'>
                  {t(`common:escrow`)}
                </h3>
                <p className='mb-8 text-mainBlue'>
                  {t(`common:Choose_30mins_com_is_the_middleman`)}
                </p>
                <p className='text-blueGray-400'>{t(`common:escrow_description`)}</p>
              </div>
              <div className='bg-mainBlue h-12 flex items-center justify-center'>
                <p className='text-white'>{t(`page:Hero_buyer_peace`)}</p>
              </div>
            </div>
          </div>

          <div className='w-full md:w-1/2 lg:w-1/3 px-3 mb-6'>
            <div className='pt-2 pb-2 sm:pb-8 h-full text-center bg-white rounded shadow flex flex-col justify-between'>
              <div className='px-4 h-max flex flex-col gap-2 items-center justify-center'>
                <img className='h-48 mb-6 mx-auto' src='/icons/services/direct.svg' alt='ESCROW' />
                <h3 className='text-2xl font-extrabold text-mainText font-heading'>
                  {t(`common:direct`)}
                </h3>
                <p className='mb-8 text-mainBlue'>
                  {t(`common:Choose_Direct_to_your_bank_account`)}
                </p>
                <p className='text-blueGray-400'>{t(`common:direct_description`)}</p>
              </div>
              <div className='bg-[#d54a30] h-12 flex items-center justify-center'>
                <p className='text-white'>{t(`page:Hero_we_are_not_involved`)}</p>
              </div>
            </div>
          </div>

          <div className='w-full h-max md:w-1/2 lg:w-1/3 px-3 mb-6'>
            <div className='pt-2 pb-2 sm:pb-8 h-full text-center bg-white rounded shadow flex flex-col justify-between'>
              <div className='px-4 h-max flex flex-col gap-2 items-center justify-center'>
                <img className='h-48 mb-6 mx-auto' src='/icons/services/manual.svg' alt='ESCROW' />
                <h3 className='text-2xl font-extrabold text-mainText font-heading'>
                  {t(`common:manual`)}
                </h3>
                <p className='mb-8 text-mainBlue'>{t(`common:Choose_We_are_not_involved`)}</p>
                <p className='text-blueGray-400'>{t(`common:manual_description`)}</p>
              </div>
              <div className='bg-[#3bb44a] h-12 flex items-center justify-center'>
                <p className='text-white'>{t(`page:Hero_we_are_not_involved`)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
