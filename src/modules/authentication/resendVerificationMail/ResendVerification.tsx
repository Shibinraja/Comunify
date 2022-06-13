/* eslint-disable react/no-unescaped-entities */
import Button from 'common/button';
import bgSendMailImage from '../../../assets/images/bg-sign.svg';

const ResendVerificationMail = () => {
  return (
    <div className='w-full flex flex-col '>
      <div className='flex w-full relative'>
        <div className='w-1/2 password-cover-bg bg-no-repeat bg-left rounded-lg  bg-thinBlue flex items-center justify-center py-20 fixed'>
          <img src={bgSendMailImage} alt='' />
        </div>
        <div className='w-1/2 flex pl-7.40 mt-13.9 flex-col overflow-y-auto no-scroll-bar absolute right-0'>
          <div className='w-25.9'>
            <p className='font-Inter font-normal leading-1.8 text-lightGray text-desc'>
              A verification link has been sent to the entered email address.
              Please check your mail and verify it to continue.
            </p>
            <Button
              text='Resend Verification Mail'
              type='submit'
              className='font-Poppins rounded-lg text-base text-white mt-1.8 h-3.6 transition ease-in duration-300 w-full hover:shadow-buttonShadowHover'
            />
          </div>
        </div>
      </div>
      <div className='py-1.9'></div>
      <div className='footer'></div>
    </div>
  );
};

export default ResendVerificationMail;
