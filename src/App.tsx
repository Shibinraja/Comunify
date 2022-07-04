import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from './routes/routes';
import store from '@/store/index';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import toastCloseButton from './assets/images/svg/toastCloseButton.svg';
// import Spinner from './components/common/spinner/Spinner';

function App() {
  return (
    <Provider store={store}>
      <div className=''>
        <React.Suspense>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </React.Suspense>
      </div>
      <ToastContainer
        hideProgressBar={true}
        pauseOnHover={true}
        autoClose={3000}
        newestOnTop={true}
        closeButton={<img src={toastCloseButton} className='w-3 pb-4' />}
      />
    </Provider>
  );
}

export default App;
