import loaderSlice from 'modules/authentication/store/slices/loader.slice';
import { combineReducers } from 'redux';
import authSlice from '../modules/authentication/store/slices/auth.slice';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  loader: loaderSlice.reducer
});

export default rootReducer;
