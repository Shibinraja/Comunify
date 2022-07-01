import { signInInput, signInResponse } from '../interface/signIn.interface';
import { GeneratorResponse } from '@/lib/api';
import { request } from '@/lib/request';

export function* _signIn(body: signInInput): GeneratorResponse<signInResponse> {
  const { data } = yield request.post('/login', body);
  return data;
}
