export type passwordFormValues = {
  password1: string;
  password2: string;
};

export type emailFormValues = {
  email: string;
};

export type FormValues = {
  userName: string;
  password: string;
};

export type decodeToken = {
  email: string;
  exp: number
  iat: number
  id: string
}

export type signUpFormValues = {
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

export interface signInInput {
  userName: string;
  password: string;
}

export interface signUpInput {
  email: string;
  password: string;
  userName: string;
  companyName: string;
  domainSector: string;
}
export interface verifyEmailInput {
  id:string
}

export type forgotPasswordInput = {
  email:string
}

export type resetPasswordInput = {
  password:string;
  confirmPassword:string
}

export interface resendVerificationMailInput {
  email:string
}

export type createWorkspaceNameInput = {
  workspaceName:string
}


//  Response Body

export type verifyEmailResponse = {
  error: boolean;
  data: { token: string };
  message: string;
  version: string;
};

export interface signUpResponseBody {
  id: string;
  email: string;
  password: string;
  userName: string;
  companyName?: string;
  domainSector?: string;
  isVerified: boolean;
  isAdmin?: boolean;
}

export type signUpResponse = {
  version:string
  error: boolean;
  data: signUpResponseBody;
  message: string;
};

export type signInResponse = {
  error: boolean;
  data: any;
  message: string;
  version: string;
};

export type workspaceResponse = {
  error: boolean;
  data: any;
  message: string;
  version: string;
};

  


