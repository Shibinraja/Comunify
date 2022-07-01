import { GeneratorResponse } from '@/lib/api';
import { request } from '@/lib/request';
import { signUpInput, signUpResponse } from '../interface/signup.interface';

export function* _signUp(body: signUpInput): GeneratorResponse<signUpResponse> {
  const { data } = yield request.post('/signup', body);
  return data;
}
