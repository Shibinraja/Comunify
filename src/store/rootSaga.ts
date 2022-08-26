import { SagaIterator } from 'redux-saga';
import { all, AllEffect } from 'redux-saga/effects';
import authSaga from '../modules/authentication/store/sagas/auth.saga';
import membersSaga from 'modules/members/store/saga/members.saga';
import { SagaType } from './rootSagaTypes';
import activitiesSaga from '../modules/activities/store/saga/activities.saga';
import settingsSaga from '../modules/settings/store/saga/settings.saga';

export default function* rootSaga(): Generator<AllEffect<SagaIterator<SagaType>>> {
  yield all([authSaga(), membersSaga(), activitiesSaga(), settingsSaga()]);
}
