import { SubscriptionPackages } from 'modules/authentication/interface/authentication.interface';

export interface RoutesArray {
  element: JSX.Element;
  path?: string;
  children?: {
    index?: boolean;
    path?: string;
    element?: JSX.Element;
  }[];
}

export interface Props {
  name: string;
  label?: string;
  type?: string;
  errors?:boolean
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  id: string;
  helperText?:any;
  handleSubmit?: any;
  username?:string;
  className?: string;
  onBlur?: (e: React.FocusEvent<any, Element> | undefined) => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export type SubscriptionProps = {
  subscriptionData: SubscriptionPackages;
}

