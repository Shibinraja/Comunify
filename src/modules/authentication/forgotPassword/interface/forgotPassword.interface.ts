export interface ForgotPasswordInputBody {
  username?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export type emailFormValues = {
  email: string;
};