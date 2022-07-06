import { GeneratorResponse } from '@/lib/api';
import { request } from '@/lib/request';
import { forgotPasswordInput, resendVerificationMailInput, resetPasswordInput, signInInput, signInResponse, signUpInput, signUpResponse, verifyEmailInput, verifyEmailResponse } from '../interface/authentication.interface';

export function* signInService(body: signInInput): GeneratorResponse<signInResponse> {
  const { data } = yield request.post('/login', body);
  return data;
}

export function* signUpService(body: signUpInput): GeneratorResponse<signUpResponse> {
  const { data } = yield request.post('/signup', body);
  return data;
}

export function* verifyEmailService(token: verifyEmailInput): GeneratorResponse<verifyEmailResponse> {
    const { data } = yield request.post(`/verify-email?id=${token.id}`);
    return data;
}


export function* resendVerifyEmailService(body: resendVerificationMailInput): GeneratorResponse<verifyEmailResponse> {
  const { data } = yield request.post(`/resend-email` , body);
  return data;
}


