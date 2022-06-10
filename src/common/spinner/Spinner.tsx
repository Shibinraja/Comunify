import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { TailSpin } from 'react-loader-spinner';

const Spinner = () => {
  return (
    <div className=''>
      <TailSpin height='60' width='60' color='#18a01c' ariaLabel='loading' />
    </div>
  );
};

export default Spinner;
