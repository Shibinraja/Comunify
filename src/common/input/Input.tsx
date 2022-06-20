import { Props } from '../../interface/interface';
import { useField, ErrorMessage } from 'formik';

const Input = ({
  disabled = false,
  placeholder,
  name,
  type,
  value,
  handleSubmit,
  className,
  ...rest
}: Props) => {
  const passDataToParent = (e: any) => {
    e.preventDefault();
    console.log(e.target.value);
    
  };

  const errorClassName='';

  return (
    <div className='flex flex-col'>
      <input
        type={type}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
        autoComplete='off'
        value={value}
        onChange={(e) => passDataToParent(e)}
      />
    </div>
  );
};

export default Input;
