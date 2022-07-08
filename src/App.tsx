import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from './routes/routes';
import store from '@/store/index';
import './App.css';
import {  } from 'react-router-dom';
import toastCloseButton from './assets/images/svg/toastCloseButton.svg';
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import history from './lib/history';

function App() {
  return (
    <Provider store={store}>
      <div className=''>
        <React.Suspense>
          {/* <BrowserRouter> */}
          <HistoryRouter history={history}> 
          <Router />
          </HistoryRouter>
          {/* </BrowserRouter> */}
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
