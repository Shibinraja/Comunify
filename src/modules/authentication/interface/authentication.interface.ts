export type passwordFormValues = {
  password1: string;
  password2: string;
};

export interface ForgotPasswordInputBody {
  username?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export type emailFormValues = {
  email: string;
};

export interface verifyEmailInput {
  id:string
}

export interface resendVerificationMailInput {
  email:string
}


export type verifyEmailResponse = {
  error: boolean;
  data: { token: string };
  message: string;
  version: string;
};

export type decodeToken = {
  email: string;
  exp: number
  iat: number
  id: string
}

export interface signInInput {
  userName: string;
  password: string;
}

export type signInResponse = {
  error: boolean;
  data: { token: string };
  message: string;
  version: string;
};

export type FormValues = {
  userName: string;
  password: string;
};

export interface signUpInput {
  email: string;
  password: string;
  userName: string;
  companyName: string;
  domainSector: string;
}

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

  


