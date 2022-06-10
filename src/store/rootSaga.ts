import { all } from 'redux-saga/effects';
import authSaga from '../modules/authentication/store/sagas/auth.saga';

export default function* rootSaga() {
  yield all([authSaga()]);
}
