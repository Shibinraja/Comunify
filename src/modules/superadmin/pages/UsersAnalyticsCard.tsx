import { count_3, width_90 } from 'constants/constants';
import { Fragment, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { UsersAnalyticsData } from '../interface/users.interface';
import { getUsersAnalytics } from '../services/users.services';
import TotalMembersIcon from '../../../assets/images/svg/TotalMembers.svg';


const UsersAnalyticsCard: React.FC = () => {
  const [fetchLoader, setFetchLoader] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<Array<UsersAnalyticsData>>([]);

  // eslint-disable-next-line space-before-function-paren
  const fetchUserAnalyticsData = async () => {
    setFetchLoader(true);
    const data = await getUsersAnalytics();
    setFetchLoader(false);
    setAnalyticsData(data as UsersAnalyticsData[]);
  };

  useEffect(() => {
    fetchUserAnalyticsData();
  }, []);

  return (
    <div className="">
      <div className="flex gap-2.28">
        {fetchLoader ? (
          Array.from({ length: 3 }, (_, i) => i + 1).map((type: number) => (
            <Fragment key={type}>
              <div className={`flex  items-center justify-center rounded-0.9 w-full h-8.34 cursor-pointer ${type === 1 ?  'bg-member1' : type === 2 ? ' bg-member2': ' bg-member3'}`}>
                <Skeleton count={count_3} width={width_90} />
              </div>
            </Fragment>
          ))
        ) : (
          analyticsData &&
          analyticsData.map((analytics) => (
            <div className={`flex  items-center justify-center rounded-0.9 w-full h-8.34 cursor-pointer ${analytics.title.toLocaleLowerCase().trim() === 'total users' ?  'bg-member1' : analytics.title.toLocaleLowerCase().trim() === 'total active' ? ' bg-member2': ' bg-member3'}`} key={Math.random()}>
              <div className='flex-col'>
                <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">{analytics.count}</div>
                <div className="font-Poppins font-semibold text-infoBlack text-member leading-4">{analytics.title}</div>
                {/* <div className="text-[8px] xl:text-card font-Poppins font-normal leading-1.12 text-status mt-0.151">{totalMembers.analyticMessage}</div> */}
              </div>
              <div className="ml-[130.75px] w-[23px] h-[34px]">
                <img src={TotalMembersIcon} alt="" />
              </div>
            </div>
          )))}
      </div>
    </div>
  );
};

export default UsersAnalyticsCard;
