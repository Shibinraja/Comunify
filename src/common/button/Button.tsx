import React from 'react';
import { ButtonProps } from '../../interface/interface';

const Button: React.FC<ButtonProps> = ({
  text,
  //   isLoading,
  disabled,
  className,
  children,
  ...props
}) => (
  <button {...props} disabled={disabled} className={className}>
    {children ?? text}
  </button>
);

export default Button;
