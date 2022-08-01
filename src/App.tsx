import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from './routes/routes';
import store from '@/store/index';
import './App.css';
import toastCloseButton from './assets/images/svg/toastCloseButton.svg';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import history from './lib/history';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <Provider store={store}>
      <div className="">
        <React.Suspense>
          <DndProvider backend={HTML5Backend}>
            {/* <BrowserRouter> */}
            <HistoryRouter history={history}>
              <Router />
            </HistoryRouter>
            {/* </BrowserRouter> */}
          </DndProvider>
        </React.Suspense>
      </div>
      <ToastContainer
        hideProgressBar={true}
        pauseOnHover={true}
        autoClose={3000}
        newestOnTop={true}
        closeButton={<img src={toastCloseButton} className="w-3 pb-4" />}
      />
    </Provider>
  );
}

export default App;
