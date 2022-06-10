import { ButtonProps } from '../../interface/interface';

const Button: React.FC<ButtonProps> = ({
  text,
  isLoading,
  className,
  children,
  ...props
}) => <button className={className}>{children ?? text}</button>;

export default Button;
