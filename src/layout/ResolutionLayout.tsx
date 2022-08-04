import React from 'react';
import resolutionImage from '../assets/images/low-resolution.svg';
import resolutionBg from '../assets/images/low-resolution-bg.svg';
const ResolutionLayout: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center justify-center  box-border shadow-paymentSubscriptionCard rounded-0.9 px-16 py-16 md:py-32 overflow-hidden border-table w-[80%] mx-auto">
      <div className="relative">
        <img src={resolutionImage} alt="" />
        <div className="absolute -right-48 bottom-0 -z-20">
          <img src={resolutionBg} alt="" />
        </div>
      </div>
      <div className="mt-9 font-Poppins text-resolution text-xs md:text-signIn leading-3 md:leading-10 font-bold text-center w-full">Current Resolution Not Supported!</div>
      <div className="pt-4 font-Poppins font-medium text-xs md:text-resolutionDescription  text-resolution max-w-[43rem] text-center">
      The current window is too small to properly display the page.Please reload the page in a larger window/screen
      </div>
    </div >
  </div>
);

export default ResolutionLayout;
