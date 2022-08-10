/* eslint-disable @typescript-eslint/ban-types */
import { GeneratorResponse } from '@/lib/api';
import { auth_module, subscription_module, workspace_module } from '@/lib/config';
import { request } from '@/lib/request';

import {
  CreateWorkspaceNameInput,
  ForgotPasswordInput,
  ResendVerificationMailInput,
  ResetPasswordInput,
  SignInInput,
  SignUpResponse,
  SignUpInput,
  VerifyEmailInput,
  SubscriptionPackages,
  TokenResponse,
  WorkspaceResponse,
  GetWorkspaceIdResponse
} from '../interface/auth.interface';

//Auth Module
export function* signInService(body: SignInInput): GeneratorResponse<TokenResponse> {
  const { data } = yield request.post(`${auth_module}/login`, body);
  return data;
}

export function* signUpService(body: SignUpInput): GeneratorResponse<SignUpResponse> {
  const { data } = yield request.post(`${auth_module}/signup`, body);
  return data;
}

export function* verifyEmailService(token: VerifyEmailInput): GeneratorResponse<TokenResponse> {
  const { data } = yield request.post(`${auth_module}/verifyemail?id=${token.id}`);
  return data;
}

export function* resendVerifyEmailService(body: ResendVerificationMailInput): GeneratorResponse<TokenResponse> {
  const { data } = yield request.post(`${auth_module}/resendemail`, body);
  return data;
}

export function* forgotPasswordService(body: ForgotPasswordInput): GeneratorResponse<{}> {
  const { data } = yield request.post(`${auth_module}/forgotpasswordemail`, body);
  return data;
}

export function* verifyForgotEmailService(token: VerifyEmailInput): GeneratorResponse<TokenResponse> {
  const { data } = yield request.post(`${auth_module}/verifyforgotemail?id=${token.id}`);
  return data;
}

export function* resetPasswordService(body: ResetPasswordInput): GeneratorResponse<{}> {
  const { data } = yield request.post(`${auth_module}/resetpassword`, body);
  return data;
}

// Workspace Module
export function* getWorkspaceService(): GeneratorResponse<WorkspaceResponse> {
  const { data } = yield request.get(`${workspace_module}/getworkspace`);
  return data;
}

export function* createWorkspaceService(body: CreateWorkspaceNameInput): GeneratorResponse<WorkspaceResponse> {
  const { data } = yield request.post(`${workspace_module}/createworkspace`, body);
  return data;
}
export function* getworkspaceIdService(): GeneratorResponse<GetWorkspaceIdResponse> {
  const { data } = yield request.get(`${workspace_module}/getworkspaces`);
  return data;
}

//Subscription Module
export function* getSubscriptionPackagesService(): GeneratorResponse<SubscriptionPackages> {
  const { data } = yield request.get(`${subscription_module}/getsubscription`);
  return data;
}

export function* sendSubscriptionPlan(id: string): GeneratorResponse<SubscriptionPackages> {
  const { data } = yield request.post(`${subscription_module}/chooseplan/${id}`);
  return data;
}

//Logout Module
export function* signOutService(): GeneratorResponse<{}> {
  const { data } = yield request.post(`${auth_module}/logout`);
  return data;
}
