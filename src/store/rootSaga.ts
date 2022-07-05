import { SagaIterator } from 'redux-saga';
import { all, AllEffect } from 'redux-saga/effects';
import authSaga from '../modules/authentication/store/sagas/auth.saga';
import { SagaType } from './rootSagaTypes';

export default function* rootSaga(): Generator<
  AllEffect<SagaIterator<SagaType>>
> {
  yield all([authSaga()]);
}
