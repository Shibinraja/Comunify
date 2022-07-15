import { GeneratorResponse } from '@/lib/api';
import { API_ENDPOINT, auth_module, subscription_module, workspace_module } from '@/lib/config';
import { request } from '@/lib/request';
import axios from 'axios';

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
} from '../interface/authentication.interface';

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
    const { data } = yield request.post(`${auth_module}/verify-email?id=${token.id}`);
    return data;
}

export function* resendVerifyEmailService(body: ResendVerificationMailInput): GeneratorResponse<TokenResponse> {
    const { data } = yield request.post(`${auth_module}/resend-email`, body);
    return data;
}

export function* forgotPasswordService(body: ForgotPasswordInput): GeneratorResponse<{}> {
    const { data } = yield request.post(`${auth_module}/forgot-password-email`, body);
    return data;
}

export function* verifyForgotEmailService(token: VerifyEmailInput): GeneratorResponse<TokenResponse> {
    const { data } = yield request.post(`${auth_module}/verify-forgot-email?id=${token.id}`);
    return data;
}

export function* resetPasswordService(body: ResetPasswordInput): GeneratorResponse<{}> {
    const { data } = yield request.post(`${auth_module}/reset-password`, body);
    return data;
}

// Workspace Module
export function* getWorkspaceService(): GeneratorResponse<WorkspaceResponse> {
    const { data } = yield request.get(`${workspace_module}/get-workspace`);
    return data;
}

export function* createWorkspaceService(body: CreateWorkspaceNameInput): GeneratorResponse<WorkspaceResponse> {
    const { data } = yield request.post(`${workspace_module}/create-workspace`, body);
    return data;
}
//Subscription Module
export function* getSubscriptionPackagesService(): GeneratorResponse<SubscriptionPackages> {
    const { data } = yield request.get(`${subscription_module}/get-subscription`);
    return data;
}

export function* sendSubscriptionPlan (id: string): GeneratorResponse<SubscriptionPackages> {
    const { data } = yield request.post(`${subscription_module}/choose-plan/${id}`) 
    return data;
}