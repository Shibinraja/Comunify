import React from 'react';
import Skeleton from 'react-loading-skeleton';

const MemberSuggestionLoader = () => (
  <div className="flex items-center primary-card box-border border border-borderPrimary w-26.25 h-7.5 shadow-profileCard rounded-0.6 pl-1.313 mt-5">
    <div className="w-1/5">
      <Skeleton width={64} height={64} borderRadius={'50%'} />
    </div>
    <div className="flex flex-col  w-4/5 relative">
      <div ><Skeleton width={120} height={15} /></div>
      <div >
        <Skeleton width={180} height={12} />
      </div>
      <div className="flex">
        <Skeleton width={16} height={16} borderRadius={'50%'} className={'mr-1'} />
        <Skeleton width={16} height={16} borderRadius={'50%'} className={'mr-1'} />
        <Skeleton width={16} height={16} borderRadius={'50%'} />
      </div>
      <div className="flex absolute right-0 -bottom-4 items-center">
        <Skeleton width={12} height={12} borderRadius={'50%'}  />
        <Skeleton width={50} height={12} className={'ml-1'} />
      </div>
    </div>
  </div>
);

export default MemberSuggestionLoader;
