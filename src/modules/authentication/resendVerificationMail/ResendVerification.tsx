/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react';
import Button from 'common/button';
import bgSendMailImage from '../../../assets/images/bg-sign.svg';
import './resendVerification.css';
import {  useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import authSlice from '../store/slices/auth.slice';
import { DecodeToken } from '../interface/authentication.interface';
import { AppDispatch } from '../../../store/index';
import { decodeToken } from '@/lib/decodeToken';
import { getLocalRefreshToken } from '@/lib/request';

const ResendVerificationMail: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const {clearFormikValue:verifyEmailRoute, userEmail} = useAppSelector((state) => state.auth);

  const [searchParams] = useSearchParams();
  const tokenData = getLocalRefreshToken() || '';
  const token: string | any = searchParams.get('confirm') || '';

  const verifyToken:DecodeToken = token && decodeToken(token) || decodeToken(tokenData);

  useEffect(() => {
    if (token) {
      dispatch(authSlice.actions.verifyEmail({id:token}));
    } else if (tokenData) {
      dispatch(authSlice.actions.verifyEmail({id:tokenData}));
    }
  }, [token]);

  useEffect(() => {
    if (verifyEmailRoute) {navigate('/welcome');}
  }, [verifyEmailRoute]);

  const resendVerifyEmail = () => {
    if (verifyToken?.email) {dispatch(authSlice.actions.resendVerificationMail({email:verifyToken.email}));}
    if (userEmail) {dispatch(authSlice.actions.resendVerificationMail({email:userEmail}));}
  };

  return (
    <div className="create-password">
      <div className="flex w-full height-calc">
        <div className="w-1/2 rounded-r-lg   bg-thinBlue flex items-center justify-center p-28 resend-cover-bg bg-no-repeat bg-left overflow-hidden">
          <img src={bgSendMailImage} alt="" className="object-cover" />
        </div>
        <div className="flex flex-col w-1/2  pl-7.40 overflow-scroll pt-13.9">
          <div className="w-25.9">
            <p className="font-Inter font-normal leading-1.8 text-lightGray text-desc">
              A verification link has been sent to the entered email address.
              Please check your mail and verify it to continue.
            </p>
            <div className="pb-10">
              <Button
                text='Resend Verification Mail'
                onClick={resendVerifyEmail}
                type='submit'
                className={`font-Poppins rounded-lg text-base font-semibold text-white mt-1.8 h-3.6  w-full hover:shadow-buttonShadowHover
                transition ease-in duration-300 btn-gradient`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationMail;
