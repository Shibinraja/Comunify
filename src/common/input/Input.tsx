import { Props } from '../../interface/interface';

const Input = ({
  disabled = false,
  placeholder,
  name,
  type,
  value,
  ...rest
}: Props) => {
  return (
    <div className='flex flex-col'>
      <input
        type={type}
        className='h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border'
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        {...rest}
      />
    </div>
  );
};

export default Input;
