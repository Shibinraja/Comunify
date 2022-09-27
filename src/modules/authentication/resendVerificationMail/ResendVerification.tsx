/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react';
import Button from 'common/button';
import bgSendMailImage from '../../../assets/images/bg-sign.svg';
import './resendVerification.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import authSlice from '../store/slices/auth.slice';
import { DecodeToken } from '../interface/auth.interface';
import { AppDispatch } from '../../../store/index';
import { decodeToken } from '@/lib/decodeToken';
import { getLocalRefreshToken } from '@/lib/request';

const ResendVerificationMail: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const { clearFormikValue: verifyEmailRoute, userEmail } = useAppSelector((state) => state.auth);

  const [searchParams] = useSearchParams();
  const tokenData = getLocalRefreshToken() || '';
  const token: string | any = searchParams.get('confirm') || '';

  const verifyToken: DecodeToken = (token && decodeToken(token)) || decodeToken(tokenData);

  useEffect(() => {
    if (token) {
      dispatch(authSlice.actions.verifyEmail({ id: token }));
    }
  }, [token]);

  useEffect(() => {
    if (verifyEmailRoute) {
      navigate('/welcome');
    }
  }, [verifyEmailRoute]);

  const resendVerifyEmail = () => {
    if (verifyToken?.email) {
      dispatch(authSlice.actions.resendVerificationMail({ email: verifyToken.email }));
    }
    if (userEmail) {
      dispatch(authSlice.actions.resendVerificationMail({ email: userEmail }));
    }
  };

  return (
    <div className="flex flex-col h-auto layout-height">
      <div className=" flex h-full overflow-auto ">


        <div className="w-3/5 2xl:w-1/2 auth-layout-section flex items-center justify-center 3xl:justify-end pr-0   3xl:pr-16 py-10">
          <div className="flex items-center justify-center">
            <img src={bgSendMailImage} alt="" className="w-9/12 xl:w-[621px] 3xl:w-full object-cover" />
          </div>
        </div>
        <div className="flex justify-center w-1/2 3xl:items-center 3xl:justify-start  pl-0 3xl:pl-16">
          <div className="flex flex-col  justify-center">
            <p className="text-lightGray font-Inter  max-w-sm font-normal not-italic mt-0.78 text-desc">
            A verification link has been sent to the entered email address. Please check your mail and verify it to continue.
            </p>
            <Button
              text="Resend Verification Mail"
              onClick={resendVerifyEmail}
              type="submit"
              className={`font-Poppins rounded-lg text-base font-semibold text-white mt-1.8 h-3.6  w-full hover:shadow-buttonShadowHover
                transition ease-in duration-300 btn-gradient`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationMail;
