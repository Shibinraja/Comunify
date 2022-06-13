import { Props } from '../../interface/interface';
import { useField, ErrorMessage } from 'formik';

const Input = ({
  disabled = false,
  placeholder,
  name,
  type,
  value,
  handleSubmit,
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
        className='h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border'
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
