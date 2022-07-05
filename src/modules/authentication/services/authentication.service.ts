import { GeneratorResponse } from '@/lib/api';
import { request } from '@/lib/request';
import { resendVerificationMailInput, signInInput, signInResponse, signUpInput, signUpResponse, verifyEmailInput, verifyEmailResponse } from '../interface/authentication.interface';


export function* _verifyEmail(token: verifyEmailInput): GeneratorResponse<verifyEmailResponse> {
    const { data } = yield request.post(`/verify-email?id=${token.id}`);
    return data;
}


export function* _resendVerifyEmail(body: resendVerificationMailInput): GeneratorResponse<verifyEmailResponse> {
  const { data } = yield request.post(`/resend-email` , body);
  return data;
}

export function* _signIn(body: signInInput): GeneratorResponse<signInResponse> {
  const { data } = yield request.post('/login', body);
  return data;
}

export function* _signUp(body: signUpInput): GeneratorResponse<signUpResponse> {
  const { data } = yield request.post('/signup', body);
  return data;
}

