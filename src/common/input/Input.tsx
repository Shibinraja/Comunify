import { Props } from '../../interface/interface';

const Input = ({
  id,
  disabled = false,
  placeholder,
  name,
  type,
  value,
  // handleSubmit,
  className,
  errors,
  onBlur,
  onChange,
  helperText
}: // ...rest
Props) => (
  <div className="flex flex-col relative">
    <input
      id={id}
      type={type}
      name={name}
      className={className}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete="off"
      value={value}
      onBlur={onBlur}
      onChange={onChange}
    />
    {errors && <p className="text-lightRed absolute -bottom-4 font-normal text-xs font-Inter mt-0.287 pl-1">{helperText}</p>}
  </div>
);

export default Input;
