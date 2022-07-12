/* eslint-disable react/no-unescaped-entities */
import Button from 'common/button';
import bgSendMailImage from '../../../assets/images/bg-sign.svg';
import './resendVerification.css';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useRedux';
import { useEffect } from 'react';
import authSlice from '../store/slices/auth.slice';
import jwt_decode from 'jwt-decode';
import { DecodeToken } from '../interface/authentication.interface';
import { AppDispatch } from '../../../store/index';

const ResendVerificationMail: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const token: string | any = searchParams.get('confirm')

  const verifyToken:DecodeToken = jwt_decode(token);

  useEffect(()=>{
    if(token) dispatch(authSlice.actions.verifyEmail({id:token}))
  },[token])

  const _resendVerifyEmail = () => {
    if(verifyToken?.email) dispatch( authSlice.actions.resendVerificationMail({email:verifyToken.email}))
  }

  return (
    <div className="w-full flex flex-col ">
      <div className="flex w-full relative">
        <div className="w-1/2 resend-cover-bg bg-no-repeat bg-left rounded-lg  bg-thinBlue flex items-center justify-center py-20 fixed">
          <img src={bgSendMailImage} alt="" />
        </div>
        <div className="w-1/2 flex pl-7.40 mt-13.9 flex-col overflow-y-auto no-scroll-bar absolute right-0 pb-6.25">
          <div className="w-25.9">
            <p className="font-Inter font-normal leading-1.8 text-lightGray text-desc">
              A verification link has been sent to the entered email address.
              Please check your mail and verify it to continue.
            </p>
            <div className="pb-10">
            <Button
              text='Resend Verification Mail'
              onClick={_resendVerifyEmail}
              type='submit'
              className='font-Poppins rounded-lg text-base font-semibold text-white mt-1.8 h-3.6  w-full hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient'
            />
            </div>
          </div>
        </div>
      </div>
      <div className="py-1.9"></div>
      <div className="footer"></div>
    </div>
  );
};

export default ResendVerificationMail;
