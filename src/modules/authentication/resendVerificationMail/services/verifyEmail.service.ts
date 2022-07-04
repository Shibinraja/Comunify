import { GeneratorResponse } from '@/lib/api';
import { request } from '@/lib/request';
import { resendVerificationMailInput, verifyEmailInput, verifyEmailResponse } from '../interface/verify.interface';

export function* _verifyEmail(token: verifyEmailInput): GeneratorResponse<verifyEmailResponse> {
    const { data } = yield request.post(`/verify-email?id=${token.id}`);
    return data;
}


export function* _resendVerifyEmail(body: resendVerificationMailInput): GeneratorResponse<verifyEmailResponse> {
  const { data } = yield request.post(`/resend-email` , body);
  return data;
}