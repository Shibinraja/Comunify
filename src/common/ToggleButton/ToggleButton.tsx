
interface SwitchProps {
  value: boolean;
  onChange: () => void;
}

const ToggleButton = (props: SwitchProps) => {
  const toggleClass = 'transform translate-x-3';
  return (
    <div
      onClick={props.onChange}
      className={`w-8 h-4 flex items-center ${
        props.value === true ? 'btn-save-modal' : 'bg-gray-300'
      } rounded-full p-1 cursor-pointer`}
    >
      <div
        className={`${
          props.value === true ? 'bg-white' : 'btn-save-modal'
        } h-3 w-3 rounded-full shadow-md transition transform${
          props.value ? toggleClass : null
        }`}
      ></div>
    </div>
  );
};

export default ToggleButton;
