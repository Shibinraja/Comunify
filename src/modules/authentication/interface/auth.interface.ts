/* eslint-disable no-unused-vars */

export type PasswordFormValues = {
  password: string;
  confirmPassword: string;
  token?: string;
};

export type EmailFormValues = {
  email: string;
};

export type FormValues = {
  userName: string;
  password: string;
};

export type DecodeToken = {
  email: string;
  exp: number;
  iat: number;
  id: string;
  userName: string;
  isAdmin: boolean;
  isSubscribed: boolean;
  isWorkSpaceCreated: boolean;
  isVerified: boolean;
};

export type SignUpFormValues = {
  userName: string;
  email: string;
  password: string;
  companyName: string;
  domainSector: string;
};

export type SubscriptionValues = {
  username: string;
  password: string;
  card_holder: string;
  cardnumber: string;
  cvv: string;
};

// Input Body

export interface SignInInput {
  userName: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  userName: string;
  companyName: string;
  domainSector: string;
}
export interface VerifyEmailInput {
  id: string;
}

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  password: string;
  confirmPassword: string;
};

export interface ResendVerificationMailInput {
  email: string;
}

export type CreateWorkspaceNameInput = {
  workspaceName: string;
};

//  Response Body

export type TokenResponse = {
  token: string;
};

export interface SignUpResponse {
  id: string;
  email: string;
  password: string;
  userName: string;
  companyName?: string;
  domainSector?: string;
  isVerified: boolean;
  isAdmin?: boolean;
}

enum Type {
  PRIMARY,
  ADDON
}

enum SubscriptionPeriod {
  Monthly,
  Daily,
  Yearly,
  Weekly,
  None
}
export interface SubscriptionPackages {
  id: string;
  name: string;
  viewName: string;
  description: string;
  features: {
    comunifyFeature:{name:string},
    value:string
  }[];
  amount: number;
  type: Type;
  isActive: boolean;
  periodType: SubscriptionPeriod;
  createdAt: Date;
  updatedAt: Date;
}
export interface SubscriptionToken {
  email: string;
  exp: Date;
  iat: Date;
  id: string;
  isAdmin: boolean;
  userName: string;
}

export type WorkspaceResponse = {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
