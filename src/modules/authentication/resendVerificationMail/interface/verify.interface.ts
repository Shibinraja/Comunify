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

