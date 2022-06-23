import Button from 'common/button';
import Input from 'common/input';
import React from 'react';
import './ForgotPassword.css';
import bgForgotImage from '../../../../assets/images/bg-sign.svg';

const ForgotPassword = () => {
  return (
    <div className='w-full flex flex-col'>
      <div className='flex w-full relative'>
        <div className='w-1/2 password-cover-bg bg-no-repeat bg-left rounded-lg  bg-thinBlue flex items-center justify-center py-20 fixed'>
          <img src={bgForgotImage} alt='' />
        </div>
        <div className='w-1/2 flex pl-7.5 mt-13.1 flex-col overflow-y-auto no-scroll-bar absolute right-0 pb-[100px]'>
          <h1 className='font-Inter font-bold text-signIn text-neutralBlack leading-2.8'>
            Forgot Password
          </h1>
          <p className='mt-0.78 text-desc font-normal leading-1.8 font-Inter text-lightGray max-w-sm'>
            Enter your email address to reset your password.
          </p>
          <form className='w-25.9 mt-1.9' autoComplete='off'>
            <div className='email'>
              <Input
                type='email'
                placeholder='Email'
                label='Email'
                id='email'
                name='email'
                className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
              />
              <p className='text-lightRed font-normal text-error font-Inter mt-0.287 hidden'>
                Invalid email id
              </p>
            </div>
            <Button
              text='Submit'
              type='submit'
              className='font-Poppins rounded-lg text-base text-white transition ease-in duration-300 w-full mt-1.84 h-3.6 hover:shadow-buttonShadowHover btn-gradient'
            />
            <div className='underline text-center text-thinGray font-Poppins font-normal mt-1.86 text-reset'>
              <a href=''> Resend Link</a>
            </div>
          </form>
        </div>
      </div>
      <div className='py-1.9'></div>
      <div className='footer'></div>
    </div>
  );
};

export default ForgotPassword;
