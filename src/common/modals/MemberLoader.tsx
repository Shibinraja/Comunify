import Skeleton from 'react-loading-skeleton';

export const MemberLoader = () => (
  <div className="flex border-b border-activitySubCard pb-2 mt-4">
    <Skeleton width={12} height={12} className={'mr-2'} />

    <div className="flex flex-col ">
      <Skeleton width={100} height={14} />
      <Skeleton width={200} height={10} className={'-top-1'} />
      <div className="flex -mt-3">
        <Skeleton width={17} height={17} borderRadius={'50%'} className={'mr-1'} />
        <Skeleton width={17} height={17} borderRadius={'50%'} className={'mr-1'} />
        <Skeleton width={17} height={17} borderRadius={'50%'} className={'mr-1'} />
      </div>
    </div>
  </div>
);
