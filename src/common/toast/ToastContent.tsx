import React from 'react';

const ToastContent = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className='pl-2  flex flex-col font-Poppins'>
    <span className='text-white text-base font-bold'>{title}</span>
    <span className='text-white text-base font-thin'>{description}</span>
  </div>
);

export default ToastContent;
