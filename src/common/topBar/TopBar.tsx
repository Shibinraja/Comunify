import searchIcon from '../../assets/images/search.svg';
import profilePic from '../../assets/images/profile image.svg';
import slackIcon from '../../assets/images/slack.svg';
import unplashmjIcon from '../../assets/images/unsplash.svg';
import unplashmj from '../../assets/images/unsplash_mj.svg';
import unionIcon from '../../assets/images/Union.svg';
import sunIcon from '../../assets/images/sun.svg';
import ellipseIcon from '../../assets/images/Ellipse 39.svg';
import { useState } from 'react';

function TopBar() {
  
  const [isDropdownActive, setisDropdownActive] = useState(false);
  const options=['Profile Settings','Sign Out']

  return (
    <div className='container mt-6 mx-auto '>
      <div className='flex justify-between items-center '>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search...'
            className='app-input-card-border focus:outline-none pl-4.18 box-border bg-white rounded-0.6 h-16 w-34.3 placeholder:font-Poppins placeholder:font-normal placeholder:leading-snug placeholder:text-search opacity-40 placeholder:text-searchGray shadow-profileCard'
          />
        </div>
        <img src={searchIcon} alt='' className='absolute pl-7' />
        <div className='flex items-center'>
          <div className="cursor-pointer">
            <img src={sunIcon} alt='' />
          </div>
          <div className='pl-1.68 relative cursor-pointer'>
            <img src={unionIcon} alt='' />
            <div className='absolute top-0 right-0 overflow-hidden'>
              <img src={ellipseIcon} alt='' />
            </div>
          </div>
          <div className='pl-2.56 relative'>
            <img
              src={profilePic}
              alt=''
              className='rounded-full bg-cover bg-center relative cursor-pointer'
              onClick={()=>setisDropdownActive(true)}
            />
             {isDropdownActive && <div className="absolute border-box w-9.62 rounded-0.3 app-result-card-border bg-white cursor-pointer top-10 right-0 shadow-trialButtonShadow">
               {options.map((options)=>
                  <div className="flex flex-col" onClick={()=>setisDropdownActive(false)} key={options.toString()}>
                      <div className="h-3.06 p-2 flex items-center text-searchBlack font-Poppins font-normal text-trial leading-1.31 hover:font-medium hover:bg-signUpDomain transition ease-in duration-300">{options}</div>
                  </div>
                )}
            </div>}
          </div>
        </div>
      </div>
      <div className='mt-[3px] scroll-auto box-border rounded-0.3 shadow-reportInput w-34.37 app-result-card-border hidden'>
        <div className='flex flex-col mt-[13px] pl-4 pb-5 opacity-40'>
          <div className='flex'>
            <div>
              <img src={unplashmjIcon} alt='' />
            </div>
            <div className='pl-6 font-Poppins font-normal text-searchBlack leading-1.31 text-trial'>
              John posted a “Latest Release” on channel “Updates”
            </div>
          </div>
          <div className='flex  mt-1.625'>
            <div>
              <img src={unplashmj} alt='' />
            </div>
            <div className='pl-6 font-Poppins font-normal text-searchBlack leading-1.31 text-trial'>
              Nishitha commented a post “Latest Release” on channel “Updates”
            </div>
          </div>
          <div className='flex mt-1.625'>
            <div>
              <img src={slackIcon} alt='' />
            </div>
            <div className='pl-6 font-Poppins font-normal text-searchBlack leading-1.31 text-trial'>
              Nishitha started a discussion “Latest Release” of our product”
            </div>
          </div>
          <div className='flex mt-1.625'>
            <div>
              <img src={unplashmjIcon} alt='' />
            </div>
            <div className='pl-6 font-Poppins font-normal text-searchBlack leading-1.31 text-trial'>
              John posted a “Latest Release” on channel “Updates”
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
