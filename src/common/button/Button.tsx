import { ButtonProps } from '../../interface/interface';

const Button: React.FC<ButtonProps> = ({
  text,
  isLoading,
  className,
  children,
  ...props
}) => (
  <button {...props} className={className}>
    {children ?? text}
  </button>
);

export default Button;
