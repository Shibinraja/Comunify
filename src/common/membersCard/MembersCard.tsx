import { useAppSelector } from '@/hooks/useRedux';

const MembersCard = () => {
  const {
    membersCountAnalyticsData: { totalMembers, newMembers },
    membersActivityAnalyticsData: { activeMembers, inActiveMembers }
  } = useAppSelector((state) => state.members);

  return (
    <div className="">
      <div className="flex gap-2.28">
        <div className="flex  flex-col items-center justify-center bg-member1 rounded-0.9 w-full h-8.34 cursor-pointer">
          <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">{totalMembers.count}</div>
          <div className="text-Poppins font-semibold text-infoBlack text-member leading-4">{totalMembers.title}</div>
          <div className="text-card font-Poppins font-normal leading-1.12 text-status mt-0.151">{totalMembers.analyticMessage}</div>
        </div>
        <div className=" flex-col items-center justify-center flex bg-member2 rounded-0.9 w-full h-8.34 cursor-pointer">
          <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">{newMembers.count}</div>
          <div className="text-Poppins font-semibold text-infoBlack text-member leading-4">{newMembers.title}</div>
          <div className="text-card font-Poppins font-normal leading-1.12 text-status mt-0.151">{newMembers.analyticMessage}</div>
        </div>
        <div className=" flex-col items-center justify-center flex bg-member3 rounded-0.9 w-full h-8.34 cursor-pointer">
          <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">{activeMembers.count}</div>
          <div className="text-Poppins font-semibold text-infoBlack text-member leading-4">{activeMembers.title}</div>
          <div className="text-card font-Poppins font-normal leading-1.12 text-status mt-0.151">{activeMembers.analyticMessage}</div>
        </div>
        <div className=" flex-col items-center justify-center flex bg-member4 rounded-0.9 w-full h-8.34 cursor-pointer">
          <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">{inActiveMembers.count}</div>
          <div className="text-Poppins font-semibold text-infoBlack text-member leading-4">{inActiveMembers.title}</div>
          <div className="text-card font-Poppins font-normal leading-1.12 text-status mt-0.151">{inActiveMembers.analyticMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default MembersCard;
