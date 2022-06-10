import { combineReducers } from 'redux';
import authSlice from '../modules/authentication/store/slices/auth.slice';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

export default rootReducer;
