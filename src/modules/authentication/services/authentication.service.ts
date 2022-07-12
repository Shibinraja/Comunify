import { GeneratorResponse } from '@/lib/api';
import { auth_module, subscription_module, workspace_module } from '@/lib/config';
import { request } from '@/lib/request';
import {
    createWorkspaceNameInput,
    forgotPasswordInput,
    forgotPasswordResponse,
    resendVerificationMailInput,
    resetPasswordInput,
    resetPasswordResponse,
    signInInput,
    signInResponse,
    signUpInput,
    signUpResponse,
    verifyEmailInput,
    verifyEmailResponse,
    workspaceResponse,
    SubscriptionPackages,
} from '../interface/authentication.interface';

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
    const { data } = yield request.post(`${auth_module}/resend-email`, body);
    return data;
}

export function* forgotPasswordService(body: forgotPasswordInput): GeneratorResponse<forgotPasswordResponse> {
    const { data } = yield request.post(`${auth_module}/forgot-password-email`, body);
    return data;
}

export function* verifyForgotEmailService(token: verifyEmailInput): GeneratorResponse<verifyEmailResponse> {
    const { data } = yield request.post(`${auth_module}/verify-forgot-email?id=${token.id}`);
    return data;
}

export function* resetPasswordService(body: resetPasswordInput): GeneratorResponse<resetPasswordResponse> {
    const { data } = yield request.post(`${auth_module}/reset-password`, body);
    return data;
}

// Workspace Module
export function* getWorkspaceService(): GeneratorResponse<workspaceResponse> {
    const { data } = yield request.get(`${workspace_module}/get-workspace`);
    return data;
}

export function* createWorkspaceService(body: createWorkspaceNameInput): GeneratorResponse<workspaceResponse> {
    const { data } = yield request.post(`${workspace_module}/create-workspace`, body);
    return data;
}
//Subscription Module
export function* getSubscriptionPackagesService(): GeneratorResponse<SubscriptionPackages> {
    const { data } = yield request.get(`${subscription_module}/get-subscription`);
    return data;
}
