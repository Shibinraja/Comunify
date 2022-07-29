import { configureStore, Store } from '@reduxjs/toolkit';
import type { Middleware, compose} from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

declare module 'redux' {
  export interface Store {
    sagaTask: unknown;
  }
}

// const makeStore = (preloadedState: RootState = {} as RootState) => {
const sagaMiddleware = createSagaMiddleware();
const middleware: Middleware[] = [sagaMiddleware];

if (import.meta.env.MODE === 'development') {
  middleware.push(logger as SagaMiddleware);
}

// Add enhancers here
// const composedEnhancers: StoreEnhancer = composeEnhancers(...enhancers);

// const store:Store = createStore(rootReducer, preloadedState, composedEnhancers);

const store: Store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: import.meta.env.MODE === 'development'
});

store.sagaTask = sagaMiddleware.run(rootSaga);

// return store;
// };

// Preloaded state is used to initialize the store with data possibly from localStorage
// const preloadedState = {} as RootState;
// const store = configureStore(preloadedState);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export default store;
