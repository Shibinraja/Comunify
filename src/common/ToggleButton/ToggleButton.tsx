import React from 'react';
interface SwitchProps {
  value: boolean;
  onChange: () => void;
  isLoading: boolean;
}

const ToggleButton = (props: SwitchProps) => {
  const toggleClass = 'transform translate-x-3';
  return (
    <button
      onClick={props.onChange}
      disabled={props.isLoading ? true : false}
      className={`w-8 h-4 flex items-center ${props.isLoading ? 'bg-white-200 pointer-events-none' : ''} ${
        props.value === true ? 'btn-save-modal' : 'bg-gray-300'
      } rounded-full p-1 cursor-pointer`}
    >
      <div
        className={`${props.value === true ? 'bg-white' : 'btn-save-modal'} ${
          props.isLoading ? 'bg-gray-100 pointer-events-none' : ''
        } h-3 w-3 rounded-full shadow-md transition transform${props.value ? toggleClass : null}`}
      ></div>
    </button>
  );
};

export default ToggleButton;
