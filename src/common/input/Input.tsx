import { Props } from '../../interface/interface';
import { useField, ErrorMessage } from 'formik';
import { Fragment } from 'react';

const Input = ({
    id,
    disabled = false,
    placeholder,
    name,
    type,
    value,
    handleSubmit,
    className,
    errors,
    onBlur,
    onChange,
    helperText,
    ...rest
}: Props) => {
  

    return (
        <Fragment>
             <div className='flex flex-col'>
                <input
                    id={id}
                    type={type}
                    name={name}
                    className={className}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete='off'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                />
            </div>
            {errors && <p className='text-lightRed font-normal text-error font-Inter mt-0.287 '>{helperText}</p>}
        </Fragment>
    );
};

export default Input;
