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
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  id?: string;
  handleSubmit?: any;
  username?:string;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}
