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
