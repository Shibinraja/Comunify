import React, { Fragment } from 'react';
import { Props } from '../../interface/interface';
// import { useField, ErrorMessage } from 'formik';

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
  <Fragment>
    <div className="flex flex-col relative pb-2">
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
      {errors && <p className="text-lightRed absolute -bottom-4 font-normal text-email font-Inter mt-0.287 pl-1">{helperText}</p>}
    </div>
  </Fragment>
);

export default Input;
