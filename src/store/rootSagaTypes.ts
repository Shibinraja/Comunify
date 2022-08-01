import authSaga from 'modules/authentication/store/sagas/auth.saga';
import membersSaga from 'modules/members/store/saga/members.saga';

export type SagaType = typeof authSaga | typeof membersSaga;
