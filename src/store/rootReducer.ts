import loaderSlice from 'modules/authentication/store/slices/loader.slice';
import membersSlice from 'modules/members/store/slice/members.slice';
import { combineReducers } from 'redux';
import activitiesSlice from '../modules/activities/store/slice/activities.slice';
import authSlice from '../modules/authentication/store/slices/auth.slice';
import settingsSlice from '../modules/settings/store/slice/settings.slice';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  loader: loaderSlice.reducer,
  members: membersSlice.reducer,
  activities: activitiesSlice.reducer,
  settings: settingsSlice.reducer
});

export default rootReducer;
