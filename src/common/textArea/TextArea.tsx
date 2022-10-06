import React, { Fragment } from 'react';
import { Props } from '../../interface/interface';
// import { useField, ErrorMessage } from 'formik';

const TextArea = ({ id, disabled = false, placeholder, name, value, className, errors, onBlur, onChange, helperText }: Props) => (
  <Fragment>
    <div className="flex flex-col relative">
      <textarea
        id={id}
        name={name}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        value={value}
        onBlur={onBlur}
        onChange={onChange}
      />
      {errors && <p className="text-lightRed absolute top-24 font-normal text-xs font-Inter mt-2 pl-1">{helperText}</p>}
    </div>
  </Fragment>
);

export default TextArea;
