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
  isAdmin: boolean;
  profilePhotoUrl: string | null;
  subscribtionPackageId: string | null;
  googleId: string | null;
  comunifyUserId: string;
  planExpiry: string | null;
  createdAt: string;
  updatedAt: string;
}

export type signUpResponse = {
  error: boolean;
  data: signUpResponseBody;
  message: string;
};
