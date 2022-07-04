export interface signInInput {
  userName?: string;
  password: string;
  email:string
}

export type signInResponse = {
  error: boolean;
  data: { token: string };
  message: string;
  version: string;
};

export type FormValues = {
  email: string;
  password: string;
};
