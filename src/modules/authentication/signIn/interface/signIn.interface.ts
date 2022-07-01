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
