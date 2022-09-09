import authSaga from 'modules/authentication/store/sagas/auth.saga';
import membersSaga from 'modules/members/store/saga/members.saga';
import activitiesSaga from '../modules/activities/store/saga/activities.saga';

export type SagaType = typeof authSaga | typeof membersSaga | typeof activitiesSaga;
