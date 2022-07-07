import { GeneratorResponse } from '@/lib/api';
import { auth_module, workspace_module } from '@/lib/config';
import { request } from '@/lib/request';
import { createWorkspaceNameInput, resendVerificationMailInput,  signInInput, signInResponse, signUpInput, signUpResponse, verifyEmailInput, verifyEmailResponse, workspaceResponse } from '../interface/authentication.interface';

//Auth Module
export function* signInService(body: signInInput): GeneratorResponse<signInResponse> {
  const { data } = yield request.post(`${auth_module}/login`, body);
  return data;
}

export function* signUpService(body: signUpInput): GeneratorResponse<signUpResponse> {
  const { data } = yield request.post(`${auth_module}/signup`, body);
  return data;
}

export function* verifyEmailService(token: verifyEmailInput): GeneratorResponse<verifyEmailResponse> {
    const { data } = yield request.post(`${auth_module}/verify-email?id=${token.id}`);
    return data;
}

export function* resendVerifyEmailService(body: resendVerificationMailInput): GeneratorResponse<verifyEmailResponse> {
  const { data } = yield request.post(`${auth_module}/resend-email` , body);
  return data;
}

// Workspace Module
export function* getWorkspaceService(): GeneratorResponse<workspaceResponse> {
  const { data } = yield request.get(`${workspace_module}/get-workspace`);
  return data;
}

export function* createWorkspaceService(body: createWorkspaceNameInput): GeneratorResponse<workspaceResponse> {
  const { data } = yield request.post(`${workspace_module}/create-workspace` , body);
  return data;
}

