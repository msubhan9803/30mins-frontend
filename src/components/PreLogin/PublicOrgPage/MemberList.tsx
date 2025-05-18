import useTranslation from 'next-translate/useTranslation';
import MemberListItem from './MemberListItem';
import MemberListItemManagement from './MemberListItemManagement';

const MemberList = ({members, isManagement, organizationDetails, userRole}) => {
  const {t} = useTranslation();

  return (
    <>
      {members?.length > 0 && members !== null ? (
        members?.map((member, index) =>
          isManagement ? (
            <MemberListItemManagement
              userRole={userRole}
              member={member}
              members={members}
              key={index}
              organizationDetails={organizationDetails}
            />
          ) : (
            <MemberListItem member={member} key={index} />
          )
        )
      ) : (
        <li className='flex justify-center font-bold text-xl bg-white mb-2 rounded-md py-3 px-4 w-full'>
          {t('common:no_result_found')}...
        </li>
      )}
    </>
  );
};

export default MemberList;
